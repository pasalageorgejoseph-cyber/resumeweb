'use client';

import { useResumeStore } from '@/store/resumeStore';
import { TemplateName, FontFamily } from '@/types/resume';
import { Palette, Type, Layout } from 'lucide-react';

const TEMPLATES: { id: TemplateName; label: string; description: string }[] = [
  { id: 'modern', label: 'Modern', description: 'Bold header, clean lines' },
  { id: 'classic', label: 'Classic', description: 'Traditional, centered style' },
  { id: 'creative', label: 'Creative', description: 'Two-column sidebar layout' },
];

const COLORS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#0ea5e9', label: 'Sky Blue' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#64748b', label: 'Slate' },
  { value: '#374151', label: 'Dark Gray' },
];

export function SettingsPanel() {
  const { settings, updateSettings } = useResumeStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Template Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layout size={14} style={{ color: 'var(--accent-light)' }} />
          <span className="text-sm font-semibold">Template</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              id={`template-${tpl.id}`}
              onClick={() => updateSettings({ template: tpl.id })}
              className="p-3 rounded-lg text-left transition-all duration-200"
              style={{
                border: settings.template === tpl.id
                  ? '2px solid var(--accent)'
                  : '2px solid var(--border)',
                background: settings.template === tpl.id
                  ? 'var(--accent-glow)'
                  : 'var(--bg-secondary)',
              }}
            >
              <div
                className="w-full h-10 rounded mb-2 flex items-center justify-center text-xs"
                style={{
                  background: settings.template === tpl.id ? 'var(--accent)' : 'var(--border)',
                  color: settings.template === tpl.id ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                {tpl.label[0]}
              </div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{tpl.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{tpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={14} style={{ color: 'var(--accent-light)' }} />
          <span className="text-sm font-semibold">Theme Color</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              id={`color-${c.label}`}
              onClick={() => updateSettings({ primaryColor: c.value })}
              title={c.label}
              className="w-7 h-7 rounded-full transition-all duration-200"
              style={{
                background: c.value,
                border: settings.primaryColor === c.value
                  ? '3px solid white'
                  : '3px solid transparent',
                boxShadow: settings.primaryColor === c.value
                  ? `0 0 0 2px ${c.value}`
                  : 'none',
                transform: settings.primaryColor === c.value ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        <div className="mt-3">
          <label className="label">Custom Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => updateSettings({ primaryColor: e.target.value })}
              className="w-10 h-9 rounded cursor-pointer"
              style={{ border: '1px solid var(--border)', background: 'none' }}
            />
            <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              {settings.primaryColor}
            </span>
          </div>
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type size={14} style={{ color: 'var(--accent-light)' }} />
          <span className="text-sm font-semibold">Font Style</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['sans', 'serif'] as FontFamily[]).map((font) => (
            <button
              key={font}
              id={`font-${font}`}
              onClick={() => updateSettings({ fontFamily: font })}
              className="p-3 rounded-lg text-center transition-all duration-200"
              style={{
                border: settings.fontFamily === font
                  ? '2px solid var(--accent)'
                  : '2px solid var(--border)',
                background: settings.fontFamily === font
                  ? 'var(--accent-glow)'
                  : 'var(--bg-secondary)',
                fontFamily: font === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif',
              }}
            >
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Aa</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {font === 'sans' ? 'Sans-Serif' : 'Serif'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
