'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Education } from '@/types/resume';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';

function EducationItem({
  edu,
  onUpdate,
  onRemove,
}: {
  edu: Education;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card mb-3 overflow-hidden animate-slide-up">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        style={{ borderBottom: expanded ? '1px solid var(--border)' : 'none' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <GraduationCap size={16} style={{ color: 'var(--accent-light)' }} />
          <span className="font-medium text-sm">
            {edu.institution || 'New Education'}{edu.degree ? ` — ${edu.degree}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(edu.id); }}
            className="btn-danger p-1.5"
            style={{ padding: '0.25rem' }}
            title="Remove"
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </div>

      {expanded && (
        <div className="p-3 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Institution</label>
            <input
              className="input-field"
              value={edu.institution}
              onChange={(e) => onUpdate(edu.id, { institution: e.target.value })}
              placeholder="University Name"
            />
          </div>
          <div>
            <label className="label">Degree</label>
            <input
              className="input-field"
              value={edu.degree}
              onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
              placeholder="Bachelor of Science"
            />
          </div>
          <div>
            <label className="label">Field of Study</label>
            <input
              className="input-field"
              value={edu.field}
              onChange={(e) => onUpdate(edu.id, { field: e.target.value })}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label className="label">Start Date</label>
            <input
              className="input-field"
              type="month"
              value={edu.startDate}
              onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">End Date</label>
            <input
              className="input-field"
              type="month"
              value={edu.endDate}
              onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">GPA (optional)</label>
            <input
              className="input-field"
              value={edu.gpa || ''}
              onChange={(e) => onUpdate(edu.id, { gpa: e.target.value })}
              placeholder="3.8"
            />
          </div>
          <div className="col-span-2">
            <label className="label">Additional Info (optional)</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={edu.description || ''}
              onChange={(e) => onUpdate(edu.id, { description: e.target.value })}
              placeholder="Relevant coursework, honors, activities..."
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function EducationEditor() {
  const { education, addEducation, updateEducation, removeEducation } = useResumeStore();

  const handleAdd = () => {
    addEducation({
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    });
  };

  return (
    <div className="animate-fade-in">
      {education.map((edu) => (
        <EducationItem
          key={edu.id}
          edu={edu}
          onUpdate={updateEducation}
          onRemove={removeEducation}
        />
      ))}
      {education.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          <GraduationCap size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No education added yet</p>
        </div>
      )}
      <button className="btn-secondary w-full mt-2 justify-center" onClick={handleAdd}>
        <Plus size={14} /> Add Education
      </button>
    </div>
  );
}
