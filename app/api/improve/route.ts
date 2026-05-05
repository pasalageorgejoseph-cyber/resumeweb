export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { callGemini, checkRateLimit, getUserId } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an expert resume writer specializing in ATS optimization.
Rewrite the given resume content to:
1. Use strong action verbs (Led, Built, Architected, Delivered, Optimized, etc.)
2. Add quantified metrics where possible (%, numbers, dollar amounts)
3. Be concise, professional, and impactful
4. Remove passive voice and filler words
5. Keep all original facts — do NOT invent new information

Return ONLY the improved text. No explanations, no preamble, no quotes.
For bullet points / achievements: return each on a separate line.`;

function buildPrompt(type: string, content: string): string {
  switch (type) {
    case 'summary':
      return `Rewrite this professional summary to be compelling and ATS-optimized (2–3 sentences):\n\n${content}`;
    case 'achievement':
      return `Rewrite this single achievement bullet point with a strong action verb and metrics:\n\n${content}`;
    case 'achievements':
      return `Rewrite each of these achievement bullet points with strong action verbs and metrics. Return each on a new line:\n\n${content}`;
    case 'project':
      return `Rewrite this project description to highlight technical impact, your role, and outcomes:\n\n${content}`;
    default:
      return `Improve this resume content for ATS and professionalism:\n\n${content}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req as any);
    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Support both { text } and { content } for compatibility
    const content = (body.text || body.content || '').trim();
    const type = body.type || 'default';

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    const prompt = buildPrompt(type, content);
    
    let improved = await callGemini(prompt, SYSTEM_PROMPT);
    improved = improved.trim();

    if (!improved) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({ improved, original: content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[AI improve] Error:', message);
    const status = message.includes('missing') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

