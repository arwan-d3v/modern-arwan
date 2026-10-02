import React from 'react';
import { Layout as LayoutIcon, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { CVData } from '@/types';

export type CVTheme = 'minimalist_mono' | 'executive_blue' | 'emerald_tech' | 'cyber_purple';

export const THEME_COLORS: Record<CVTheme, { primary: string; secondary: string; bg: string }> = {
  minimalist_mono: { primary: 'text-black', secondary: 'text-gray-600', bg: 'bg-gray-100' },
  executive_blue: { primary: 'text-[#1e3a8a]', secondary: 'text-slate-600', bg: 'bg-slate-50' },
  emerald_tech: { primary: 'text-[#064e3b]', secondary: 'text-zinc-600', bg: 'bg-zinc-50' },
  cyber_purple: { primary: 'text-[#4c1d95]', secondary: 'text-indigo-600', bg: 'bg-indigo-50' }
};

export interface BasePreviewProps {
  data: CVData;
  theme?: CVTheme;
}

const DEFAULT_DATA_ATS: CVData = {
  personalInfo: {
    fullName: "ARWAN",
    email: "arwanarwan12@gmail.com",
    phone: "+62 852 4013 5915",
    location: "East Kutai, Indonesia 75683",
    title: "Field Network & FMS Technician",
    summary: "Field Professional with about 10 years of intensive experience in extreme mining environments. Unique hybrid background bridging heavy machinery mechanics (Vocational Grad, 2015) and advanced Information Technology (B.Sc. IT, 2022-2026). Expert in designing, deploying, and troubleshooting wired and wireless communication networks, including isolated WAN and LTE topologies for Fleet Management systems. Highly trained in strict mining safety procedures (LOTO, Working at Heights, Full Pit Access Holding Permit), ensuring minimum-downtime remote and onsite support during critical project rollouts.",
    photoShape: 'square',
  },
  experience: [
    {
      title: "Field Network & FMS Technician",
      company: "PT. MULTI KONTROL NUSANTARA",
      location: "Sangatta, Indonesia",
      startDate: "01/2024",
      endDate: "Present",
      description: "• **Installation** efficiently on repeater BTS/TBTS two-way radios, backbone link, CCTV, and dispatch FMS units on heavy equipment according to specifications, ensuring proper wiring, connections, and testing post-installation for optimal functionality.\n• **Preventive Maintenance** checks to identify and address potential issues proactively, performing regular inspections and cleaning of equipment components to maintain peak performance.\n• **Troubleshooting and Repair** techniques and diagnostic tools to identify and resolve technical problems promptly, executing repairs efficiently by replacing faulty components and making necessary adjustments.\n• **Customer Support** to provide timely technical support and assistance to customers, addressing inquiries and resolving issues courteously, while offering guidance and training on equipment usage and maintenance to maximize customer satisfaction."
    },
    {
      title: "IT Support Engineer",
      company: "PT. BUDHI WIGUNA PRIMA",
      location: "Sangatta, Indonesia",
      startDate: "08/2020",
      endDate: "12/2023",
      description: "• **Technical Support** providing technical assistance to end-users for hardware, software, and network-related issues. Troubleshooting problems and resolving them in a timely manner.\n• **Hardware and Software Maintenance** Installing, configuring, and maintaining computer hardware and software. Performing routine maintenance tasks, such as updates and patches.\n• **Network Support** assisting with the setup and maintenance of the company's network infrastructure. Developed and implemented extensive LAN designs to connect up to 25+ users on network.\n• **Monitoring** system performance and addressing any issues to ensure optimal functionality. Implementing monitoring tools to identify potential problems proactively.\n• **CCTV Maintenance** Built and maintained strong working relationships with other CCTV Technicians, supporting each other with more complex repairs."
    },
    {
      title: "Maintenance Planner",
      company: "PT. BUDHI WIGUNA PRIMA",
      location: "Sangatta, Indonesia",
      startDate: "08/2018",
      endDate: "Present",
      description: "• **Delivered continuous improvement** strategies, process optimization approaches, and operational engineering support to the management team.\n• **Standardized processes** for installing, commissioning, and maintaining industrial equipment.\n• **Planned and organized** repairs for faulty production equipment repairs, independently fixing minor problems.\n• **Coordinated** delivery schedules and labor plans to set up plant equipment.\n• **Prepared reports** detailing data analysis and prospective solutions, benefits and costs."
    },
    {
      title: "Mechanical Technician",
      company: "PT. THIESS CONTRACTOR INDONESIA",
      location: "Sangatta, Indonesia",
      startDate: "10/2017",
      endDate: "04/2018",
      description: "• **Regular maintenance and inspections** on excavators, small diggers, dewatering pump sets, and rotary drilling equipment.\n• **Diagnosed and troubleshot** mechanical issues with the equipment, performing repairs and replacements of faulty components.\n• **Scheduled servicing plans** for each type of equipment, changing fluids and filters as part of routine servicing."
    },
    {
      title: "Electricity Generation Plant Operator",
      company: "PT. SUMBERDAYA SEWATAMA",
      location: "Sangatta, Indonesia",
      startDate: "06/2015",
      endDate: "10/2017",
      description: "• **Read engineering drawings and diagrams** to understand equipment's power requirements.\n• **Monitored plant operations** by taking readings from charts, meters, and gauges at predetermined intervals.\n• **Distributed electrical power** from production plants over electrical grids to electricity distribution stations.\n• **Performed pre-start checks** to identify mechanical and safety issues, executing fixes to resolve identified problems."
    }
  ],
  education: [
    {
      degree: "B.Sc. Information Technology",
      school: "Cyber Asia University South Jakarta",
      year: "Jun, 2026",
    },
    {
      degree: "Vocational High School - Heavy Equipment",
      school: "SMK Muh 1 Sangatta Utara, Indonesia",
      year: "May, 2015",
    }
  ],
  skills: [
    { name: "Field Network Installations & Hardware", level: 95 },
    { name: "FMS Integration & Maintenance", level: 95 },
    { name: "Software Dev & Network Automation (Python, Flask, React)", level: 85 },
    { name: "MS Office Suite & Visio", level: 90 },
    { name: "CISCO Packet Tracer & Wireshark", level: 90 },
    { name: "HSE & Working at Heights", level: 100 },
  ],
  projects: [
    { title: "Mastercard Cybersecurity Job Simulation", description: "Actively participated in a comprehensive job simulation focused on cybersecurity. Key highlights include engagement in real-world scenarios, incident response, implementation of security protocols, collaborative teamwork, and showcasing adaptability in diverse cybersecurity challenges.", techStack: "Incident Response, Network Security" },
    { title: "Dynamic Online Resume Platform", description: "Developed a dynamic online resume platform, leveraging programming languages to enhance user experience and showcase digitalization technology skills.", techStack: "HTML, CSS, JavaScript, Python" },
    { title: "KRX Monitoring & Automation Dashboard", description: "Engineered a decentralized, real-time telemetry and automation dashboard featuring seamless Firebase Cloud synchronization. Built complex data pipelines to visualize live metrics, active system nodes, and automated processes, demonstrating high-level system integration capabilities.", link: "krx-dgc.vercel.app", techStack: "React, Python, MQL5 (C++), Firebase" },
    { title: "Dynamic CV & Portfolio CMS", description: "Developed and deployed a custom Content Management System (CMS) for dynamic resume generation.", link: "is-arwan.vercel.app", techStack: "React, Node.js, Firebase" },
    { title: "KosKosanKu - Property Management & Booking Platform", description: "Developed and deployed a full-stack web application featuring user authentication, geolocation-based routing, and transaction management.", link: "koskosanku.vercel.app", techStack: "React, Node.js, Cloud Supabase" }
  ],
  certifications: [
    { name: "Fundamentals Network Computer", issuer: "ID-Networkers", year: "Oct, 2023", link: "https://www.idn.id/" },
    { name: "Introduction to Information Security Course", issuer: "CYBER ACADEMY", year: "Oct, 2023", link: "https://www.cyberacademy.id/" },
    { name: "Certified Of Fundamental Cyber Security", issuer: "CODING STUDIO", year: "2023" },
    { name: "Primavera P6 Professional Project Management", issuer: "Oracle Academy", year: "Feb, 2025", link: "https://academy.oracle.com/" },
    { name: "Basic Radio Awareness", issuer: "Tait Radio Academy", year: "Sept, 2025", link: "https://www.taitradioacademy.com/" },
    { name: "Rajant Kinetic Mesh", issuer: "Rajant x PT. Multi Kontrol Nusantara", year: "Jul, 2025", link: "https://rajant.com/" }
  ],
  languages: [
    { name: "Indonesian", proficiency: "Native" },
    { name: "English", proficiency: "CEFR B1 - B2" }
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

      <section className="cv-print-block space-y-2 print:break-inside-avoid">
        <h2 className="text-[11pt] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">Summary</h2>
        <p className="text-justify">{formatText(data.personalInfo.summary)}</p>
      </section>

      <section className="space-y-3 print:break-inside-avoid print:break-before-auto">
        <h2 className="text-[11pt] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">Work Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <article key={i} className="cv-print-block experience-item print:break-inside-avoid">
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

      <section className="cv-print-block space-y-2 print:break-inside-avoid">
        <h2 className="text-[11pt] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">Technical Skills</h2>
        <ul className="list-none p-0 m-0">
          <li><strong>Expertise:</strong> {data.skills.map(s => s.name).join(', ')}</li>
        </ul>
      </section>

      <section className="space-y-2 print:break-inside-avoid print:break-before-auto">
        <h2 className="text-[11pt] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">Education</h2>
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
        <section className="space-y-3 print:break-inside-avoid print:break-before-auto">
          <h2 className="text-[11pt] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">Projects & Portfolio</h2>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <article key={i} className="cv-print-block experience-item print:break-inside-avoid">
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
        <section className="space-y-2 print:break-inside-avoid print:break-before-auto">
          <h2 className="text-[11pt] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">Certifications</h2>
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
        <section className="cv-print-block space-y-2 print:break-inside-avoid">
          <h2 className="text-[11pt] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">Languages</h2>
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
export { DEFAULT_DATA_ATS, DEFAULT_DATA_MODERN, DEFAULT_DATA_INDONESIAN, formatText, ATSPreview, ModernPreview, IndonesianPreview };
