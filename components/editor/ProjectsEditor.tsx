'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Project } from '@/types/resume';
import { generateId } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, ChevronUp, FolderGit2, X, Link, GitBranch } from 'lucide-react';
import { AIImproveButton } from '@/components/AIImproveButton';

function ProjectItem({
  project,
  onUpdate,
  onRemove,
}: {
  project: Project;
  onUpdate: (id: string, data: Partial<Project>) => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [newTech, setNewTech] = useState('');

  const addTech = () => {
    if (newTech.trim()) {
      onUpdate(project.id, {
        technologies: [...project.technologies, newTech.trim()],
      });
      setNewTech('');
    }
  };

  const removeTech = (index: number) => {
    onUpdate(project.id, {
      technologies: project.technologies.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="card mb-3 overflow-hidden animate-slide-up">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        style={{ borderBottom: expanded ? '1px solid var(--border)' : 'none' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <FolderGit2 size={16} style={{ color: 'var(--accent-light)' }} />
          <span className="font-medium text-sm">{project.name || 'New Project'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(project.id); }}
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
          <div>
            <label className="label">Project Name</label>
            <input
              className="input-field"
              value={project.name}
              onChange={(e) => onUpdate(project.id, { name: e.target.value })}
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label mb-0">Description</label>
              {project.description.trim().length > 10 && (
                <AIImproveButton
                  content={project.description}
                  type="project"
                  compact
                  onAccept={(improved) => onUpdate(project.id, { description: improved })}
                />
              )}
            </div>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={project.description}
              onChange={(e) => onUpdate(project.id, { description: e.target.value })}
              placeholder="Describe the project, your role, and the impact..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label"><Link size={11} className="inline mr-1" />Live URL</label>
              <input
                className="input-field"
                value={project.url || ''}
                onChange={(e) => onUpdate(project.id, { url: e.target.value })}
                placeholder="https://myproject.com"
              />
            </div>
            <div>
              <label className="label"><GitBranch size={11} className="inline mr-1" />GitHub URL</label>
              <input
                className="input-field"
                value={project.github || ''}
                onChange={(e) => onUpdate(project.id, { github: e.target.value })}
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          <div>
            <label className="label">Technologies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                  style={{ background: 'var(--accent-glow)', color: 'var(--accent-light)', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  {tech}
                  <button onClick={() => removeTech(index)}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                placeholder="React, Node.js... (press Enter)"
              />
              <button className="btn-secondary" onClick={addTech}>
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectsEditor() {
  const { projects, addProject, updateProject, removeProject } = useResumeStore();

  const handleAdd = () => {
    addProject({
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
    });
  };

  return (
    <div className="animate-fade-in">
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onUpdate={updateProject}
          onRemove={removeProject}
        />
      ))}
      {projects.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          <FolderGit2 size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No projects added yet</p>
        </div>
      )}
      <button className="btn-secondary w-full mt-2 justify-center" onClick={handleAdd}>
        <Plus size={14} /> Add Project
      </button>
    </div>
  );
}
