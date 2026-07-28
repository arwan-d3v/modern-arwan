import React, { useMemo } from 'react';
import Modal from './ui/Modal';
import { CVData } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ATSCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
}

interface ATSResult {
  score: number;
  good: string[];
  warnings: string[];
  errors: string[];
}

export default function ATSCheckerModal({ isOpen, onClose, data }: ATSCheckerModalProps) {
  
  const result = useMemo<ATSResult>(() => {
    let score = 100;
    const good: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    // 1. Personal Info Check
    if (!data.personalInfo.fullName) { score -= 5; errors.push("Missing Full Name"); }
    else { good.push("Full Name provided"); }
    
    if (!data.personalInfo.email || !data.personalInfo.email.includes('@')) { score -= 10; errors.push("Invalid or missing Email"); }
    else { good.push("Email format looks valid"); }

    if (!data.personalInfo.phone) { score -= 5; warnings.push("Missing Phone Number"); }
    else { good.push("Phone Number provided"); }

    if (!data.personalInfo.summary || data.personalInfo.summary.length < 50) {
      score -= 10;
      warnings.push("Professional Summary is too short or missing. ATS systems look for keywords here.");
    } else {
      good.push("Professional Summary has good length");
    }

    // 2. Experience Check
    if (data.experience.length === 0) {
      score -= 20;
      errors.push("No Work Experience listed");
    } else {
      let missingDates = false;
      let missingDesc = false;
      data.experience.forEach(exp => {
        if (!exp.startDate || !exp.endDate) missingDates = true;
        if (!exp.description || exp.description.length < 20) missingDesc = true;
      });
      if (missingDates) { score -= 10; errors.push("Some experience entries are missing dates"); }
      else { good.push("Experience dates are well-formatted"); }

      if (missingDesc) { score -= 10; warnings.push("Some experience entries have very short descriptions. Expand with quantifiable achievements."); }
      else { good.push("Experience descriptions are detailed"); }
    }

    // 3. Skills Check
    if (data.skills.length < 3) {
      score -= 15;
      errors.push("Too few skills listed. Add at least 3 core technical/professional skills.");
    } else if (data.skills.length < 6) {
      score -= 5;
      warnings.push("Consider adding more skills to match job descriptions.");
    } else {
      good.push("Healthy amount of skills listed for ATS keyword matching");
    }

    // 4. Education Check
    if (data.education.length === 0) {
      score -= 10;
      warnings.push("No Education listed. Some ATS heavily filter by degree.");
    } else {
      good.push("Education section is populated");
    }

    // Bound score
    if (score < 0) score = 0;

    return { score, good, warnings, errors };
  }, [data]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Modal
      visible={isOpen}
      title="ATS COMPATIBILITY SCAN"
      message=""
      confirmLabel="ACKNOWLEDGE"
      onConfirm={onClose}
      onCancel={onClose}
    >
      <div className="space-y-6 mt-4 text-left">
        <div className="flex flex-col items-center justify-center p-6 bg-black/20 border border-white/5 rounded-lg">
          <ShieldCheck size={48} className={`mb-4 ${getScoreColor(result.score)}`} />
          <div className="text-sm font-mono text-text-secondary uppercase tracking-widest mb-1">Overall Match Score</div>
          <div className={`text-6xl font-bold font-mono tracking-tighter ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
        </div>

        <div className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
          {result.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                <XCircle size={14} /> Critical Issues
              </h4>
              <ul className="space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-red-500 mt-1">-</span> {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} /> Recommendations
              </h4>
              <ul className="space-y-1">
                {result.warnings.map((warn, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">-</span> {warn}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.good.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-green-500 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={14} /> Passed Checks
              </h4>
              <ul className="space-y-1">
                {result.good.map((good, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span> {good}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
