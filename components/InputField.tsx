'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: React.ReactNode;
}

export function InputField({ label, id, error, icon, type = 'text', ...props }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      <label htmlFor={id} className="label text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={inputType}
          className={`input-field
            ${icon ? '!pl-11' : '!pl-4'}
            ${isPasswordType ? '!pr-11' : '!pr-4'}
            ${error ? '!border-[var(--danger)] !focus:border-[var(--danger)] !focus:ring-[var(--danger)] !bg-[var(--danger)]/5' : ''}
            ${props.disabled ? '!opacity-50 !cursor-not-allowed' : ''}
          `}
          style={{ transition: 'all 0.2s', ...props.style }}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none focus:text-[var(--accent)] transition-colors rounded-md p-0.5"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[var(--danger)] animate-fade-in flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[var(--danger)]"></span>
          {error}
        </p>
      )}
    </div>
  );
}
