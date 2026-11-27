'use client';

import { Download, MessageSquare, Printer } from 'lucide-react';

interface ManagerAttendanceAbsenteeHeaderProps {
  title: string;
  subtitle: string;
  filteredCount: number;
  onPrint: () => void;
  onExportCsv: () => void;
  onOpenBulkWhatsApp: () => void;
}

export function ManagerAttendanceAbsenteeHeader({
  title,
  subtitle,
  filteredCount,
  onPrint,
  onExportCsv,
  onOpenBulkWhatsApp,
}: ManagerAttendanceAbsenteeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">{title}</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary font-bold border border-border">
            {filteredCount} Students
          </span>
        </div>
        <p className="text-xs sm:text-sm text-secondary mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
          title="Print Absentee Report"
        >
          <Printer size={14} />
          <span>Print Report</span>
        </button>

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
          title="Export Absentee Report as CSV"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>

        <button
          type="button"
          onClick={onOpenBulkWhatsApp}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs motion-safe:transition-colors cursor-pointer"
          title="Launch bulk WhatsApp alerts queue for absentees"
        >
          <MessageSquare size={14} />
          <span>Bulk WhatsApp Alerts ({filteredCount})</span>
        </button>
      </div>
    </div>
  );
}
