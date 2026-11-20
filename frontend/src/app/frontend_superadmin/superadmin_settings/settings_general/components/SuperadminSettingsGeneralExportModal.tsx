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
      // Fallback
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 motion-safe:animate-fade-in"
    >
      <div
        ref={modalRef}
        className="sa-card max-w-xl w-full p-6 shadow-xl border border-border flex flex-col gap-4 bg-surface max-h-[85vh]"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-subtle text-primary">
              <FileJson size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-base font-bold text-primary">
                Export System Configuration
              </h2>
              <span className="text-xs text-secondary">
                JSON manifest snapshot of all 11 global setting domains.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-hover"
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="relative rounded-lg border border-border bg-subtle p-3 overflow-hidden">
          <pre className="text-[11px] font-mono text-secondary max-h-64 overflow-y-auto overflow-x-auto">
            {jsonString}
          </pre>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleCopy}
            className="sa-btn-secondary text-xs px-3.5 py-2 inline-flex items-center gap-2"
            data-testid="settings-export-copy-btn"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="sa-btn-primary text-xs px-3.5 py-2 inline-flex items-center gap-2"
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
