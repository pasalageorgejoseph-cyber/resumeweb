import React from 'react';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="flex-1 flex flex-col items-center bg-[var(--bg-primary)] p-4 sm:p-8 relative min-h-[calc(100vh-64px)] z-10 w-full animate-fade-in overflow-y-auto">
      
      {/* Background decorations matching the app theme */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#a78bfa] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none" />

      <div className="max-w-md w-full glass card p-8 sm:p-10 transition-all z-20 my-auto mt-4 sm:mt-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--text-primary)]">{title}</h2>
          <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        
        {children}
        
        <div className="mt-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border)] pt-6">
          {footerText}{' '}
          <Link 
            href={footerLinkHref} 
            className="text-[var(--accent-light)] font-medium hover:text-[var(--accent)] hover:underline transition-colors focus:ring-2 focus:ring-[var(--accent)] focus:outline-none rounded-sm px-1 py-0.5"
          >
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
