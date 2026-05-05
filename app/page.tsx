'use client';

import dynamic from 'next/dynamic';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';

// Lazy load heavy components
const ResumeEditor = dynamic(
  () => import('@/components/ResumeEditor').then((m) => ({ default: m.ResumeEditor })),
  { ssr: false }
);

const ResumePreview = dynamic(
  () => import('@/components/ResumePreview').then((m) => ({ default: m.ResumePreview })),
  { ssr: false }
);

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
        <Navbar />

        <main className="flex flex-1 overflow-hidden relative">
          <div
            className="flex flex-col no-print z-10"
            style={{
              width: '42%',
              minWidth: 380,
              maxWidth: 520,
              borderRight: '1px solid var(--border)',
              background: 'var(--bg-primary)',
              overflow: 'hidden',
            }}
          >
            <ResumeEditor />
          </div>

          <div
            className="flex-1 flex flex-col overflow-hidden"
            style={{ background: '#1a1a2e' }}
          >
            <ResumePreview />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
