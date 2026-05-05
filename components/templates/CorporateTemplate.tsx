'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface TemplateProps { data: ResumeData; }

export function CorporateTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || 'Inter';

  const ordered = [...sections].filter(s => s.visible && s.id !== 'personalInfo').sort((a, b) => a.order - b.order);

  // Darken: used for rule lines
  const lightColor = `${color}20`;

  return (
    <div style={{ fontFamily: `'${font}', sans-serif`, background: 'white', color: '#1f2937', minHeight: '100%' }}>
      {/* Top bar + header */}
      <div style={{ borderTop: `6px solid ${color}`, padding: '1.75rem 2.25rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#111827', margin: 0, lineHeight: 1.1 }}>
              {personalInfo.name || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {personalInfo.title}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.7 }}>
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>
      </div>

      {/* Summary bar */}
      {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
        <div style={{ background: lightColor, padding: '0.75rem 2.25rem', borderTop: `1px solid ${color}30`, borderBottom: `1px solid ${color}30` }}>
          <p style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.65, margin: 0 }}>{personalInfo.summary}</p>
        </div>
      )}

      <div style={{ padding: '1.25rem 2.25rem' }}>
        {ordered.map(section => {
          const SectionHeading = ({ title }: { title: string }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <h2 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color, margin: 0, whiteSpace: 'nowrap' }}>{title}</h2>
              <div style={{ flex: 1, height: 1.5, background: color, opacity: 0.25 }} />
            </div>
          );

          if (section.id === 'experience' && experience.length > 0) return (
            <div key="exp" style={{ marginBottom: '1.5rem' }}>
              <SectionHeading title="Professional Experience" />
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{exp.position}</p>
                    <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color, marginBottom: '0.25rem' }}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {exp.achievements.filter(Boolean).map((a, i) => (
                      <li key={i} style={{ fontSize: '0.78rem', color: '#374151', marginBottom: '0.18rem', lineHeight: 1.55 }}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
          if (section.id === 'education' && education.length > 0) return (
            <div key="edu" style={{ marginBottom: '1.5rem' }}>
              <SectionHeading title="Education" />
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{edu.institution}</p>
                    <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}{edu.gpa ? ` — GPA ${edu.gpa}` : ''}</p>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                </div>
              ))}
            </div>
          );
          if (section.id === 'projects' && projects.length > 0) return (
            <div key="proj" style={{ marginBottom: '1.5rem' }}>
              <SectionHeading title="Key Projects" />
              {projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{proj.name}</p>
                    {proj.url && <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{proj.url}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize: '0.78rem', color: '#374151', marginTop: '0.15rem' }}>{proj.description}</p>}
                  {proj.technologies.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                      {proj.technologies.map((t, i) => (
                        <span key={i} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: 3, background: lightColor, color, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
          if (section.id === 'skills' && skills.length > 0) return (
            <div key="sk" style={{ marginBottom: '1.5rem' }}>
              <SectionHeading title="Core Competencies" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {skills.map(sg => (
                  <div key={sg.id} style={{ fontSize: '0.78rem' }}>
                    <span style={{ fontWeight: 700, color: '#374151' }}>{sg.category}: </span>
                    <span style={{ color: '#6b7280' }}>{sg.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
}
