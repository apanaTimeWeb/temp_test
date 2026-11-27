'use client';

import { AdminFinanceAutoSuspendEmptyState } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendEmptyState';
import type {
  AdminFinanceAutoSuspendSuspendedStudent,
  SuspendSortField,
} from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import {
  AlertTriangle, Armchair, ArrowDown, ArrowUp, ArrowUpDown, Building,
  Calendar, Check, ChevronLeft, ChevronRight, Clock, MessageCircle, QrCode, RotateCcw,
} from 'lucide-react';

export interface AdminFinanceAutoSuspendTableProps {
  filtered: AdminFinanceAutoSuspendSuspendedStudent[];
  paginated: AdminFinanceAutoSuspendSuspendedStudent[];
  totalRows: number;
  startItem: number;
  endItem: number;
  pageSize: number;
  effectivePage: number;
  pageCount: number;
  sortField: SuspendSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: SuspendSortField) => void;
  onPageSizeChange: (size: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSendReminder: (student: AdminFinanceAutoSuspendSuspendedStudent) => void;
  onRestoreStudent: (student: AdminFinanceAutoSuspendSuspendedStudent) => void;
  onTestKioskScan: (student: AdminFinanceAutoSuspendSuspendedStudent) => void;
  remindedStudents?: Record<number, string>;
  shiftLabels: Record<string, string>;
  labels: {
    student: string;
    seat: string;
    shift: string;
    branch: string;
    dues: string;
    daysOverdue: string;
    suspendedSince: string;
    actions: string;
    noStudents: string;
  };
}

export function AdminFinanceAutoSuspendTable({
  paginated,
  totalRows,
  startItem,
  endItem,
  pageSize,
  effectivePage,
  pageCount,
  sortField,
  sortDirection,
  onToggleSort,
  onPageSizeChange,
  onPrevPage,
  onNextPage,
  onSendReminder,
  onRestoreStudent,
  onTestKioskScan,
  remindedStudents = {},
  shiftLabels,
  labels,
}: AdminFinanceAutoSuspendTableProps) {
  const renderSortableHeader = (field: SuspendSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="text-left py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-text-secondary"
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className="group inline-flex items-center gap-1.5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 motion-safe:transition-colors cursor-pointer"
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={13} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={13} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={13} className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-highlight">
              {renderSortableHeader('studentName', labels.student)}
              {renderSortableHeader('seat', labels.seat)}
              <th scope="col" className="text-left py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-text-secondary">
                {labels.branch}
              </th>
              {renderSortableHeader('duesAmount', labels.dues)}
              {renderSortableHeader('daysOverdue', labels.daysOverdue)}
              {renderSortableHeader('suspendedSince', labels.suspendedSince)}
              <th scope="col" className="text-right py-3.5 px-4 font-semibold text-xs uppercase tracking-wider text-text-secondary">
                {labels.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card text-xs">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12">
                  <AdminFinanceAutoSuspendEmptyState>
                    <div className="p-3 rounded-full bg-surface-highlight border border-border w-12 h-12 flex items-center justify-center mx-auto mb-3 text-text-secondary">
                      <AlertTriangle size={20} aria-hidden="true" />
                    </div>
                    <p className="font-semibold text-text-primary">{labels.noStudents}</p>
                    <p className="text-xs text-text-secondary mt-1">Try adjusting your search criteria or shift filters.</p>
                  </AdminFinanceAutoSuspendEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((student) => {
                const isSeverelyOverdue = student.daysOverdue >= 14;
                const wasReminded = remindedStudents[student.id];

                return (
                  <tr key={student.id} className="hover:bg-surface-hover motion-safe:transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-danger-bg text-danger-text border border-danger flex items-center justify-center shrink-0 font-bold text-xs">
                          {student.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-text-primary flex items-center gap-2">
                            <span>{student.studentName}</span>
                            <span className="font-mono text-[11px] font-semibold text-text-secondary">({student.smartId})</span>
                          </div>
                          {student.phone && <div className="text-[11px] text-text-secondary mt-0.5">+91 {student.phone}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-text-primary bg-surface-highlight border border-border">
                          <Armchair size={12} className="text-text-secondary" aria-hidden="true" />
                          <span>Seat {student.seat}</span>
                        </div>
                        <div className="text-[11px] text-text-secondary">{shiftLabels[student.shift] || student.shift}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-highlight text-text-secondary border border-border">
                        <Building size={11} aria-hidden="true" />
                        {student.branch || 'Downtown Central'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-danger-text">₹{(student.duesAmount || 1500).toLocaleString('en-IN')}</span>
                        <div className="text-[11px] text-text-secondary">{student.planName || 'Monthly Sub'}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          isSeverelyOverdue ? 'bg-danger-bg text-danger-text border-danger' : 'bg-warning-bg text-warning-text border-warning'
                        }`}
                      >
                        <Clock size={11} aria-hidden="true" />
                        <span>{student.daysOverdue} Days Due</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Calendar size={12} aria-hidden="true" />
                        <span>{student.suspendedSince}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onTestKioskScan(student)}
                          aria-label={`Simulate Turnstile Gate QR Scan for ${student.studentName}`}
                          className="p-1.5 rounded-lg border border-border bg-card hover:bg-surface-hover text-text-secondary hover:text-text-primary cursor-pointer motion-safe:transition-colors"
                          title="Simulate Turnstile Gate QR Scan for this student"
                        >
                          <QrCode size={14} aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onSendReminder(student)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border motion-safe:transition-colors cursor-pointer ${
                            wasReminded
                              ? 'bg-success-bg text-success-text border-success'
                              : 'bg-primary hover:bg-primary-hover text-on-primary border-transparent shadow-card'
                          }`}
                          title={wasReminded ? `Reminded at ${wasReminded}` : 'Send WhatsApp Reminder'}
                        >
                          {wasReminded ? (
                            <>
                              <Check size={12} aria-hidden="true" />
                              <span className="hidden sm:inline">Sent {wasReminded}</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle size={12} aria-hidden="true" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onRestoreStudent(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-card hover:bg-surface-hover border border-border text-text-primary cursor-pointer motion-safe:transition-colors"
                          title="Restore student seat access & clear suspension"
                        >
                          <RotateCcw size={12} className="text-text-secondary" aria-hidden="true" />
                          <span className="hidden sm:inline">Restore</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary px-1">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            aria-label="Rows per page"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="p-1 rounded-lg border border-border bg-input text-text-primary text-xs cursor-pointer focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-text-secondary ml-2">
            Showing <strong className="text-text-primary">{startItem}</strong> - <strong className="text-text-primary">{endItem}</strong> of <strong className="text-text-primary">{totalRows}</strong> defaulters
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-secondary">
            Page {effectivePage + 1} of {pageCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={effectivePage <= 0}
              onClick={onPrevPage}
              aria-label="Previous Page"
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-text-primary motion-safe:transition-colors"
              title="Previous Page"
            >
              <ChevronLeft size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={effectivePage >= pageCount - 1}
              onClick={onNextPage}
              aria-label="Next Page"
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-text-primary motion-safe:transition-colors"
              title="Next Page"
            >
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
