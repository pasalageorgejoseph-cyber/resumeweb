'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface TemplateProps { data: ResumeData; }

export function ExecutiveTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || 'Playfair Display';

  const ordered = [...sections].filter(s => s.visible && s.id !== 'personalInfo').sort((a, b) => a.order - b.order);

  return (
    <div style={{ fontFamily: `'${font}', serif`, background: 'white', color: '#1f2937', minHeight: '100%', padding: '2.5rem 2.75rem' }}>
      {/* Header — centred executive style */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: `2px solid ${color}` }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#111827', margin: 0 }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '0.9rem', color, fontWeight: 500, marginTop: '0.3rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{personalInfo.title}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.6rem', fontSize: '0.78rem', color: '#6b7280' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.865rem', color: '#374151', fontStyle: 'italic', lineHeight: 1.7, maxWidth: '80%', margin: '0 auto' }}>{personalInfo.summary}</p>
        </div>
      )}

      {ordered.map(section => {
        const SHead = ({ t }: { t: string }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, height: 1, background: `${color}40` }} />
            <h2 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color, margin: 0 }}>{t}</h2>
            <div style={{ flex: 1, height: 1, background: `${color}40` }} />
          </div>
        );

        if (section.id === 'experience' && experience.length > 0) return (
          <div key="exp" style={{ marginBottom: '1.75rem' }}>
            <SHead t="Experience" />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '1.25rem', paddingLeft: '0.5rem', borderLeft: `2px solid ${color}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{exp.position}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                </div>
                <p style={{ fontSize: '0.82rem', color, fontStyle: 'italic', marginBottom: '0.35rem' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.achievements.filter(Boolean).map((a, i) => (
                  <p key={i} style={{ fontSize: '0.8rem', color: '#374151', display: 'flex', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ color }}>&bull;</span>{a}
                  </p>
                ))}
              </div>
            ))}
          </div>
        );
        if (section.id === 'education' && education.length > 0) return (
          <div key="edu" style={{ marginBottom: '1.75rem' }}>
            <SHead t="Education" />
            {education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{edu.institution}</p>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
              </div>
            ))}
          </div>
        );
        if (section.id === 'projects' && projects.length > 0) return (
          <div key="proj" style={{ marginBottom: '1.75rem' }}>
            <SHead t="Notable Projects" />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '0.875rem', paddingLeft: '0.5rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{proj.name}</p>
                {proj.description && <p style={{ fontSize: '0.8rem', color: '#374151', fontStyle: 'italic', marginTop: '0.15rem' }}>{proj.description}</p>}
                {proj.technologies.length > 0 && <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>{proj.technologies.join(' · ')}</p>}
              </div>
            ))}
          </div>
        );
        if (section.id === 'skills' && skills.length > 0) return (
          <div key="sk" style={{ marginBottom: '1.75rem' }}>
            <SHead t="Expertise" />
            <div style={{ paddingLeft: '0.5rem' }}>
              {skills.map(sg => (
                <p key={sg.id} style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 700, color: '#374151' }}>{sg.category}: </span>
                  <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{sg.skills.join(' · ')}</span>
                </p>
              ))}
            </div>
          </div>
        );
        return null;
      })}
    </div>
  );
}
