'use client';
/**
 * Responsibility: Modal dialog allowing export of current settings snapshot as JSON manifest or clipboard copy.
 * Flow: User clicks Export -> Modal opens -> Download or Copy JSON -> Close.
 */
import { useEffect, useRef, useState } from 'react';
import { Download, Copy, Check, X, FileJson } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';

interface SuperadminSettingsGeneralExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValues: SuperadminSettingsFormValues;
}

export function SuperadminSettingsGeneralExportModal({
  isOpen,
  onClose,
  currentValues,
}: SuperadminSettingsGeneralExportModalProps) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(currentValues, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `libraryos-global-settings-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 motion-safe:animate-fade-in"
    >
      <div
        ref={modalRef}
        className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c102b] via-[#090d24] to-[#050714] max-w-xl w-full p-6 shadow-2xl shadow-black/80 flex flex-col gap-4 text-slate-100 max-h-[85vh]"
      >
        <div className="flex items-center justify-between border-b border-indigo-500/15 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <FileJson size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-base font-bold text-slate-100">
                Export System Configuration
              </h2>
              <span className="text-xs text-slate-400">
                JSON manifest snapshot of all platform setting domains.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="relative rounded-xl border border-indigo-500/20 bg-slate-950/90 p-3.5 overflow-hidden">
          <pre className="text-[11px] font-mono text-cyan-300 max-h-64 overflow-y-auto overflow-x-auto">
            {jsonString}
          </pre>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/15">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 hover:bg-indigo-500/25 text-xs font-semibold text-indigo-300 hover:text-white inline-flex items-center gap-2 transition-all cursor-pointer"
            data-testid="settings-export-copy-btn"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold inline-flex items-center gap-2 transition-all shadow-md shadow-amber-950/40 cursor-pointer"
            data-testid="settings-export-download-btn"
          >
            <Download size={14} />
            <span>Download Configuration JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
}
