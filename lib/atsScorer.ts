import { ResumeData, ATSScore } from '@/types/resume';

const ACTION_VERBS = [
  'led', 'built', 'designed', 'developed', 'implemented', 'managed', 'created',
  'launched', 'improved', 'increased', 'reduced', 'delivered', 'architected',
  'optimized', 'scaled', 'deployed', 'mentored', 'collaborated', 'drove',
  'spearheaded', 'established', 'streamlined', 'automated', 'engineered',
  'executed', 'achieved', 'generated', 'accelerated', 'transformed', 'migrated',
  'integrated', 'shipped', 'maintained', 'authored', 'coordinated', 'facilitated',
];

const TECH_KEYWORDS = [
  'javascript', 'typescript', 'python', 'react', 'node', 'aws', 'docker',
  'kubernetes', 'ci/cd', 'agile', 'scrum', 'api', 'rest', 'graphql', 'sql',
  'nosql', 'microservices', 'cloud', 'devops', 'git', 'testing', 'performance',
  'security', 'scalable', 'architecture', 'algorithms', 'machine learning',
  'ai', 'data', 'analytics', 'mobile', 'frontend', 'backend', 'full-stack',
  'product', 'roadmap', 'stakeholder', 'cross-functional', 'metrics',
];

function extractText(data: ResumeData): string {
  const parts: string[] = [];
  parts.push(data.personalInfo.summary || '');
  data.experience.forEach((exp) => {
    parts.push(exp.description || '');
    exp.achievements.forEach((a) => parts.push(a));
  });
  data.projects.forEach((proj) => {
    parts.push(proj.description || '');
  });
  data.skills.forEach((sg) => parts.push(sg.skills.join(' ')));
  return parts.join(' ').toLowerCase();
}

function scoreActionVerbs(text: string): { score: number; found: string[] } {
  const found = ACTION_VERBS.filter((verb) =>
    new RegExp(`\\b${verb}\\b`, 'i').test(text)
  );
  const score = Math.min(100, Math.round((found.length / 8) * 100));
  return { score, found };
}

function scoreKeywords(text: string): { score: number; found: string[] } {
  const found = TECH_KEYWORDS.filter((kw) => text.includes(kw));
  const score = Math.min(100, Math.round((found.length / 10) * 100));
  return { score, found };
}

function scoreStructure(data: ResumeData): number {
  let score = 0;
  if (data.personalInfo.name) score += 15;
  if (data.personalInfo.email) score += 15;
  if (data.personalInfo.phone) score += 10;
  if (data.personalInfo.summary && data.personalInfo.summary.length > 50) score += 20;
  if (data.experience.length > 0) score += 20;
  if (data.education.length > 0) score += 10;
  if (data.skills.length > 0) score += 10;
  return Math.min(100, score);
}

function scoreCompleteness(data: ResumeData): number {
  let score = 0;
  const pi = data.personalInfo;
  if (pi.name) score += 10;
  if (pi.email) score += 10;
  if (pi.phone) score += 10;
  if (pi.title) score += 10;
  if (pi.location) score += 5;
  if (pi.summary && pi.summary.length > 100) score += 15;
  if (data.experience.length >= 2) score += 15;
  if (data.education.length >= 1) score += 10;
  if (data.projects.length >= 1) score += 10;
  if (data.skills.length >= 2) score += 5;
  return Math.min(100, score);
}

export function calculateATSScore(data: ResumeData): ATSScore {
  const text = extractText(data);
  const verbResult = scoreActionVerbs(text);
  const keywordResult = scoreKeywords(text);
  const structure = scoreStructure(data);
  const completeness = scoreCompleteness(data);

  const total = Math.round(
    verbResult.score * 0.25 +
    keywordResult.score * 0.3 +
    structure * 0.25 +
    completeness * 0.2
  );

  const suggestions: string[] = [];

  if (verbResult.score < 70) {
    suggestions.push(
      `Use more strong action verbs (e.g., "Led", "Built", "Designed"). Found: ${verbResult.found.length}/8 recommended.`
    );
  }
  if (keywordResult.score < 60) {
    suggestions.push(
      'Add more relevant technical keywords to improve ATS matching. Include technologies and methodologies from job descriptions.'
    );
  }
  if (!data.personalInfo.summary || data.personalInfo.summary.length < 100) {
    suggestions.push(
      'Add or expand your professional summary to at least 2-3 sentences (100+ characters).'
    );
  }
  if (data.experience.length === 0) {
    suggestions.push('Add at least one work experience entry.');
  } else {
    const hasMetrics = data.experience.some((exp) =>
      exp.achievements.some((a) => /\d+/.test(a))
    );
    if (!hasMetrics) {
      suggestions.push(
        'Quantify your achievements with metrics (e.g., "Increased performance by 40%", "Managed team of 5").'
      );
    }
  }
  if (data.skills.length < 2) {
    suggestions.push('Add more skill categories to showcase your technical breadth.');
  }
  if (!data.personalInfo.email) {
    suggestions.push('Add your email address to the personal information section.');
  }
  if (data.projects.length === 0) {
    suggestions.push('Add at least one project to demonstrate your practical skills.');
  }
  if (structure < 80) {
    suggestions.push('Improve resume structure by completing all key sections.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Great job! Your resume is well-optimized for ATS systems.');
  }

  return {
    total,
    breakdown: {
      actionVerbs: verbResult.score,
      keywords: keywordResult.score,
      structure,
      completeness,
    },
    suggestions,
  };
}
