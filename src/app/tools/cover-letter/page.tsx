"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  MonitorOff,
  Mail,
  History,
  X,
  Trash2
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { CoverLetterData, DEFAULT_DATA, ATSPreview, FormInput, FormTextarea, FormattingHint } from "@/components/cover-letter/CoverLetterPreview";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import { useToast } from "@/context/ToastContext";

interface CLHistoryItem {
  id: string;
  date: string;
  title: string;
  data: CoverLetterData;
}


export default function CoverLetterPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [history, setHistory] = useState<CLHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const saved = localStorage.getItem('cl_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { register, watch, reset } = useForm<CoverLetterData>({
    defaultValues: DEFAULT_DATA,
  });

  const watchedData = watch();

  const handlePrint = async () => {
    const newItem: CLHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      title: watchedData.recipientInfo.company || watchedData.recipientInfo.contactPerson || "Untitled Cover Letter",
      data: watchedData
    };
    const updatedHistory = [newItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('cl_history', JSON.stringify(updatedHistory));
    
    if (user) {
      try {
        const draftRef = doc(collection(db, `users/${user.uid}/cl_drafts`), newItem.id);
        await setDoc(draftRef, newItem);
        toast.success('CLOUD_SYNC', 'Cover Letter saved securely to the Vault.');
      } catch (e) {
        console.error('Save error', e);
      }
    }
    
    setTimeout(() => {
      window.print();
    }, 500);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <FadeIn className="max-w-md space-y-6">
          <MonitorOff size={64} className="mx-auto text-accent-cyan opacity-20" />
          <h1 className="text-2xl font-bold tracking-tighter uppercase">MOBILE_INTERFACE_LOCKED</h1>
          <p className="text-text-secondary font-mono text-sm leading-relaxed">
            The <span className="text-accent-cyan font-bold">CL_CONSTRUCTOR</span> requires a high-resolution canvas for real-time rendering.
            Please access this module via a Desktop terminal.
          </p>
          <div className="flex flex-col gap-4 pt-4">
             <Link href="/" className="glass px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:text-accent-cyan">
                RETURN_TO_BASE
             </Link>
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
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-accent-cyan tracking-[0.2em] uppercase">
                    <Mail size={14} /> CL_CONSTRUCTOR_V1.0
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter uppercase mt-2">Generate_Cover_Letter</h1>
                </div>
                <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase border border-surface bg-surface text-text-secondary px-4 py-2 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors">
                   <History size={14} /> PROJECT_VAULT
                </button>
              </div>
            </header>

            {/* Stepper Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold font-mono tracking-widest text-accent-purple uppercase border-b border-surface pb-2">01_Sender_Identity</h2>
                  <FormInput label="Full Name" {...register("senderInfo.fullName")} />
                  <div className="grid grid-cols-2 gap-4">
                     <FormInput label="Location" {...register("senderInfo.location")} />
                     <FormInput label="Phone" {...register("senderInfo.phone")} />
                  </div>
                  <FormInput label="Email" {...register("senderInfo.email")} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold font-mono tracking-widest text-accent-purple uppercase border-b border-surface pb-2">02_Recipient_Data</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Date" {...register("recipientInfo.date")} />
                    <FormInput label="Contact Person / Title" {...register("recipientInfo.contactPerson")} />
                  </div>
                  <FormInput label="Company" {...register("recipientInfo.company")} />
                  <FormInput label="Company Location" {...register("recipientInfo.location")} />
                  <FormInput label="Subject / Re:" {...register("recipientInfo.subject")} />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold font-mono tracking-widest text-accent-purple uppercase border-b border-surface pb-2">03_Message_Body</h2>
                  <div>
                    <FormTextarea label="Cover Letter Content" className="min-h-[300px]" {...register("body")} />
                    <FormattingHint />
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
                {step < 3 ? (
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
               <ATSPreview data={watchedData} />
            </div>
          </div>
        </div>
      </div>

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
                           localStorage.setItem('cl_history', JSON.stringify(newHistory));
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
            /* Removes the Tailwind p-[15mm] padding during print to prevent double-margins */
            padding: 0 !important;
            
            /* Compresses content slightly if it exceeds one page */
            zoom: 0.95;
            transform: scale(0.97);
            transform-origin: top left;
            font-size: 11pt !important;
            line-height: 1.4 !important;
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
