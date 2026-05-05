'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { TemplateName, FontName } from '@/types/resume';
import { Palette, Type, Layout, Sparkles } from 'lucide-react';

// ── Template registry ──────────────────────────────────────────
const TEMPLATES: {
  id: TemplateName;
  label: string;
  category: string;
  description: string;
  accent: string;
  preview: { bg: string; headerBg?: string; sidebarBg?: string; style: 'full-header' | 'sidebar' | 'classic' | 'minimal' };
}[] = [
  { id: 'modern',       label: 'Modern',       category: 'Modern',    description: 'Bold color header',        accent: '#6366f1', preview: { bg: 'white', headerBg: '#6366f1', style: 'full-header' } },
  { id: 'bold',         label: 'Bold',         category: 'Modern',    description: 'Statement header + badges', accent: '#ef4444', preview: { bg: 'white', headerBg: '#ef4444', style: 'full-header' } },
  { id: 'creative',     label: 'Creative',     category: 'Creative',  description: 'Left color sidebar',       accent: '#8b5cf6', preview: { bg: 'white', sidebarBg: '#8b5cf6', style: 'sidebar' } },
  { id: 'sidebar-dark', label: 'Sidebar Dark', category: 'Creative',  description: 'Dark navy sidebar',        accent: '#0f172a', preview: { bg: '#f8fafc', sidebarBg: '#0f172a', style: 'sidebar' } },
  { id: 'classic',      label: 'Classic',      category: 'Classic',   description: 'Centered traditional',     accent: '#374151', preview: { bg: 'white', style: 'classic' } },
  { id: 'executive',    label: 'Executive',    category: 'Classic',   description: 'Centered serif formal',    accent: '#1e40af', preview: { bg: 'white', style: 'classic' } },
  { id: 'elegant',      label: 'Elegant',      category: 'Classic',   description: 'Warm serif ornate',        accent: '#92400e', preview: { bg: '#fdfcfb', style: 'classic' } },
  { id: 'corporate',    label: 'Corporate',    category: 'Corporate', description: 'Top bar + right contact',  accent: '#0f766e', preview: { bg: 'white', headerBg: '#0f766e', style: 'full-header' } },
  { id: 'minimal',      label: 'Minimal',      category: 'Minimal',   description: 'Ultra clean & spacious',   accent: '#111827', preview: { bg: 'white', style: 'minimal' } },
  { id: 'compact',      label: 'Compact',      category: 'Minimal',   description: 'Dense, fits more content', accent: '#374151', preview: { bg: 'white', style: 'minimal' } },
];

const CATEGORIES = ['All', 'Modern', 'Classic', 'Creative', 'Corporate', 'Minimal'];

// ── Color palettes ─────────────────────────────────────────────
const COLOR_PALETTES = [
  { label: 'Indigo',    value: '#6366f1' },
  { label: 'Violet',    value: '#7c3aed' },
  { label: 'Blue',      value: '#2563eb' },
  { label: 'Sky',       value: '#0284c7' },
  { label: 'Cyan',      value: '#0891b2' },
  { label: 'Teal',      value: '#0f766e' },
  { label: 'Emerald',   value: '#059669' },
  { label: 'Green',     value: '#16a34a' },
  { label: 'Lime',      value: '#65a30d' },
  { label: 'Amber',     value: '#d97706' },
  { label: 'Orange',    value: '#ea580c' },
  { label: 'Red',       value: '#dc2626' },
  { label: 'Rose',      value: '#e11d48' },
  { label: 'Pink',      value: '#db2777' },
  { label: 'Slate',     value: '#475569' },
  { label: 'Dark',      value: '#1e293b' },
];

// ── Font options ────────────────────────────────────────────────
const FONTS: { name: FontName; label: string; category: string; style: string }[] = [
  { name: 'Inter',           label: 'Inter',           category: 'Sans-Serif', style: 'Inter, sans-serif' },
  { name: 'Poppins',         label: 'Poppins',         category: 'Sans-Serif', style: 'Poppins, sans-serif' },
  { name: 'Roboto',          label: 'Roboto',          category: 'Sans-Serif', style: 'Roboto, sans-serif' },
  { name: 'Lato',            label: 'Lato',            category: 'Sans-Serif', style: 'Lato, sans-serif' },
  { name: 'Raleway',         label: 'Raleway',         category: 'Sans-Serif', style: 'Raleway, sans-serif' },
  { name: 'Playfair Display',label: 'Playfair Display',category: 'Serif',      style: 'Playfair Display, serif' },
  { name: 'Merriweather',    label: 'Merriweather',    category: 'Serif',      style: 'Merriweather, serif' },
];

