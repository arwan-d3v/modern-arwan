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
  History,
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Menu,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CVData } from "@/types";
import { DEFAULT_DATA_ATS, DEFAULT_DATA_MODERN, DEFAULT_DATA_INDONESIAN, ATSPreview, ModernPreview, IndonesianPreview, CVTheme, THEME_COLORS } from "@/components/cv-builder/CVTemplates";
import FadeIn from "@/components/FadeIn";
import PhotoUpload from "@/components/PhotoUpload";
import Modal from "@/components/ui/Modal";
import ATSCheckerModal from "@/components/ATSCheckerModal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";

interface CVHistoryItem {
  id: string;
  date: string;
  title: string;
  data: CVData;
}


const SECTIONS = [
  { id: 1, label: "01_Personal_Identity" },
  { id: 2, label: "02_Experience_Nodes" },
  { id: 3, label: "03_Academic_Protocol" },
  { id: 4, label: "04_Technical_Matrix" },
  { id: 5, label: "05_PROJECTS_PORTFOLIO" },
  { id: 6, label: "06_CERTIFICATIONS" },
  { id: 7, label: "07_LANGUAGES_&_REFERENCES" },
];

export default function CVBuilderPage() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<'ATS' | 'MODERN' | 'INDONESIAN'>('MODERN');
  const [theme, setTheme] = useState<CVTheme>('minimalist_mono');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<CVHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isATSOpen, setIsATSOpen] = useState(false);
  const [itemToLoad, setItemToLoad] = useState<CVHistoryItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dismissMobileWarning, setDismissMobileWarning] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [hideMobileWarningOption, setHideMobileWarningOption] = useState(false);
  
  const toast = useToast();
  const { user, profile } = useAuth();

  
  useEffect(() => {
    const saved = localStorage.getItem('cv_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const savedWarningPref = localStorage.getItem('hide_mobile_warning');
    if (savedWarningPref === 'true') {
      setDismissMobileWarning(true);
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

  const handlePrint = async () => {
    if (!user || !profile) {
      toast.error('AUTH_REQUIRED', 'Access Denied: Please login to export your CV.');
      return;
    }

    const isPro = profile.role === 'super_admin' || profile.role === 'family';
    let pdfExportCount = 0;
    
    if (!isPro) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          pdfExportCount = userSnap.data().pdfExportCount || 0;

          if (pdfExportCount >= 2) {
            setIsPricingModalOpen(true);
            toast.error('QUOTA_EXCEEDED', 'Export limit reached. Please upgrade to Pro for unlimited exports.');
            return;
          }
        }
      } catch (error) {
         console.error('Error checking quota:', error);
         toast.error('NETWORK_ERROR', 'Failed to verify export quota. Please try again.');
         return;
      }
    }

    // Prepare History & Draft Data
    const newItem: CVHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      title: watchedData.personalInfo.fullName + " - " + watchedData.personalInfo.title,
      data: watchedData
    };

    const updatedHistory = [newItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('cv_history', JSON.stringify(updatedHistory));
    
    // Save draft to cloud (non-blocking for print if fails)
    try {
      const draftRef = doc(collection(db, `users/${user.uid}/cv_drafts`), newItem.id);
      await setDoc(draftRef, newItem);
      toast.success('CLOUD_SYNC', 'Draft synced securely to the Vault.');
    } catch (e) {
      console.error('Save draft error:', e);
    }
    
    toast.success("PROCESSING", "Initiating native PDF generation...");
    
    try {
      const element = document.getElementById('cv-export-container');
      if (!element) {
        toast.error("ERROR", "Canvas container not found. Cannot render PDF.");
        return;
      }
      
      const html2pdf = (await import('html2pdf.js')).default;

      // Naming Convention
      const userName = watchedData.personalInfo.fullName?.trim() || "Untitled";
      const userJob = watchedData.personalInfo.title?.trim() || "Role";
      const date = new Date();
      const formattedDate = `${String(date.getDate()).padStart(2, '0')} ${String(date.getMonth() + 1).padStart(2, '0')} ${date.getFullYear()}`;
      const filename = `${userName} - ${userJob} - ${formattedDate} - made by is.arwan.vercel.app (CV and Portofolio showcase Profesional).pdf`;

      const originalTitle = document.title;
      document.title = filename.replace('.pdf', '');

      const opt: any = {
        margin:       0,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: 'css', avoid: '.avoid-break' }
      };
      
      await html2pdf().set(opt).from(element).save();
      document.title = originalTitle;

      // DECREMENT QUOTA ONLY AFTER SUCCESSFUL EXPORT
      if (!isPro) {
         try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { pdfExportCount: pdfExportCount + 1, lastPdfExportDate: Date.now() }, { merge: true });
         } catch (quotaError) {
            console.error('Failed to update quota post-export:', quotaError);
         }
      }

      toast.success("SUCCESS", "PDF export completed successfully.");
    } catch (error) {
      console.error("PDF Generation failed:", error);
      toast.error("ERROR", "Failed to generate PDF. Layout integrity may be compromised.");
    }
  };

  const handleExportWord = async () => {
    if (!user || !profile) {
      toast.error('AUTH_REQUIRED', 'Please login to export to Word.');
      return;
    }
    
    const isPro = profile.role === 'super_admin' || profile.role === 'family';
    if (!isPro) {
      setIsPricingModalOpen(true);
      toast.error('PRO_FEATURE', 'Word export is available for Pro users only.');
      return;
    }

    try {
      toast.success('PROCESSING', 'Generating DOCX file...');
      
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
      const { saveAs } = await import('file-saver');

      const docx = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: watchedData.personalInfo.fullName,
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: watchedData.personalInfo.title, bold: true }),
                new TextRun({ text: ` | ${watchedData.personalInfo.email} | ${watchedData.personalInfo.phone}` }),
              ]
            }),
            new Paragraph({ text: '' }),
            new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: watchedData.personalInfo.summary }),
            new Paragraph({ text: '' }),
            new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_1 }),
            ...watchedData.experience.map(exp => 
               new Paragraph({ text: `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})\
${exp.description}` })
            )
          ],
        }],
      });
      
      const blob = await Packer.toBlob(docx);
      saveAs(blob, `${watchedData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.docx`);
      toast.success('SUCCESS', 'DOCX file downloaded.');
    } catch (e) {
      toast.error('ERROR', 'Failed to generate Word document.');
      console.error(e);
    }
  };

  const handleLoadHistory = () => {
    if (itemToLoad) {
      reset(itemToLoad.data);
      setIsHistoryOpen(false);
      setItemToLoad(null);
      toast.success("ARCHIVE_RESTORED", `Successfully loaded: ${itemToLoad.title}`);
    }
  };

  if (isMobile && !dismissMobileWarning) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <FadeIn className="max-w-md space-y-6">
          <MonitorOff size={64} className="mx-auto text-accent-cyan opacity-20" />
          <h1 className="text-2xl font-bold tracking-tighter uppercase">DESKTOP_RECOMMENDED</h1>
          <p className="text-text-secondary font-mono text-sm leading-relaxed">
            The <span className="text-accent-cyan font-bold">CV_CONSTRUCTOR</span> requires a high-resolution canvas for real-time rendering.
            For the best experience, please access this module via a Desktop terminal.
          </p>
          <div className="flex flex-col gap-4 pt-4">
             <label className="flex items-center justify-center gap-2 text-text-secondary font-mono text-xs cursor-pointer">
               <input
                 type="checkbox"
                 className="accent-accent-cyan w-4 h-4"
                 checked={hideMobileWarningOption}
                 onChange={(e) => setHideMobileWarningOption(e.target.checked)}
               />
               DO NOT SHOW THIS AGAIN
             </label>
             <button
                onClick={() => {
                  if (hideMobileWarningOption) {
                    localStorage.setItem('hide_mobile_warning', 'true');
                  }
                  setDismissMobileWarning(true);
                }}
                className="glass px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:text-accent-cyan border border-surface bg-white/5"
             >
                CONTINUE_ANYWAY
             </button>
             <a href="/" className="text-text-secondary hover:text-white font-mono text-[10px] underline uppercase">
               RETURN_TO_BASE
             </a>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col lg:flex-row bg-background print:bg-white print:block">
        {/* Left/Top Column: Form */}
        <div className="lg:h-screen w-full lg:w-1/2 overflow-y-auto p-4 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-surface custom-scrollbar print:hidden relative z-10 bg-background">
          <div className="max-w-xl mx-auto space-y-12">
            <header className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-accent-cyan tracking-[0.2em] uppercase">
                    <FileText size={14} /> CV_CONSTRUCTOR_V2.1
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter uppercase mt-2">Generate_Resume</h1>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsATSOpen(true)} className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase border border-accent-purple bg-accent-purple/10 text-accent-purple px-4 py-2 hover:bg-accent-purple hover:text-white transition-colors">
                     <AlertCircle size={14} /> ATS_SCAN
                  </button>
                  <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase border border-surface bg-surface text-text-secondary px-4 py-2 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors">
                     <History size={14} /> PROJECT_VAULT
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-1 gap-2">
                  <button
                    onClick={() => handleTemplateChange('ATS')}
                    className={`flex-1 py-3 px-2 md:px-4 font-mono text-[9px] md:text-[10px] font-bold uppercase border transition-all ${template === 'ATS' ? 'bg-white text-black border-white' : 'bg-surface border-surface text-text-secondary hover:border-white/20'}`}
                  >
                    ATS_OPT
                  </button>
                  <button
                    onClick={() => handleTemplateChange('MODERN')}
                    className={`flex-1 py-3 px-2 md:px-4 font-mono text-[9px] md:text-[10px] font-bold uppercase border transition-all ${template === 'MODERN' ? 'bg-accent-cyan text-black border-accent-cyan' : 'bg-surface border-surface text-text-secondary hover:border-accent-cyan/20'}`}
                  >
                    MODERN
                  </button>
                  <button
                    onClick={() => handleTemplateChange('INDONESIAN')}
                    className={`flex-1 py-3 px-2 md:px-4 font-mono text-[9px] md:text-[10px] font-bold uppercase border transition-all ${template === 'INDONESIAN' ? 'bg-accent-purple text-black border-accent-purple' : 'bg-surface border-surface text-text-secondary hover:border-accent-purple/20'}`}
                  >
                    INDO
                  </button>
                </div>
                
                {/* Section Navigation Dropdown */}
                <div className="relative md:w-64 shrink-0 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-cyan pointer-events-none">
                    <Menu size={16} />
                  </div>
                  <select 
                    value={step}
                    onChange={(e) => {
                       const nextStep = Number(e.target.value);
                       if (step === 1 && nextStep > 1 && !watchedData.personalInfo.fullName?.trim()) {
                         toast.error("VALIDATION_ERROR", "Full Name is required before proceeding to the next sequence.");
                         return;
                       }
                       setStep(nextStep);
                    }}
                    className="w-full bg-surface border border-surface text-text-primary text-xs font-mono font-bold uppercase py-3 pl-10 pr-10 appearance-none outline-none focus:border-accent-cyan/50 hover:border-white/10 transition-colors cursor-pointer"
                  >
                    {SECTIONS.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                    ▼
                  </div>
                </div>
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
                    onClick={() => {
                       if (step === 1 && !watchedData.personalInfo.fullName?.trim()) {
                         toast.error("VALIDATION_ERROR", "Full Name is required before proceeding to the next sequence.");
                         return;
                       }
                       setStep(step + 1);
                    }}
                    className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-accent-cyan hover:underline"
                  >
                    NEXT_MODULE <ChevronRight size={14} />
                  </button>
                ) : (
                  <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase bg-accent-cyan text-black px-6 py-2 hover:bg-accent-cyan/90"
                  >
                    <Printer size={14} /> EXPORT PDF
                  </button>
                  <button
                    onClick={handleExportWord}
                    className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase bg-accent-purple text-white px-6 py-2 hover:bg-accent-purple/90"
                  >
                    <FileText size={14} /> EXPORT DOCX (PRO)
                  </button>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right/Bottom Column: Preview */}
        <div className="w-full lg:w-1/2 bg-surface p-4 md:p-12 flex justify-center overflow-auto custom-scrollbar print:p-0 print:bg-white print:block">
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl origin-top transition-transform duration-500 print:shadow-none print:m-0 print:w-full print:scale-100 shrink-0 scale-[0.3] xs:scale-[0.4] sm:scale-[0.6] md:scale-75 lg:scale-[0.85] xl:scale-100 mx-auto -mb-[200mm] sm:-mb-[100mm] lg:mb-0 lg:-translate-y-4 xl:translate-y-0">
            <div id="cv-export-container" className="h-full text-black bg-white relative">
              {/* Visual A4 Page Guides (Real-time Preview) - Hidden during print/export */}
              <div className="absolute inset-0 pointer-events-none z-50 print:hidden" style={{
                backgroundImage: 'linear-gradient(to bottom, transparent calc(297mm - 2px), rgba(0, 242, 255, 0.4) calc(297mm - 2px), rgba(0, 242, 255, 0.4) 297mm)',
                backgroundSize: '100% 297mm'
              }}></div>
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

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm print:hidden">
          <FadeIn className="bg-surface border border-surface w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-surface flex justify-between items-center bg-background/50">
               <div className="font-mono text-xs font-bold uppercase tracking-widest text-accent-cyan flex items-center gap-2">
                 <History size={14} /> PROJECT_VAULT_ARCHIVES
               </div>
               <button onClick={() => setIsHistoryOpen(false)} className="text-text-secondary hover:text-text-primary"><X size={16} /></button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar flex-1">
               {history.length === 0 ? (
                 <div className="text-center p-8 text-text-secondary font-mono text-xs uppercase">No archives found in local storage.</div>
               ) : (
                 history.map(item => (
                   <div key={item.id} className="flex justify-between items-center p-4 dark:bg-white/5 bg-black/5 border border-surface hover:border-accent-cyan/30 transition-colors group">
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
                         onClick={() => setItemToLoad(item)}
                         className="px-4 py-1.5 font-mono text-[10px] font-bold uppercase dark:bg-white/10 bg-black/10 hover:bg-accent-cyan hover:text-white dark:hover:text-black transition-colors"
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

      {/* Confirmation Modal */}
      <Modal 
        visible={!!itemToLoad}
        title="OVERWRITE_WARNING"
        message={`Loading "${itemToLoad?.title}" will overwrite your current progress. Do you wish to continue?`}
        confirmLabel="LOAD_ARCHIVE"
        cancelLabel="CANCEL"
        dangerous={true}
        onConfirm={handleLoadHistory}
        onCancel={() => setItemToLoad(null)}
      />

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm print:hidden">
          <FadeIn className="bg-surface border border-surface w-full max-w-4xl max-h-[90vh] flex flex-col relative">
            <div className="p-6 border-b border-surface flex justify-between items-center bg-background/50">
               <div className="font-mono text-lg font-bold uppercase tracking-widest text-accent-cyan flex items-center gap-2">
                 UPGRADE_ACCESS_PROTOCOL
               </div>
               <button onClick={() => setIsPricingModalOpen(false)} className="text-text-secondary hover:text-white"><X size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
               <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold mb-2">Unlock the Full Potential of Your Career Arsenal</h2>
                 <p className="text-text-secondary font-mono text-xs">Choose a tier that matches your deployment needs.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Free Tier */}
                 <div className="p-6 border border-surface bg-background flex flex-col">
                    <h3 className="text-xl font-bold mb-2">FREE</h3>
                    <div className="text-2xl font-bold text-accent-cyan mb-6">Rp 0</div>
                    <ul className="space-y-3 font-mono text-xs text-text-secondary mb-8 flex-1">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></div> 2 PDF Exports / Week</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></div> Basic Templates</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></div> Watermarked PDF</li>
                    </ul>
                    <button className="w-full py-3 border border-surface text-text-secondary font-mono text-xs uppercase font-bold cursor-default opacity-50">
                       CURRENT_TIER
                    </button>
                 </div>

                 {/* Student Tier */}
                 <div className="p-6 border border-accent-purple bg-accent-purple/5 flex flex-col relative">
                    <div className="absolute top-0 right-0 bg-accent-purple text-white text-[9px] font-bold px-2 py-1 uppercase font-mono">Popular</div>
                    <h3 className="text-xl font-bold mb-2 text-accent-purple">STUDENT</h3>
                    <div className="text-2xl font-bold text-white mb-6">Rp 49.000 <span className="text-sm text-text-secondary font-normal">/mo</span></div>
                    <ul className="space-y-3 font-mono text-xs text-text-secondary mb-8 flex-1">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-purple rounded-full"></div> 10 PDF Exports / Month</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-purple rounded-full"></div> All ATS & Modern Templates</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-purple rounded-full"></div> No Watermark</li>
                    </ul>
                    <button className="w-full py-3 bg-accent-purple text-white font-mono text-xs uppercase font-bold hover:bg-accent-purple/90 transition-colors">
                       UPGRADE_VIA_QRIS
                    </button>
                 </div>

                 {/* Pro Tier */}
                 <div className="p-6 border border-accent-cyan bg-accent-cyan/5 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-accent-cyan">PRO_USER</h3>
                    <div className="text-2xl font-bold text-white mb-6">Rp 99.000 <span className="text-sm text-text-secondary font-normal">/mo</span></div>
                    <ul className="space-y-3 font-mono text-xs text-text-secondary mb-8 flex-1">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></div> Unlimited PDF Exports</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></div> DOCX / Word Export Access</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></div> Priority Support</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></div> Custom Theming</li>
                    </ul>
                    <button className="w-full py-3 bg-accent-cyan text-black font-mono text-xs uppercase font-bold hover:bg-accent-cyan/90 transition-colors">
                       UPGRADE_VIA_MIDTRANS
                    </button>
                 </div>
               </div>

               <div className="mt-8 text-center text-[10px] font-mono text-text-secondary">
                 Payments are securely processed via Midtrans and QRIS network.
               </div>
            </div>
          </FadeIn>
        </div>
      )}

      {/* ATS Scan Modal */}
      <ATSCheckerModal 
        isOpen={isATSOpen}
        onClose={() => setIsATSOpen(false)}
        data={watchedData}
      />

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
