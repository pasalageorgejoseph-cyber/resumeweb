'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Skill } from '@/types/resume';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, X, Wrench } from 'lucide-react';

function SkillGroupItem({
  skill,
  onUpdate,
  onRemove,
}: {
  skill: Skill;
  onUpdate: (id: string, data: Partial<Skill>) => void;
  onRemove: (id: string) => void;
}) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      onUpdate(skill.id, { skills: [...skill.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    onUpdate(skill.id, { skills: skill.skills.filter((_, i) => i !== index) });
  };

  return (
    <div className="card mb-3 p-3 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <label className="label">Category Name</label>
          <input
            className="input-field"
            value={skill.category}
            onChange={(e) => onUpdate(skill.id, { category: e.target.value })}
            placeholder="e.g. Languages, Frameworks, Tools"
          />
        </div>
        <button
          onClick={() => onRemove(skill.id)}
          className="btn-danger mt-5"
          style={{ padding: '0.4rem' }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div>
        <label className="label">Skills</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {skill.skills.map((s, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(99,102,241,0.1)',
                color: 'var(--accent-light)',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
            >
              {s}
              <button onClick={() => removeSkill(index)} className="hover:opacity-70">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Add skill and press Enter..."
          />
          <button className="btn-secondary" onClick={addSkill}>
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SkillsEditor() {
  const { skills, addSkillGroup, updateSkillGroup, removeSkillGroup } = useResumeStore();

  const handleAdd = () => {
    addSkillGroup({
      id: generateId(),
      category: '',
      skills: [],
    });
  };

  return (
    <div className="animate-fade-in">
      {skills.map((skill) => (
        <SkillGroupItem
          key={skill.id}
          skill={skill}
          onUpdate={updateSkillGroup}
          onRemove={removeSkillGroup}
        />
      ))}
      {skills.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          <Wrench size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No skill groups added yet</p>
        </div>
      )}
      <button className="btn-secondary w-full mt-2 justify-center" onClick={handleAdd}>
        <Plus size={14} /> Add Skill Group
      </button>
    </div>
  );
}
