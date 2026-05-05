'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
}

export function ClassicTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || (settings.fontFamily === 'serif' ? 'Merriweather' : 'Inter');

  const orderedSections = [...sections]
    .filter((s) => s.visible && s.id !== 'personalInfo')
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className="resume-preview bg-white text-gray-800"
      style={{
        fontFamily: `'${font}', ${['Merriweather','Playfair Display'].includes(font) ? 'serif' : 'sans-serif'}`,
        padding: '2rem 2.5rem',
      }}
    >
      {/* Header */}
      <div className="text-center mb-1 pb-4" style={{ borderBottom: `3px double ${color}` }}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {personalInfo.name || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p className="text-base mt-1 font-medium" style={{ color }}>{personalInfo.title}</p>
        )}
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>•</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
        <div className="my-4">
          <p className="text-sm text-gray-600 text-center italic leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {orderedSections.map((section) => {
        if (section.id === 'experience' && experience.length > 0) return (
          <div key="experience" className="mb-5">
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-2 text-center"
              style={{ color }}
            >
              ── Professional Experience ──
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-sm text-gray-900">{exp.position}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm italic text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                </div>
                {exp.achievements.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {exp.achievements.filter(Boolean).map((a, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600">
                        <span className="mt-0.5">•</span>
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
              className="text-sm font-bold uppercase tracking-widest mb-2 text-center"
              style={{ color }}
            >
              ── Education ──
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-sm">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                </div>
                <p className="text-xs text-gray-600 italic">{edu.degree}{edu.field ? `, ${edu.field}` : ''}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
                {edu.description && <p className="text-xs text-gray-500 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        );

        if (section.id === 'projects' && projects.length > 0) return (
          <div key="projects" className="mb-5">
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-2 text-center"
              style={{ color }}
            >
              ── Projects ──
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <p className="font-bold text-sm">{proj.name}{proj.url ? ` | ${proj.url}` : ''}</p>
                {proj.description && <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5 italic">Tech: {proj.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        );

        if (section.id === 'skills' && skills.length > 0) return (
          <div key="skills" className="mb-5">
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-2 text-center"
              style={{ color }}
            >
              ── Skills ──
            </h2>
            <div className="space-y-1">
              {skills.map((sg) => (
                <div key={sg.id} className="flex text-xs">
                  <span className="font-semibold text-gray-700 w-28 shrink-0">{sg.category}:</span>
                  <span className="text-gray-600">{sg.skills.join(' • ')}</span>
                </div>
              ))}
            </div>
          </div>
        );

        return null;
      })}
    </div>
  );
}
