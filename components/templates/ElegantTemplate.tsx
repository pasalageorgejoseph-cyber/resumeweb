'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface TemplateProps { data: ResumeData; }

export function ElegantTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || 'Merriweather';

  const ordered = [...sections].filter(s => s.visible && s.id !== 'personalInfo').sort((a, b) => a.order - b.order);

  return (
    <div style={{ fontFamily: `'${font}', serif`, background: '#fdfcfb', color: '#1c1917', minHeight: '100%', padding: '2.5rem 2.75rem' }}>
      {/* Ornate header */}
      <div style={{ borderBottom: `1px solid ${color}50`, paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: 28, height: 2, background: color }} />
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color, fontWeight: 700, margin: 0 }}>Curriculum Vitae</p>
          <div style={{ flex: 1, height: 2, background: color }} />
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#1c1917', margin: 0, letterSpacing: '-0.02em' }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '0.9rem', color, marginTop: '0.35rem', fontStyle: 'italic' }}>{personalInfo.title}</p>
        )}
        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#78716c', flexWrap: 'wrap' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
        <p style={{ fontSize: '0.845rem', color: '#44403c', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.75rem', borderLeft: `3px solid ${color}`, paddingLeft: '1rem' }}>
          {personalInfo.summary}
        </p>
      )}

      {ordered.map(section => {
        const SHead = ({ t }: { t: string }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
            <h2 style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color, margin: 0, whiteSpace: 'nowrap' }}>{t}</h2>
            <div style={{ flex: 1, height: 0.5, background: `${color}50` }} />
          </div>
        );

        if (section.id === 'experience' && experience.length > 0) return (
          <div key="exp" style={{ marginBottom: '1.75rem' }}>
            <SHead t="Experience" />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1c1917' }}>{exp.position}</p>
                  <p style={{ fontSize: '0.72rem', color: '#78716c', fontStyle: 'italic' }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                </div>
                <p style={{ fontSize: '0.8rem', color, fontStyle: 'italic', marginBottom: '0.4rem' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.achievements.filter(Boolean).map((a, i) => (
                  <p key={i} style={{ fontSize: '0.79rem', color: '#44403c', paddingLeft: '1rem', borderLeft: `1px solid ${color}40`, marginBottom: '0.25rem', lineHeight: 1.55 }}>{a}</p>
                ))}
              </div>
            ))}
          </div>
        );
        if (section.id === 'education' && education.length > 0) return (
          <div key="edu" style={{ marginBottom: '1.75rem' }}>
            <SHead t="Education" />
            {education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{edu.institution}</p>
                  <p style={{ fontSize: '0.8rem', color: '#78716c', fontStyle: 'italic' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#78716c' }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
              </div>
            ))}
          </div>
        );
        if (section.id === 'projects' && projects.length > 0) return (
          <div key="proj" style={{ marginBottom: '1.75rem' }}>
            <SHead t="Projects" />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '0.875rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{proj.name}</p>
                {proj.description && <p style={{ fontSize: '0.79rem', color: '#44403c', fontStyle: 'italic', marginTop: '0.15rem' }}>{proj.description}</p>}
                {proj.technologies.length > 0 && <p style={{ fontSize: '0.73rem', color: '#78716c', marginTop: '0.2rem' }}>{proj.technologies.join(' · ')}</p>}
              </div>
            ))}
          </div>
        );
        if (section.id === 'skills' && skills.length > 0) return (
          <div key="sk" style={{ marginBottom: '1.75rem' }}>
            <SHead t="Expertise" />
            {skills.map(sg => (
              <p key={sg.id} style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 700, color: '#1c1917' }}>{sg.category}: </span>
                <span style={{ color: '#78716c', fontStyle: 'italic' }}>{sg.skills.join(', ')}</span>
              </p>
            ))}
          </div>
        );
        return null;
      })}
    </div>
  );
}
