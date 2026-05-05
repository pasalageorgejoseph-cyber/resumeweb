export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { callGemini, checkRateLimit, getUserId } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an advanced AI ATS and Job Matching System.
Your task is to analyze the given resume against the provided job description and return an accurate ATS score and detailed feedback.
Follow advanced semantic matching: understand context instead of just exact word matches.

OUTPUT FORMAT (STRICT JSON ONLY, DO NOT ADD ANY MARKDOWN OR TEXT OUTSIDE JSON):
{
  "score": 85,
  "keywordsMatched": ["React", "TypeScript", "Node.js"],
  "missingKeywords": ["AWS", "Docker"],
  "suggestions": ["Include metrics in your first experience bullet", "Add AWS experience if you have it"],
  "improvedBullets": [
    {
      "original": "Worked on the frontend",
      "improved": "Developed responsive frontend using React, improving user engagement by 20%",
      "section": "Experience"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req as any);
    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    const { resumeData, jobDescription } = await req.json().catch(() => ({}));

    // strip photo
    if (resumeData?.personalInfo?.photo) delete resumeData.personalInfo.photo;

    const resumeText = JSON.stringify(resumeData, null, 2);
    
    let promptText = `RESUME:\n${resumeText}\n\n`;
    if (jobDescription) {
        promptText += `JOB DESCRIPTION:\n${jobDescription}\n\n`;
    }

    let generatedOut = await callGemini(promptText, SYSTEM_PROMPT);
    generatedOut = generatedOut.trim();

    // Clean up markdown
    if (generatedOut.startsWith('```json')) {
        generatedOut = generatedOut.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    } else if (generatedOut.startsWith('```')) {
        generatedOut = generatedOut.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
    }

    const parsed = JSON.parse(generatedOut);
    return NextResponse.json(parsed);

  } catch (err: any) {
    console.error('[AI Score] Error:', err.message);
    const status = err.message.includes('missing') ? 503 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

