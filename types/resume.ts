export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export type SectionType = 'personalInfo' | 'education' | 'experience' | 'projects' | 'skills';

export interface ResumeSection {
  id: SectionType;
  label: string;
  visible: boolean;
  order: number;
}

export type TemplateName =
  | 'modern'
  | 'classic'
  | 'creative'
  | 'minimal'
  | 'corporate'
  | 'executive'
  | 'bold'
  | 'elegant'
  | 'compact'
  | 'sidebar-dark';

export type FontName =
  | 'Inter'
  | 'Poppins'
  | 'Roboto'
  | 'Playfair Display'
  | 'Merriweather'
  | 'Lato'
  | 'Raleway';

export type FontFamily = 'sans' | 'serif'; // kept for backward compat

export interface ResumeSettings {
  template: TemplateName;
  primaryColor: string;
  fontFamily: FontFamily;
  fontName: FontName;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  sections: ResumeSection[];
  settings: ResumeSettings;
}

export interface ATSScore {
  total: number;
  breakdown: {
    actionVerbs: number;
    keywords: number;
    structure: number;
    completeness: number;
  };
  suggestions: string[];
}

export interface AIImproveResult {
  improved: string;
  original: string;
}
