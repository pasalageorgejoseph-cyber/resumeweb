import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ResumeForge — AI-Powered ATS Resume Builder',
  description:
    'Build a professional, ATS-friendly resume in minutes. Real-time preview, 10+ beautiful templates, AI content improvement, and one-click PDF export.',
  keywords: 'resume builder, ATS resume, CV maker, free resume, AI resume, professional resume',
  openGraph: {
    title: 'ResumeForge — AI-Powered Resume Builder',
    description: 'Modern resume builder with AI assistance, ATS scoring, 10+ templates and real-time preview.',
    type: 'website',
  },
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load all selectable resume fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@300;400;700&family=Lato:wght@300;400;700&family=Raleway:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
