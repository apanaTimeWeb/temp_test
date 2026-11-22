'use client';

import {AlertCircle, AlertTriangle, Armchair, BookOpen, Calendar, Check, CheckCheck, CheckCircle2, Copy, Eye, IndianRupee, MapPin, RotateCcw, SlidersHorizontal, User} from 'lucide-react';
import React,{ useMemo,useState } from 'react';
import { toast } from 'sonner';

export interface StudentSampleProfile {
  id: string;
  label: string;
  badge: string;
  name: string;
  amount: string;
  duedate: string;
  planname: string;
  libraryname: string;
  phone: string;
  seat: string;
}

export const DEFAULT_SAMPLE_PROFILES: StudentSampleProfile[] = [
  {
    id: 'rahul',
    label: 'Rahul Sharma',
    badge: 'General Member',
    name: 'Rahul Sharma',
    amount: '₹1,000',
    duedate: '15-Apr-2026',
    planname: 'Monthly Morning Plan',
    libraryname: 'Central Study Hub - Branch 1',
    phone: '+91 98765 43210',
    seat: 'Seat S-03 (Hall A)',
  },
  {
    id: 'priya',
    label: 'Priya Patel',
    badge: 'Due Fees / 24x7',
    name: 'Priya Patel',
    amount: '₹1,500',
    duedate: '10-May-2026',
    planname: 'Full Day 24x7 Reserve',
    libraryname: 'Central Study Hub - Branch 2',
    phone: '+91 98112 34567',
    seat: 'Cabin C-09 (Quiet Zone)',
  },
  {
    id: 'vikram',
    label: 'Vikramaditya C. Rao',
    badge: 'Quarterly VIP',
    name: 'Vikramaditya C. Rao',
    amount: '₹2,400',
    duedate: '01-Jun-2026',
    planname: 'Quarterly Premium Plan',
    libraryname: 'Central Study Hub - Branch 1',
    phone: '+91 97654 32109',
    seat: 'Seat D-22 (AC Hall B)',
  },
];

/**
 * Common manager aliases that cause broken messages if not normalized.
 */
export const KNOWN_VARIABLE_ALIASES: Record<string, string> = {
  '{student_name}': '{name}',
  '{student}': '{name}',
  '{studentname}': '{name}',
  '{name_of_student}': '{name}',
  '{fee}': '{amount}',
  '{fee_amount}': '{amount}',
  '{fees}': '{amount}',
  '{due_date}': '{duedate}',
  '{date}': '{duedate}',
  '{expiry_date}': '{duedate}',
  '{valid_till}': '{duedate}',
  '{plan}': '{planname}',
  '{membership_plan}': '{planname}',
  '{branch}': '{libraryname}',
  '{branch_name}': '{libraryname}',
  '{library}': '{libraryname}',
  '{mobile}': '{phone}',
  '{contact}': '{phone}',
  '{phone_number}': '{phone}',
  '{seat_no}': '{seat}',
  '{seat_number}': '{seat}',
  '{cabin}': '{seat}',
};

export const STANDARD_VARIABLES = [
  '{name}',
  '{amount}',
  '{duedate}',
  '{planname}',
  '{libraryname}',
  '{phone}',
  '{seat}',
] as const;

export interface VariableDiagnostics {
  totalTokens: number;
  validTokens: string[];
  aliasTokens: { token: string; suggested: string }[];
  unknownTokens: string[];
  isAllValid: boolean;
}

export function analyzeVariables(body: string): VariableDiagnostics {
  const matches = body.match(/\{[^}]+\}/g) || [];
  const validTokens: string[] = [];
  const aliasTokens: { token: string; suggested: string }[] = [];
  const unknownTokens: string[] = [];

  for (const token of matches) {
    if ((STANDARD_VARIABLES as readonly string[]).includes(token)) {
      if (!validTokens.includes(token)) validTokens.push(token);
    } else if (KNOWN_VARIABLE_ALIASES[token]) {
      if (!aliasTokens.some((a) => a.token === token)) {
        aliasTokens.push({ token, suggested: KNOWN_VARIABLE_ALIASES[token] });
      }
    } else {
      if (!unknownTokens.includes(token)) unknownTokens.push(token);
    }
  }

  return {
    totalTokens: matches.length,
    validTokens,
    aliasTokens,
    unknownTokens,
    isAllValid: aliasTokens.length === 0 && unknownTokens.length === 0,
  };
}

