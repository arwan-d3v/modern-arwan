import { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for IS_ARWAN.DEV — How we handle your data.",
};

const LAST_UPDATED = "July 28, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-accent-cyan transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-accent-cyan" />
            <span className="font-mono text-[10px] text-accent-cyan tracking-[0.3em] uppercase">
              [LEGAL_DOCUMENT]
            </span>
          </div>
          <h1 className="text-4xl font-bold font-mono uppercase tracking-tighter text-text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-text-secondary text-sm font-mono">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8 text-text-secondary leading-relaxed">
          <Section title="1. Overview">
            <p>
              IS_ARWAN.DEV (&quot;the Platform&quot;) is a personal portfolio and professional tool suite operated by Arwan (&quot;I&quot;, &quot;me&quot;, &quot;my&quot;). This Privacy Policy explains how I collect, use, and protect information when you access the Platform, including the CV Builder, Cover Letter Generator, and contact features.
            </p>
            <p>
              By using the Platform, you agree to the collection and use of information in accordance with this policy.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>I collect the following types of information:</p>
            <ul className="list-none space-y-3 mt-4">
              {[
                { label: "Authentication Data", desc: "When you sign in with Google, I receive your name, email address, and profile photo via Firebase Authentication. This is used solely to authenticate your session." },
                { label: "CV & Profile Data", desc: "Information you enter into the CV Builder (name, work history, skills, education, etc.) is stored in your personal Firestore profile, accessible only to you." },
                { label: "Contact Messages", desc: "When you submit a contact form, your name, email, and message are stored in Firestore and may be used to respond to your inquiry." },
                { label: "Waitlist Submissions", desc: "Email addresses submitted for early access are stored in Firestore and used only for platform updates and announcements." },
                { label: "Testimonials", desc: "Any testimonial voluntarily submitted is stored and, upon approval, displayed publicly with your name and role." },
                { label: "Usage Analytics", desc: "I may use Google Analytics to understand aggregate usage patterns. No personally identifiable data is linked to these analytics." },
              ].map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="text-accent-cyan font-mono text-[10px] pt-1 shrink-0">▶</span>
                  <span><strong className="text-text-primary">{item.label}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="space-y-2">
              {[
                "To provide and improve the CV Builder, Cover Letter Generator, and portfolio tools.",
                "To authenticate your identity and manage your account session.",
                "To respond to your contact form messages.",
                "To display approved testimonials on the platform.",
                "To notify waitlist members of product updates (with your consent).",
                "To monitor platform health and performance via anonymized analytics.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-accent-cyan shrink-0">–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="4. Data Storage & Security">
            <p>
              All data is stored in Google Firebase (Firestore, Authentication, and Storage), which operates with industry-standard security practices including encryption at rest and in transit.
            </p>
            <p>
              Access to sensitive data (admin functions, CMS, user management) is protected by Role-Based Access Control (RBAC) with the following levels: <code className="text-accent-cyan bg-surface px-1">super_admin</code>, <code className="text-accent-cyan bg-surface px-1">family</code>, and <code className="text-accent-cyan bg-surface px-1">guest</code>.
            </p>
          </Section>

          <Section title="5. Third-Party Services">
            <p>The Platform uses the following third-party services:</p>
            <ul className="space-y-2 mt-4">
              {[
                { name: "Google Firebase", purpose: "Authentication, database, and storage" },
                { name: "Vercel", purpose: "Hosting and serverless functions" },
                { name: "Google Analytics", purpose: "Anonymized usage statistics" },
                { name: "Google Fonts", purpose: "Typography (Inter, JetBrains Mono)" },
              ].map((item) => (
                <li key={item.name} className="flex gap-3 text-sm">
                  <span className="text-accent-purple shrink-0 font-mono">▸</span>
                  <span><strong className="text-text-primary">{item.name}</strong> — {item.purpose}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <ul className="space-y-2 mt-4">
              {[
                "Access the personal data I hold about you.",
                "Request deletion of your account and associated data.",
                "Request corrections to inaccurate personal data.",
                "Opt out of non-essential communications at any time.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-accent-cyan shrink-0">–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact me at{" "}
              <a href="mailto:arwanarwan12@gmail.com" className="text-accent-cyan hover:underline">
                arwanarwan12@gmail.com
              </a>
              .
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              The Platform uses essential browser storage (localStorage and session cookies) to maintain your authentication state and UI preferences (e.g., dark mode). No third-party advertising cookies are used.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              I may update this Privacy Policy from time to time. When I do, I will update the &quot;Last updated&quot; date at the top of this page. Continued use of the Platform after changes constitutes your acceptance of the new policy.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              If you have any questions about this Privacy Policy, please reach out:
            </p>
            <div className="mt-4 glass p-4 border-accent-cyan/20 font-mono text-sm space-y-1">
              <p>Email: <a href="mailto:arwanarwan12@gmail.com" className="text-accent-cyan">arwanarwan12@gmail.com</a></p>
              <p>Platform: <a href="https://is-arwan.vercel.app" className="text-accent-cyan">is-arwan.vercel.app</a></p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-surface pb-8">
      <h2 className="text-lg font-bold font-mono text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="text-accent-cyan font-mono text-xs">&#47;&#47;</span>
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
