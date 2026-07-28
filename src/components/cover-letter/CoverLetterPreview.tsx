import React from 'react';

export interface CoverLetterData {
  senderInfo: {
    fullName: string;
    location: string;
    phone: string;
    email: string;
  };
  recipientInfo: {
    date: string;
    contactPerson: string;
    company: string;
    location: string;
    subject: string;
  };
  body: string;
}

const DEFAULT_DRAFT = `I am writing to express my strong interest in the **Regional Telecommunications Specialist** position at **Fire and Emergency New Zealand (FENZ)**. With a decade of experience ensuring the high availability of mission-critical communication networks in high-risk, demanding operational environments, I am highly motivated to bring my technical expertise to support FENZ’s vital emergency response infrastructure. Although currently based in Indonesia, I am fully committed and prepared to relocate to New Zealand for this opportunity.

Throughout my career, particularly in my current role as a Field FMS Technician, I have developed extensive hands-on expertise with UHF/VHF radio networks. I am highly proficient in configuring, programming, and maintaining TAIT mobile and portable radio fleets, including the TP8100, TP9300, TM8235, and TM9300 series. I have successfully managed dual-network architectures, utilizing both Trunked and Conventional modes to ensure seamless coverage across complex operational zones. My daily responsibilities involve the end-to-end installation and rapid troubleshooting of repeater systems on BTS towers, guaranteeing **zero-downtime network reliability** in extreme conditions—a skillset I believe aligns perfectly with the critical nature of emergency communications at FENZ.

Beyond hardware infrastructure, I also possess a strong background in data-driven maintenance planning. In my previous role as a Planner Maintenance, I successfully managed the scheduling of preventive services and corrective repairs, significantly minimizing equipment downtime. Furthermore, my proficiency in modern database architectures and systems monitoring allows me to not only maintain hardware but also optimize network stability and field coordination through structured tracking systems.

I am drawn to FENZ because of the critical importance of reliable communication in emergency services. I am confident that my technical proficiency with TAIT systems, combined with my dedication to operational safety and system reliability, will make me a valuable asset to your telecommunications team.

Thank you for considering my application. I have attached my resume detailing my technical background, and I would welcome the opportunity to discuss how my 10 years of field experience can contribute to the success of FENZ’s mission. I look forward to hearing from you.`;

const DEFAULT_DATA: CoverLetterData = {
  senderInfo: {
    fullName: "Arwan",
    location: "Indonesia",
    phone: "+62 85240135915",
    email: "arwanarwan12@gmail.com",
  },
  recipientInfo: {
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    contactPerson: "Hiring Manager",
    company: "Fire and Emergency New Zealand (FENZ)",
    location: "New Zealand",
    subject: "Application for Regional Telecommunications Specialist",
  },
  body: DEFAULT_DRAFT,
};

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

function ATSPreview({ data }: { data: CoverLetterData }) {
  return (
    <main className="cv-print-container p-[20mm] print:p-0 space-y-8 text-[11pt] leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <header className="cv-print-block text-center border-b-[1.5pt] border-black pb-6" style={{ display: 'block' }}>
        <h1 className="text-3xl font-bold uppercase tracking-tight">{data.senderInfo.fullName}</h1>
        <div className="text-[10pt] mt-3 flex justify-center gap-3">
          <span>{data.senderInfo.location}</span>
          <span>•</span>
          <span>{data.senderInfo.phone}</span>
          <span>•</span>
          <span className="underline">{data.senderInfo.email}</span>
        </div>
      </header>

      <section className="cv-print-block space-y-4">
        <div>{data.recipientInfo.date}</div>
        <div>
          <div>{data.recipientInfo.contactPerson}</div>
          <div>{data.recipientInfo.company}</div>
          <div>{data.recipientInfo.location}</div>
        </div>
        {data.recipientInfo.subject && (
          <div className="font-bold">Re: {data.recipientInfo.subject}</div>
        )}
      </section>

      <section className="space-y-4 text-justify">
        <div className="cv-print-block">Dear {data.recipientInfo.contactPerson},</div>
        <div className="whitespace-pre-line">{formatText(data.body)}</div>
        <div className="cv-print-block pt-6 space-y-2">
           <div>Sincerely,</div>
           <div className="font-bold">{data.senderInfo.fullName}</div>
        </div>
      </section>
    </main>
  );
}

