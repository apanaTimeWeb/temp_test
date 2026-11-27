'use client';

import { Download, Mail, MessageSquare, Printer, RefreshCw, Smartphone, Upload } from 'lucide-react';

interface ManagerFinanceSubscriptionsHeaderProps {
  title: string;
  importLabel: string;
  onQuickRenew: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
  onImport: () => void;
  onWhatsApp: () => void;
  onSms: () => void;
  onEmail: () => void;
}

export default function ManagerFinanceSubscriptionsHeader({
  title,
  importLabel,
  onQuickRenew,
  onExportCsv,
  onPrint,
  onImport,
  onWhatsApp,
  onSms,
  onEmail,
}: ManagerFinanceSubscriptionsHeaderProps) {
  return (
    <div className="flex justify-between items-start flex-wrap gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="fin-page-title">{title}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
            Active Registry
          </span>
        </div>
        <p className="fin-page-subtitle">
          Track member subscription plans, renewal schedules, expiry alerts, and payment records.
        </p>
      </div>
      <div className="flex gap-2.5 flex-wrap items-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer motion-safe:transition-all active:scale-[0.98]"
          onClick={onQuickRenew}
          title="Renew Student Subscription Plan"
        >
          <RefreshCw size={13} />
          <span>Renew Plan</span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer motion-safe:transition-all"
          onClick={onExportCsv}
          title="Export CSV"
        >
          <Download size={13} className="text-secondary" />
          <span>Export CSV</span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer motion-safe:transition-all"
          onClick={onPrint}
          title="Print Subscription Summary"
        >
          <Printer size={13} className="text-secondary" />
          <span>Print</span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer motion-safe:transition-all"
          onClick={onImport}
          title={importLabel}
        >
          <Upload size={13} className="text-secondary" />
          <span>{importLabel}</span>
        </button>
        <div className="flex items-center gap-1.5 pl-3 border-l border-border">
          <button
            type="button"
            className="fin-sub-wa-icon p-2 rounded-xl border border-border bg-card hover:bg-emerald-500/10 motion-safe:transition-colors cursor-pointer shadow-xs"
            onClick={onWhatsApp}
            title="Send WhatsApp Notice"
          >
            <MessageSquare size={14} />
          </button>
          <button
            type="button"
            className="fin-sub-sms-icon p-2 rounded-xl border border-border bg-card hover:bg-sky-500/10 motion-safe:transition-colors cursor-pointer shadow-xs"
            onClick={onSms}
            title="Dispatch SMS Notice"
          >
            <Smartphone size={14} />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl border border-border bg-card hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 motion-safe:transition-colors cursor-pointer shadow-xs"
            onClick={onEmail}
            title="Dispatch Email Statement"
          >
            <Mail size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
