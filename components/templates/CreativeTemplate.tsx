'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export function CreativeTemplate({ data }: TemplateProps) {
  const { personalInfo, experience, education, projects, skills, sections, settings } = data;
  const color = settings.primaryColor;
  const font = settings.fontName || (settings.fontFamily === 'serif' ? 'Merriweather' : 'Inter');

  const orderedSections = [...sections]
    .filter((s) => s.visible && s.id !== 'personalInfo')
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className="resume-preview bg-white flex"
      style={{ fontFamily: `'${font}', ${['Merriweather','Playfair Display'].includes(font) ? 'serif' : 'sans-serif'}`, minHeight: '100%' }}
    >
      {/* Left Sidebar */}
      <div
        className="w-1/3 text-white flex flex-col"
        style={{ background: color, padding: '2rem 1.25rem' }}
      >
        {/* Name */}
        <div className="mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            {personalInfo.name ? personalInfo.name[0] : '?'}
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="text-xs mt-1 opacity-80 font-medium">{personalInfo.title}</p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Contact</h2>
          <div className="space-y-1.5 text-xs opacity-85">
            {personalInfo.email && (
              <div className="flex items-start gap-1.5">
                <Mail size={11} className="mt-0.5 shrink-0" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={11} className="shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="shrink-0" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-1.5">
                <Globe size={11} className="shrink-0" />
                <span>{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills in Sidebar */}
        {sections.find(s => s.id === 'skills')?.visible && skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Skills</h2>
            {skills.map((sg) => (
              <div key={sg.id} className="mb-3">
                <p className="text-xs font-semibold opacity-80 mb-1">{sg.category}</p>
                <div className="flex flex-wrap gap-1">
                  {sg.skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education in Sidebar */}
        {sections.find(s => s.id === 'education')?.visible && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 text-xs opacity-85">
                <p className="font-semibold">{edu.institution}</p>
                <p className="opacity-80">{edu.degree}</p>
                {edu.field && <p className="opacity-70">{edu.field}</p>}
                <p className="opacity-60 mt-0.5">
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 text-gray-800" style={{ padding: '2rem 1.5rem' }}>
        {/* Summary */}
        {personalInfo.summary && sections.find(s => s.id === 'personalInfo')?.visible && (
          <div className="mb-5 pb-4" style={{ borderBottom: `2px solid ${color}20` }}>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color }}
            >
              About Me
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {orderedSections
          .filter((s) => s.id !== 'skills' && s.id !== 'education')
          .map((section) => {
            if (section.id === 'experience' && experience.length > 0) return (
              <div key="experience" className="mb-5">
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color }}
                >
                  Experience
                </h2>
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-4 pl-3" style={{ borderLeft: `3px solid ${color}` }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{exp.position}</p>
                        <p className="text-xs font-medium" style={{ color }}>{exp.company}</p>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <p>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                        {exp.location && <p>{exp.location}</p>}
                      </div>
                    </div>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {exp.achievements.filter(Boolean).map((a, i) => (
                          <li key={i} className="flex gap-2 text-xs text-gray-600">
                            <span style={{ color, flexShrink: 0 }}>›</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );

            if (section.id === 'projects' && projects.length > 0) return (
              <div key="projects" className="mb-5">
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color }}
                >
                  Projects
                </h2>
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="mb-3 p-2.5 rounded-md text-xs"
                    style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                  >
                    <p className="font-bold text-gray-900">{proj.name}</p>
                    {proj.description && <p className="text-gray-600 mt-0.5">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-xs font-medium"
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

            return null;
          })}
      </div>
    </div>
  );
}
