'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Check, X, AlertCircle } from 'lucide-react';

interface AIImproveButtonProps {
  content: string;
  type: 'summary' | 'achievement' | 'achievements' | 'project';
  onAccept: (improved: string) => void;
  label?: string;
  compact?: boolean;
}

type UIState = 'idle' | 'loading' | 'preview' | 'error';

export function AIImproveButton({
  content,
  type,
  onAccept,
  label = 'Improve with AI',
  compact = false,
}: AIImproveButtonProps) {
  const [state, setState] = useState<UIState>('idle');
  const [improved, setImproved] = useState('');
  const [error, setError] = useState('');

  const handleImprove = async () => {
    if (!content.trim()) return;

    setState('loading');
    setError('');

    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'AI request failed');
      }

      setImproved(data.improved);
      setState('preview');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI failed. Try again.';
      setError(message);
      setState('error');
      setTimeout(() => setState('idle'), 5000);
    }
  };

  const handleAccept = () => {
    onAccept(improved);
    setState('idle');
    setImproved('');
  };

  const handleReject = () => {
    setState('idle');
    setImproved('');
  };

  return (
    <div className="w-full">
      {/* ─── Trigger button ─── */}
      {state === 'idle' && (
        <button
          onClick={handleImprove}
          disabled={!content.trim()}
          className="flex items-center gap-1.5 text-xs transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15))',
            border: '1px solid rgba(139,92,246,0.35)',
            color: '#a78bfa',
            borderRadius: '0.4rem',
            padding: compact ? '0.25rem 0.6rem' : '0.35rem 0.75rem',
            fontWeight: 500,
          }}
        >
          <Sparkles size={11} className="shrink-0" />
          {compact ? '✨' : label}
        </button>
      )}

      {/* ─── Loading ─── */}
      {state === 'loading' && (
        <div
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md"
          style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.1)' }}
        >
          <Loader2 size={11} className="animate-spin" />
          <span>AI is improving…</span>
        </div>
      )}

      {/* ─── Error ─── */}
      {state === 'error' && (
        <div
          className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-md"
          style={{
            color: '#fca5a5',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <AlertCircle size={11} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Preview & Accept/Reject ─── */}
      {state === 'preview' && (
        <div
          className="rounded-lg overflow-hidden animate-slide-up"
          style={{ border: '1px solid rgba(139,92,246,0.35)', marginTop: '0.5rem' }}
        >
          {/* Header row */}
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))',
              borderBottom: '1px solid rgba(139,92,246,0.25)',
            }}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#a78bfa' }}>
              <Sparkles size={11} />
              AI Suggestion
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAccept}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium transition-all"
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.3)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(16,185,129,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(16,185,129,0.15)')}
              >
                <Check size={11} /> Accept
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  color: '#f87171',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                <X size={11} /> Dismiss
              </button>
            </div>
          </div>

          {/* Suggested text */}
          <div
            className="p-3 text-xs leading-relaxed whitespace-pre-wrap"
            style={{
              background: 'rgba(139,92,246,0.05)',
              color: 'var(--text-secondary)',
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {improved}
          </div>
        </div>
      )}
    </div>
  );
}
