"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { CVData } from "@/types";
import { Layout as LayoutIcon, Printer, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const DEFAULT_DATA: CVData = {
  personalInfo: {
    fullName: "Alex Rivera",
    email: "alex.rivera@sys-architect.io",
    phone: "+61 400 000 000",
    location: "Sydney, Australia",
    title: "Senior Systems Architect",
    summary: "Strategic engineer specialized in low-latency infrastructure and high-frequency trading systems.",
  },
  experience: [
    {
      title: "Senior Systems Architect",
      company: "Nexus Quant Lab",
      location: "Sydney",
      startDate: "2022",
      endDate: "Present",
      description: "Designed ultra-low latency execution engines using Rust and C++. Managed a distributed network of 50+ VPS nodes."
    }
  ],
  education: [
    {
      degree: "B.Sc. Computer Science",
      school: "University of Technology",
      year: "2018"
    }
  ],
  skills: [
    { name: "Python / Rust", level: 95 },
    { name: "MT5 / MQL5", level: 90 },
    { name: "MikroTik Networking", level: 85 }
  ]
};

export default function CVBuilderPage() {
  const [template, setTemplate] = useState<'ATS' | 'MODERN'>('MODERN');
  const [step, setStep] = useState(1);
  const { register, control, watch } = useForm<CVData>({
    defaultValues: DEFAULT_DATA
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });

  const watchedData = watch();

  const handleDownload = () => {
    window.print();
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-8rem)] print:block print:p-0">

        {/* Left Column: Form (Hidden on Print) */}
        <div className="space-y-6 print:hidden">
          <div className="flex justify-between items-center bg-surface/30 p-4 rounded-xl border border-surface">
            <div>
              <h1 className="text-xl font-bold font-mono tracking-tight text-accent-cyan">CV_CONSTRUCTOR_v1.0</h1>
              <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mt-1">Multi-step data input for optimized resumes</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTemplate(template === 'ATS' ? 'MODERN' : 'ATS')}
                className="p-2 glass hover:bg-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 font-mono text-[10px] font-bold"
              >
                <LayoutIcon size={14} />
                SWITCH_TEMPLATE: {template}
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-accent-cyan hover:bg-accent-cyan/90 rounded-lg text-black transition-colors flex items-center gap-2 font-mono text-[10px] font-bold"
              >
                <Printer size={14} />
                GENERATE_PDF
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl space-y-8">
            {/* Step Indicators */}
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface -translate-y-1/2 z-0" />
              {[1, 2, 3, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={`w-8 h-8 rounded-full z-10 font-mono text-xs font-bold transition-all ${
                    step >= s ? 'bg-accent-cyan text-black shadow-[0_0_10px_rgba(0,242,255,0.4)]' : 'bg-surface text-text-secondary'
                  }`}
                >
                  0{s}
                </button>
              ))}
            </div>

            {/* Step Forms */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h2 className="font-mono text-xs font-bold uppercase text-accent-cyan">01 // Personal_Identification</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Full Name" {...register("personalInfo.fullName")} />
                  <FormInput label="Job Title" {...register("personalInfo.title")} />
                  <FormInput label="Email" {...register("personalInfo.email")} />
                  <FormInput label="Phone" {...register("personalInfo.phone")} />
                  <FormInput label="Location" {...register("personalInfo.location")} />
                </div>
                <FormTextarea label="Professional Summary" {...register("personalInfo.summary")} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-mono text-xs font-bold uppercase text-accent-cyan">02 // Professional_Engagement</h2>
                  <button onClick={() => appendExp({ title: "", company: "", location: "", startDate: "", endDate: "", description: "" })} className="text-accent-cyan font-mono text-[10px] font-bold hover:underline tracking-widest">+ ADD_EXP</button>
                </div>
                {expFields.map((field, index) => (
                  <div key={field.id} className="p-4 bg-black/20 rounded-xl border border-surface space-y-4 relative group">
                    <button onClick={() => removeExp(index)} className="absolute top-2 right-2 p-1 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput label="Title" {...register(`experience.${index}.title`)} />
                      <FormInput label="Company" {...register(`experience.${index}.company`)} />
                      <FormInput label="Start" {...register(`experience.${index}.startDate`)} />
                      <FormInput label="End" {...register(`experience.${index}.endDate`)} />
                    </div>
                    <FormTextarea label="Description" {...register(`experience.${index}.description`)} />
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-mono text-xs font-bold uppercase text-accent-cyan">03 // Educational_History</h2>
                  <button onClick={() => appendEdu({ degree: "", school: "", year: "" })} className="text-accent-cyan font-mono text-[10px] font-bold hover:underline tracking-widest">+ ADD_EDU</button>
                </div>
                {eduFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 p-4 bg-black/20 rounded-xl border border-surface relative group">
                    <button onClick={() => removeEdu(index)} className="absolute top-1 right-1 p-1 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12}/></button>
                    <FormInput label="Degree" {...register(`education.${index}.degree`)} />
                    <FormInput label="School" {...register(`education.${index}.school`)} />
                    <FormInput label="Year" {...register(`education.${index}.year`)} />
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-mono text-xs font-bold uppercase text-accent-cyan">04 // Technical_Skills_Matrix</h2>
                  <button onClick={() => appendSkill({ name: "", level: 80 })} className="text-accent-cyan font-mono text-[10px] font-bold hover:underline tracking-widest">+ ADD_SKILL</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end p-4 bg-black/20 rounded-xl border border-surface relative group">
                      <div className="flex-1">
                        <FormInput label="Skill Name" {...register(`skills.${index}.name`)} />
                      </div>
                      <div className="w-32">
                        <FormInput label="Level (%)" type="number" {...register(`skills.${index}.level`, { valueAsNumber: true })} />
                      </div>
                      <button onClick={() => removeSkill(index)} className="p-2 text-text-secondary hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-surface">
              <button
                disabled={step === 1}
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-text-secondary hover:text-text-primary disabled:opacity-30"
              >
                <ChevronLeft size={14} /> BACK
              </button>
              <button
                disabled={step === 4}
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-accent-cyan hover:underline disabled:opacity-30"
              >
                NEXT_STEP <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="bg-white rounded-lg min-h-[1050px] overflow-hidden shadow-2xl print:shadow-none print:m-0 print:rounded-none h-fit">
          <div className="p-[40px] h-full text-black bg-white">
            {template === 'ATS' ? (
              <ATSPreview data={watchedData} />
            ) : (
              <ModernPreview data={watchedData} />
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\:hidden { display: none !important; }
          main { padding-top: 0 !important; }
          nav { display: none !important; }
          @page { size: A4; margin: 0; }
          .print\:m-0 { margin: 0 !important; }
        }
      `}</style>
    </ProtectedRoute>
  );
}

// --- Preview Templates ---

function ATSPreview({ data }: { data: CVData }) {
  return (
    <div className="font-serif space-y-6 text-[11pt] leading-snug">
      <div className="text-center border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{data.personalInfo.fullName}</h1>
        <div className="text-sm mt-1">
          {data.personalInfo.location} | {data.personalInfo.phone} | {data.personalInfo.email}
        </div>
      </div>

      <section>
        <h2 className="text-base font-bold uppercase border-b border-black mb-2">Professional Summary</h2>
        <p>{data.personalInfo.summary}</p>
      </section>

      <section>
        <h2 className="text-base font-bold uppercase border-b border-black mb-2">Work Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between font-bold">
                <span>{exp.title} | {exp.company}</span>
                <span>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div className="italic text-sm">{exp.location}</div>
              <p className="mt-1 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold uppercase border-b border-black mb-2">Technical Skills</h2>
        <p>{data.skills.map(s => s.name).join(', ')}</p>
      </section>

      <section>
        <h2 className="text-base font-bold uppercase border-b border-black mb-2">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="flex justify-between">
            <span>{edu.degree}, {edu.school}</span>
            <span>{edu.year}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

function ModernPreview({ data }: { data: CVData }) {
  return (
    <div className="font-sans flex gap-8 h-full">
      {/* Sidebar */}
      <div className="w-[240px] bg-[#f8f9fa] -m-[40px] p-[40px] pt-[60px] flex flex-col gap-8 h-auto min-h-full">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 bg-[#e9ecef] rounded-full border-4 border-white flex items-center justify-center text-[#adb5bd]">
             <LayoutIcon size={40} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">{data.personalInfo.fullName}</h1>
            <p className="text-xs text-[#00F2FF] font-bold uppercase tracking-wider mt-1">{data.personalInfo.title}</p>
          </div>
        </div>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#adb5bd] mb-4">Contact</h2>
          <div className="text-[9pt] space-y-2">
            <p className="flex flex-col"><strong>EMAIL</strong> {data.personalInfo.email}</p>
            <p className="flex flex-col"><strong>PHONE</strong> {data.personalInfo.phone}</p>
            <p className="flex flex-col"><strong>LOCATION</strong> {data.personalInfo.location}</p>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#adb5bd] mb-4">Core Skills</h2>
          <div className="space-y-4">
            {data.skills.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[8pt] font-bold">
                  <span>{s.name}</span>
                  <span>{s.level}%</span>
                </div>
                <div className="h-1 w-full bg-[#dee2e6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8A2BE2]" style={{ width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8 pt-4">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00F2FF] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F2FF]" />
            About Me
          </h2>
          <p className="text-[10pt] leading-relaxed text-[#495057]">{data.personalInfo.summary}</p>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00F2FF] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F2FF]" />
            Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l border-[#dee2e6]">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#adb5bd]" />
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[11pt]">{exp.title}</h3>
                  <span className="text-[9pt] font-bold text-[#adb5bd]">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-[9pt] font-bold text-[#8A2BE2] mb-2">{exp.company}</div>
                <p className="text-[10pt] text-[#495057] whitespace-pre-line leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00F2FF] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F2FF]" />
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <h3 className="font-bold text-[10pt]">{edu.degree}</h3>
                  <p className="text-[9pt] text-[#495057]">{edu.school}</p>
                </div>
                <span className="text-[9pt] font-bold text-[#adb5bd]">{edu.year}</span>
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
    <label className="block font-mono text-[10px] text-text-secondary uppercase">{label}</label>
    <input
      ref={ref}
      className="w-full bg-surface border border-surface rounded-lg py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none"
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
    <label className="block font-mono text-[10px] text-text-secondary uppercase">{label}</label>
    <textarea
      ref={ref}
      rows={3}
      className="w-full bg-surface border border-surface rounded-lg py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none resize-none"
      {...props}
    />
  </div>
));
FormTextarea.displayName = "FormTextarea";
