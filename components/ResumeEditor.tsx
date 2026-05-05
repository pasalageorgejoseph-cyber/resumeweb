'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { PersonalInfoEditor } from './editor/PersonalInfoEditor';
import { EducationEditor } from './editor/EducationEditor';
import { ExperienceEditor } from './editor/ExperienceEditor';
import { ProjectsEditor } from './editor/ProjectsEditor';
import { SkillsEditor } from './editor/SkillsEditor';
import { DesignPanel } from './DesignPanel';
import { ATSPanel } from './ATSPanel';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Wrench,
  Palette,
  Target,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  BrainCircuit,
} from 'lucide-react';
import { SectionType } from '@/types/resume';

type Tab = 'editor' | 'design' | 'ats';

const SECTION_CONFIG: { id: SectionType; label: string; icon: any; component: any }[] = [
  { id: 'personalInfo', label: 'Personal Info', icon: User, component: PersonalInfoEditor },
  { id: 'experience', label: 'Experience', icon: Briefcase, component: ExperienceEditor },
  { id: 'education', label: 'Education', icon: GraduationCap, component: EducationEditor },
  { id: 'projects', label: 'Projects', icon: FolderGit2, component: ProjectsEditor },
  { id: 'skills', label: 'Skills', icon: Wrench, component: SkillsEditor },
];

function SectionAccordion({
  id, label, icon: Icon, children, canReorder,
  onMoveUp, onMoveDown, isVisible, onToggleVisible
}: {
  id: string;
  label: string;
  icon: any;
  children: React.ReactNode;
  canReorder?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isVisible?: boolean;
  onToggleVisible?: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="mb-2 rounded-xl overflow-hidden transition-all duration-200"
      style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        style={{ borderBottom: open ? '1px solid var(--border)' : 'none' }}
        onClick={() => setOpen(!open)}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent-glow)' }}
        >
          <Icon size={14} style={{ color: 'var(--accent-light)' }} />
        </div>
        <span className="flex-1 text-sm font-semibold">{label}</span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {canReorder && (
            <>
              <button
                onClick={onMoveUp}
                className="p-1 rounded hover:opacity-60 transition-opacity"
                style={{ color: 'var(--text-muted)' }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={onMoveDown}
                className="p-1 rounded hover:opacity-60 transition-opacity"
                style={{ color: 'var(--text-muted)' }}
              >
                <ChevronDown size={14} />
              </button>
            </>
          )}
          {onToggleVisible && (
            <button
              onClick={onToggleVisible}
              className="p-1 rounded hover:opacity-60 transition-opacity"
              style={{ color: 'var(--text-muted)', opacity: isVisible ? 1 : 0.4 }}
              title={isVisible ? 'Hide section' : 'Show section'}
            >
              {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          )}
        </div>

        <div onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
          {open
            ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} />
            : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />
          }
        </div>
      </div>

      {open && (
        <div className="p-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export function ResumeEditor() {
  const [activeTab, setActiveTab] = useState<Tab>('editor');
  const { sections, updateSectionOrder, toggleSectionVisibility } = useResumeStore();

  const moveSection = (sectionId: SectionType, direction: 'up' | 'down') => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === sectionId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newSections = sorted.map((s, i) => {
      if (i === idx) return { ...s, order: sorted[swapIdx].order };
      if (i === swapIdx) return { ...s, order: sorted[idx].order };
      return s;
    });
    updateSectionOrder(newSections);
  };

  const orderedSections = [...sections].sort((a, b) => a.order - b.order);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'editor', label: 'Editor', icon: User },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'ats', label: 'AI Assistant', icon: BrainCircuit },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div
        className="flex gap-1 p-1 mx-4 mt-4 rounded-xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`tab-${id}`}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              background: activeTab === id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === id ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'editor' && (
          <div>
            {orderedSections.map((section) => {
              const config = SECTION_CONFIG.find((c) => c.id === section.id);
              if (!config) return null;
              const Component = config.component;
              return (
                <SectionAccordion
                  key={section.id}
                  id={section.id}
                  label={config.label}
                  icon={config.icon}
                  canReorder={section.id !== 'personalInfo'}
                  onMoveUp={() => moveSection(section.id, 'up')}
                  onMoveDown={() => moveSection(section.id, 'down')}
                  isVisible={section.visible}
                  onToggleVisible={section.id !== 'personalInfo' ? () => toggleSectionVisibility(section.id) : undefined}
                >
                  <Component />
                </SectionAccordion>
              );
            })}
          </div>
        )}
        {activeTab === 'design' && <DesignPanel />}
        {activeTab === 'ats' && <ATSPanel />}
      </div>
    </div>
  );
}
