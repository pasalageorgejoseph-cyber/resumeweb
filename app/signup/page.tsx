'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, User } from 'lucide-react';
import { AuthCard } from '@/components/AuthCard';
import { InputField } from '@/components/InputField';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'An error occurred during signup. Please try again.');
      }

      login(data.user);
    } catch (error: any) {
      setErrors({ form: error.message || 'An error occurred during signup. Please try again.' });
      setIsSubmitting(false);
    } 
  };

  if (!mounted || isLoading || isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <AuthCard
        title="Create an account"
        subtitle="Start building your ATS-optimized resume today."
        footerText="Already have an account?"
        footerLinkText="Log in"
        footerLinkHref="/login"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="username"
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            icon={<User size={18} />}
            disabled={isSubmitting}
          />

          <InputField
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail size={18} />}
            disabled={isSubmitting}
          />
          
          <InputField
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<Lock size={18} />}
            disabled={isSubmitting}
          />

          <InputField
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<Lock size={18} />}
            disabled={isSubmitting}
          />

          {errors.form && (
            <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-xl border border-[var(--danger)]/20 animate-fade-in flex items-center gap-2 mt-2">
              <span className="shrink-0 font-bold text-lg leading-none">!</span>
              <span>{errors.form}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center mt-6 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Setting up workspace...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
