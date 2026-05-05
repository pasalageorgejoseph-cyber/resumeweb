'use client';

import { useRef, useState, useCallback } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { BoldTemplate } from './templates/BoldTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { SidebarDarkTemplate } from './templates/SidebarDarkTemplate';
import { Download, Loader2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { ResumeData } from '@/types/resume';

const SCALE_FACTOR = 0.72;

function getTemplate(data: ResumeData) {
  switch (data.settings.template) {
    case 'classic':       return <ClassicTemplate data={data} />;
    case 'creative':      return <CreativeTemplate data={data} />;
    case 'minimal':       return <MinimalTemplate data={data} />;
    case 'corporate':     return <CorporateTemplate data={data} />;
    case 'executive':     return <ExecutiveTemplate data={data} />;
    case 'bold':          return <BoldTemplate data={data} />;
    case 'elegant':       return <ElegantTemplate data={data} />;
    case 'compact':       return <CompactTemplate data={data} />;
    case 'sidebar-dark':  return <SidebarDarkTemplate data={data} />;
    default:              return <ModernTemplate data={data} />;
  }
}

export function ResumePreview() {
  const store = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [zoom, setZoom] = useState(SCALE_FACTOR);

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Temporarily remove zoom/transform so canvas captures at 1:1
      const parent = previewRef.current.parentElement;
      const originalTransform = parent ? parent.style.transform : '';
      if (parent) {
        parent.style.transform = 'scale(1)';
      }

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: Math.max(previewRef.current.scrollHeight, 1123),
        windowWidth: 794,
      });

      if (parent) {
        parent.style.transform = originalTransform;
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Multi-page if content is tall
      const canvasHeight = canvas.height;
      const canvasWidth = canvas.width;
      const pageHeightPx = Math.round((pdfHeight / pdfWidth) * canvasWidth);

      if (canvasHeight <= pageHeightPx * 1.1) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        let yOffset = 0;
        let page = 0;
        while (yOffset < canvasHeight) {
          if (page > 0) pdf.addPage();
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvasWidth;
          sliceCanvas.height = Math.min(pageHeightPx, canvasHeight - yOffset);
          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, yOffset, canvasWidth, sliceCanvas.height, 0, 0, canvasWidth, sliceCanvas.height);
          }
          const sliceImg = sliceCanvas.toDataURL('image/png');
          const sliceHeightMm = (sliceCanvas.height / canvasHeight) * (pdfHeight * Math.ceil(canvasHeight / pageHeightPx));
          pdf.addImage(sliceImg, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, sliceHeightMm));
          yOffset += pageHeightPx;
          page++;
        }
      }

      pdf.save(`${store.personalInfo.name || 'Resume'}_Resume.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setExporting(false);
    }
  }, [store.personalInfo.name]);

  return (
    <div className="flex flex-col h-full">
      {/* Preview Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Live Preview
            </span>
            <div
              className="w-2 h-2 rounded-full animate-pulse-slow"
              style={{ background: '#10b981' }}
              title="Auto-updating"
            />
          </div>
          {/* Template badge */}
          <div
            className="hidden sm:flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
            style={{ background: 'var(--accent-glow)', color: 'var(--accent-light)', border: '1px solid rgba(99,102,241,0.25)' }}
          >
            {store.settings.template}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div
            className="flex items-center gap-1 rounded-lg px-2 py-1"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(1)))}
              className="p-0.5 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ZoomOut size={13} />
            </button>
            <span className="text-xs font-mono px-1 tabular-nums" style={{ color: 'var(--text-secondary)', minWidth: 32, textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.1).toFixed(1)))}
              className="p-0.5 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={() => setZoom(SCALE_FACTOR)}
              className="p-0.5 hover:opacity-70 transition-opacity ml-1"
              style={{ color: 'var(--text-secondary)' }}
              title="Reset zoom"
            >
              <Maximize2 size={12} />
            </button>
          </div>

          <button
            id="export-pdf-btn"
            className="btn-primary text-xs"
            onClick={handleExport}
            disabled={exporting}
            style={{ padding: '0.4rem 0.9rem' }}
          >
            {exporting ? (
              <><Loader2 size={13} className="animate-spin" />Exporting...</>
            ) : (
              <><Download size={13} />Export PDF</>
            )}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div
        className="flex-1 overflow-auto flex items-start justify-center"
        style={{ background: '#12121e', padding: '2rem' }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            width: 794,
            minHeight: 1123,
            transition: 'transform 0.2s ease',
            boxShadow: '0 12px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            borderRadius: 2,
          }}
        >
          {/* This div is captured by html2canvas */}
          <div
            ref={previewRef}
            style={{
              width: 794,
              minHeight: 1123,
              background: 'white',
              transition: 'all 0.25s ease',
            }}
          >
            {getTemplate(store)}
          </div>
        </div>
      </div>
    </div>
  );
}
