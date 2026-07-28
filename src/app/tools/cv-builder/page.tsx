"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Layout as LayoutIcon,
  FileText,
  Printer,
  MonitorOff,
  AlertCircle,
  History, Check,
  X,
  Mail,
  Phone,
  MapPin,
  Globe
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CVData } from "@/types";
import FadeIn from "@/components/FadeIn";
import PhotoUpload from "@/components/PhotoUpload";
interface CVHistoryItem {
  id: string;
  date: string;
  title: string;
  data: CVData;
}

const DEFAULT_DATA_ATS: CVData = {
  personalInfo: {
    fullName: "Jerome Powel",
    email: "jerome.powel@finance.gov",
    phone: "+1 202 555 0199",
    location: "Washington, D.C.",
    title: "Chief Economic Officer",
    summary: "Senior economic strategist with extensive experience in monetary policy and financial system stability. Proven track record in analyzing complex economic indicators and leading large-scale financial interventions.",
    photoShape: 'circle',
  },
  experience: [
    {
      title: "Chairman",
      company: "Federal Reserve",
      location: "Washington, D.C.",
      startDate: "2018",
      endDate: "Present",
      description: "Directed national monetary policy to promote maximum employment and stable prices.\nManaged the central banking system of the United States through various economic cycles.",
    }
  ],
  education: [
    {
      degree: "Juris Doctor",
      school: "Georgetown University",
      year: "1979",
    }
  ],
  skills: [
    { name: "Monetary Policy", level: 98 },
    { name: "Financial Analysis", level: 95 },
    { name: "Strategic Leadership", level: 90 },
  ],
  projects: [
    { title: "Quantitative Easing Program", description: "Implemented emergency liquidity measures to stabilize markets.", techStack: "Macroeconomics, Policy Design" }
  ],
  certifications: [
    { name: "Certified Financial Analyst (CFA)", issuer: "CFA Institute", year: "1985" }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Professional" }
  ],
  references: [],
};

const DEFAULT_DATA_MODERN: CVData = {
  personalInfo: {
    fullName: "Joe Smith",
    email: "joe.smith@creative.design",
    phone: "+44 7700 900077",
    location: "London, UK",
    title: "Senior Product Designer",
    summary: "Award-winning product designer specializing in minimalist interfaces and engaging user experiences. Passionate about bridging the gap between aesthetics and functionality in modern applications.",
    photoShape: 'circle',
    website: "dribbble.com/joesmith",
  },
  experience: [
    {
      title: "Lead UI/UX Designer",
      company: "Creative Studio",
      location: "London",
      startDate: "2020",
      endDate: "Present",
      description: "Led the design of 3 major SaaS products, resulting in a 40% increase in user retention.\nEstablished a comprehensive design system used across 5 cross-functional teams.",
    }
  ],
  education: [
    {
      degree: "B.A. Graphic Design",
      school: "Central Saint Martins",
      year: "2018",
    }
  ],
  skills: [
    { name: "Figma", level: 98 },
    { name: "UI/UX Design", level: 95 },
    { name: "Interaction Design", level: 90 },
  ],
  projects: [
    { title: "NeoBanking App Redesign", description: "Led end-to-end redesign of a mobile banking app increasing DAU by 25%.", link: "behance.net/neobank", techStack: "Figma, Framer" }
  ],
  certifications: [
    { name: "Google UX Design Professional Certificate", issuer: "Coursera", year: "2021" }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "French", proficiency: "Conversational" }
  ],
  references: [],
};

const DEFAULT_DATA_INDONESIAN: CVData = {
  personalInfo: {
    fullName: "Sultan Alaudin",
    email: "sultan.alaudin@email.co.id",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    title: "Marketing Manager",
    summary: "Seorang profesional pemasaran dengan pengalaman lebih dari 5 tahun dalam mengelola kampanye digital dan konvensional. Memiliki kemampuan analitis yang kuat dan rekam jejak dalam meningkatkan brand awareness dan penjualan.",
    photoShape: 'square',
    dateOfBirth: "17 Agustus 1995",
    gender: "Laki-laki",
    maritalStatus: "Belum Menikah",
    religion: "Islam",
    nationality: "Warga Negara Indonesia (WNI)",
    website: "linkedin.com/in/sultanalaudin",
  },
  experience: [
    {
      title: "Marketing Manager",
      company: "PT. Maju Bersama",
      location: "Jakarta",
      startDate: "2021",
      endDate: "Sekarang",
      description: "Memimpin tim pemasaran digital beranggotakan 10 orang.\nMeningkatkan konversi penjualan sebesar 35% melalui kampanye media sosial yang terstruktur.",
    }
  ],
  education: [
    {
      degree: "S1 Ilmu Komunikasi",
      school: "Universitas Indonesia",
      year: "2017",
    }
  ],
  skills: [
    { name: "Digital Marketing", level: 90 },
    { name: "SEO & SEM", level: 85 },
    { name: "Public Speaking", level: 90 },
  ],
  projects: [
    { title: "Kampanye Lebaran 2023", description: "Mengeksekusi kampanye pemasaran terpadu (OOH & Digital) yang meningkatkan penjualan Q2 sebesar 40%.", techStack: "Google Ads, Meta Ads, TikTok Ads" }
  ],
  certifications: [
    { name: "Sertifikasi Digital Marketing BNSP", issuer: "LSP Digital", year: "2022" },
    { name: "Google Analytics Individual Qualification", issuer: "Google", year: "2021" }
  ],
  languages: [
    { name: "Bahasa Indonesia", proficiency: "Penutur Asli" },
    { name: "Bahasa Inggris", proficiency: "Aktif Profesional" }
  ],
  references: [
    { name: "Budi Santoso", position: "Direktur Pemasaran", company: "PT. Maju Bersama", contact: "0811-2222-3333" }
  ],
};

