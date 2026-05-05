'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Experience } from '@/types/resume';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp, Briefcase, X } from 'lucide-react';
import { AIImproveButton } from '@/components/AIImproveButton';

function ExperienceItem({
  exp,
  onUpdate,
  onRemove,
}: {
  exp: Experience;
  onUpdate: (id: string, data: Partial<Experience>) => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [newAchievement, setNewAchievement] = useState('');

  const addAchievement = () => {
    if (newAchievement.trim()) {
      onUpdate(exp.id, {
        achievements: [...exp.achievements, newAchievement.trim()],
      });
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    onUpdate(exp.id, {
      achievements: exp.achievements.filter((_, i) => i !== index),
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const updated = [...exp.achievements];
    updated[index] = value;
    onUpdate(exp.id, { achievements: updated });
  };

  // Handle AI improvement of all achievements at once
  const handleAIAchievements = (improved: string) => {
    const lines = improved
      .split('\n')
      .map(l => l.replace(/^[-•*▸›]\s*/, '').trim())
      .filter(Boolean);
    if (lines.length > 0) {
      onUpdate(exp.id, { achievements: lines });
    }
  };

  return (
    <div className="card mb-3 overflow-hidden animate-slide-up">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        style={{ borderBottom: expanded ? '1px solid var(--border)' : 'none' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Briefcase size={16} style={{ color: 'var(--accent-light)' }} />
          <span className="font-medium text-sm">
            {exp.position || 'New Position'}{exp.company ? ` @ ${exp.company}` : ''}
            {exp.current && (
              <span className="badge ml-2 text-xs" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                Current
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(exp.id); }}
            className="btn-danger"
            style={{ padding: '0.25rem' }}
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Company</label>
              <input
                className="input-field"
                value={exp.company}
                onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="label">Position / Title</label>
              <input
                className="input-field"
                value={exp.position}
                onChange={(e) => onUpdate(exp.id, { position: e.target.value })}
                placeholder="Senior Engineer"
              />
            </div>
            <div>
              <label className="label">Location</label>
              <input
                className="input-field"
                value={exp.location}
                onChange={(e) => onUpdate(exp.id, { location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input
                className="input-field"
                type="month"
                value={exp.startDate}
                onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">End Date</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => onUpdate(exp.id, { current: e.target.checked, endDate: '' })}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Present</span>
                </label>
              </div>
              <input
                className="input-field"
                type="month"
                value={exp.endDate}
                disabled={exp.current}
                onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label mb-0">Key Achievements</label>
              {exp.achievements.filter(Boolean).length > 0 && (
                <AIImproveButton
                  content={exp.achievements.filter(Boolean).join('\n')}
                  type="achievements"
                  compact
                  label="Improve All"
                  onAccept={handleAIAchievements}
                />
              )}
            </div>
            <div className="space-y-2">
              {exp.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-2 text-xs" style={{ color: 'var(--accent-light)' }}>•</span>
                  <div className="flex-1 space-y-1">
                    <textarea
                      className="input-field resize-none"
                      rows={2}
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="Describe an achievement with impact and metrics..."
                    />
                    {achievement.trim().length > 10 && (
                      <AIImproveButton
                        content={achievement}
                        type="achievement"
                        compact
                        label="Improve"
                        onAccept={(improved) => updateAchievement(index, improved)}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => removeAchievement(index)}
                    className="mt-1 p-1 rounded transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                className="input-field flex-1"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                placeholder="Add achievement and press Enter..."
              />
              <button className="btn-secondary" onClick={addAchievement}>
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExperienceEditor() {
  const { experience, addExperience, updateExperience, removeExperience } = useResumeStore();

  const handleAdd = () => {
    addExperience({
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    });
  };

  return (
    <div className="animate-fade-in">
      {experience.map((exp) => (
        <ExperienceItem
          key={exp.id}
          exp={exp}
          onUpdate={updateExperience}
          onRemove={removeExperience}
        />
      ))}
      {experience.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          <Briefcase size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No experience added yet</p>
        </div>
      )}
      <button className="btn-secondary w-full mt-2 justify-center" onClick={handleAdd}>
        <Plus size={14} /> Add Experience
      </button>
    </div>
  );
}
