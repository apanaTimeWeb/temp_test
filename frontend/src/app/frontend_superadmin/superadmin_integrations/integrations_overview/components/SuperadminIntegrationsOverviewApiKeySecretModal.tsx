// components/SuperadminIntegrationsOverviewApiKeySecretModal.tsx
// RESPONSIBILITY: One-time reveal modal for newly created API key secret with copy CTA.
// DATA FLOW: ApiKeyCreatedResult -> SuperadminIntegrationsOverviewApiKeySecretModal -> clipboard copy.
'use client';

import { AlertCircle, CheckCircle2, Copy, Key, Lock, X } from 'lucide-react';
import React, { useState } from 'react';
import type { ApiKeyCreatedResult } from '../types/superadmin_integrations_overview.types';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-secret-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-success/30 bg-card p-6 shadow-dialog text-foreground animate-in fade-in-0 zoom-in-95 duration-150 space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-success-bg text-success-text">
              <Key size={18} />
            </span>
            <div>
              <h3 id="api-secret-modal-title" className="text-sm font-bold text-foreground">
                API Key Generated Successfully
              </h3>
              <p className="text-xs text-muted-foreground">Save your secret key immediately</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="rounded-xl border border-warning/30 bg-warning/5 p-3.5 space-y-2 text-xs">
          <p className="text-[11px] text-warning-text flex items-center gap-1.5 font-medium">
            <AlertCircle size={14} className="shrink-0" />
            Please copy this secret key now. You will NOT be able to see it again!
          </p>
          <div className="flex items-center justify-between gap-2 rounded-lg bg-card p-2.5 font-mono text-xs border border-border">
            <span className="text-purple-400 font-semibold break-all select-all">
              {newKeyResult.plainTextSecret}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted/80 cursor-pointer shrink-0 transition-colors"
            >
              <Copy size={12} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Lock size={12} />
            Hashed with Argon2id before storage
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 cursor-pointer transition-opacity"
          >
            I Have Saved This Key
          </button>
        </div>
      </div>
    </div>
  );
};
