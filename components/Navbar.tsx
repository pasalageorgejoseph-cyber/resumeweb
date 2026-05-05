'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LogOut, User, RotateCcw, Sparkles, History, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useResumeStore } from '@/store/resumeStore';

export function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const store = useResumeStore();
  const { resetData, personalInfo, ...dataParams } = store;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [didSave, setDidSave] = useState(false);
  const pathname = usePathname();
  
  const isDashboard = pathname === '/';

  const handleReset = () => {
    if (showResetConfirm) {
      resetData();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const handleSaveToCloud = async () => {
    if (!isAuthenticated) return;
    setIsSaving(true);
    
    try {
      await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: personalInfo.name ? `${personalInfo.name}'s Resume` : 'Untitled Builder',
          data: { ...store }
        })
      });
      setDidSave(true);
      setTimeout(() => setDidSave(false), 3000);
    } catch {
      alert("Failed syncing to database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-5 py-3 no-print z-50 bg-[var(--bg-card)] border-b border-[var(--border)] shrink-0">
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md border border-[rgba(255,255,255,0.1)]" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <FileText size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-none gradient-text">ResumeForge</h1>
          <p className="text-[10px] sm:text-xs leading-none mt-0.5 text-[var(--text-muted)]">ATS-Optimized Builder</p>
        </div>
      </Link>

      <div className="flex items-center gap-3 relative min-h-[32px]">
        {/* Editor Controls Segment */}
        {isDashboard && isAuthenticated && !isLoading && (
          <div className="flex items-center gap-2 mr-2">
            <button
               onClick={handleSaveToCloud}
               disabled={isSaving || didSave}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${didSave ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20'}`}
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : didSave ? <CheckCircle2 size={13} /> : <Save size={13} />}
              <span className="hidden sm:inline">{didSave ? 'Saved' : 'Save to Cloud'}</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-secondary text-xs focus:ring-2 focus:ring-red-500 outline-none transition-all"
              style={{ padding: '0.4rem 0.75rem', color: showResetConfirm ? 'var(--danger)' : 'var(--text-muted)', borderColor: showResetConfirm ? 'rgba(239,68,68,0.4)' : 'var(--border)' }}
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">{showResetConfirm ? 'Confirm?' : 'Reset'}</span>
            </button>
            <div className="h-4 w-px bg-[var(--border)] hidden sm:block mx-1"></div>
          </div>
        )}

        {/* Auth / Account Controls Segment */}
        {isLoading ? (
          <div className="w-24 h-8 bg-[var(--border)] rounded-md animate-pulse"></div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-3 animate-fade-in">
            <Link href="/history" className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pr-2">
              <History size={14} className="text-[var(--accent-light)]" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded-full border border-[var(--border)]">
              <div className="w-5 h-5 flex items-center justify-center">
                <User size={14} className="text-indigo-400" />
              </div>
              <span className="truncate max-w-[100px] pr-1">{user?.username || 'User'}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] border border-transparent hover:border-[var(--danger)]/30 transition-all focus:outline-none focus:ring-1 focus:ring-[var(--danger)]"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-fade-in">
            <Link href="/login" className="btn-secondary text-xs hover:text-white transition-colors" style={{ padding: '0.4rem 0.8rem' }}>
              Login
            </Link>
            <Link href="/signup" className="btn-primary text-xs shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]" style={{ padding: '0.4rem 0.8rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