function ATSPreviewID({ data }: { data: CoverLetterData }) {
  return (
    <main className="cv-print-container p-[20mm] print:p-0 space-y-8 text-[11pt] leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <header className="cv-print-block text-center border-b-[1.5pt] border-black pb-6" style={{ display: 'block' }}>
        <h1 className="text-3xl font-bold uppercase tracking-tight">{data.senderInfo.fullName}</h1>
        <div className="text-[10pt] mt-3 flex justify-center gap-3">
          <span>{data.senderInfo.location}</span>
          <span>•</span>
          <span>{data.senderInfo.phone}</span>
          <span>•</span>
          <span className="underline">{data.senderInfo.email}</span>
        </div>
      </header>

      <section className="cv-print-block space-y-4">
        <div>{data.recipientInfo.date}</div>
        <div>
          <div>Yth. {data.recipientInfo.contactPerson}</div>
          <div>{data.recipientInfo.company}</div>
          <div>{data.recipientInfo.location}</div>
        </div>
        {data.recipientInfo.subject && (
          <div className="font-bold">Hal: {data.recipientInfo.subject}</div>
        )}
      </section>

      <section className="space-y-4 text-justify">
        <div className="cv-print-block">Dengan hormat,</div>
        <div className="whitespace-pre-line">{formatText(data.body)}</div>
        <div className="cv-print-block pt-6 space-y-2">
           <div>Hormat saya,</div>
           <div className="font-bold">{data.senderInfo.fullName}</div>
        </div>
      </section>
    </main>
  );
}

