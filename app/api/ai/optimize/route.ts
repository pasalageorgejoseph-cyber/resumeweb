export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { callGemini, checkRateLimit, getUserId } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an expert resume optimizer and ATS specialist.
Rewrite the provided resume content to improve clarity, add impact, and ensure it is ATS-optimized.
- Use strong action verbs.
- Add quantifiable metrics where logical.
- Keep the original facts.
Return ONLY the rewritten and optimized content without any surrounding explanations or quotes.`;

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = getUserId(req as any);
    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    const { content } = await req.json().catch(() => ({}));

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    const promptText = `CONTENT TO OPTIMIZE:\n${content}`;
    
    let optimized = await callGemini(promptText, SYSTEM_PROMPT);
    optimized = optimized.trim();

    return NextResponse.json({ optimized });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[AI Optimize] Error:', errorMsg);
    const status = errorMsg.includes('missing') ? 503 : 500;
    return NextResponse.json({ error: errorMsg }, { status });
  }
}

