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
  AlertCircle
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CVData } from "@/types";
import FadeIn from "@/components/FadeIn";

const DEFAULT_DATA: CVData = {
  personalInfo: {
    fullName: "Jules Engineer",
    email: "jules@nexus-labs.io",
    phone: "+65 8888 0000",
    location: "Singapore",
    title: "Senior Infrastructure Architect",
    summary: "Specialist in high-frequency trading infrastructure and automated data pipelines. Expert in low-latency systems and resilient cloud architecture.",
  },
  experience: [
    {
      title: "Senior Infrastructure Architect",
      company: "Nexus Labs",
      location: "Singapore",
      startDate: "2021",
      endDate: "Present",
      description: "Designed sub-10ms latency networks for trading bots.\nAutomated 90% of infrastructure deployment using Terraform.",
    }
  ],
  education: [
    {
      degree: "B.Sc. Computer Science",
      school: "National University of Singapore",
      year: "2018",
    }
  ],
  skills: [
    { name: "Rust", level: 95 },
    { name: "Python", level: 90 },
    { name: "Infrastructure", level: 98 },
  ],
};

export default function CVBuilderPage() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<'ATS' | 'MODERN'>('MODERN');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { register, control, watch, handleSubmit } = useForm<CVData>({
    defaultValues: DEFAULT_DATA,
  });

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

  const watchedData = watch();

  const handlePrint = () => {
    window.print();
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <FadeIn className="max-w-md space-y-6">
          <MonitorOff size={64} className="mx-auto text-accent-cyan opacity-20" />
          <h1 className="text-2xl font-bold tracking-tighter uppercase">MOBILE_INTERFACE_LOCKED</h1>
          <p className="text-text-secondary font-mono text-sm leading-relaxed">
            The <span className="text-accent-cyan font-bold">CV_CONSTRUCTOR</span> requires a high-resolution canvas for real-time rendering.
            Please access this module via a Desktop terminal (width {">"} 1024px).
          </p>
          <div className="flex flex-col gap-4 pt-4">
             <div className="flex items-center gap-2 text-[10px] font-mono text-accent-purple justify-center">
                <AlertCircle size={14} /> SYSTEM_PRE-REQUISITE: RESOLUTION_1080P
             </div>
             <a href="/" className="glass px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:text-accent-cyan">
                RETURN_TO_BASE
             </a>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background print:bg-white print:block">
        {/* Left Column: Form */}
        <div className="h-screen overflow-y-auto p-8 md:p-12 border-r border-surface custom-scrollbar print:hidden">
          <div className="max-w-xl mx-auto space-y-12">
            <header className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-accent-cyan tracking-[0.2em] uppercase">
                <FileText size={14} /> CV_CONSTRUCTOR_V2.1
              </div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase">Generate_Resume</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setTemplate('ATS')}
                  className={`flex-1 py-3 px-4 font-mono text-[10px] font-bold uppercase border transition-all ${template === 'ATS' ? 'bg-white text-black border-white' : 'bg-surface border-surface text-text-secondary hover:border-white/20'}`}
                >
                  ATS_OPTIMIZED
                </button>
                <button
                  onClick={() => setTemplate('MODERN')}
                  className={`flex-1 py-3 px-4 font-mono text-[10px] font-bold uppercase border transition-all ${template === 'MODERN' ? 'bg-accent-cyan text-black border-accent-cyan' : 'bg-surface border-surface text-text-secondary hover:border-accent-cyan/20'}`}
                >
                  MODERN_MINIMAL
                </button>
              </div>
            </header>

            {/* Stepper Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold font-mono tracking-widest text-accent-purple uppercase border-b border-surface pb-2">01_Personal_Identity</h2>
                  <FormInput label="Full Name" {...register("personalInfo.fullName")} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Email" {...register("personalInfo.email")} />
                    <FormInput label="Phone" {...register("personalInfo.phone")} />
                  </div>
                  <FormInput label="Location" {...register("personalInfo.location")} />
                  <FormInput label="Professional Title" {...register("personalInfo.title")} />
                  <FormTextarea label="Professional Summary" {...register("personalInfo.summary")} />
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
                      <FormTextarea label="Key Contributions" {...register(`experience.${index}.description`)} />
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

              <div className="flex justify-between pt-8 border-t border-surface">
                <button
                  disabled={step === 1}
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-text-secondary hover:text-text-primary disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> BACK_SEQUENCE
                </button>
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-accent-cyan hover:underline"
                  >
                    NEXT_MODULE <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase bg-accent-cyan text-black px-6 py-2 hover:bg-accent-cyan/90"
                  >
                    <Printer size={14} /> INITIALIZE_PRINT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="bg-[#111111] p-12 flex justify-center overflow-y-auto custom-scrollbar print:p-0 print:bg-white print:block">
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl origin-top transition-transform duration-500 print:shadow-none print:m-0 print:w-full print:scale-100">
            <div className="h-full text-black bg-white">
              {template === 'ATS' ? (
                <ATSPreview data={watchedData} />
              ) : (
                <ModernPreview data={watchedData} />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\:hidden { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; }
          nav { display: none !important; }
          @page { size: A4; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
      `}</style>
    </ProtectedRoute>
  );
}

// --- Preview Templates ---

function ATSPreview({ data }: { data: CVData }) {
  return (
    <div className="p-[15mm] font-serif space-y-6 text-[10.5pt] leading-snug">
      <div className="text-center border-b-[1.5pt] border-black pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-tight">{data.personalInfo.fullName}</h1>
        <div className="text-[9pt] mt-2 flex justify-center gap-3">
          <span>{data.personalInfo.location}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span className="underline">{data.personalInfo.email}</span>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black">Summary</h2>
        <p className="text-justify">{data.personalInfo.summary}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black">Work Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between font-bold">
                <span>{exp.title}</span>
                <span>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div className="flex justify-between italic text-[9.5pt]">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <p className="mt-1 whitespace-pre-line text-justify">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black">Technical Skills</h2>
        <p><strong>Expertise:</strong> {data.skills.map(s => s.name).join(', ')}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="flex justify-between">
            <div>
              <span className="font-bold">{edu.school}</span>, {edu.degree}
            </div>
            <span>{edu.year}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

function ModernPreview({ data }: { data: CVData }) {
  const accentColor = "#0E7490"; // Deep Cyan for print

  return (
    <div className="font-sans flex h-full min-h-[297mm]">
      {/* Sidebar */}
      <div className="w-[30%] bg-[#F3F4F6] p-8 flex flex-col gap-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-white rounded-full mx-auto border-4 border-white shadow-sm flex items-center justify-center text-gray-300">
             <LayoutIcon size={40} />
          </div>
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
               <div className="break-all">{data.personalInfo.email}</div>
            </div>
            <div className="space-y-0.5">
               <div className="font-bold text-[7pt] text-gray-400 uppercase">Phone</div>
               <div>{data.personalInfo.phone}</div>
            </div>
            <div className="space-y-0.5">
               <div className="font-bold text-[7pt] text-gray-400 uppercase">Location</div>
               <div>{data.personalInfo.location}</div>
            </div>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 space-y-10">
        <section className="space-y-3">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: accentColor }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            Executive_Summary
          </h2>
          <p className="text-[9.5pt] leading-relaxed text-gray-700">{data.personalInfo.summary}</p>
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
                <p className="text-[9.5pt] text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
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
