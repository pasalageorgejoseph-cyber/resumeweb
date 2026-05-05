'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Clock, FileText, Trash2, Edit, Download, Plus, Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const [resumes, setResumes] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRes, histRes] = await Promise.all([
        fetch('/api/resumes'),
        fetch('/api/history')
      ]);
      const resData = await resRes.json();
      const histData = await histRes.json();
      setResumes(resData.resumes || []);
      setHistoryLogs(histData.history || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}`);
      const data = await res.json();
      if (data.resume && data.resume.data) {
        // Loads strict backend database variant back into dynamic frontend Zustand architecture overriding old data safely
        localStorage.setItem('resume-forge-data-v2', JSON.stringify({ state: data.resume.data, version: 0 }));
        window.location.href = '/'; 
      }
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
    fetchData(); // Recoups data refreshing UI silently
  };

  const handleMockDownload = async (title: string) => {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, action: 'downloaded' })
    });
    alert('Resume downloaded implicitly.');
    fetchData();
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Navbar />
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-3 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-2xl font-bold">Document Hub</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Manage and edit your saved resumes in the cloud.</p>
              </div>
              <button 
                onClick={() => { localStorage.removeItem('resume-forge-data-v2'); window.location.href = '/'; }} 
                className="btn-primary"
              >
                <Plus size={16} /> New Draft
              </button>
            </div>
            
            {isLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--accent)] w-8 h-8" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
                {resumes.map((r: any) => (
                  <div key={r.id} className="card p-5 flex flex-col glass hover:-translate-y-1 transition-transform shadow-lg group">
                    <div className="flex items-center gap-3 mb-4 text-[var(--accent-light)] pb-3 border-b border-[var(--border)]/50">
                      <FileText size={20} />
                      <h3 className="font-semibold text-md truncate flex-1 leading-tight text-[var(--text-primary)]">{r.title}</h3>
                    </div>
                    <p className="text-[11px] font-medium tracking-wide uppercase text-[var(--text-muted)] mb-6">Last edit: {new Date(r.updatedAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 mt-auto pt-4 relative">
                      <button onClick={() => handleEdit(r.id)} className="btn-primary flex-1 text-xs justify-center shadow-lg"><Edit size={14} /> Open</button>
                      <button onClick={() => handleMockDownload(r.title)} className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--accent-glow)] text-[var(--accent-light)] transition-colors"><Download size={15} /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 hover:bg-[var(--danger)]/20 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
                {resumes.length === 0 && <div className="card p-12 text-center text-[var(--text-muted)] col-span-full border-dashed border-2">No resumes found currently saved to the database.</div>}
              </div>
            )}
          </div>

          <div className="md:col-span-1 border-l border-[var(--border)] pt-2 md:pl-8 mt-8 md:mt-0">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
              <Clock size={18} className="text-[var(--accent)]" /> 
              Audit Log
            </h2>
            {isLoading ? <Loader2 className="animate-spin text-[var(--accent)]" /> : (
              <div className="space-y-5 relative before:absolute before:inset-0 before:ml-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent pl-4">
                {historyLogs.slice(0, 15).map((log: any) => (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                     <div className="flex items-start gap-4 text-xs bg-[var(--bg-secondary)] border border-[var(--border)] p-3 rounded-xl shadow-sm w-full relative z-10 transition-colors group-hover:border-[var(--accent)]/50">
                        <div className="absolute -left-5 top-4 w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[var(--bg-primary)] z-20"></div>
                        <div className="flex-1">
                          <p className="text-[var(--text-primary)] leading-relaxed">
                            <span className={`font-bold capitalize ${log.action === 'deleted' ? 'text-[var(--danger)]' : log.action === 'created' ? 'text-[var(--success)]' : 'text-[var(--accent-light)]'}`}>
                              {log.action}
                            </span> 
                            {' '}on "{log.title}"
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-1.5">{new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                     </div>
                  </div>
                ))}
                {historyLogs.length === 0 && <p className="text-xs text-[var(--text-muted)] italic">No actions recorded.</p>}
              </div>
            )}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