export default function CVBuilderPage() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<'ATS' | 'MODERN' | 'INDONESIAN'>('MODERN');
  const [isMobile, setIsMobile] = useState(false);
  const [history, setHistory] = useState<CVHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [continueMobile, setContinueMobile] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const saved = localStorage.getItem('cv_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { register, control, watch, handleSubmit, reset, setValue } = useForm<CVData>({
    defaultValues: DEFAULT_DATA_MODERN,
  });

  const handleTemplateChange = (newTemplate: 'ATS' | 'MODERN' | 'INDONESIAN') => {
    setTemplate(newTemplate);
    if (newTemplate === 'ATS') reset(DEFAULT_DATA_ATS);
    else if (newTemplate === 'MODERN') reset(DEFAULT_DATA_MODERN);
    else if (newTemplate === 'INDONESIAN') reset(DEFAULT_DATA_INDONESIAN);
  };

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills",
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects",
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: "certifications",
  });

  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({
    control,
    name: "languages",
  });

  const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({
    control,
    name: "references",
  });

  const watchedData = watch();

  const handlePrint = () => {
    // Quota check simulation
    const quota = parseInt(localStorage.getItem('cv_pdf_quota') || '0');
    if (quota >= 2) {
      setIsPricingModalOpen(true);
      return;
    }
    localStorage.setItem('cv_pdf_quota', (quota + 1).toString());

    const newItem: CVHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      title: watchedData.personalInfo.fullName + " - " + watchedData.personalInfo.title,
      data: watchedData
    };
    const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem('cv_history', JSON.stringify(updatedHistory));
    
    const originalTitle = document.title;
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')} ${String(date.getMonth() + 1).padStart(2, '0')} ${date.getFullYear()}`;
    const name = watchedData.personalInfo.fullName || 'User';
    const title = watchedData.personalInfo.title || 'Professional';
    document.title = `${name} - ${title} - ${formattedDate} - made by is.arwan.vercel.app (CV and Portofolio showcase Profesional)`;

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 100);
  };

  const handleExportWord = () => {
    setIsPricingModalOpen(true);
  };

  if (isMobile && !continueMobile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <FadeIn className="max-w-md space-y-6">
          <MonitorOff size={64} className="mx-auto text-accent-cyan opacity-20" />
          <h1 className="text-2xl font-bold tracking-tighter uppercase">DESKTOP_RECOMMENDED</h1>
          <p className="text-text-secondary font-mono text-sm leading-relaxed">
            The <span className="text-accent-cyan font-bold">CV_CONSTRUCTOR</span> is best viewed on a high-resolution canvas for real-time rendering.
            You can continue on mobile, but the preview will be moved to the bottom.
          </p>
          <div className="flex flex-col gap-4 pt-4">
             <div className="flex items-center gap-2 text-[10px] font-mono text-accent-purple justify-center">
                <AlertCircle size={14} /> SYSTEM_PRE-REQUISITE: RESOLUTION_1080P
             </div>
             <button onClick={() => setContinueMobile(true)} className="glass px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:text-accent-cyan">
                CONTINUE_ANYWAY
             </button>
             <a href="/" className="px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white">
                RETURN_TO_BASE
             </a>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-background print:bg-white print:block`}>
        {/* Left Column: Form */}
        <div className="lg:h-screen overflow-y-auto p-4 lg:p-8 md:p-12 border-b lg:border-r border-surface custom-scrollbar print:hidden">
          <div className="max-w-xl mx-auto space-y-12">
            <header className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-accent-cyan tracking-[0.2em] uppercase">
                    <FileText size={14} /> CV_CONSTRUCTOR_V2.1
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter uppercase mt-2">Generate_Resume</h1>
                </div>
                <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase border border-surface bg-surface text-text-secondary px-4 py-2 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors">
                   <History size={14} /> PROJECT_VAULT
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleTemplateChange('ATS')}
                  className={`flex-1 py-3 px-4 font-mono text-[10px] font-bold uppercase border transition-all ${template === 'ATS' ? 'bg-white text-black border-white' : 'bg-surface border-surface text-text-secondary hover:border-white/20'}`}
                >
                  ATS_OPTIMIZED
                </button>
                <button
                  onClick={() => handleTemplateChange('MODERN')}
                  className={`flex-1 py-3 px-4 font-mono text-[10px] font-bold uppercase border transition-all ${template === 'MODERN' ? 'bg-accent-cyan text-black border-accent-cyan' : 'bg-surface border-surface text-text-secondary hover:border-accent-cyan/20'}`}
                >
                  MODERN_MINIMAL
                </button>
                <button
                  onClick={() => handleTemplateChange('INDONESIAN')}
                  className={`flex-1 py-3 px-4 font-mono text-[10px] font-bold uppercase border transition-all ${template === 'INDONESIAN' ? 'bg-accent-purple text-black border-accent-purple' : 'bg-surface border-surface text-text-secondary hover:border-accent-purple/20'}`}
                >
                  INDONESIAN_VERSION
                </button>
              </div>
            </header>

            {/* Stepper Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold font-mono tracking-widest text-accent-purple uppercase border-b border-surface pb-2">01_Personal_Identity</h2>
                  <PhotoUpload 
                    currentPhoto={watchedData.personalInfo.photoUrl}
                    shape={watchedData.personalInfo.photoShape || 'circle'}
                    onPhotoSelected={(url) => setValue('personalInfo.photoUrl', url)}
                    onShapeChange={(shape) => setValue('personalInfo.photoShape', shape)}
                  />
                  <FormInput label="Full Name" {...register("personalInfo.fullName")} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Email" {...register("personalInfo.email")} />
                    <FormInput label="Phone" {...register("personalInfo.phone")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Location" {...register("personalInfo.location")} />
                    <FormInput label="WEBSITE / SOCIAL" {...register("personalInfo.website")} />
                  </div>
                  <FormInput label="Professional Title" {...register("personalInfo.title")} />
                  {template === 'INDONESIAN' && (
                    <div className="space-y-4 pt-4 border-t border-surface border-dashed">
                      <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-accent-purple uppercase">
                         <AlertCircle size={14} /> INDONESIAN_STANDARD_DATA
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput label="Tempat, Tanggal Lahir" {...register("personalInfo.dateOfBirth")} />
                        <FormInput label="Jenis Kelamin" {...register("personalInfo.gender")} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput label="Agama" {...register("personalInfo.religion")} />
                        <FormInput label="Status Perkawinan" {...register("personalInfo.maritalStatus")} />
                      </div>
                      <FormInput label="Kewarganegaraan" {...register("personalInfo.nationality")} />
                    </div>
                  )}
                  <div>
                    <FormTextarea label="Professional Summary" {...register("personalInfo.summary")} />
                    <FormattingHint />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-surface pb-2">
                    <h2 className="text-lg font-bold font-mono tracking-widest text-accent-purple uppercase">02_Experience_Nodes</h2>
                    <button onClick={() => appendExp({ title: "", company: "", location: "", startDate: "", endDate: "", description: "" })} className="text-accent-cyan hover:underline font-mono text-[10px] flex items-center gap-1"><Plus size={14}/> ADD_NODE</button>
                  </div>
                  {expFields.map((field, index) => (
                    <div key={field.id} className="p-6 bg-white/5 border border-surface space-y-4 relative group">
                      <button onClick={() => removeExp(index)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                      <FormInput label="Job Title" {...register(`experience.${index}.title`)} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput label="Company" {...register(`experience.${index}.company`)} />
                        <FormInput label="Location" {...register(`experience.${index}.location`)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput label="Start Date" {...register(`experience.${index}.startDate`)} />
                        <FormInput label="End Date" {...register(`experience.${index}.endDate`)} />
                      </div>
                      <div>
                        <FormTextarea label="Key Contributions" {...register(`experience.${index}.description`)} />
                        <FormattingHint />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-surface pb-2">
                    <h2 className="text-lg font-bold font-mono tracking-widest text-accent-purple uppercase">03_Academic_Protocol</h2>
                    <button onClick={() => appendEdu({ degree: "", school: "", year: "" })} className="text-accent-cyan hover:underline font-mono text-[10px] flex items-center gap-1"><Plus size={14}/> ADD_ENTRY</button>
                  </div>
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="p-6 bg-white/5 border border-surface space-y-4 relative group">
                      <button onClick={() => removeEdu(index)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                      <FormInput label="Degree / Certification" {...register(`education.${index}.degree`)} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput label="Institution" {...register(`education.${index}.school`)} />
                        <FormInput label="Graduation Year" {...register(`education.${index}.year`)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-surface pb-2">
                    <h2 className="text-lg font-bold font-mono tracking-widest text-accent-purple uppercase">04_Technical_Matrix</h2>
                    <button onClick={() => appendSkill({ name: "", level: 80 })} className="text-accent-cyan hover:underline font-mono text-[10px] flex items-center gap-1"><Plus size={14}/> ADD_SKILL</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end p-4 bg-white/5 border border-surface relative group">
                        <div className="flex-1">
                          <FormInput label="Skill Name" {...register(`skills.${index}.name`)} />
                        </div>
                        <div className="w-32">
                          <FormInput label="Proficiency (%)" type="number" {...register(`skills.${index}.level`, { valueAsNumber: true })} />
                        </div>
                        <button onClick={() => removeSkill(index)} className="p-2 text-text-secondary hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold tracking-widest uppercase text-accent-cyan">05_PROJECTS_PORTFOLIO</h2>
                    <button type="button" onClick={() => appendProject({ title: "", description: "", link: "", techStack: "" })} className="text-accent-cyan hover:bg-accent-cyan hover:text-black p-2 rounded transition-colors"><Plus size={20}/></button>
                  </div>
                  <div className="space-y-8">
                    {projectFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-surface relative group">
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput label="Project Title" {...register(`projects.${index}.title` as const)} />
                          <FormInput label="Tech Stack" {...register(`projects.${index}.techStack` as const)} />
                          <FormInput label="Link" {...register(`projects.${index}.link` as const)} />
                        </div>
                        <FormTextarea label="Description" {...register(`projects.${index}.description` as const)} />
                        <button type="button" onClick={() => removeProject(index)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold tracking-widest uppercase text-accent-cyan">06_CERTIFICATIONS</h2>
                    <button type="button" onClick={() => appendCert({ name: "", issuer: "", year: "", link: "" })} className="text-accent-cyan hover:bg-accent-cyan hover:text-black p-2 rounded transition-colors"><Plus size={20}/></button>
                  </div>
                  <div className="space-y-8">
                    {certFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-surface relative group grid grid-cols-2 gap-4">
                        <FormInput label="Certification Name" {...register(`certifications.${index}.name` as const)} />
                        <FormInput label="Issuer" {...register(`certifications.${index}.issuer` as const)} />
                        <FormInput label="Year" {...register(`certifications.${index}.year` as const)} />
                        <FormInput label="Link" {...register(`certifications.${index}.link` as const)} />
                        <button type="button" onClick={() => removeCert(index)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold tracking-widest uppercase text-accent-cyan">07A_LANGUAGES</h2>
                      <button type="button" onClick={() => appendLang({ name: "", proficiency: "" })} className="text-accent-cyan hover:bg-accent-cyan hover:text-black p-2 rounded transition-colors"><Plus size={20}/></button>
                    </div>
                    <div className="space-y-4">
                      {langFields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end">
                          <div className="flex-1">
                            <FormInput label="Language" {...register(`languages.${index}.name` as const)} />
                          </div>
                          <div className="flex-1">
                            <FormInput label="Proficiency" {...register(`languages.${index}.proficiency` as const)} />
                          </div>
                          <button type="button" onClick={() => removeLang(index)} className="p-2 mb-2 text-text-secondary hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold tracking-widest uppercase text-accent-cyan">07B_REFERENCES</h2>
                      <button type="button" onClick={() => appendRef({ name: "", position: "", company: "", contact: "" })} className="text-accent-cyan hover:bg-accent-cyan hover:text-black p-2 rounded transition-colors"><Plus size={20}/></button>
                    </div>
                    <div className="space-y-8">
                      {refFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-surface relative group grid grid-cols-2 gap-4">
                          <FormInput label="Name" {...register(`references.${index}.name` as const)} />
                          <FormInput label="Position" {...register(`references.${index}.position` as const)} />
                          <FormInput label="Company" {...register(`references.${index}.company` as const)} />
                          <FormInput label="Contact" {...register(`references.${index}.contact` as const)} />
                          <button type="button" onClick={() => removeRef(index)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-8 border-t border-surface">
                <button
                  disabled={step === 1}
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-text-secondary hover:text-text-primary disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> BACK_SEQUENCE
                </button>
                {step < 7 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-accent-cyan hover:underline"
                  >
                    NEXT_MODULE <ChevronRight size={14} />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportWord}
                      className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase bg-accent-purple text-white px-4 py-2 hover:bg-accent-purple/90"
                    >
                      <Download size={14} /> WORD
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase bg-accent-cyan text-black px-4 py-2 hover:bg-accent-cyan/90"
                    >
                      <Printer size={14} /> PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="bg-[#111111] p-4 lg:p-12 flex justify-center lg:overflow-y-auto overflow-x-auto custom-scrollbar print:p-0 print:bg-white print:block">
          <div className="w-[210mm] min-w-[210mm] min-h-[297mm] bg-white shadow-2xl origin-top lg:scale-100 scale-[0.45] sm:scale-75 lg:origin-top lg:transition-transform lg:duration-500 print:shadow-none print:m-0 print:w-full print:scale-100 mb-[-150mm] sm:mb-[-50mm] lg:mb-0">
            <div className="h-full text-black bg-white">
              {template === 'ATS' ? (
                <ATSPreview data={watchedData} />
              ) : template === 'MODERN' ? (
                <ModernPreview data={watchedData} />
              ) : (
                <IndonesianPreview data={watchedData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm print:hidden">
          <FadeIn className="bg-[#111111] border border-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
            <div className="p-4 border-b border-surface flex justify-between items-center sticky top-0 bg-[#111111] z-10">
               <div className="font-mono text-xs font-bold uppercase tracking-widest text-accent-cyan flex items-center gap-2">
                 UPGRADE_REQUIRED
               </div>
               <button onClick={() => setIsPricingModalOpen(false)} className="text-text-secondary hover:text-white"><X size={16} /></button>
            </div>

            <div className="p-8 text-center space-y-4">
               <h2 className="text-3xl font-bold uppercase tracking-tight">Unlock Full Potential</h2>
               <p className="text-text-secondary font-mono text-sm max-w-2xl mx-auto">
                 You have reached your free tier limits or requested a premium feature (Word Export). Choose a plan below to continue.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 pt-0">
               {/* Free Tier */}
               <div className="border border-surface p-6 flex flex-col space-y-6">
                 <div>
                   <h3 className="text-lg font-bold uppercase text-white">Free</h3>
                   <div className="text-2xl font-bold mt-2">Rp 0</div>
                 </div>
                 <ul className="space-y-3 font-mono text-xs text-text-secondary flex-1">
                   <li className="flex gap-2"><Check size={14} className="text-accent-cyan shrink-0" /> Basic Templates</li>
                   <li className="flex gap-2"><Check size={14} className="text-accent-cyan shrink-0" /> 2 PDF Exports / week</li>
                   <li className="flex gap-2"><X size={14} className="text-red-500 shrink-0" /> No Word Export</li>
                   <li className="flex gap-2"><X size={14} className="text-red-500 shrink-0" /> Vault limited to 1</li>
                 </ul>
                 <button disabled className="w-full py-2 bg-surface text-text-secondary font-mono text-[10px] font-bold uppercase opacity-50 cursor-not-allowed">
                   CURRENT_PLAN
                 </button>
               </div>

               {/* Student Tier */}
               <div className="border border-accent-purple p-6 flex flex-col space-y-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-accent-purple text-black font-mono text-[8px] font-bold px-2 py-1 uppercase">Best Value</div>
                 <div>
                   <h3 className="text-lg font-bold uppercase text-accent-purple">Student</h3>
                   <div className="text-2xl font-bold mt-2">Rp 15.000<span className="text-sm text-text-secondary font-normal">/mo</span></div>
                 </div>
                 <ul className="space-y-3 font-mono text-xs text-text-secondary flex-1">
                   <li className="flex gap-2"><Check size={14} className="text-accent-purple shrink-0" /> All Templates</li>
                   <li className="flex gap-2"><Check size={14} className="text-accent-purple shrink-0" /> 10 Exports / week</li>
                   <li className="flex gap-2"><Check size={14} className="text-accent-purple shrink-0" /> Word (.docx) Export</li>
                   <li className="flex gap-2"><Check size={14} className="text-accent-purple shrink-0" /> Vault up to 5</li>
                   <li className="flex gap-2"><Check size={14} className="text-accent-purple shrink-0" /> No Watermarks</li>
                 </ul>
                 <button onClick={() => alert('Midtrans QRIS integration pending...')} className="w-full py-2 bg-accent-purple hover:bg-accent-purple/90 text-white font-mono text-[10px] font-bold uppercase transition-colors">
                   UPGRADE_STUDENT (QRIS)
                 </button>
               </div>

               {/* Pro Tier */}
               <div className="border border-accent-cyan p-6 flex flex-col space-y-6">
                 <div>
                   <h3 className="text-lg font-bold uppercase text-accent-cyan">Pro</h3>
                   <div className="text-2xl font-bold mt-2">Rp 49.000<span className="text-sm text-text-secondary font-normal">/mo</span></div>
                 </div>
                 <ul className="space-y-3 font-mono text-xs text-text-secondary flex-1">
                   <li className="flex gap-2"><Check size={14} className="text-accent-cyan shrink-0" /> All Templates & Features</li>
                   <li className="flex gap-2"><Check size={14} className="text-accent-cyan shrink-0" /> Unlimited Exports</li>
                   <li className="flex gap-2"><Check size={14} className="text-accent-cyan shrink-0" /> Unlimited Vault</li>
                   <li className="flex gap-2"><Check size={14} className="text-accent-cyan shrink-0" /> Priority Support</li>
                 </ul>
                 <button onClick={() => alert('Midtrans QRIS integration pending...')} className="w-full py-2 bg-accent-cyan hover:bg-accent-cyan/90 text-black font-mono text-[10px] font-bold uppercase transition-colors">
                   UPGRADE_PRO (QRIS)
                 </button>
               </div>
            </div>
          </FadeIn>
        </div>
      )}

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:hidden">
          <FadeIn className="bg-[#111111] border border-surface w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-surface flex justify-between items-center bg-black/50">
               <div className="font-mono text-xs font-bold uppercase tracking-widest text-accent-cyan flex items-center gap-2">
                 <History size={14} /> PROJECT_VAULT_ARCHIVES
               </div>
               <button onClick={() => setIsHistoryOpen(false)} className="text-text-secondary hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar flex-1">
               {history.length === 0 ? (
                 <div className="text-center p-8 text-text-secondary font-mono text-xs uppercase">No archives found in local storage.</div>
               ) : (
                 history.map(item => (
                   <div key={item.id} className="flex justify-between items-center p-4 bg-white/5 border border-surface hover:border-accent-cyan/30 transition-colors group">
                     <div>
                       <div className="font-bold text-sm">{item.title}</div>
                       <div className="text-[10px] font-mono text-text-secondary mt-1">{item.date}</div>
                     </div>
                     <div className="flex gap-3">
                       <button 
                         onClick={() => {
                           const newHistory = history.filter(h => h.id !== item.id);
                           setHistory(newHistory);
                           localStorage.setItem('cv_history', JSON.stringify(newHistory));
                         }} 
                         className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                       >
                         <Trash2 size={16} />
                       </button>
                       <button 
                         onClick={() => {
                           if(window.confirm("Loading this archive will overwrite your current progress. Continue?")) {
                              reset(item.data);
                              setIsHistoryOpen(false);
                           }
                         }}
                         className="px-4 py-1.5 font-mono text-[10px] font-bold uppercase bg-white/10 hover:bg-accent-cyan hover:text-black transition-colors"
                       >
                         LOAD
                       </button>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </FadeIn>
        </div>
      )}

      <style jsx global>{`
        /* Web-safe ATS Typography & Print Enhancements */
        @media print {
          body { background: white !important; color: black !important; }
          
          /* Hide all UI elements entirely during print, but NEVER hide valid headers in the document */
          .print\:hidden { display: none !important; }
          nav, button, footer, .ui-controls { display: none !important; }
          
          /* Strict A4 page size format with normalized ATS margins */
          @page { size: A4; margin: 10mm; }
          
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; box-shadow: none !important; }
          
          /* Orphan/Widow Control - Prevents sections from breaking in half */
          .cv-print-block, .experience-item, .education-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: block !important;
          }
          
          /* Dynamic Scale Approach / Compression */
          .cv-print-container {
            /* Compresses content slightly if it exceeds one page */
            padding: 0 !important;
            zoom: 0.95;
            transform: scale(0.97);
            transform-origin: top left;
            font-size: 0.95em !important;
            line-height: 1.3 !important;
            width: 100% !important;
          }

          /* Force ATS-friendly fonts */
          .cv-print-container, .cv-print-container * {
             font-family: Arial, Helvetica, Calibri, sans-serif !important;
          }
        }
      `}</style>
    </ProtectedRoute>
  );
}

// --- Preview Templates ---

const formatText = (text: string) => {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\*\*\S(?:.*?\S)?\*\*|\*\S(?:.*?\S)?\*|_\S(?:.*?\S)?_|~\S(?:.*?\S)?~)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={index}>{part.slice(1, -1)}</strong>;
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('~') && part.endsWith('~')) {
      return <u key={index}>{part.slice(1, -1)}</u>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

function ATSPreview({ data }: { data: CVData }) {
  return (
    <main className="cv-print-container p-[15mm] print:p-0 space-y-6 text-[10.5pt] leading-snug" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <header className="cv-print-block text-center border-b-[1.5pt] border-black pb-4" style={{ display: 'block' }}>
        <h1 className="text-2xl font-bold uppercase tracking-tight">{data.personalInfo.fullName}</h1>
        <div className="text-[9pt] mt-2 flex justify-center gap-3">
          <span>{data.personalInfo.location}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span className="underline">{data.personalInfo.email}</span>
        </div>
      </header>

      <section className="cv-print-block space-y-2">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black">Summary</h2>
        <p className="text-justify">{formatText(data.personalInfo.summary)}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black">Work Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <article key={i} className="cv-print-block experience-item">
              <header className="flex justify-between font-bold" style={{ display: 'flex' }}>
                <h3>{exp.title}</h3>
                <span>{exp.startDate} – {exp.endDate}</span>
              </header>
              <div className="flex justify-between italic text-[9.5pt]">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <p className="mt-1 whitespace-pre-line text-justify">{formatText(exp.description)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cv-print-block space-y-2">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black">Technical Skills</h2>
        <ul className="list-none p-0 m-0">
          <li><strong>Expertise:</strong> {data.skills.map(s => s.name).join(', ')}</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black">Education</h2>
        <ul className="list-none p-0 m-0 space-y-2">
          {data.education.map((edu, i) => (
            <li key={i} className="cv-print-block education-item flex justify-between">
              <div>
                <span className="font-bold">{edu.school}</span>, {edu.degree}
              </div>
              <span>{edu.year}</span>
            </li>
          ))}
        </ul>
      </section>

      {data.projects && data.projects.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[11pt] font-bold uppercase border-b border-black">Projects & Portfolio</h2>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <article key={i} className="cv-print-block experience-item">
                <header className="flex justify-between font-bold" style={{ display: 'flex' }}>
                  <h3>{proj.title} {proj.link && <span className="font-normal italic">| {proj.link}</span>}</h3>
                </header>
                {proj.techStack && (
                  <div className="italic text-[9.5pt]">Tech Stack: {proj.techStack}</div>
                )}
                <p className="mt-1 whitespace-pre-line text-justify">{formatText(proj.description)}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-[11pt] font-bold uppercase border-b border-black">Certifications</h2>
          <ul className="list-none p-0 m-0 space-y-1">
            {data.certifications.map((cert, i) => (
              <li key={i} className="cv-print-block">
                <span className="font-bold">{cert.name}</span>, {cert.issuer} {cert.year ? `(${cert.year})` : ''} {cert.link && <span className="italic ml-1">[{cert.link}]</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.languages && data.languages.length > 0 && (
        <section className="cv-print-block space-y-2">
          <h2 className="text-[11pt] font-bold uppercase border-b border-black">Languages</h2>
          <ul className="list-none p-0 m-0">
            <li>{data.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}</li>
          </ul>
        </section>
      )}
    </main>
  );
}

function ModernPreview({ data }: { data: CVData }) {
  const accentColor = "#0E7490"; // Deep Cyan for print

  return (
    <div className="font-sans flex h-full min-h-[297mm]">
      {/* Sidebar */}
      <div className="w-[30%] bg-[#F3F4F6] p-8 flex flex-col gap-8">
        <div className="space-y-4">
          {data.personalInfo.photoUrl ? (
            <div className={`w-24 h-24 mx-auto border-4 border-white shadow-sm overflow-hidden ${data.personalInfo.photoShape === 'square' ? 'rounded-2xl' : 'rounded-full'}`}>
              <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className={`w-24 h-24 bg-white mx-auto border-4 border-white shadow-sm flex items-center justify-center text-gray-300 ${data.personalInfo.photoShape === 'square' ? 'rounded-2xl' : 'rounded-full'}`}>
               <LayoutIcon size={40} />
            </div>
          )}
          <div className="text-center">
            <h1 className="text-xl font-bold leading-tight uppercase tracking-tighter">{data.personalInfo.fullName}</h1>
            <p className="text-[8pt] font-bold uppercase tracking-widest mt-1" style={{ color: accentColor }}>{data.personalInfo.title}</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-[9pt] font-bold uppercase tracking-widest border-b border-gray-300 pb-1">Contact</h2>
          <div className="text-[8.5pt] space-y-3">
            <div className="space-y-0.5">
               <div className="font-bold text-[7pt] text-gray-400 uppercase">Email</div>
               <div className="break-words">{data.personalInfo.email}</div>
            </div>
            <div className="space-y-0.5">
               <div className="font-bold text-[7pt] text-gray-400 uppercase">Phone</div>
               <div>{data.personalInfo.phone}</div>
            </div>
            <div className="space-y-0.5">
               <div className="font-bold text-[7pt] text-gray-400 uppercase">Location</div>
               <div>{data.personalInfo.location}</div>
            </div>
            {data.personalInfo.website && (
              <div className="space-y-0.5">
                 <div className="font-bold text-[7pt] text-gray-400 uppercase">WEBSITE / SOCIAL</div>
                 <div className="break-words">{data.personalInfo.website}</div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[9pt] font-bold uppercase tracking-widest border-b border-gray-300 pb-1">Core Matrix</h2>
          <div className="space-y-4">
            {data.skills.map((s, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[8pt] font-bold">
                  <span>{s.name}</span>
                  <span>{s.level}%</span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${s.level}%`, backgroundColor: accentColor }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {data.languages && data.languages.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[9pt] font-bold uppercase tracking-widest border-b border-gray-300 pb-1">Languages</h2>
            <div className="space-y-3 text-[8.5pt]">
              {data.languages.map((lang, i) => (
                <div key={i} className="flex justify-between">
                  <span className="font-bold">{lang.name}</span>
                  <span className="text-gray-500">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 space-y-10">
        <section className="space-y-3">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: accentColor }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            Executive_Summary
          </h2>
          <p className="text-[9.5pt] leading-relaxed text-gray-700">{formatText(data.personalInfo.summary)}</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: accentColor }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            Professional_Timeline
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-gray-100">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300" />
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[10.5pt]">{exp.title}</h3>
                  <span className="text-[8pt] font-bold text-gray-400">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-[9pt] font-bold mb-3" style={{ color: accentColor }}>{exp.company}</div>
                <p className="text-[9.5pt] text-gray-600 whitespace-pre-line leading-relaxed">{formatText(exp.description)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: accentColor }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            Academic_History
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <h3 className="font-bold text-[10pt]">{edu.degree}</h3>
                  <p className="text-[9pt] text-gray-600">{edu.school}</p>
                </div>
                <span className="text-[9pt] font-bold text-gray-400">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>

        {data.projects && data.projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: accentColor }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Projects_Portfolio
            </h2>
            <div className="space-y-6">
              {data.projects.map((proj, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-gray-100">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300" />
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[10.5pt]">{proj.title}</h3>
                    {proj.link && <span className="text-[8pt] text-gray-400 italic">{proj.link}</span>}
                  </div>
                  {proj.techStack && (
                    <div className="text-[8pt] font-bold mb-2 text-gray-500">Tech: {proj.techStack}</div>
                  )}
                  <p className="text-[9.5pt] text-gray-600 whitespace-pre-line leading-relaxed">{formatText(proj.description)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: accentColor }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Certifications
            </h2>
            <div className="space-y-4">
              {data.certifications.map((cert, i) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-[10pt]">{cert.name}</h3>
                    <p className="text-[9pt] text-gray-600">{cert.issuer} {cert.link && <span className="italic">| {cert.link}</span>}</p>
                  </div>
                  <span className="text-[9pt] font-bold text-gray-400">{cert.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.references && data.references.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: accentColor }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              References
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.references.map((ref, i) => (
                <div key={i} className="text-[9pt]">
                  <div className="font-bold">{ref.name}</div>
                  <div className="text-gray-600">{ref.position} at {ref.company}</div>
                  <div className="text-gray-500 italic mt-1">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function IndonesianPreview({ data }: { data: CVData }) {
  const accentColor = "#8B5CF6"; // Accent Purple for Indonesian template

  return (
    <div className="font-sans flex flex-col h-full min-h-[297mm] bg-white text-gray-800">
      {/* Header section with photo and main contact */}
      <div className="flex bg-[#F8FAFC] p-8 border-b-4 items-center justify-between" style={{ borderColor: accentColor }}>
        <div className="flex-1 pr-6">
          <h1 className="text-[28pt] leading-none font-extrabold uppercase tracking-tight text-gray-900">{data.personalInfo.fullName}</h1>
          <p className="text-[12pt] font-bold uppercase tracking-[0.2em] mt-3 mb-6" style={{ color: accentColor }}>{data.personalInfo.title}</p>
          
          <div className="flex flex-col gap-3 text-[9.5pt] text-gray-700">
             <div className="flex items-center gap-3">
               <div className="p-1.5 rounded-md" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                 <Mail size={14} />
               </div>
               <span className="font-medium">{data.personalInfo.email}</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="p-1.5 rounded-md" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                 <Phone size={14} />
               </div>
               <span className="font-medium">{data.personalInfo.phone}</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="p-1.5 rounded-md" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                 <MapPin size={14} />
               </div>
               <span className="font-medium">{data.personalInfo.location}</span>
             </div>
             {data.personalInfo.website && (
               <div className="flex items-center gap-3">
                 <div className="p-1.5 rounded-md" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                   <Globe size={14} />
                 </div>
                 <span className="font-medium">{data.personalInfo.website}</span>
               </div>
             )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {data.personalInfo.photoUrl ? (
            <div className={`w-32 h-40 border-4 border-white shadow-lg overflow-hidden bg-gray-100 ${data.personalInfo.photoShape === 'circle' ? 'rounded-full w-32 h-32' : 'rounded-xl'}`}>
              <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className={`w-32 h-40 bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-gray-400 ${data.personalInfo.photoShape === 'circle' ? 'rounded-full w-32 h-32' : 'rounded-xl'}`}>
               <LayoutIcon size={40} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Column: Data Diri & Skills */}
        <div className="w-[35%] bg-[#F1F5F9] p-8 space-y-8 border-r border-gray-200">
          <section className="space-y-4">
            <h2 className="text-[11pt] font-bold uppercase tracking-widest border-b-2 pb-1" style={{ borderColor: accentColor }}>Data Pribadi</h2>
            <div className="text-[9pt] space-y-3">
              {(data.personalInfo.dateOfBirth || data.personalInfo.gender || data.personalInfo.religion) ? (
                <>
                  {data.personalInfo.dateOfBirth && (
                    <div>
                      <div className="font-bold text-gray-500 text-[8pt]">Tempat, Tanggal Lahir</div>
                      <div>{data.personalInfo.dateOfBirth}</div>
                    </div>
                  )}
                  {data.personalInfo.gender && (
                    <div>
                      <div className="font-bold text-gray-500 text-[8pt]">Jenis Kelamin</div>
                      <div>{data.personalInfo.gender}</div>
                    </div>
                  )}
                  {data.personalInfo.religion && (
                    <div>
                      <div className="font-bold text-gray-500 text-[8pt]">Agama</div>
                      <div>{data.personalInfo.religion}</div>
                    </div>
                  )}
                  {data.personalInfo.maritalStatus && (
                    <div>
                      <div className="font-bold text-gray-500 text-[8pt]">Status Perkawinan</div>
                      <div>{data.personalInfo.maritalStatus}</div>
                    </div>
                  )}
                  {data.personalInfo.nationality && (
                    <div>
                      <div className="font-bold text-gray-500 text-[8pt]">Kewarganegaraan</div>
                      <div>{data.personalInfo.nationality}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="italic text-gray-500 text-[8pt]">Tambahkan data standar Indonesia di form.</div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[11pt] font-bold uppercase tracking-widest border-b-2 pb-1" style={{ borderColor: accentColor }}>Keahlian</h2>
            <div className="space-y-3">
              {data.skills.map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[8.5pt] font-bold text-gray-700">
                    <span>{s.name}</span>
                    <span>{s.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.level}%`, backgroundColor: accentColor }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {data.languages && data.languages.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-[11pt] font-bold uppercase tracking-widest border-b-2 pb-1" style={{ borderColor: accentColor }}>Kemampuan Bahasa</h2>
              <div className="space-y-2">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between text-[8.5pt]">
                    <span className="font-bold text-gray-700">{lang.name}</span>
                    <span className="text-gray-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Experience & Education */}
        <div className="flex-1 p-8 space-y-8">
          <section className="space-y-3">
            <h2 className="text-[12pt] font-bold uppercase flex items-center gap-2" style={{ color: accentColor }}>
              <FileText size={16} /> Profil Singkat
            </h2>
            <p className="text-[9.5pt] leading-relaxed text-justify text-gray-700 bg-white">{formatText(data.personalInfo.summary)}</p>
          </section>

          <section className="space-y-5">
            <h2 className="text-[12pt] font-bold uppercase flex items-center gap-2 border-b border-gray-200 pb-2" style={{ color: accentColor }}>
              <FileText size={16} /> Pengalaman Kerja
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[11pt] text-gray-900">{exp.title}</h3>
                    <span className="text-[8.5pt] font-bold text-white px-2 py-0.5 rounded-sm" style={{ backgroundColor: accentColor }}>
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div className="text-[9.5pt] font-bold text-gray-600 mb-2">{exp.company} — {exp.location}</div>
                  <p className="text-[9.5pt] text-gray-700 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-gray-200 text-justify">
                    {formatText(exp.description)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-[12pt] font-bold uppercase flex items-center gap-2 border-b border-gray-200 pb-2" style={{ color: accentColor }}>
              <FileText size={16} /> Riwayat Pendidikan
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[10.5pt] text-gray-900">{edu.degree}</h3>
                    <p className="text-[9.5pt] text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-[9pt] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>

          {data.projects && data.projects.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-[12pt] font-bold uppercase flex items-center gap-2 border-b border-gray-200 pb-2" style={{ color: accentColor }}>
                <FileText size={16} /> Proyek & Portofolio
              </h2>
              <div className="space-y-6">
                {data.projects.map((proj, i) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-[11pt] text-gray-900">{proj.title}</h3>
                      {proj.link && <span className="text-[8.5pt] text-gray-500 italic">{proj.link}</span>}
                    </div>
                    {proj.techStack && (
                      <div className="text-[9pt] font-bold text-gray-500 mb-2">Tech Stack: {proj.techStack}</div>
                    )}
                    <p className="text-[9.5pt] text-gray-700 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-gray-200 text-justify">
                      {formatText(proj.description)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-[12pt] font-bold uppercase flex items-center gap-2 border-b border-gray-200 pb-2" style={{ color: accentColor }}>
                <FileText size={16} /> Sertifikasi & Lisensi
              </h2>
              <div className="space-y-4">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[10.5pt] text-gray-900">{cert.name}</h3>
                      <p className="text-[9.5pt] text-gray-600">{cert.issuer} {cert.link && <span className="italic">| {cert.link}</span>}</p>
                    </div>
                    {cert.year && <span className="text-[9pt] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{cert.year}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.references && data.references.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-[12pt] font-bold uppercase flex items-center gap-2 border-b border-gray-200 pb-2" style={{ color: accentColor }}>
                <FileText size={16} /> Referensi
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.references.map((ref, i) => (
                  <div key={i} className="text-[9.5pt]">
                    <div className="font-bold text-gray-900">{ref.name}</div>
                    <div className="text-gray-600">{ref.position} — {ref.company}</div>
                    <div className="text-gray-500 italic">{ref.contact}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Form Helpers ---

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({ label, ...props }, ref) => (
  <div className="space-y-1.5">
    <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">{label}</label>
    <input
      ref={ref}
      className="w-full bg-surface border border-surface rounded-none py-2.5 px-4 text-sm focus:border-accent-cyan/50 outline-none transition-colors"
      {...props}
    />
  </div>
));
FormInput.displayName = "FormInput";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(({ label, ...props }, ref) => (
  <div className="space-y-1.5">
    <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">{label}</label>
    <textarea
      ref={ref}
      rows={4}
      className="w-full bg-surface border border-surface rounded-none py-2.5 px-4 text-sm focus:border-accent-cyan/50 outline-none resize-none transition-colors"
      {...props}
    />
  </div>
));
FormTextarea.displayName = "FormTextarea";

const FormattingHint = () => (
  <div className="text-[10px] text-text-secondary font-mono mt-1.5 space-y-1 bg-white/5 p-2 border border-surface">
    <div><span className="font-bold text-accent-cyan uppercase">Supported Formatting:</span></div>
    <div>Use <code className="text-white bg-black/20 px-1 rounded">**text**</code> or <code className="text-white bg-black/20 px-1 rounded">*text*</code> for bold.</div>
    <div>Use <code className="text-white bg-black/20 px-1 rounded">_text_</code> for italic.</div>
    <div>Use <code className="text-white bg-black/20 px-1 rounded">~text~</code> for underline.</div>
  </div>
);
