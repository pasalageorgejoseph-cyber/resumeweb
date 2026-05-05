import { GoogleGenerativeAI } from '@google/generative-ai';

// We'll instantiate the models upon request so it captures any live .env.local changes
let primaryModel: any = null;
let fallbackModel: any = null;

function getModels() {
  if (!primaryModel || !fallbackModel) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing from environment variables.');
    const genAI = new GoogleGenerativeAI(apiKey);
    primaryModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    // Use latest pro as a robust fallback
    fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
  }
  return { primaryModel, fallbackModel };
}

// Simple per-user rate limiting using in-memory store
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(userId);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  record.count += 1;
  return true;
}

// Simple in-memory cache to reduce API usage for duplicate prompts
const cacheMap = new Map<string, { response: string; expiresAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export function getCachedResponse(prompt: string): string | null {
  const record = cacheMap.get(prompt);
  if (!record) return null;
  if (record.expiresAt < Date.now()) {
    cacheMap.delete(prompt);
    return null;
  }
  return record.response;
}

export function setCachedResponse(prompt: string, response: string) {
  cacheMap.set(prompt, { response, expiresAt: Date.now() + CACHE_TTL_MS });
}

export async function callGemini(prompt: string, systemInstruction?: string) {
  const fullPrompt = systemInstruction 
    ? `[SYSTEM INSTRUCTIONS]\n${systemInstruction}\n\n[USER INPUT]\n${prompt}` 
    : prompt;
  
  const cached = getCachedResponse(fullPrompt);
  if (cached) {
    console.log('[Gemini] Serving from cache');
    return cached;
  }

  const { primaryModel, fallbackModel } = getModels();
  
  let responseText = '';
  try {
    const result = await primaryModel.generateContent(fullPrompt);
    responseText = result.response.text();
  } catch (err: any) {
    // If the primary model yields 503 or 429, try the robust fallback
    if (err.message?.includes('503') || err.message?.includes('429')) {
      console.warn('[Gemini] Primary model overloaded. Falling back to gemini-2.0-flash...');
      const fallbackResult = await fallbackModel.generateContent(fullPrompt);
      responseText = fallbackResult.response.text();
    } else {
      throw err;
    }
  }
  
  setCachedResponse(fullPrompt, responseText);
  return responseText;
}

// Helper to extract a user identifier from the request for rate limiting
export function getUserId(req: Request) {
  // Can use IP or a user token if present
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  
  const authHeader = req.headers.get('authorization');
  if (authHeader) return authHeader; // In case they use standard bearer tokens
  
  return 'anonymous_user';
}
