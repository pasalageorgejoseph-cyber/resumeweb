'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { analyzeResumeRuleBased } from '@/lib/ruleBasedAI';
import {
  Target,
  CheckCircle,
  AlertCircle,
  Zap,
  Sparkles,
  Loader2,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Settings2,
  RefreshCw,
  Plus
} from 'lucide-react';

interface AIAnalysisResult {
  score: number;
  keywordsMatched: string[];
  missingKeywords: string[];
  suggestions: string[];
  improvedBullets: { original: string; improved: string; section: string }[];
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative flex items-center justify-center p-4">
      <svg width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: getColor(score) }}>{score}</span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  );
}

export function ATSPanel() {
  const store = useResumeStore();
  
  const [jobDescription, setJobDescription] = useState('');
  const [mode, setMode] = useState<'mvp' | 'advanced'>('mvp');
  
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate fields
  const [genRole, setGenRole] = useState('');
  const [genLevel, setGenLevel] = useState('Mid-Level');
  const [genTech, setGenTech] = useState('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  
  const [expandedSection, setExpandedSection] = useState<string | null>('score');

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError('');
    try {
      if (mode === 'mvp') {
        // Run instantly (<50ms)
        const result = analyzeResumeRuleBased(store, jobDescription);
        setAnalysis(result);
        setExpandedSection('score');
      } else {
        // Phase 2: LLM API call
        const res = await fetch('/api/ai/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeData: store, jobDescription }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to analyze resume via LLM');
        setAnalysis(data);
        setExpandedSection('score');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateContent = async (type: 'bullets' | 'summary') => {
    if (!genRole || !genTech) {
        setError('Please provide role and tech stack before generating.');
        return;
    }
    setIsGenerating(true);
    setError('');
    try {
        const res = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, role: genRole, experienceLevel: genLevel, techStack: genTech }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Generation failed');
        setGeneratedContent({ type, result: data.result });
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsGenerating(false);
    }
  };

  const applyBullet = (original: string, improved: string) => {
    // Basic apply - updates store where matches
    store.experience.forEach((exp, expIndex) => {
        const idx = exp.achievements.indexOf(original);
        if (idx !== -1) {
            const newExps = [...store.experience];
            newExps[expIndex].achievements[idx] = improved;
            store.updateExperience(exp.id, newExps[expIndex]);
        }
    });
    alert('Applied! Please review the editor to see the changes.');
  };

  return (
    <div className="animate-fade-in pb-10 space-y-6">
      
      {/* Configuration Header */}
      <div className="p-4 rounded-xl shadow-lg border relative overflow-hidden" 
           style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        
        {/* Glow effect for Advanced mode */}
        {mode === 'advanced' && (
          <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay pointer-events-none" />
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className={mode === 'advanced' ? 'text-indigo-400' : 'text-emerald-400'} />
            <h3 className="font-semibold text-sm">AI Engine Mode</h3>
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-black/20 border border-white/5">
            <button
              onClick={() => setMode('mvp')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'mvp' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
               Fast (Rule-Based)
            </button>
            <button
              onClick={() => setMode('advanced')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                mode === 'advanced' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
               <Sparkles size={12} /> Deep (LLM)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Target Job Description (Optional)</label>
            <textarea
              placeholder="Paste the job description here for highly customized keywords and scoring..."
              className="w-full text-sm p-3 rounded-lg bg-black/20 border border-white/10 focus:border-indigo-500/50 outline-none h-24 resize-none transition-colors"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl font-semibold transition-all ${
              mode === 'advanced' 
                ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            {isAnalyzing ? (
              <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
            ) : (
              <><Target size={16} /> Check ATS Score</>
            )}
          </button>
          
          {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Main Score Card */}
          <div className="card p-6 flex flex-col items-center justify-center bg-black/10 border-white/5">
            <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">ATS Match Score</h3>
            <ScoreRing score={analysis.score} />
            <p className="text-xs text-center text-gray-400 max-w-[200px] mt-2">
              Based on {mode === 'advanced' ? 'semantic analysis' : 'exact keywords, impact, and structure'}
            </p>
          </div>

          {/* Keyword Matching Box */}
          <div className="card overflow-hidden">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'keywords' ? null : 'keywords')}
              className="w-full p-4 flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-medium"><Briefcase size={16}/> Keyword Matching</div>
              {expandedSection === 'keywords' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {expandedSection === 'keywords' && (
              <div className="p-4 border-t border-white/5 space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-green-400 mb-2 font-medium">Matched Keywords</h4>
                  {analysis.keywordsMatched.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.keywordsMatched.map((kw, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-300 border border-green-500/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-xs text-gray-500">No matches found.</p>}
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-red-400 mb-2 font-medium">Missing Keywords (Add these!)</h4>
                  {analysis.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingKeywords.map((kw, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-xs text-gray-500">Perfect match on JD keywords!</p>}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions List */}
          <div className="card overflow-hidden">
            <button 
              onClick={() => setExpandedSection(expandedSection === 'suggestions' ? null : 'suggestions')}
              className="w-full p-4 flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-medium"><Settings2 size={16}/> Optimization Suggestions</div>
              {expandedSection === 'suggestions' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
            {expandedSection === 'suggestions' && (
              <div className="p-4 border-t border-white/5 space-y-3">
                {analysis.suggestions.length > 0 ? (
                  analysis.suggestions.map((s, i) => (
                    <div key={i} className="flex gap-3 text-xs bg-black/20 p-3 rounded-lg border border-white/5">
                      <Zap className="text-yellow-400 shrink-0 mt-0.5" size={14} />
                      <span className="text-gray-300 leading-relaxed">{s}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-green-400 flex items-center gap-2"><CheckCircle size={14}/> All sections are well optimized!</p>
                )}
              </div>
            )}
          </div>

          {/* Bullet Point Enhancer */}
          {analysis.improvedBullets.length > 0 && (
             <div className="card overflow-hidden border-indigo-500/30">
               <div className="w-full p-4 flex justify-between items-center bg-indigo-500/10 border-b border-indigo-500/20">
                 <div className="flex items-center gap-2 text-sm font-medium text-indigo-300"><RefreshCw size={16}/> Weak Bullet Point Enhancer</div>
               </div>
               <div className="p-4 space-y-4">
                 {analysis.improvedBullets.map((bullet, idx) => (
                   <div key={idx} className="p-3 rounded-lg bg-black/30 border border-white/5">
                     <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Section: {bullet.section}</p>
                     <p className="text-xs text-red-300 line-through opacity-80 mb-2 leading-relaxed">{bullet.original}</p>
                     
                     <div className="flex gap-2">
                       <Sparkles size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                       <p className="text-xs text-green-300 leading-relaxed">{bullet.improved}</p>
                     </div>
                     <button
                        onClick={() => applyBullet(bullet.original, bullet.improved)}
                        className="mt-3 text-xs bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-3 py-1.5 rounded transition-colors w-full flex justify-center"
                     >
                       1-Click Apply Fix
                     </button>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>
      )}

      {/* Content Generator (Phase 2 feature enabled here) */}
      <div className="card p-5 border-purple-500/20 bg-gradient-to-br from-black to-purple-900/10 mt-8">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-purple-300">
          <FileText size={16} /> Smart Content Generator
        </h3>
        <p className="text-xs text-gray-400 mb-4">Let our advanced LLM write perfect bullets and summaries for you.</p>
        
        <div className="space-y-3 mb-4">
           <input 
             type="text" placeholder="Target Role (e.g., Software Engineer)" 
             className="w-full text-xs p-2.5 rounded bg-black/40 border border-white/10 outline-none"
             value={genRole} onChange={(e) => setGenRole(e.target.value)}
           />
           <div className="flex gap-2">
             <input 
               type="text" placeholder="Key Tech (React, Node...)" 
               className="w-2/3 text-xs p-2.5 rounded bg-black/40 border border-white/10 outline-none"
               value={genTech} onChange={(e) => setGenTech(e.target.value)}
             />
             <select 
               className="w-1/3 text-xs p-2.5 rounded bg-black/40 border border-white/10 outline-none"
               value={genLevel} onChange={(e) => setGenLevel(e.target.value)}
             >
               <option>Junior</option>
               <option>Mid-Level</option>
               <option>Senior</option>
             </select>
           </div>
        </div>

        <div className="flex gap-2">
            <button
               onClick={() => generateContent('bullets')}
               disabled={isGenerating}
               className="flex-1 text-xs py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded transition-colors border border-purple-500/30 flex items-center justify-center gap-1"
            >
               {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <><Plus size={12} /> Generate Bullets</>}
            </button>
            <button
               onClick={() => generateContent('summary')}
               disabled={isGenerating}
               className="flex-1 text-xs py-2 bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 rounded transition-colors border border-pink-500/30 flex items-center justify-center gap-1"
            >
               {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <><FileText size={12} /> Generate Summary</>}
            </button>
        </div>

        {generatedContent && (
          <div className="mt-4 p-3 bg-black/30 border border-white/5 rounded-lg space-y-2">
            <h4 className="text-[10px] uppercase text-gray-500 font-semibold mb-2">Generated Result</h4>
            {generatedContent.type === 'summary' ? (
                <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-2 rounded">{generatedContent.result}</p>
            ) : (
                <ul className="list-disc pl-4 space-y-2">
                   {Array.isArray(generatedContent.result) 
                     ? generatedContent.result.map((item: string, i: number) => (
                         <li key={i} className="text-xs text-gray-300 leading-relaxed">{item}</li>
                       ))
                     : <li className="text-xs text-gray-300">{generatedContent.result}</li>}
                </ul>
            )}
            <p className="text-[10px] text-gray-500 mt-2 italic text-center">Copy content to use in your resume</p>
          </div>
        )}
      </div>

    </div>
  );
}
