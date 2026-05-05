import { ResumeData } from '@/types/resume';

const ACTION_VERBS = [
  'led', 'developed', 'built', 'improved', 'increased', 'optimized',
  'designed', 'implemented', 'managed', 'created', 'launched', 'delivered',
  'architected', 'scaled', 'deployed', 'mentored', 'collaborated', 'drove',
  'spearheaded', 'established', 'streamlined', 'automated', 'engineered',
  'executed', 'achieved', 'generated', 'accelerated', 'transformed',
  'migrated', 'integrated', 'shipped', 'maintained', 'authored',
  'coordinated', 'facilitated'
];

type AIScoreResult = {
  score: number;
  keywordsMatched: string[];
  missingKeywords: string[];
  suggestions: string[];
  improvedBullets: { original: string; improved: string; section: string; }[];
};

// Helper: extremely basic stop words
const STOP_WORDS = new Set(['and', 'or', 'the', 'is', 'in', 'at', 'of', 'to', 'for', 'with', 'on', 'a', 'an']);

export function extractKeywords(text: string): string[] {
  if (!text) return [];
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  return Array.from(new Set(words.filter(w => w.length > 2 && !STOP_WORDS.has(w))));
}

export function analyzeResumeRuleBased(data: ResumeData, jobDescription: string): AIScoreResult {
  const jdKeywords = extractKeywords(jobDescription);
  
  // Extract all text from resume
  const parts: string[] = [];
  parts.push(data.personalInfo.summary || '');
  data.experience.forEach(exp => {
    parts.push(exp.description || '');
    exp.achievements.forEach(a => parts.push(a));
  });
  data.projects.forEach(proj => {
    parts.push(proj.description || '');
  });
  data.skills.forEach(sg => parts.push(sg.skills.join(' ')));
  const resumeText = parts.join(' ').toLowerCase();

  // 1. KEYWORD MATCHING ENGINE
  const keywordsMatched: string[] = [];
  const missingKeywords: string[] = [];

  if (jdKeywords.length > 0) {
    jdKeywords.forEach(kw => {
      if (resumeText.includes(kw)) {
        keywordsMatched.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });
  }

  const keywordMatchScore = jdKeywords.length > 0 
    ? Math.min(100, Math.round((keywordsMatched.length / jdKeywords.length) * 100))
    : 100; // If no JD, assume 100% or we can default to something else, but 100 is fine if not constrained

  // 2. IMPACT SCORING SYSTEM & 3. BULLET ENHANCER
  let totalBullets = 0;
  let impactScoreAcc = 0;
  const improvedBullets: { original: string; improved: string; section: string }[] = [];
  const suggestions: Set<string> = new Set();

  const analyzeBullets = (bullets: string[], sectionName: string) => {
    bullets.forEach(bullet => {
      if (!bullet.trim()) return;
      totalBullets++;
      
      let score = 0;
      const lowerBullet = bullet.toLowerCase();
      
      const hasActionVerb = ACTION_VERBS.some(v => lowerBullet.startsWith(v) || lowerBullet.split(' ').includes(v));
      if (hasActionVerb) {
        score += 10;
      } else {
        suggestions.add(`Weak bullet point found in ${sectionName}. Start with an action verb.`);
      }

      const hasMetrics = /\d+%?/.test(lowerBullet);
      if (hasMetrics) {
        score += 10;
      } else {
        suggestions.add(`Add measurable metrics (numbers/%) to bullets in ${sectionName}.`);
        
        // Enhance: simple rule-based rewrite if no metrics
        improvedBullets.push({
          original: bullet,
          improved: `Achieved ${bullet.replace(/^(I |My |Working on |Worked on )/i, '').trim()} by doing [Action] resulting in [Number]% increase in [Metric]`,
          section: sectionName
        });
      }

      // Check for outcomes (words indicating results)
      const outcomeWords = ['resulting', 'leading to', 'improving', 'reducing', 'increasing', 'achieved'];
      const hasOutcome = outcomeWords.some(w => lowerBullet.includes(w));
      if (hasOutcome) {
        score += 5;
      }

      // scale up from 25 raw max to 100
      impactScoreAcc += Math.min(100, (score / 25) * 100);
    });
  };

  data.experience.forEach(exp => {
    analyzeBullets(exp.achievements, 'Experience');
  });
  data.projects.forEach(proj => {
    // If project just has description separated by commas or sentences, let's treat it as one bullet
    if (proj.description) {
      analyzeBullets([proj.description], 'Projects');
    }
  });

  const avgImpactScore = totalBullets > 0 ? Math.round(impactScoreAcc / totalBullets) : 0;

  if (totalBullets === 0) {
    suggestions.add("No bullet points found in Experience or Projects. Add details.");
  }

  // 4. ATS SCORE CALCULATOR (Rule based metrics)
  // Structure completeness (20%)
  let structureCompleteness = 0;
  if (data.personalInfo.name && data.personalInfo.email && data.personalInfo.phone) structureCompleteness += 30;
  if (data.personalInfo.summary) structureCompleteness += 20;
  if (data.experience.length > 0) structureCompleteness += 20;
  if (data.education.length > 0) structureCompleteness += 10;
  if (data.skills.length > 0) structureCompleteness += 20;

  // Readability (10%) - approximate based on word count/bullet length
  const readabilityScore = 80;

  const score = Math.round(
    (keywordMatchScore * 0.40) +
    (avgImpactScore * 0.30) +
    (structureCompleteness * 0.20) +
    (readabilityScore * 0.10)
  );

  // 5. SUGGESTION ENGINE
  if (missingKeywords.length > 0) {
    suggestions.add(`Missing Job Description Keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  if (!data.personalInfo.summary) suggestions.add("Missing Profile Summary section");
  if (data.experience.length === 0) suggestions.add("Missing Experience section");

  return {
    score,
    keywordsMatched,
    missingKeywords,
    suggestions: Array.from(suggestions),
    improvedBullets
  };
}
