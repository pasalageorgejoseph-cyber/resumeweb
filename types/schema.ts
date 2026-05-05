// Copyright (c) 2026 Resume Forge
// Live App: https://resumewebin-p7wo9bht7-metpallyakshayareddy-1914s-projects.vercel.app/
import { z } from 'zod';

export const PersonalInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(),
});

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(2, "Institution is required"),
  degree: z.string().min(2, "Degree is required"),
  field: z.string().min(2, "Field of study is required"),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
  achievements: z.array(z.string()),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Project name is required"),
  description: z.string(),
  technologies: z.array(z.string()),
  url: z.string().url("Invalid URL format").optional().or(z.literal('')),
  github: z.string().url("Invalid URL format").optional().or(z.literal('')),
});

export const SkillSchema = z.object({
  id: z.string(),
  category: z.string(),
  skills: z.array(z.string()),
});

export const ResumeSchema = z.object({
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(SkillSchema),
});

export type ValidatedResume = z.infer<typeof ResumeSchema>;
