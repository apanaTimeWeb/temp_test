'use client';

import React from 'react';
import { Upload, Download, Printer, MessageSquare, Mail, Send } from 'lucide-react';

export interface ManagerFinanceRenewalsHeaderProps {
  renewalsTitle: string;
  renewalsSubtitle: string;
  sampleWarningText: string;
  importLabel: string;
  waAllLabel: string;
  emailAllLabel: string;
  remindAllLabel: string;
  hasVisibleRows: boolean;
  onImportClick: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
  onWhatsAppAll: () => void;
  onEmailAll: () => void;
  onRemindAll: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ManagerFinanceRenewalsHeader({
  renewalsTitle,
  renewalsSubtitle,
  sampleWarningText,
  importLabel,
  waAllLabel,
  emailAllLabel,
  remindAllLabel,
  hasVisibleRows,
  onImportClick,
  onExportCsv,
  onPrint,
  onWhatsAppAll,
  onEmailAll,
  onRemindAll,
  fileInputRef,
  onFileChange,
}: ManagerFinanceRenewalsHeaderProps) {
  return (
    <div className="flex justify-between items-start flex-wrap gap-4">
      <div>
        <h1 className="fin-page-title">{renewalsTitle}</h1>
        <p className="fin-page-subtitle">{renewalsSubtitle}</p>
        <p className="fin-input-hint fin-text-warning mt-2" data-testid="manager-finance-renewals-sample-warning" role="status">
          {sampleWarningText}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".csv"
          className="hidden"
          aria-label="Upload CSV renewals file"
        />
        <button type="button" onClick={onImportClick} className="mgr-btn-outline text-xs flex items-center gap-1.5 cursor-pointer hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" title={importLabel}>
          <Upload size={13} /> {importLabel}
        </button>
        <button type="button" onClick={onExportCsv} disabled={!hasVisibleRows} className="mgr-btn-outline text-xs flex items-center gap-1.5 cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" title="Export CSV">
          <Download size={13} /> Export CSV
        </button>
        <button type="button" onClick={onPrint} disabled={!hasVisibleRows} className="mgr-btn-outline text-xs flex items-center gap-1.5 cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" title="Print Renewals" data-testid="manager-finance-renewals-print">
          <Printer size={13} /> Print
        </button>
        <div className="flex items-center gap-1 pl-2 border-l border-border">
          <button type="button" onClick={onWhatsAppAll} disabled={!hasVisibleRows} className="mgr-btn-ghost text-xs text-success p-2 rounded-lg cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" title={waAllLabel}>
            <MessageSquare size={14} />
          </button>
          <button type="button" onClick={onEmailAll} disabled={!hasVisibleRows} className="mgr-btn-ghost text-xs text-purple p-2 rounded-lg cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" title={emailAllLabel}>
            <Mail size={14} />
          </button>
          <button type="button" onClick={onRemindAll} disabled={!hasVisibleRows} className="mgr-btn-ghost text-xs text-amber-500 p-2 rounded-lg cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" title={remindAllLabel}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

