'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface TemplateProps { data: ResumeData; }

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || 'Inter';

  const ordered = [...sections].filter(s => s.visible && s.id !== 'personalInfo').sort((a, b) => a.order - b.order);

  return (
    <div style={{ fontFamily: `'${font}', sans-serif`, background: 'white', color: '#111827', padding: '2.5rem 3rem', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#111827', margin: 0 }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '0.95rem', color: color, fontWeight: 500, marginTop: '0.25rem' }}>{personalInfo.title}</p>
        )}
        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.6rem', fontSize: '0.78rem', color: '#6b7280', flexWrap: 'wrap' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
        <p style={{ fontSize: '0.825rem', color: '#374151', lineHeight: 1.65, marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: `1px solid #e5e7eb` }}>
          {personalInfo.summary}
        </p>
      )}

      {ordered.map(section => {
        if (section.id === 'experience' && experience.length > 0) return (
          <div key="exp" style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: color, marginBottom: '0.875rem' }}>Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{exp.position}</p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.achievements.filter(Boolean).length > 0 && (
                  <ul style={{ marginTop: '0.4rem', paddingLeft: 0, listStyle: 'none' }}>
                    {exp.achievements.filter(Boolean).map((a, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#374151', marginBottom: '0.2rem' }}>
                        <span style={{ color, flexShrink: 0, marginTop: '0.05rem' }}>—</span><span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
        if (section.id === 'education' && education.length > 0) return (
          <div key="edu" style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: color, marginBottom: '0.875rem' }}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{edu.institution}</p>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
              </div>
            ))}
          </div>
        );
        if (section.id === 'projects' && projects.length > 0) return (
          <div key="proj" style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: color, marginBottom: '0.875rem' }}>Projects</h2>
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '0.875rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{proj.name}</p>
                {proj.description && <p style={{ fontSize: '0.8rem', color: '#374151', marginTop: '0.15rem' }}>{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>{proj.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        );
        if (section.id === 'skills' && skills.length > 0) return (
          <div key="sk" style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: color, marginBottom: '0.875rem' }}>Skills</h2>
            {skills.map(sg => (
              <div key={sg.id} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, color: '#374151', minWidth: '6rem' }}>{sg.category}</span>
                <span style={{ color: '#6b7280' }}>{sg.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        );
        return null;
      })}
    </div>
  );
}
