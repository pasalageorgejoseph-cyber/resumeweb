'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface TemplateProps { data: ResumeData; }

export function SidebarDarkTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || 'Raleway';

  const mainSections = [...sections].filter(s => s.visible && s.id !== 'personalInfo' && s.id !== 'skills' && s.id !== 'education').sort((a, b) => a.order - b.order);

  return (
    <div style={{ fontFamily: `'${font}', sans-serif`, background: 'white', display: 'flex', minHeight: '100%' }}>
      {/* Dark sidebar */}
      <div style={{ width: '34%', background: '#0f172a', color: 'white', padding: '2rem 1.25rem', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Avatar / Initials */}
        <div>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.875rem' }}>
            {personalInfo.name ? personalInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}
          </div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.2 }}>{personalInfo.name || 'Your Name'}</h1>
          {personalInfo.title && (
            <p style={{ fontSize: '0.75rem', color, marginTop: '0.3rem', fontWeight: 600, letterSpacing: '0.03em' }}>{personalInfo.title}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <h2 style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: `${color}`, marginBottom: '0.625rem' }}>Contact</h2>
          {[
            { label: 'Email', val: personalInfo.email },
            { label: 'Phone', val: personalInfo.phone },
            { label: 'Location', val: personalInfo.location },
            { label: 'Website', val: personalInfo.website },
          ].filter(i => i.val).map(({ label, val }) => (
            <div key={label} style={{ marginBottom: '0.45rem' }}>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
              <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all', margin: 0 }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        {sections.find(s => s.id === 'skills')?.visible && skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: '0.625rem' }}>Skills</h2>
            {skills.map(sg => (
              <div key={sg.id} style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>{sg.category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {sg.skills.map((s, i) => (
                    <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '0.15rem 0.45rem', borderRadius: 4, color: 'rgba(255,255,255,0.8)' }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {sections.find(s => s.id === 'education')?.visible && education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: '0.625rem' }}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'white' }}>{edu.institution}</p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '2rem 1.75rem', background: '#f8fafc' }}>
        {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: `2px solid ${color}25` }}>
            <h2 style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color, marginBottom: '0.5rem' }}>About</h2>
            <p style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.65 }}>{personalInfo.summary}</p>
          </div>
        )}

        {mainSections.map(section => {
          const SHead = ({ t }: { t: string }) => (
            <h2 style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color, marginBottom: '0.75rem', paddingBottom: '0.3rem', borderBottom: `1.5px solid ${color}30` }}>{t}</h2>
          );

          if (section.id === 'experience' && experience.length > 0) return (
            <div key="exp" style={{ marginBottom: '1.5rem' }}>
              <SHead t="Experience" />
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '1.1rem', paddingLeft: '0.5rem', borderLeft: `2px solid ${color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{exp.position}</p>
                    <span style={{ fontSize: '0.68rem', color, background: `${color}15`, padding: '0.1rem 0.4rem', borderRadius: 4, whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {formatDate(exp.startDate)} – {exp.current ? 'Now' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color, fontWeight: 600, marginBottom: '0.35rem' }}>{exp.company}</p>
                  <ul style={{ paddingLeft: '0.875rem', margin: 0 }}>
                    {exp.achievements.filter(Boolean).map((a, i) => (
                      <li key={i} style={{ fontSize: '0.77rem', color: '#374151', marginBottom: '0.18rem', lineHeight: 1.5 }}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
          if (section.id === 'projects' && projects.length > 0) return (
            <div key="proj" style={{ marginBottom: '1.5rem' }}>
              <SHead t="Projects" />
              {projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '0.875rem', padding: '0.625rem 0.75rem', background: 'white', borderRadius: 6, border: `1px solid ${color}20` }}>
                  <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>{proj.name}</p>
                  {proj.description && <p style={{ fontSize: '0.76rem', color: '#374151', marginTop: '0.2rem' }}>{proj.description}</p>}
                  {proj.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.4rem' }}>
                      {proj.technologies.map((t, i) => (
                        <span key={i} style={{ fontSize: '0.65rem', background: `${color}12`, color, padding: '0.1rem 0.4rem', borderRadius: 3, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
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
