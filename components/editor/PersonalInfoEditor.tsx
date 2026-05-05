'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { validateEmail, sanitizeText } from '@/lib/utils';
import { User, Mail, Phone, MapPin, Globe, FileText, Briefcase } from 'lucide-react';
import { AIImproveButton } from '@/components/AIImproveButton';

export function PersonalInfoEditor() {
  const { personalInfo, updatePersonalInfo } = useResumeStore();
  const [emailError, setEmailError] = useState('');

  const handleChange = (field: string, value: string) => {
    const sanitized = sanitizeText(value);
    if (field === 'email') {
      setEmailError(sanitized && !validateEmail(sanitized) ? 'Invalid email address' : '');
    }
    updatePersonalInfo({ [field]: sanitized });
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="label">
            <span className="flex items-center gap-1.5"><User size={12} />Full Name</span>
          </label>
          <input
            id="pi-name"
            className="input-field"
            value={personalInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="col-span-2">
          <label className="label">
            <span className="flex items-center gap-1.5"><Briefcase size={12} />Professional Title</span>
          </label>
          <input
            id="pi-title"
            className="input-field"
            value={personalInfo.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </div>

        <div>
          <label className="label">
            <span className="flex items-center gap-1.5"><Mail size={12} />Email</span>
          </label>
          <input
            id="pi-email"
            className="input-field"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
          />
          {emailError && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{emailError}</p>}
        </div>

        <div>
          <label className="label">
            <span className="flex items-center gap-1.5"><Phone size={12} />Phone</span>
          </label>
          <input
            id="pi-phone"
            className="input-field"
            value={personalInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="label">
            <span className="flex items-center gap-1.5"><MapPin size={12} />Location</span>
          </label>
          <input
            id="pi-location"
            className="input-field"
            value={personalInfo.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="label">
            <span className="flex items-center gap-1.5"><Globe size={12} />Website</span>
          </label>
          <input
            id="pi-website"
            className="input-field"
            value={personalInfo.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="yoursite.com"
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">
              <span className="flex items-center gap-1.5"><FileText size={12} />Professional Summary</span>
            </label>
            <AIImproveButton
              content={personalInfo.summary}
              type="summary"
              compact
              onAccept={(improved) => updatePersonalInfo({ summary: improved })}
            />
          </div>
          <textarea
            id="pi-summary"
            className="input-field resize-none"
            rows={4}
            value={personalInfo.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Write a compelling 2-3 sentence summary highlighting your experience and value proposition..."
          />
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {personalInfo.summary.length} characters — aim for 150–300
          </p>
        </div>
      </div>
    </div>
  );
}
