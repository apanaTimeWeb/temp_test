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
      <div className="flex gap-2 flex-wrap">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".csv"
          className="hidden"
          aria-label="Upload CSV renewals file"
        />
        <button type="button" onClick={onImportClick} className="fin-btn fin-btn-secondary cursor-pointer hover:bg-surface-hover" title={importLabel}>
          <Upload size={14} className="mr-1" /> {importLabel}
        </button>
        <button type="button" onClick={onExportCsv} disabled={!hasVisibleRows} className="fin-btn fin-btn-secondary cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title="Export CSV">
          <Download size={14} className="mr-1" /> Export CSV
        </button>
        <button type="button" onClick={onPrint} disabled={!hasVisibleRows} className="fin-btn fin-btn-secondary cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title="Print Renewals" data-testid="manager-finance-renewals-print">
          <Printer size={14} className="mr-1" /> Print
        </button>
        <button type="button" onClick={onWhatsAppAll} disabled={!hasVisibleRows} className="fin-btn fin-btn-secondary text-success cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title={waAllLabel}>
          <MessageSquare size={14} className="mr-1" /> {waAllLabel}
        </button>
        <button type="button" onClick={onEmailAll} disabled={!hasVisibleRows} className="fin-btn fin-btn-secondary text-purple cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title={emailAllLabel}>
          <Mail size={14} className="mr-1" /> {emailAllLabel}
        </button>
        <button type="button" onClick={onRemindAll} disabled={!hasVisibleRows} className="fin-btn fin-btn-secondary cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title={remindAllLabel}>
          <Send size={14} className="mr-1 text-amber-500" /> {remindAllLabel}
        </button>
      </div>
    </div>
  );
}

