export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { callGemini, checkRateLimit, getUserId } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an expert AI Resume Writer.
Based on the input provided (job role, experience level, tech stack), generate highly professional and ATS-optimized content.
Return the response as a JSON array of strings if generating bullets, or a simple text string if generating a summary.
Do NOT include markdown like \`\`\`json. Output raw JSON.`;

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = getUserId(req as any);
    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    const { type, role, experienceLevel, techStack } = await req.json().catch(() => ({}));

    let prompt = "";
    if (type === 'bullets') {
        prompt = `Generate 4 highly impactful, ATS-optimized experience bullet points for a ${experienceLevel} ${role} using ${techStack}. Output ONLY a JSON array of strings: ["bullet 1", "bullet 2"]`;
    } else if (type === 'summary') {
        prompt = `Generate a 3-sentence professional summary for a ${experienceLevel} ${role} skilled in ${techStack}. Output ONLY plain text summary.`;
    } else {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    let generatedOut = await callGemini(prompt, SYSTEM_PROMPT);
    generatedOut = generatedOut.trim();

    // Clean up markdown formatting if the model still returns it
    if (type === 'bullets') {
      try {
        if (generatedOut.startsWith('```json')) {
            generatedOut = generatedOut.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
        } else if (generatedOut.startsWith('```')) {
            generatedOut = generatedOut.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
        }
        
        const parsed = JSON.parse(generatedOut);
        return NextResponse.json({ result: parsed });
      } catch {
          // If parse fails, attempt to split by newline fallback
          const lines = generatedOut.split('\n').filter((l: string) => l.trim().length > 0).map((l: string) => l.replace(/^[-\*•\d\.]+\s*/, ''));
          return NextResponse.json({ result: lines });
      }
    }

    return NextResponse.json({ result: generatedOut });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[AI Generate] Error:', errorMsg);
    const status = errorMsg.includes('missing') ? 503 : 500;
    return NextResponse.json({ error: errorMsg }, { status });
  }
}

