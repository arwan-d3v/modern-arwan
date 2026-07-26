import { Timestamp, FieldValue } from "firebase/firestore";

export type UserRole = 'super_admin' | 'family' | 'guest' | 'public';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Timestamp | FieldValue | number | null;
}

export interface WorkExperience {
  id?: string;
  type: 'formal' | 'freelance';
  title: string;
  company: string;
  location: string;
  dates: string;
  description: string;
  order: number;
}

export interface ShowcaseProject {
  id?: string;
  title: string;
  tech_stack: string[];
  description: string;
  image_url: string;
  live_link: string;
  github_link?: string;
  technical_brief?: {
    integrity: string;
    encryption: string;
    access: string;
  };
  order: number;
}

export interface SkillMatrix {
  id?: string;
  category: string;
  skills: string[];
  order: number;
}

export interface SystemMetrics {
  id?: string;
  vpsUptime: string;
  networkPing: string;
  mt5Status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  cpuLoad: number;
  memoryUsage: number;
  storageIO: number;
  updatedAt: Timestamp | FieldValue;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    photoUrl?: string;
    photoShape?: 'circle' | 'square';
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    religion?: string;
    nationality?: string;
    website?: string;
  };
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  skills: {
    name: string;
    level: number; // 1-100
  }[];
  projects: {
    title: string;
    description: string;
    link?: string;
    techStack?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
    link?: string;
  }[];
  languages: {
    name: string;
    proficiency: string;
  }[];
  references: {
    name: string;
    position: string;
    company: string;
    contact: string;
  }[];
}