export interface ManagerCommunicationWhatsappTemplatesVariablePreviewProps {
  body: string;
  onUpdateBody?: (newBody: string) => void;
  className?: string;
}

export const ManagerCommunicationWhatsappTemplatesVariablePreview: React.FC<
  ManagerCommunicationWhatsappTemplatesVariablePreviewProps
> = ({ body, onUpdateBody, className = '' }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('rahul');
  const [highlightVariables, setHighlightVariables] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCustomInputs, setShowCustomInputs] = useState<boolean>(false);

  // Custom profile state for testing arbitrary inputs
  const [customProfile, setCustomProfile] = useState<StudentSampleProfile>({
    id: 'custom',
    label: 'Custom Student',
    badge: 'Custom Persona',
    name: 'Rohit Verma',
    amount: '₹1,200',
    duedate: '25-Apr-2026',
    planname: 'Morning Shift (6 AM - 2 PM)',
    libraryname: 'Central Study Hub - Branch 1',
    phone: '+91 99887 76655',
    seat: 'Seat S-14 (Hall A)',
  });

  const activeProfile = useMemo(() => {
    if (selectedProfileId === 'custom') return customProfile;
    return (
      DEFAULT_SAMPLE_PROFILES.find((p) => p.id === selectedProfileId) ||
      DEFAULT_SAMPLE_PROFILES[0]
    );
  }, [selectedProfileId, customProfile]);

  const diagnostics = useMemo(() => analyzeVariables(body), [body]);

  // Compute live replaced plain text
  const renderedText = useMemo(() => {
    let result = body;
    // Replace standard tokens
    result = result.replace(/{name}/g, activeProfile.name);
    result = result.replace(/{amount}/g, activeProfile.amount);
    result = result.replace(/{duedate}/g, activeProfile.duedate);
    result = result.replace(/{planname}/g, activeProfile.planname);
    result = result.replace(/{libraryname}/g, activeProfile.libraryname);
    result = result.replace(/{phone}/g, activeProfile.phone);
    result = result.replace(/{seat}/g, activeProfile.seat);

    // Also replace known aliases for preview friendliness
    Object.entries(KNOWN_VARIABLE_ALIASES).forEach(([alias, standard]) => {
      const standardKey = standard.replace(/[{}]/g, '') as keyof StudentSampleProfile;
      const val = activeProfile[standardKey];
      if (typeof val === 'string') {
        result = result.replaceAll(alias, val);
      }
    });

    return result;
  }, [body, activeProfile]);

  // Handle auto-fixing aliases
  const handleFixAliases = () => {
    if (!onUpdateBody || diagnostics.aliasTokens.length === 0) return;
    let nextBody = body;
    diagnostics.aliasTokens.forEach(({ token, suggested }) => {
      nextBody = nextBody.replaceAll(token, suggested);
    });
    onUpdateBody(nextBody);
    toast.success(
      `Fixed ${diagnostics.aliasTokens.length} non-standard variable(s) to canonical tags!`
    );
  };

  // Copy rendered text
  const handleCopyPreview = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(renderedText);
      setCopied(true);
      toast.success('Live preview message copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Render tokens highlighted in preview
  const renderHighlightedContent = () => {
    if (!highlightVariables) {
      return (
        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed select-text font-normal">
          {renderedText}
        </p>
      );
    }

    // Split text into tokens and replace with highlighted badges
    // Regex splits by variable patterns
    const regex = /({[a-zA-Z0-9_]+})/g;
    const parts = body.split(regex);

    return (
      <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed select-text font-normal">
        {parts.map((part, index) => {
          if (!part.startsWith('{') || !part.endsWith('}')) {
            return <React.Fragment key={index}>{part}</React.Fragment>;
          }

          const standard = KNOWN_VARIABLE_ALIASES[part] || part;
          let val = '';
          let badgeColor = 'bg-primary/20 text-primary border-primary/30';

          switch (standard) {
            case '{name}':
              val = activeProfile.name;
              badgeColor = 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40';
              break;
            case '{amount}':
              val = activeProfile.amount;
              badgeColor = 'bg-amber-500/25 text-amber-300 border-amber-500/40';
              break;
            case '{duedate}':
              val = activeProfile.duedate;
              badgeColor = 'bg-rose-500/25 text-rose-300 border-rose-500/40';
              break;
            case '{planname}':
              val = activeProfile.planname;
              badgeColor = 'bg-purple-500/25 text-purple-300 border-purple-500/40';
              break;
            case '{libraryname}':
              val = activeProfile.libraryname;
              badgeColor = 'bg-indigo-500/25 text-indigo-300 border-indigo-500/40';
              break;
            case '{phone}':
              val = activeProfile.phone;
              badgeColor = 'bg-cyan-500/25 text-cyan-300 border-cyan-500/40';
              break;
            case '{seat}':
              val = activeProfile.seat;
              badgeColor = 'bg-sky-500/25 text-sky-300 border-sky-500/40';
              break;
            default:
              val = part; // unrecognized
              badgeColor = 'bg-rose-900/50 text-rose-300 border-rose-500';
              break;
          }

          return (
            <span
              key={index}
              className={`inline-block px-1.5 py-0.2 rounded font-semibold border ${badgeColor} transition-all shadow-2xs mx-0.5`}
              title={`Source Variable: ${part}`}
            >
              {val}
            </span>
          );
        })}
      </p>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header bar with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <p
              className="text-xs font-bold uppercase tracking-wider text-secondary"
              id="manager-whatsapp-template-preview-label"
            >
              Live Student Variable Preview
            </p>
            {diagnostics.isAllValid ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={11} />
                Variables OK
              </span>
            ) : diagnostics.aliasTokens.length > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle size={11} />
                Non-Standard Variable
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertCircle size={11} />
                Unknown Variable
              </span>
            )}
          </div>
          <p className="text-[11px] text-secondary mt-0.5">
            Real look as received on student's WhatsApp with live data
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setHighlightVariables(!highlightVariables)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              highlightVariables
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card hover:bg-surface-hover text-secondary border-border'
            }`}
            title="Toggle variable replacement highlighting"
          >
            <Eye size={12} />
            <span>{highlightVariables ? 'Realistic View' : 'Highlight Variables'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPreview}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-card hover:bg-surface-hover text-secondary border border-border transition-colors cursor-pointer"
            title="Copy rendered message"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Profile Persona Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
        <span className="text-[11px] font-medium text-secondary shrink-0 flex items-center gap-1">
          <User size={12} />
          <span>Student Persona:</span>
        </span>
        {DEFAULT_SAMPLE_PROFILES.map((profile) => {
          const isSelected = selectedProfileId === profile.id;
          return (
            <button
              type="button"
              key={profile.id}
              onClick={() => {
                setSelectedProfileId(profile.id);
                setShowCustomInputs(false);
              }}
              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-xs'
                  : 'bg-card text-secondary hover:text-primary hover:bg-surface-hover border-border'
              }`}
            >
              <span>{profile.name}</span>
              <span className="text-[10px] opacity-70">({profile.amount})</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => {
            setSelectedProfileId('custom');
            setShowCustomInputs(true);
          }}
          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
            selectedProfileId === 'custom'
              ? 'bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-xs'
              : 'bg-card text-secondary hover:text-primary hover:bg-surface-hover border-border'
          }`}
        >
          <SlidersHorizontal size={12} />
          <span>Custom Student Data</span>
        </button>
      </div>

      {/* Diagnostics Alert Banner if non-standard / unknown variables found */}
      {diagnostics.aliasTokens.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">
                Non-standard variable token detected
              </p>
              <p className="text-[11px] text-amber-300/90 mt-0.5">
                {diagnostics.aliasTokens
                  .map((a) => `"${a.token}" → "${a.suggested}"`)
                  .join(', ')}
                . Messages may fail on standard dispatch if not normalized.
              </p>
            </div>
          </div>
          {onUpdateBody && (
            <button
              type="button"
              onClick={handleFixAliases}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold cursor-pointer shrink-0 transition-colors"
            >
              <CheckCheck size={13} />
              <span>Auto-Fix All Aliases</span>
            </button>
          )}
        </div>
      )}

      {diagnostics.unknownTokens.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">
              Unrecognized variables detected: {diagnostics.unknownTokens.join(', ')}
            </p>
            <p className="text-[11px] text-rose-300/90 mt-0.5">
              These will appear literally in brackets to the student. Please replace them
              with valid tokens from the chips above (e.g. &#123;name&#125;, &#123;amount&#125;).
            </p>
          </div>
        </div>
      )}

      {/* Expandable Custom Persona Inputs */}
      {selectedProfileId === 'custom' && showCustomInputs && (
        <div className="p-3.5 rounded-xl border border-border bg-card/60 backdrop-blur-xs space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-sky-400" />
              <span>Test with Custom Student Values (लाइव टेस्ट डेटा)</span>
            </p>
            <button
              type="button"
              onClick={() =>
                setCustomProfile({
                  id: 'custom',
                  label: 'Custom Student',
                  badge: 'Custom Persona',
                  name: 'Rohit Verma',
                  amount: '₹1,200',
                  duedate: '25-Apr-2026',
                  planname: 'Morning Shift (6 AM - 2 PM)',
                  libraryname: 'Central Study Hub - Branch 1',
                  phone: '+91 99887 76655',
                  seat: 'Seat S-14 (Hall A)',
                })
              }
              className="text-[11px] text-secondary hover:text-primary flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Reset Values</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
                <User size={11} className="text-emerald-400" />
                <span>Student Name &#123;name&#125;</span>
              </label>
              <input
                type="text"
                value={customProfile.name}
                onChange={(e) =>
                  setCustomProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
                placeholder="e.g. Rohit Verma"
              />
            </div>

            <div>
              <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
                <IndianRupee size={11} className="text-amber-400" />
                <span>Amount &#123;amount&#125;</span>
              </label>
              <input
                type="text"
                value={customProfile.amount}
                onChange={(e) =>
                  setCustomProfile((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
                placeholder="e.g. ₹1,200"
              />
            </div>

            <div>
              <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
                <Calendar size={11} className="text-rose-400" />
                <span>Due Date &#123;duedate&#125;</span>
              </label>
              <input
                type="text"
                value={customProfile.duedate}
                onChange={(e) =>
                  setCustomProfile((prev) => ({ ...prev, duedate: e.target.value }))
                }
                className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
                placeholder="e.g. 25-Apr-2026"
              />
            </div>

            <div>
              <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
                <BookOpen size={11} className="text-purple-400" />
                <span>Plan &#123;planname&#125;</span>
              </label>
              <input
                type="text"
                value={customProfile.planname}
                onChange={(e) =>
                  setCustomProfile((prev) => ({ ...prev, planname: e.target.value }))
                }
                className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
                placeholder="e.g. Morning Shift"
              />
            </div>

            <div>
              <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
                <Armchair size={11} className="text-sky-400" />
                <span>Seat Tag &#123;seat&#125;</span>
              </label>
              <input
                type="text"
                value={customProfile.seat}
                onChange={(e) =>
                  setCustomProfile((prev) => ({ ...prev, seat: e.target.value }))
                }
                className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
                placeholder="e.g. Seat S-14 (Hall A)"
              />
            </div>

            <div>
              <label className="text-[11px] text-secondary block mb-1 flex items-center gap-1">
                <MapPin size={11} className="text-indigo-400" />
                <span>Library &#123;libraryname&#125;</span>
              </label>
              <input
                type="text"
                value={customProfile.libraryname}
                onChange={(e) =>
                  setCustomProfile((prev) => ({ ...prev, libraryname: e.target.value }))
                }
                className="mgr-input w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background"
                placeholder="e.g. Central Study Hub"
              />
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Chat Canvas */}
      <div className="rounded-2xl border border-border bg-[#0b141a] overflow-hidden shadow-md">
        {/* WhatsApp Business Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              LO
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  Library OS Official
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold"
                  title="Verified Business"
                >
                  ✓
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Official Business Account • Preview for: {activeProfile.name} ({activeProfile.seat})
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              {renderedText.length} chars • {renderedText.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>

        {/* WhatsApp Chat Canvas */}
        <div className="p-3 sm:p-5 md:p-6 bg-[#0b141a] min-h-[140px] sm:min-h-[160px] flex flex-col justify-end">
          {/* Outgoing WhatsApp Bubble */}
          <div className="max-w-[92%] sm:max-w-md ml-auto bg-[#005c4b] text-slate-100 p-3 sm:p-4 rounded-2xl rounded-tr-xs shadow-md space-y-1.5 border border-[#005c4b]/50">
            {renderHighlightedContent()}
            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/80 pt-0.5">
              <span>Today, 10:45 AM</span>
              <CheckCheck size={14} className="text-[#53bdeb]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
