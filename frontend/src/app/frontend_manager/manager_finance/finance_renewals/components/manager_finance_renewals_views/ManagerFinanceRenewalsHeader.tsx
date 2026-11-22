'use client';

import { Download,Mail,MessageCircle,Printer,Smartphone,Upload } from 'lucide-react';
import React from 'react';

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
        <div className="flex items-center gap-3">
          <h1 className="fin-page-title">{renewalsTitle}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Renewal Desk
          </span>
        </div>
        <p className="fin-page-subtitle">{renewalsSubtitle}</p>
        <p
          style={{ display: 'none' }}
          data-testid="manager-finance-renewals-sample-warning"
          role="status"
        >
          {sampleWarningText}
        </p>
      </div>
      <div className="flex gap-2.5 flex-wrap items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".csv"
          className="hidden"
          aria-label="Upload CSV renewals file"
        />
        <button
          type="button"
          onClick={onImportClick}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all"
          title={importLabel}
        >
          <Upload size={13} className="text-secondary" />
          <span>{importLabel}</span>
        </button>
        <button
          type="button"
          onClick={onExportCsv}
          disabled={!hasVisibleRows}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Export CSV"
        >
          <Download size={13} className="text-secondary" />
          <span>Export CSV</span>
        </button>
        <button
          type="button"
          onClick={onPrint}
          disabled={!hasVisibleRows}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Print Renewals"
          data-testid="manager-finance-renewals-print"
        >
          <Printer size={13} className="text-secondary" />
          <span>Print</span>
        </button>
        <div className="flex items-center gap-1.5 pl-3 border-l border-border">
          <button
            type="button"
            onClick={onWhatsAppAll}
            disabled={!hasVisibleRows}
            className="p-2 rounded-xl border border-border bg-card hover:bg-emerald-500/10 text-[#25D366] transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send WhatsApp to All (WhatsApp All)"
            aria-label="Send WhatsApp to All"
          >
            <MessageCircle size={15} />
          </button>
          <button
            type="button"
            onClick={onEmailAll}
            disabled={!hasVisibleRows}
            className="p-2 rounded-xl border border-border bg-card hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send Email to All (Email All)"
            aria-label="Send Email to All"
          >
            <Mail size={15} />
          </button>
          <button
            type="button"
            onClick={onRemindAll}
            disabled={!hasVisibleRows}
            className="p-2 rounded-xl border border-border bg-card hover:bg-amber-500/10 text-amber-500 dark:text-amber-400 transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send SMS to All (SMS All)"
            aria-label="Send SMS to All"
          >
            <Smartphone size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

