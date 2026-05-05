'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface TemplateProps { data: ResumeData; }

export function CompactTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || 'Roboto';

  const ordered = [...sections].filter(s => s.visible && s.id !== 'personalInfo').sort((a, b) => a.order - b.order);

  return (
    <div style={{ fontFamily: `'${font}', sans-serif`, background: 'white', color: '#111827', minHeight: '100%', padding: '1.5rem 2rem', fontSize: '12px' }}>
      {/* Compact header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: `2px solid ${color}`, marginBottom: '0.875rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.1 }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && <p style={{ fontSize: '0.78rem', color, fontWeight: 600, marginTop: '0.2rem' }}>{personalInfo.title}</p>}
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.6 }}>
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {[personalInfo.location, personalInfo.website].filter(Boolean).map((v, i) => <p key={i}>{v}</p>)}
        </div>
      </div>

      {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
        <p style={{ fontSize: '0.775rem', color: '#374151', lineHeight: 1.6, marginBottom: '0.875rem' }}>{personalInfo.summary}</p>
      )}

      {ordered.map(section => {
        const SHead = ({ t }: { t: string }) => (
          <h2 style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color, background: `${color}12`, padding: '0.2rem 0.5rem', borderRadius: 3, marginBottom: '0.5rem', display: 'inline-block' }}>{t}</h2>
        );

        if (section.id === 'experience' && experience.length > 0) return (
          <div key="exp" style={{ marginBottom: '0.875rem' }}>
            <SHead t="Experience" />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.8rem' }}>{exp.position} — <span style={{ color, fontWeight: 600 }}>{exp.company}</span></p>
                  <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{formatDate(exp.startDate)}–{exp.current ? 'Now' : formatDate(exp.endDate)}</p>
                </div>
                <ul style={{ paddingLeft: '1rem', margin: '0.2rem 0 0', listStyleType: 'disc' }}>
                  {exp.achievements.filter(Boolean).map((a, i) => (
                    <li key={i} style={{ fontSize: '0.76rem', color: '#374151', marginBottom: '0.1rem', lineHeight: 1.45 }}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        if (section.id === 'education' && education.length > 0) return (
          <div key="edu" style={{ marginBottom: '0.875rem' }}>
            <SHead t="Education" />
            {education.map(edu => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <p style={{ fontSize: '0.78rem' }}><span style={{ fontWeight: 700 }}>{edu.institution}</span> — {edu.degree}{edu.field ? `, ${edu.field}` : ''}{edu.gpa ? ` (${edu.gpa})` : ''}</p>
                <p style={{ fontSize: '0.68rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(edu.startDate)}–{formatDate(edu.endDate)}</p>
              </div>
            ))}
          </div>
        );
        if (section.id === 'projects' && projects.length > 0) return (
          <div key="proj" style={{ marginBottom: '0.875rem' }}>
            <SHead t="Projects" />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '0.4rem' }}>
                <p style={{ fontSize: '0.78rem' }}><span style={{ fontWeight: 700 }}>{proj.name}</span>{proj.description ? ` — ${proj.description}` : ''}</p>
                {proj.technologies.length > 0 && <p style={{ fontSize: '0.69rem', color: '#9ca3af' }}>{proj.technologies.join(', ')}</p>}
              </div>
            ))}
          </div>
        );
        if (section.id === 'skills' && skills.length > 0) return (
          <div key="sk" style={{ marginBottom: '0.875rem' }}>
            <SHead t="Skills" />
            {skills.map(sg => (
              <p key={sg.id} style={{ fontSize: '0.76rem', marginBottom: '0.15rem' }}>
                <span style={{ fontWeight: 700 }}>{sg.category}: </span>
                <span style={{ color: '#6b7280' }}>{sg.skills.join(', ')}</span>
              </p>
            ))}
          </div>
        );
        return null;
      })}
    </div>
  );
}
