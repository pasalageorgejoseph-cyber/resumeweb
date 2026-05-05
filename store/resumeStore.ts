// Copyright (c) 2026 Resume Forge
// Live App: https://resumewebin-p7wo9bht7-metpallyakshayareddy-1914s-projects.vercel.app/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ResumeData,
  PersonalInfo,
  Education,
  Experience,
  Project,
  Skill,
  ResumeSettings,
  ResumeSection,
} from '@/types/resume';

const defaultSections: ResumeSection[] = [
  { id: 'personalInfo', label: 'Personal Info', visible: true, order: 0 },
  { id: 'experience', label: 'Experience', visible: true, order: 1 },
  { id: 'education', label: 'Education', visible: true, order: 2 },
  { id: 'projects', label: 'Projects', visible: true, order: 3 },
  { id: 'skills', label: 'Skills', visible: true, order: 4 },
];

const defaultData: ResumeData = {
  personalInfo: {
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    summary:
      'Passionate software engineer with 5+ years of experience building scalable web applications. Led cross-functional teams to deliver high-impact products used by millions of users.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: '3.8',
      description: '',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-06',
      endDate: '',
      current: true,
      description: '',
      achievements: [
        'Led development of microservices architecture serving 2M+ daily users',
        'Built and deployed CI/CD pipelines reducing deployment time by 60%',
        'Mentored team of 5 junior engineers and conducted technical interviews',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'CloudDash Analytics',
      description:
        'Designed and built a real-time analytics dashboard processing 100K+ events/second using React, Node.js, and Kafka.',
      technologies: ['React', 'Node.js', 'Kafka', 'PostgreSQL', 'Redis'],
      url: 'https://clouddash.io',
      github: 'https://github.com/alexj/clouddash',
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Go', 'SQL'],
    },
    {
      id: 'skill-2',
      category: 'Frameworks',
      skills: ['React', 'Next.js', 'Node.js', 'Express', 'FastAPI'],
    },
    {
      id: 'skill-3',
      category: 'Tools & Platforms',
      skills: ['AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
    },
  ],
  sections: defaultSections,
  settings: {
    template: 'modern',
    primaryColor: '#6366f1',
    fontFamily: 'sans',
    fontName: 'Inter',
  },
};

interface ResumeStore extends ResumeData {
  history: Omit<ResumeData, 'sections' | 'settings'>[];
  historyIndex: number;
  
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addProject: (proj: Project) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addSkillGroup: (skill: Skill) => void;
  updateSkillGroup: (id: string, skill: Partial<Skill>) => void;
  removeSkillGroup: (id: string) => void;
  updateSettings: (settings: Partial<ResumeSettings>) => void;
  updateSectionOrder: (sections: ResumeSection[]) => void;
  toggleSectionVisibility: (id: string) => void;
  
  // Versioning & History actions
  undo: () => void;
  redo: () => void;
  resetData: () => void;
}

// Helper to save history snapshot
const saveToHistory = (
  state: ResumeStore,
  newData: Partial<Omit<ResumeData, 'sections' | 'settings'>>
): Partial<ResumeStore> => {
  const currentSnapshot = {
    personalInfo: newData.personalInfo || state.personalInfo,
    education: newData.education || state.education,
    experience: newData.experience || state.experience,
    projects: newData.projects || state.projects,
    skills: newData.skills || state.skills,
  };

  const newHistory = state.history.slice(0, state.historyIndex + 1);
  return {
    ...currentSnapshot,
    history: [...newHistory, currentSnapshot].slice(-50), // keep last 50 edits
    historyIndex: Math.min(state.historyIndex + 1, 49),
  };
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      ...defaultData,
      history: [defaultData],
      historyIndex: 0,

      updatePersonalInfo: (info) =>
        set((state) => saveToHistory(state, {
          personalInfo: { ...state.personalInfo, ...info },
        })),

      addEducation: (edu) =>
        set((state) => saveToHistory(state, { education: [...state.education, edu] })),

      updateEducation: (id, edu) =>
        set((state) => saveToHistory(state, {
          education: state.education.map((e) =>
            e.id === id ? { ...e, ...edu } : e
          ),
        })),

      removeEducation: (id) =>
        set((state) => saveToHistory(state, {
          education: state.education.filter((e) => e.id !== id),
        })),

      addExperience: (exp) =>
        set((state) => saveToHistory(state, { experience: [...state.experience, exp] })),

      updateExperience: (id, exp) =>
        set((state) => saveToHistory(state, {
          experience: state.experience.map((e) =>
            e.id === id ? { ...e, ...exp } : e
          ),
        })),

      removeExperience: (id) =>
        set((state) => saveToHistory(state, {
          experience: state.experience.filter((e) => e.id !== id),
        })),

      addProject: (proj) =>
        set((state) => saveToHistory(state, { projects: [...state.projects, proj] })),

      updateProject: (id, proj) =>
        set((state) => saveToHistory(state, {
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...proj } : p
          ),
        })),

      removeProject: (id) =>
        set((state) => saveToHistory(state, {
          projects: state.projects.filter((p) => p.id !== id),
        })),

      addSkillGroup: (skill) =>
        set((state) => saveToHistory(state, { skills: [...state.skills, skill] })),

      updateSkillGroup: (id, skill) =>
        set((state) => saveToHistory(state, {
          skills: state.skills.map((s) =>
            s.id === id ? { ...s, ...skill } : s
          ),
        })),

      removeSkillGroup: (id) =>
        set((state) => saveToHistory(state, {
          skills: state.skills.filter((s) => s.id !== id),
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      updateSectionOrder: (sections) => set({ sections }),

      toggleSectionVisibility: (id) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === id ? { ...s, visible: !s.visible } : s
          ),
        })),

      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            const index = state.historyIndex - 1;
            const previousState = state.history[index];
            return {
              ...previousState,
              historyIndex: index,
            };
          }
          return state;
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const index = state.historyIndex + 1;
            const nextState = state.history[index];
            return {
              ...nextState,
              historyIndex: index,
            };
          }
          return state;
        }),

      resetData: () => set({ ...defaultData, historyIndex: 0, history: [defaultData] }),
    }),
    {
      name: 'resume-forge-data-v3',
    }
  )
);
