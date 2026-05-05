export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { callGemini, checkRateLimit, getUserId } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an advanced AI Resume Analyzer integrated inside a resume builder application.

Your job is to analyze the user's resume and return highly detailed ATS feedback.

IMPORTANT:
- Do NOT give generic suggestions
- Be specific and actionable
- Always explain WHY the score is low
- Always show WHERE the issue is
- Always give an improved version

--------------------------------------

Analyze the resume across these categories:

1. Action Verbs
2. Keywords (ATS match)
3. Structure & Formatting
4. Content Completeness
5. Impact & Measurability

--------------------------------------

For EACH category, return:

- score (0–100)
- reason (clear explanation with numbers if possible)
- issues:
    - section (e.g., Experience, Projects)
    - original_text (exact line from resume)
    - problem (what is wrong)
    - why_it_is_problem (brief explanation)
    - improved_text (rewritten strong version)

- fix_summary (short steps to improve)
- ai_insight (1–2 lines explaining ATS/recruiter impact)

--------------------------------------

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "overall_score": 85,
  "categories": [
    {
      "name": "Action Verbs",
      "score": 80,
      "reason": "text",
      "issues": [
        {
          "section": "text",
          "original_text": "text",
          "problem": "text",
          "why_it_is_problem": "text",
          "improved_text": "text"
        }
      ],
      "fix_summary": "text",
      "ai_insight": "text"
    }
  ]
}

--------------------------------------

RULES:
- Extract real content from resume
- Do not hallucinate fake lines
- Keep output clean JSON (no markdown, no explanation)
- Focus on clarity and usefulness
- Prefer measurable improvements (numbers, results)`;

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req as any);
    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    const { resumeData } = await req.json().catch(() => ({}));
    
    if (!resumeData) {
      return NextResponse.json({ error: 'Invalid request body, expected resumeData' }, { status: 400 });
    }

    // Strip photo to save tokens
    if (resumeData.personalInfo && resumeData.personalInfo.photo) {
      delete resumeData.personalInfo.photo;
    }

    const resumeText = JSON.stringify(resumeData, null, 2);
    const prompt = `RESUME:\n${resumeText}`;

    let textOut = await callGemini(prompt, SYSTEM_PROMPT);
    textOut = textOut.trim();

    // Strip markdown formatting if the model still wrapped it
    if (textOut.startsWith('```json')) {
      textOut = textOut.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    } else if (textOut.startsWith('```')) {
      textOut = textOut.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
    }

    try {
      const parsedJson = JSON.parse(textOut);
      
      // Validate that the AI returned the expected structure
      if (!parsedJson || typeof parsedJson !== 'object') {
        throw new Error('AI returned an invalid JSON structure (not an object)');
      }
      
      if (!Array.isArray(parsedJson.categories)) {
        console.error('[AI Analyze] Missing categories in response:', parsedJson);
        return NextResponse.json({ 
          error: "AI failed to generate a complete category analysis. Please try again." 
        }, { status: 500 });
      }

      return NextResponse.json(parsedJson);
    } catch (parseErr: any) {
      console.error('[AI Analyze] JSON Parse Error:', parseErr.message);
      console.error('[AI Analyze] Raw Output:', textOut);
      return NextResponse.json({ 
        error: `Failed to parse AI response: ${parseErr.message}`,
        rawText: textOut 
      }, { status: 500 });
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[AI Analyze] Error:', message);
    const status = message.includes('missing') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