// ── Mini template thumbnail ────────────────────────────────────
function TemplateThumbnail({ tpl, selected }: { tpl: typeof TEMPLATES[0]; selected: boolean }) {
  const color = selected ? tpl.accent : '#9ca3af';
  const { preview } = tpl;

  return (
    <div style={{
      width: '100%',
      paddingBottom: '130%',
      position: 'relative',
      borderRadius: 8,
      overflow: 'hidden',
      background: preview.bg,
      border: selected ? `2px solid ${tpl.accent}` : '2px solid transparent',
      boxShadow: selected ? `0 0 0 2px ${tpl.accent}40` : 'none',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ position: 'absolute', inset: 0, padding: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header preview */}
        {preview.style === 'full-header' && (
          <div style={{ borderRadius: 4, background: preview.headerBg, height: '28%', flexShrink: 0, padding: 6 }}>
            <div style={{ width: '60%', height: 4, background: 'rgba(255,255,255,0.8)', borderRadius: 2, marginBottom: 3 }} />
            <div style={{ width: '40%', height: 2, background: 'rgba(255,255,255,0.55)', borderRadius: 2 }} />
          </div>
        )}
        {preview.style === 'sidebar' && (
          <div style={{ display: 'flex', flex: 1, gap: 4 }}>
            <div style={{ width: '35%', background: preview.sidebarBg, borderRadius: 4, padding: 5 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', marginBottom: 5 }} />
              <div style={{ width: '70%', height: 2.5, background: 'rgba(255,255,255,0.6)', borderRadius: 2, marginBottom: 2 }} />
              <div style={{ width: '50%', height: 2, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[70, 55, 65, 45].map((w, i) => (
                <div key={i} style={{ width: `${w}%`, height: 2.5, background: '#e5e7eb', borderRadius: 2 }} />
              ))}
            </div>
          </div>
        )}
        {(preview.style === 'classic' || preview.style === 'minimal') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 2px' }}>
            <div style={{ width: '50%', height: 5, background: color, borderRadius: 2, alignSelf: preview.style === 'classic' ? 'center' : 'flex-start', opacity: 0.8 }} />
            <div style={{ width: '35%', height: 2.5, background: '#d1d5db', borderRadius: 2, alignSelf: preview.style === 'classic' ? 'center' : 'flex-start' }} />
            {preview.style === 'classic' && <div style={{ width: '80%', height: 0, alignSelf: 'center', borderTop: `1.5px solid ${color}60`, marginTop: 2 }} />}
            {[65, 45, 70, 50, 60].map((w, i) => (
              <div key={i} style={{ width: `${w}%`, height: 2, background: '#e5e7eb', borderRadius: 2 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main DesignPanel component ─────────────────────────────────
export function DesignPanel() {
  const { settings, updateSettings } = useResumeStore();
  const [catFilter, setCatFilter] = useState('All');

  const filteredTemplates = catFilter === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === catFilter);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── TEMPLATE SECTION ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layout size={14} style={{ color: 'var(--accent-light)' }} />
          <span className="text-sm font-semibold">Templates</span>
          <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{TEMPLATES.length} designs</span>
        </div>

        {/* Category filter */}
        <div className="flex gap-1 flex-wrap mb-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className="text-xs px-2.5 py-1 rounded-full transition-all duration-150"
              style={{
                background: catFilter === cat ? 'var(--accent)' : 'var(--bg-secondary)',
                color: catFilter === cat ? 'white' : 'var(--text-muted)',
                border: catFilter === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
                fontWeight: 500,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {filteredTemplates.map(tpl => {
            const selected = settings.template === tpl.id;
            return (
              <button
                key={tpl.id}
                id={`template-${tpl.id}`}
                onClick={() => updateSettings({ template: tpl.id })}
                className="text-left group"
                style={{ outline: 'none' }}
              >
                <TemplateThumbnail tpl={tpl} selected={selected} />
                <div className="mt-1.5 px-0.5">
                  <p className="text-xs font-semibold truncate" style={{ color: selected ? 'var(--accent-light)' : 'var(--text-primary)' }}>{tpl.label}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{tpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── COLOR SECTION ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={14} style={{ color: 'var(--accent-light)' }} />
          <span className="text-sm font-semibold">Theme Color</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {COLOR_PALETTES.map(c => (
            <button
              key={c.value}
              id={`color-${c.label}`}
              onClick={() => updateSettings({ primaryColor: c.value })}
              title={c.label}
              className="transition-all duration-150"
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: c.value,
                border: settings.primaryColor === c.value ? '3px solid white' : '3px solid transparent',
                boxShadow: settings.primaryColor === c.value ? `0 0 0 2px ${c.value}` : 'none',
                transform: settings.primaryColor === c.value ? 'scale(1.18)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="label mb-0 shrink-0">Custom</label>
          <input
            type="color"
            value={settings.primaryColor}
            onChange={e => updateSettings({ primaryColor: e.target.value })}
            className="w-9 h-8 rounded cursor-pointer"
            style={{ border: '1px solid var(--border)', background: 'none', padding: 0 }}
          />
          <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{settings.primaryColor}</span>
        </div>
      </div>

      {/* ── FONT SECTION ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type size={14} style={{ color: 'var(--accent-light)' }} />
          <span className="text-sm font-semibold">Resume Font</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {FONTS.map(f => {
            const selected = settings.fontName === f.name;
            return (
              <button
                key={f.name}
                id={`font-${f.name.replace(' ', '-')}`}
                onClick={() => updateSettings({ fontName: f.name, fontFamily: ['Playfair Display', 'Merriweather'].includes(f.name) ? 'serif' : 'sans' })}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-150"
                style={{
                  border: selected ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  background: selected ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                }}
              >
                <div>
                  <p style={{ fontFamily: f.style, fontSize: '1rem', fontWeight: selected ? 600 : 400, color: 'var(--text-primary)', lineHeight: 1.2, margin: 0 }}>Aa — {f.label}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>{f.category}</p>
                </div>
                {selected && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── AI STATUS ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: '#a78bfa' }} />
          <span className="text-sm font-semibold">AI Assistant</span>
          <span
            className="text-xs ml-auto px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            ✓ Enabled
          </span>
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.08))',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.3))' }}
            >
              <Sparkles size={14} style={{ color: '#c4b5fd' }} />
            </div>
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                AI Assistant Enabled ✨
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Click the <span style={{ color: '#a78bfa', fontWeight: 600 }}>✨</span> button next to any
                summary, achievement, or project description to instantly improve it with AI.
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Summary', icon: '📝' },
              { label: 'Achievements', icon: '🎯' },
              { label: 'Projects', icon: '🚀' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-lg px-2 py-1.5 text-center"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                <p style={{ fontSize: '0.9rem' }}>{item.icon}</p>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: 2 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
