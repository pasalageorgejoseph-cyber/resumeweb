'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface TemplateProps { data: ResumeData; }

export function BoldTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || 'Poppins';

  const ordered = [...sections].filter(s => s.visible && s.id !== 'personalInfo').sort((a, b) => a.order - b.order);

  return (
    <div style={{ fontFamily: `'${font}', sans-serif`, background: 'white', color: '#111827', minHeight: '100%' }}>
      {/* Big coloured header */}
      <div style={{ background: color, padding: '2.25rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.05, position: 'relative' }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.82)', fontWeight: 500, marginTop: '0.4rem', position: 'relative' }}>{personalInfo.title}</p>
        )}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', flexWrap: 'wrap', position: 'relative' }}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>✆ {personalInfo.phone}</span>}
          {personalInfo.location && <span>⊙ {personalInfo.location}</span>}
          {personalInfo.website && <span>⊕ {personalInfo.website}</span>}
        </div>
      </div>

      <div style={{ padding: '1.5rem 2.5rem' }}>
        {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
          <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.7, marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: `2px solid ${color}20` }}>
            {personalInfo.summary}
          </p>
        )}

        {ordered.map(section => {
          const SHead = ({ t }: { t: string }) => (
            <h2 style={{
              fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
              color, marginBottom: '0.875rem', paddingBottom: '0.4rem',
              borderBottom: `3px solid ${color}`,
              display: 'inline-block',
            }}>{t}</h2>
          );

          if (section.id === 'experience' && experience.length > 0) return (
            <div key="exp" style={{ marginBottom: '1.5rem' }}>
              <SHead t="Experience" />
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{exp.position}</p>
                      <p style={{ fontSize: '0.82rem', color, fontWeight: 600 }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                    </div>
                    <span style={{ fontSize: '0.73rem', color: '#9ca3af', whiteSpace: 'nowrap', background: `${color}15`, padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: '1rem', margin: '0.35rem 0 0' }}>
                    {exp.achievements.filter(Boolean).map((a, i) => (
                      <li key={i} style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '0.2rem' }}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
          if (section.id === 'education' && education.length > 0) return (
            <div key="edu" style={{ marginBottom: '1.5rem' }}>
              <SHead t="Education" />
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{edu.institution}</p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                  </div>
                  <p style={{ fontSize: '0.73rem', color: '#9ca3af' }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                </div>
              ))}
            </div>
          );
          if (section.id === 'projects' && projects.length > 0) return (
            <div key="proj" style={{ marginBottom: '1.5rem' }}>
              <SHead t="Projects" />
              {projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '0.875rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{proj.name}</p>
                  {proj.description && <p style={{ fontSize: '0.8rem', color: '#374151', marginTop: '0.15rem' }}>{proj.description}</p>}
                  {proj.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.35rem' }}>
                      {proj.technologies.map((t, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', background: `${color}18`, color, padding: '0.1rem 0.5rem', borderRadius: 3, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
          if (section.id === 'skills' && skills.length > 0) return (
            <div key="sk" style={{ marginBottom: '1.5rem' }}>
              <SHead t="Skills" />
              {skills.map(sg => (
                <div key={sg.id} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 700, minWidth: '6rem', color: '#111827' }}>{sg.category}:</span>
                  <span style={{ color: '#6b7280' }}>{sg.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
}
