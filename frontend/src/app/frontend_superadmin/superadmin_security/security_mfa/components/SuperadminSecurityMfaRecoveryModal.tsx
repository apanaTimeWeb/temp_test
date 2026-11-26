'use client';

import { useState } from 'react';
import { Lock, AlertTriangle, Check, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface SuperadminSecurityMfaRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recoveryCodes?: string[];
}

export default function SuperadminSecurityMfaRecoveryModal({
  isOpen,
  onClose,
  recoveryCodes = [],
}: SuperadminSecurityMfaRecoveryModalProps) {
  const [copiedCodes, setCopiedCodes] = useState(false);

  if (!isOpen) return null;

  const handleCopyCodes = () => {
    if (!recoveryCodes.length) return;
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopiedCodes(true);
    toast.success('10 Recovery codes copied to clipboard', { id: 'mfa-copy-codes' });
    setTimeout(() => setCopiedCodes(false), 2500);
  };

  const handleDownloadCodes = () => {
    if (!recoveryCodes.length) return;
    const content = `SUPERADMIN EMERGENCY RECOVERY CODES\nGenerated: ${new Date().toISOString()}\nAccount: CSO / Emergency Operations\n\n${recoveryCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nWARNING: Store these codes in a secure vault. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `superadmin-recovery-codes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Emergency recovery codes downloaded securely', { id: 'mfa-download-codes' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recovery-codes-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/30 bg-[#0a0d24] p-5 sm:p-6 shadow-2xl space-y-4 animate-scale-in">
        <div className="flex items-start justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Lock size={18} />
            </div>
            <div>
              <h3 id="recovery-codes-title" className="text-base font-bold text-slate-100">
                Emergency Backup Recovery Codes
              </h3>
              <p className="text-xs text-slate-400">Single-use cryptographically sealed tokens</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close recovery codes modal"
          >
            ✕
          </button>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2.5 text-xs text-rose-300">
          <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-400" />
          <p>
            Treat these recovery codes like physical keys. Store them in an offline password manager or physical vault.
            If you lose access to your primary authenticator, these are the ONLY way to regain access to your SuperAdmin account.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3.5 rounded-xl bg-black/50 border border-border/80 font-mono text-xs text-emerald-400">
          {recoveryCodes.map((code, idx) => (
            <div key={code} className="flex items-center justify-between p-1.5 rounded bg-card/60 border border-border/60">
              <span className="text-slate-500 text-[11px]">{idx + 1}.</span>
              <span className="font-bold tracking-wider">{code}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCodes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 active:scale-95 motion-safe:transition-all cursor-pointer shadow-xs"
            >
              {copiedCodes ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedCodes ? 'Copied!' : 'Copy All'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCodes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 active:scale-95 motion-safe:transition-all cursor-pointer shadow-xs"
            >
              <Download size={13} />
              <span>Download .txt</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white shadow-md active:scale-95 motion-safe:transition-all cursor-pointer"
          >
            I Have Stored Them Safely
          </button>
        </div>
      </div>
    </div>
  );
}