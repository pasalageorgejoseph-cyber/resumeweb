'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Sparkles, RotateCcw, LogOut, User } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  showEditorControls?: boolean;
}

export function Header({ showEditorControls = false }: HeaderProps) {
  const { resetData, personalInfo } = useResumeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    if (showResetConfirm) {
      resetData();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header
      className="flex items-center justify-between px-5 py-3 no-print z-50 sticky top-0"
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
        >
          <FileText size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-none gradient-text">ResumeForge</h1>
          <p className="text-[10px] sm:text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>
            ATS-Optimized Builder
          </p>
        </div>
      </Link>

      {/* Center Indicator (Only for editor) */}
      {showEditorControls && isAuthenticated && (
        <div className="hidden md:flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs shadow-inner"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10b981',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Auto-saved to browser
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {showEditorControls && isAuthenticated && (
          <>
            <div
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'var(--accent-glow)', color: 'var(--accent-light)', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <Sparkles size={12} />
              <span className="max-w-[120px] truncate">{personalInfo.name || 'Your Resume'}</span>
            </div>

            <button
              id="reset-data-btn"
              onClick={handleReset}
              className="btn-secondary text-xs focus:ring-2 focus:ring-red-500 outline-none"
              style={{
                padding: '0.4rem 0.75rem',
                color: showResetConfirm ? 'var(--danger)' : 'var(--text-muted)',
                borderColor: showResetConfirm ? 'rgba(239,68,68,0.4)' : 'var(--border)',
              }}
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">{showResetConfirm ? 'Click again to confirm' : 'Reset'}</span>
            </button>
          </>
        )}

        <div className="h-4 w-px bg-[var(--border)] mx-1 hidden sm:block"></div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border)]">
                <User size={14} className="text-[var(--accent-light)]" />
              </div>
              <span className="truncate max-w-[100px]">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] border border-transparent hover:border-[var(--danger)]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--danger)]"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              href="/login" 
              className="btn-secondary text-xs hover:text-white transition-colors"
              style={{ padding: '0.4rem 0.8rem' }}
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="btn-primary text-xs shadow-lg shadow-indigo-500/20"
              style={{ padding: '0.4rem 0.8rem' }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
