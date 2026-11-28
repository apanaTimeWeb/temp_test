'use client';

import { ManagerCommunicationWhatsappTemplatesCustomPersonaCard } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/components/manager_communication_whatsapp_templates_views/ManagerCommunicationWhatsappTemplatesCustomPersonaCard';
import {
  createDefaultCustomProfile,
  DEFAULT_SAMPLE_PROFILES,
  type StudentSampleProfile,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/config/manager_communication_whatsapp_templates.demo_data';
import {
  analyzeVariables,
  KNOWN_VARIABLE_ALIASES,
  renderTemplatePreviewText,
  STANDARD_VARIABLES,
  type VariableDiagnostics,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/utils/ManagerCommunicationWhatsappTemplatesPreviewHelpers';
import { AlertCircle, AlertTriangle, Check, CheckCheck, CheckCircle2, Copy, Eye, SlidersHorizontal, User } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export { DEFAULT_SAMPLE_PROFILES, KNOWN_VARIABLE_ALIASES, STANDARD_VARIABLES, analyzeVariables };
export type { StudentSampleProfile, VariableDiagnostics };

export interface ManagerCommunicationWhatsappTemplatesVariablePreviewProps {
  body: string;
  onUpdateBody?: (newBody: string) => void;
  className?: string;
}

const TOKEN_BADGE_MAP: Record<string, { field: keyof StudentSampleProfile; badgeColor: string }> = {
  '{name}': { field: 'name', badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40' },
  '{amount}': { field: 'amount', badgeColor: 'bg-amber-500/25 text-amber-300 border-amber-500/40' },
  '{duedate}': { field: 'duedate', badgeColor: 'bg-rose-500/25 text-rose-300 border-rose-500/40' },
  '{planname}': { field: 'planname', badgeColor: 'bg-purple-500/25 text-purple-300 border-purple-500/40' },
  '{libraryname}': { field: 'libraryname', badgeColor: 'bg-indigo-500/25 text-indigo-300 border-indigo-500/40' },
  '{phone}': { field: 'phone', badgeColor: 'bg-cyan-500/25 text-cyan-300 border-cyan-500/40' },
  '{seat}': { field: 'seat', badgeColor: 'bg-sky-500/25 text-sky-300 border-sky-500/40' },
};

export const ManagerCommunicationWhatsappTemplatesVariablePreview: React.FC<
  ManagerCommunicationWhatsappTemplatesVariablePreviewProps
> = ({ body, onUpdateBody, className = '' }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('rahul');
  const [highlightVariables, setHighlightVariables] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCustomInputs, setShowCustomInputs] = useState<boolean>(false);
  const [customProfile, setCustomProfile] = useState<StudentSampleProfile>(() => createDefaultCustomProfile());
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
  }, []);

  const activeProfile = useMemo(() => {
    if (selectedProfileId === 'custom') return customProfile;
    return DEFAULT_SAMPLE_PROFILES.find((p) => p.id === selectedProfileId) || DEFAULT_SAMPLE_PROFILES[0];
  }, [selectedProfileId, customProfile]);

  const diagnostics = useMemo(() => analyzeVariables(body), [body]);
  const renderedText = useMemo(() => renderTemplatePreviewText(body, activeProfile), [body, activeProfile]);

  const handleFixAliases = () => {
    if (!onUpdateBody || diagnostics.aliasTokens.length === 0) return;
    let nextBody = body;
    diagnostics.aliasTokens.forEach(({ token, suggested }) => {
      nextBody = nextBody.replaceAll(token, suggested);
    });
    onUpdateBody(nextBody);
    toast.success(`Fixed ${diagnostics.aliasTokens.length} non-standard variable(s) to canonical tags!`, {
      id: 'manager-wa-tpl-fix-aliases',
    });
  };

  const handleCopyPreview = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(renderedText);
      setCopied(true);
      toast.success('Live preview message copied to clipboard!', { id: 'manager-wa-tpl-copy-preview' });
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => { setCopied(false); copyTimerRef.current = null; }, 2500);
    }
  };

  const renderHighlightedContent = () => {
    if (!highlightVariables) {
      return (
        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed select-text font-normal">
          {renderedText}
        </p>
      );
    }
    const parts = body.split(/({[a-zA-Z0-9_]+})/g);
    const seen = new Map<string, number>();
    return (
      <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed select-text font-normal">
        {parts.map((part) => {
          const count = (seen.get(part) || 0) + 1;
          seen.set(part, count);
          const stableKey = `${part}-${count}`;
          if (!part.startsWith('{') || !part.endsWith('}')) {
            return <React.Fragment key={stableKey}>{part}</React.Fragment>;
          }
          const standard = KNOWN_VARIABLE_ALIASES[part] || part;
          const mapped = TOKEN_BADGE_MAP[standard];
          const val = mapped ? activeProfile[mapped.field] : part;
          const badgeColor = mapped ? mapped.badgeColor : 'bg-rose-900/50 text-rose-300 border-rose-500';
          return (
            <span
              key={stableKey}
              className={`inline-block px-1.5 py-0.2 rounded font-semibold border ${badgeColor} motion-safe:transition-all shadow-2xs mx-0.5`}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary" id="manager-whatsapp-template-preview-label">
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
          <p className="text-[11px] text-secondary mt-0.5">Real look as received on student&apos;s WhatsApp with live data</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setHighlightVariables(!highlightVariables)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border motion-safe:transition-colors cursor-pointer ${
              highlightVariables ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-surface-hover text-secondary border-border'
            }`}
            title="Toggle variable replacement highlighting"
          >
            <Eye size={12} />
            <span>{highlightVariables ? 'Realistic View' : 'Highlight Variables'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyPreview}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-card hover:bg-surface-hover text-secondary border border-border motion-safe:transition-colors cursor-pointer"
            title="Copy rendered message"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

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
              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border motion-safe:transition-all cursor-pointer ${
                isSelected ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-xs' : 'bg-card text-secondary hover:text-primary hover:bg-surface-hover border-border'
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
          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border motion-safe:transition-all cursor-pointer ${
            selectedProfileId === 'custom' ? 'bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-xs' : 'bg-card text-secondary hover:text-primary hover:bg-surface-hover border-border'
          }`}
        >
          <SlidersHorizontal size={12} />
          <span>Custom Student Data</span>
        </button>
      </div>

      {diagnostics.aliasTokens.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">Non-standard variable token detected</p>
              <p className="text-[11px] text-amber-300 mt-0.5">
                {diagnostics.aliasTokens.map((a) => `"${a.token}" → "${a.suggested}"`).join(', ')}. Messages may fail on standard dispatch if not normalized.
              </p>
            </div>
          </div>
          {onUpdateBody && (
            <button
              type="button"
              onClick={handleFixAliases}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold cursor-pointer shrink-0 motion-safe:transition-colors"
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
            <p className="font-semibold text-rose-200">Unrecognized variables detected: {diagnostics.unknownTokens.join(', ')}</p>
            <p className="text-[11px] text-rose-300 mt-0.5">
              These will appear literally in brackets to the student. Please replace them with valid tokens from the chips above (e.g. &#123;name&#125;, &#123;amount&#125;).
            </p>
          </div>
        </div>
      )}

      {selectedProfileId === 'custom' && showCustomInputs && (
        <ManagerCommunicationWhatsappTemplatesCustomPersonaCard customProfile={customProfile} setCustomProfile={setCustomProfile} />
      )}

      <div className="rounded-2xl border border-border mwt-wa-canvas overflow-hidden shadow-md">
        <div className="mwt-wa-header px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              LO
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-slate-100">Library OS Official</span>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold" title="Verified Business">
                  ✓
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Official Business Account • Preview for: {activeProfile.name} ({activeProfile.seat})
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {renderedText.length} chars • {renderedText.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-5 md:p-6 mwt-wa-canvas min-h-[140px] sm:min-h-[160px] flex flex-col justify-end">
          <div className="max-w-[92%] sm:max-w-md ml-auto mwt-wa-bubble p-3 sm:p-4 rounded-2xl rounded-tr-xs shadow-md space-y-1.5 border">
            {renderHighlightedContent()}
            <div className="flex items-center justify-end gap-1 text-[10px] mwt-wa-meta pt-0.5">
              <span>Today, 10:45 AM</span>
              <CheckCheck size={14} className="mwt-wa-read-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
