// components/SuperadminIntegrationsOverviewApiKeySecretModal.tsx
// RESPONSIBILITY: One-time reveal modal for newly created API key secret with copy CTA.
// DATA FLOW: ApiKeyCreatedResult -> SuperadminIntegrationsOverviewApiKeySecretModal -> clipboard copy.
'use client';

import { AlertCircle, Copy, Key, Lock, X } from 'lucide-react';
import React, { useState } from 'react';
import type { ApiKeyCreatedResult } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewApiKeySecretModalProps {
  newKeyResult: ApiKeyCreatedResult | null;
  onClose: () => void;
}

export const SuperadminIntegrationsOverviewApiKeySecretModal: React.FC<
  SuperadminIntegrationsOverviewApiKeySecretModalProps
> = ({ newKeyResult, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!newKeyResult) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(newKeyResult.plainTextSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-secret-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-[#051814] via-[#090d24] to-[#050714] p-6 shadow-2xl text-slate-100 animate-in fade-in-0 zoom-in-95 motion-safe:duration-150 space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Key size={18} />
            </span>
            <div>
              <h3 id="api-secret-modal-title" className="text-sm font-bold text-slate-100">
                API Key Generated Successfully
              </h3>
              <p className="text-xs text-slate-400">Save your secret key immediately</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 cursor-pointer transition-colors p-1"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2 text-xs shadow-inner">
          <p className="text-[11px] text-amber-300 flex items-center gap-1.5 font-medium">
            <AlertCircle size={14} className="shrink-0 text-amber-400" />
            Please copy this secret key now. You will NOT be able to see it again!
          </p>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-950/90 p-3 font-mono text-xs border border-indigo-500/25 shadow-inner">
            <span className="text-purple-300 font-semibold break-all select-all">
              {newKeyResult.plainTextSecret}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-800/80 border border-indigo-500/20 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700/80 hover:text-white cursor-pointer shrink-0 transition-colors shadow-xs"
            >
              <Copy size={12} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 font-mono">
            <Lock size={12} className="text-indigo-400" />
            Hashed with Argon2id before storage
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/25 cursor-pointer transition-opacity"
          >
            I Have Saved This Key
          </button>
        </div>
      </div>
    </div>
  );
};
