'use client';

import { AlertTriangle, Check, CheckCircle2, FileText } from 'lucide-react';

export interface ParsedImportMember {
  name: string;
  phone: string;
  email: string;
  plan: string;
  shift?: string;
  seat?: string;
  branch?: string;
  isValid: boolean;
  validationError?: string;
}

interface AdminMembersDirectoryBulkImportPreviewProps {
  fileName: string | null;
  parsedRows: readonly ParsedImportMember[];
  validCount: number;
  invalidCount: number;
  onReset: () => void;
}

export function AdminMembersDirectoryBulkImportPreview({
  fileName,
  parsedRows,
  validCount,
  invalidCount,
  onReset,
}: AdminMembersDirectoryBulkImportPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-highlight p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-focus bg-primary-subtle text-primary">
            <FileText size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary truncate max-w-xs">{fileName || 'Imported File'}</p>
            <p className="text-[11px] text-text-secondary">Total detected: {parsedRows.length} rows</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-1 text-xs font-semibold text-success-text">
            <CheckCircle2 size={13} aria-hidden="true" /> {validCount} Ready to Import
          </span>
          {invalidCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-danger bg-danger-bg px-2.5 py-1 text-xs font-semibold text-danger-text">
              <AlertTriangle size={13} aria-hidden="true" /> {invalidCount} Issues
            </span>
          )}
          <button type="button" onClick={onReset} className="text-xs text-text-secondary hover:text-text-primary underline underline-offset-2 ml-2">
            Change File
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card max-h-72 overflow-y-auto">
        <table className="w-full text-left text-xs text-text-secondary">
          <thead className="sticky top-0 bg-surface-highlight border-b border-border font-semibold text-text-secondary z-10">
            <tr>
              <th className="px-3.5 py-2.5">Status</th>
              <th className="px-3.5 py-2.5">Student Name</th>
              <th className="px-3.5 py-2.5">Phone</th>
              <th className="px-3.5 py-2.5">Email</th>
              <th className="px-3.5 py-2.5">Plan</th>
              <th className="px-3.5 py-2.5">Shift</th>
              <th className="px-3.5 py-2.5">Seat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {parsedRows.map((row, idx) => (
              <tr key={`import-row-${idx}`} className={`hover:bg-surface-hover ${!row.isValid ? 'bg-danger-bg' : ''}`}>
                <td className="px-3.5 py-2">
                  {row.isValid ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success-text">
                      <Check size={13} aria-hidden="true" /> Valid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-danger-text" title={row.validationError}>
                      <AlertTriangle size={13} aria-hidden="true" /> {row.validationError || 'Invalid'}
                    </span>
                  )}
                </td>
                <td className="px-3.5 py-2 font-medium text-text-primary">{row.name || '—'}</td>
                <td className="px-3.5 py-2 font-mono text-text-secondary">{row.phone || '—'}</td>
                <td className="px-3.5 py-2 font-mono text-text-secondary">{row.email || '—'}</td>
                <td className="px-3.5 py-2 text-primary">{row.plan}</td>
                <td className="px-3.5 py-2 text-text-secondary">{row.shift || 'Full Day'}</td>
                <td className="px-3.5 py-2 text-info-text">{row.seat ? `Seat ${row.seat}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
