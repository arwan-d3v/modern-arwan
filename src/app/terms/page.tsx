import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for IS_ARWAN.DEV — Rules and guidelines for using the platform.",
};

const LAST_UPDATED = "July 28, 2026";

export default function TermsPage() {
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
            <FileText size={24} className="text-accent-cyan" />
            <span className="font-mono text-[10px] text-accent-cyan tracking-[0.3em] uppercase">
              [LEGAL_DOCUMENT]
            </span>
          </div>
          <h1 className="text-4xl font-bold font-mono uppercase tracking-tighter text-text-primary mb-2">
            Terms of Service
          </h1>
          <p className="text-text-secondary text-sm font-mono">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using IS_ARWAN.DEV (the &quot;Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
            <p>
              The Platform is operated by Arwan and provides portfolio showcase tools, a CV/Resume Builder, and related professional services.
            </p>
          </Section>

          <Section title="2. Use of the Platform">
            <p>You agree to use the Platform only for lawful purposes and in a manner that does not infringe upon the rights of others. You must not:</p>
            <ul className="space-y-2 mt-4">
              {[
                "Use the Platform to submit false, misleading, or fraudulent information.",
                "Attempt to reverse-engineer, hack, or compromise the Platform's security.",
                "Use automated bots or scripts to scrape, copy, or interact with the Platform.",
                "Impersonate other users or misrepresent your affiliation.",
                "Upload malicious files, code, or content of any kind.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-red-400 shrink-0">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. User Accounts & Authentication">
            <p>
              Account registration is handled through Google Authentication via Firebase. By signing in, you grant the Platform access to your basic Google profile information (name, email, photo) as described in our{" "}
              <Link href="/privacy-policy" className="text-accent-cyan hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. Notify me immediately if you suspect unauthorized access.
            </p>
          </Section>

          <Section title="4. CV Builder & Content Ownership">
            <p>
              All CV, resume, and professional content that you create using the Platform belongs to you. The Platform does not claim ownership over your personal data or creative output.
            </p>
            <p>
              By submitting a testimonial or public content to the Platform, you grant IS_ARWAN.DEV a non-exclusive, royalty-free license to display that content on the Platform following admin approval.
            </p>
          </Section>

          <Section title="5. Service Tiers & Export Quotas">
            <p>The Platform operates on a tiered access model:</p>
            <div className="mt-4 space-y-3">
              {[
                { tier: "GUEST", color: "text-text-secondary", perks: ["View dashboard", "Access CV Builder (view only)", "1x PDF export per week"] },
                { tier: "FAMILY", color: "text-accent-cyan", perks: ["All Guest features", "Simulated module access", "Read-only portfolio data"] },
                { tier: "PRO (future)", color: "text-yellow-400", perks: ["Unlimited PDF exports", "Word (.docx) export", "Multiple CV draft profiles", "Priority support"] },
                { tier: "SUPER_ADMIN", color: "text-accent-purple", perks: ["Full platform control", "CMS access", "User role management"] },
              ].map((tier) => (
                <div key={tier.tier} className="glass p-4 border-white/5">
                  <h4 className={`font-mono text-xs font-bold uppercase tracking-widest mb-2 ${tier.color}`}>
                    {tier.tier}
                  </h4>
                  <ul className="space-y-1">
                    {tier.perks.map((p, i) => (
                      <li key={i} className="text-xs flex gap-2">
                        <span className="text-accent-cyan">▸</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              The Platform&apos;s design, code, graphics, and overall aesthetic are the intellectual property of Arwan. You may not copy, reproduce, or redistribute any part of the Platform without explicit written permission.
            </p>
            <p>
              Logos and trademarks of third-party tools (Firebase, Vercel, etc.) belong to their respective owners and are used for identification purposes only.
            </p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>
              The Platform is provided on an &quot;as is&quot; basis without warranties of any kind. I am not liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to data loss or service interruptions.
            </p>
            <p>
              The CV Builder and cover letter tools are intended as assistive tools. I am not responsible for outcomes related to job applications or hiring decisions made using content generated by the Platform.
            </p>
          </Section>

          <Section title="8. Termination">
            <p>
              I reserve the right to suspend or terminate any user account at any time, without notice, for conduct that violates these Terms or is otherwise harmful to the Platform or other users.
            </p>
          </Section>

          <Section title="9. Changes to Terms">
            <p>
              I may update these Terms of Service at any time. The &quot;Last updated&quot; date at the top of this page will reflect when changes were made. Continued use of the Platform after changes constitutes your acceptance of the revised terms.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms are governed by the laws of the Republic of Indonesia. Any disputes arising from these Terms shall be resolved in accordance with Indonesian law.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For any questions regarding these Terms, please contact:
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