function ModernPreview({ data }: { data: CoverLetterData }) {
  const accentColor = "#0E7490"; // Deep Cyan
  return (
    <main className="cv-print-container flex h-full min-h-[297mm] font-sans">
      <div className="w-[30%] bg-[#F3F4F6] p-8 flex flex-col gap-8">
        <div className="space-y-4 pt-10">
          <h1 className="text-2xl font-bold leading-tight uppercase tracking-tighter text-gray-900">{data.senderInfo.fullName}</h1>
          <div className="w-10 h-1" style={{ backgroundColor: accentColor }}></div>
        </div>
        <section className="space-y-4">
          <h2 className="text-[9pt] font-bold uppercase tracking-widest border-b border-gray-300 pb-1 text-gray-800">Contact Info</h2>
          <div className="text-[8.5pt] space-y-3 text-gray-700">
            <div>
               <div className="font-bold text-[7pt] text-gray-500 uppercase">Email</div>
               <div className="break-words">{data.senderInfo.email}</div>
            </div>
            <div>
               <div className="font-bold text-[7pt] text-gray-500 uppercase">Phone</div>
               <div>{data.senderInfo.phone}</div>
            </div>
            <div>
               <div className="font-bold text-[7pt] text-gray-500 uppercase">Location</div>
               <div>{data.senderInfo.location}</div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex-1 p-12 space-y-8 bg-white">
        <section className="cv-print-block space-y-4 text-[10.5pt] text-gray-800">
          <div className="font-bold text-gray-500">{data.recipientInfo.date}</div>
          <div className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
            <div className="font-bold">{data.recipientInfo.contactPerson}</div>
            <div className="font-bold">{data.recipientInfo.company}</div>
            <div className="text-gray-500">{data.recipientInfo.location}</div>
          </div>
          {data.recipientInfo.subject && (
            <div className="font-bold pt-4 text-gray-900">Re: {data.recipientInfo.subject}</div>
          )}
        </section>

        <section className="space-y-4 text-justify text-[10.5pt] text-gray-700 leading-relaxed">
          <div className="cv-print-block text-gray-900 font-medium">Dear {data.recipientInfo.contactPerson},</div>
          <div className="whitespace-pre-line">{formatText(data.body)}</div>
          <div className="cv-print-block pt-10 space-y-2">
             <div className="text-gray-900">Sincerely,</div>
             <div className="font-bold text-xl mt-4" style={{ color: accentColor, fontFamily: 'cursive' }}>{data.senderInfo.fullName}</div>
             <div className="font-bold text-gray-900">{data.senderInfo.fullName}</div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ModernPreviewID({ data }: { data: CoverLetterData }) {
  const accentColor = "#0E7490"; // Deep Cyan
  return (
    <main className="cv-print-container flex h-full min-h-[297mm] font-sans">
      <div className="w-[30%] bg-[#F3F4F6] p-8 flex flex-col gap-8">
        <div className="space-y-4 pt-10">
          <h1 className="text-2xl font-bold leading-tight uppercase tracking-tighter text-gray-900">{data.senderInfo.fullName}</h1>
          <div className="w-10 h-1" style={{ backgroundColor: accentColor }}></div>
        </div>
        <section className="space-y-4">
          <h2 className="text-[9pt] font-bold uppercase tracking-widest border-b border-gray-300 pb-1 text-gray-800">Kontak</h2>
          <div className="text-[8.5pt] space-y-3 text-gray-700">
            <div>
               <div className="font-bold text-[7pt] text-gray-500 uppercase">Email</div>
               <div className="break-words">{data.senderInfo.email}</div>
            </div>
            <div>
               <div className="font-bold text-[7pt] text-gray-500 uppercase">Telepon</div>
               <div>{data.senderInfo.phone}</div>
            </div>
            <div>
               <div className="font-bold text-[7pt] text-gray-500 uppercase">Lokasi</div>
               <div>{data.senderInfo.location}</div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex-1 p-12 space-y-8 bg-white">
        <section className="cv-print-block space-y-4 text-[10.5pt] text-gray-800">
          <div className="font-bold text-gray-500">{data.recipientInfo.date}</div>
          <div className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
            <div className="font-bold">Yth. {data.recipientInfo.contactPerson}</div>
            <div className="font-bold">{data.recipientInfo.company}</div>
            <div className="text-gray-500">{data.recipientInfo.location}</div>
          </div>
          {data.recipientInfo.subject && (
            <div className="font-bold pt-4 text-gray-900">Hal: {data.recipientInfo.subject}</div>
          )}
        </section>

        <section className="space-y-4 text-justify text-[10.5pt] text-gray-700 leading-relaxed">
          <div className="cv-print-block text-gray-900 font-medium">Dengan hormat,</div>
          <div className="whitespace-pre-line">{formatText(data.body)}</div>
          <div className="cv-print-block pt-10 space-y-2">
             <div className="text-gray-900">Hormat saya,</div>
             <div className="font-bold text-xl mt-4" style={{ color: accentColor, fontFamily: 'cursive' }}>{data.senderInfo.fullName}</div>
             <div className="font-bold text-gray-900">{data.senderInfo.fullName}</div>
          </div>
        </section>
      </div>
    </main>
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

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(({ label, className, ...props }, ref) => (
  <div className="space-y-1.5">
    <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">{label}</label>
    <textarea
      ref={ref}
      rows={8}
      className={`w-full bg-surface border border-surface rounded-none py-2.5 px-4 text-sm focus:border-accent-cyan/50 outline-none resize-none transition-colors ${className}`}
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

export { DEFAULT_DATA, formatText, ATSPreview, ATSPreviewID, ModernPreview, ModernPreviewID, FormInput, FormTextarea, FormattingHint };
