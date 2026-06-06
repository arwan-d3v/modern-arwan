import { Timestamp, FieldValue } from "firebase/firestore";

export type UserRole = 'SUPER_USER' | 'FAMILY' | 'GUEST';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Timestamp | FieldValue | null;
}

export interface WorkExperience {
  id?: string;
  type: 'formal' | 'freelance';
  title: string;
  company: string;
  dates: string;
  description: string;
}

export interface ShowcaseProject {
  id?: string;
  title: string;
  tech_stack: string[];
  description: string;
  image_url: string;
  live_link: string;
}

export interface SkillMatrix {
  id?: string;
  category: string;
  skills: string[];
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
}
