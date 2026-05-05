'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || (settings.fontFamily === 'serif' ? 'Merriweather' : 'Inter');

  const orderedSections = [...sections]
    .filter((s) => s.visible && s.id !== 'personalInfo')
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className="resume-preview bg-white text-gray-800"
      style={{ fontFamily: `'${font}', ${['Merriweather','Playfair Display'].includes(font) ? 'serif' : 'sans-serif'}` }}
    >
      {/* Header */}
      <div style={{ background: color, padding: '2rem 2.5rem' }} className="text-white">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {personalInfo.name || 'Your Name'}
        </h1>
        <p className="text-lg mt-1 opacity-90">{personalInfo.title}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-85">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <Globe size={13} /> {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '1.5rem 2.5rem' }}>
        {/* Summary */}
        {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
          <div className="mb-5">
            <p className="text-gray-600 leading-relaxed text-sm">{personalInfo.summary}</p>
          </div>
        )}

        {orderedSections.map((section) => {
          if (section.id === 'experience' && experience.length > 0) return (
            <div key="experience" className="mb-5">
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Experience
              </h2>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{exp.position}</p>
                      <p className="text-sm" style={{ color }}>{exp.company}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.achievements.filter(Boolean).map((a, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600">
                          <span style={{ color, flexShrink: 0 }}>▸</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          );

          if (section.id === 'education' && education.length > 0) return (
            <div key="education" className="mb-5">
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{edu.institution}</p>
                      <p className="text-xs text-gray-600">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                  {edu.description && <p className="text-xs text-gray-500 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          );

          if (section.id === 'projects' && projects.length > 0) return (
            <div key="projects" className="mb-5">
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Projects
              </h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{proj.name}</p>
                    {proj.url && (
                      <span className="text-xs" style={{ color }}>{proj.url}</span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>
                  )}
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: `${color}15`, color }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );

          if (section.id === 'skills' && skills.length > 0) return (
            <div key="skills" className="mb-5">
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Skills
              </h2>
              <div className="space-y-1.5">
                {skills.map((sg) => (
                  <div key={sg.id} className="flex gap-2 text-xs">
                    <span className="font-semibold text-gray-700 w-24 shrink-0">{sg.category}:</span>
                    <span className="text-gray-600">{sg.skills.join(', ')}</span>
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
