'use client';

import {
Armchair,
ArrowDown,
ArrowUp,
ArrowUpDown,
CheckCircle,
Eye,
MessageSquare,
RefreshCw,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import type {
ManagerCommunicationComplaintsComplaint,
ManagerCommunicationComplaintsComplaintStatus,
} from '../../types/ManagerCommunicationComplaintsTypes';

export type ComplaintSortField = 'title' | 'student' | 'description' | 'status' | 'date' | 'resolvedBy';

interface ManagerCommunicationComplaintsTableProps {
  paginated: ManagerCommunicationComplaintsComplaint[];
  totalRows: number;
  startItem: number;
  endItem: number;
  effectivePage: number;
  pageCount: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  setPage: (updater: number | ((prev: number) => number)) => void;
  expandedDesc: string[];
  toggleDesc: (id: string) => void;
  statusBadge: (status: ManagerCommunicationComplaintsComplaintStatus) => React.ReactNode;
  formatDate: (val: string) => string;
  onViewItem: (complaint: ManagerCommunicationComplaintsComplaint) => void;
  sortField: ComplaintSortField | null;
  sortDirection: 'asc' | 'desc';
  toggleSort: (field: ComplaintSortField) => void;
  onStatusChange?: (id: string, newStatus: ManagerCommunicationComplaintsComplaintStatus) => void;
  onResolveClick?: (complaint: ManagerCommunicationComplaintsComplaint) => void;
}

export function ManagerCommunicationComplaintsTable({
  paginated,
  totalRows,
  startItem,
  endItem,
  effectivePage,
  pageCount,
  pageSize,
  setPageSize,
  setPage,
  expandedDesc,
  toggleDesc,
  statusBadge,
  formatDate,
  onViewItem,
  sortField,
  sortDirection,
  toggleSort,
  onStatusChange,
  onResolveClick,
}: ManagerCommunicationComplaintsTableProps) {
  const tManagerUi = useTranslations('manager.manager_complaints.ui');

  const renderSortableHeader = (field: ComplaintSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="px-3 py-3"
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${
            isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'
          }`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown
              size={14}
              className="text-secondary group-hover:text-secondary transition-colors shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="mc-scroll-x overflow-x-auto">
      <table className="mc-table w-full">
        <caption className="sr-only">{tManagerUi('complaints')}</caption>
        <thead>
          <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold">
            <th scope="col" className="px-3 py-3">
              #
            </th>
            {renderSortableHeader('title', tManagerUi('title'))}
            {renderSortableHeader('student', tManagerUi('student'))}
            {renderSortableHeader('description', tManagerUi('description'))}
            {renderSortableHeader('status', tManagerUi('status'))}
            {renderSortableHeader('date', tManagerUi('date'))}
            {renderSortableHeader('resolvedBy', tManagerUi('resolved_by'))}
            <th scope="col" className="px-3 py-3">
              {tManagerUi('resolved_date')}
            </th>
            <th scope="col" className="px-3 py-3">
              {tManagerUi('actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((complaint, index) => {
            const expanded = expandedDesc.includes(complaint.id);
            const long = complaint.description.length > 60;
            const rowNumber = effectivePage * pageSize + index + 1;
            const locationTag = complaint.seatTag || 'General Area';

            return (
              <tr
                key={complaint.id}
                className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra h-12"
              >
                <td className="mc-td-mono px-3 py-3 align-middle">{rowNumber}</td>
                {/* Title & Seat Tag */}
                <td className="mc-td-bold px-3 py-3 align-middle">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>{complaint.title}</span>
                      {complaint.priority === 'Urgent' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          URGENT
                        </span>
                      )}
                    </div>
                    {/* Explicit Seat / Location Badge */}
                    <div>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/25 font-mono text-[10px] font-bold">
                        <Armchair size={10} className="text-amber-400 shrink-0" />
                        <span>{locationTag}</span>
                      </span>
                    </div>
                  </div>
                </td>
                {/* Student Info */}
                <td className="px-3 py-3 align-middle">
                  <div className="space-y-0.5">
                    <span className="font-semibold block text-primary">{complaint.student ?? 'Anonymous'}</span>
                    {complaint.phone && (
                      <span className="text-[10px] text-secondary font-mono block">+91 {complaint.phone}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 align-middle">
                  <span>
                    {long && !expanded ? `${complaint.description.slice(0, 60)}…` : complaint.description}
                  </span>
                  {long && (
                    <button
                      type="button"
                      onClick={() => toggleDesc(complaint.id)}
                      className="mc-link-btn ml-1 cursor-pointer"
                    >
                      {expanded ? tManagerUi('less') : tManagerUi('more')}
                    </button>
                  )}
                </td>
                <td className="px-3 py-3 align-middle">{statusBadge(complaint.status)}</td>
                <td className="mc-td-muted px-3 py-3 align-middle">{formatDate(complaint.date)}</td>
                <td className="mc-td-muted px-3 py-3 align-middle">{complaint.resolvedBy ?? '—'}</td>
                <td className="mc-td-muted px-3 py-3 align-middle">
                  {complaint.resolvedDate ? formatDate(complaint.resolvedDate) : '—'}
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex items-center gap-1.5">
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => onViewItem(complaint)}
                      className="p-1.5 rounded-lg border border-border bg-card/60 text-secondary hover:text-primary hover:border-border-focus hover:bg-surface-hover transition-colors cursor-pointer"
                      title={tManagerUi('view')}
                      aria-label={tManagerUi('view_complaint')}
                    >
                      <Eye size={13} />
                    </button>

                    {/* Mark In-Progress */}
                    {complaint.status === 'Open' && (
                      <button
                        type="button"
                        onClick={onStatusChange ? () => onStatusChange(complaint.id, 'In-Progress') : undefined}
                        disabled={!onStatusChange}
                        className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                        title="Mark as In-Progress"
                        aria-label={`Mark #${complaint.id} in progress`}
                      >
                        <RefreshCw size={13} />
                      </button>
                    )}

                    {/* Mark Resolved -> Triggers Resolution WhatsApp Modal */}
                    {complaint.status !== 'Resolved' && (
                      <button
                        type="button"
                        onClick={
                          onResolveClick
                            ? () => onResolveClick(complaint)
                            : onStatusChange
                            ? () => onStatusChange(complaint.id, 'Resolved')
                            : undefined
                        }
                        className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                        title="Resolve & Send WhatsApp"
                        aria-label={`Mark #${complaint.id} resolved`}
                      >
                        <CheckCircle size={13} />
                      </button>
                    )}

                    {/* WhatsApp Student Direct Action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const studentName = complaint.student || 'Student';
                        let cleanPhone = (complaint.phone || '9876543210').replace(/\D/g, '');
                        if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
                        const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                        const resolutionText = complaint.resolvedNote ? `\nResolution: ${complaint.resolvedNote}` : '';
                        const text = encodeURIComponent(
                          `Hello ${studentName},\nRegarding your query #${complaint.id} ("${complaint.title}") at [${locationTag}]:\nCurrent status is: ${complaint.status}.${resolutionText}\n— Central Library Team`
                        );
                        window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                      title="Open WhatsApp chat with student"
                      aria-label="WhatsApp student"
                    >
                      <MessageSquare size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-3 border-t border-border text-xs text-secondary">
        <div>
          Showing {totalRows === 0 ? 0 : startItem}–{endItem} of {totalRows} complaints
        </div>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="mgr-select text-xs py-1 px-2"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1 ml-2">
            <button
              type="button"
              disabled={effectivePage <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-surface-hover cursor-pointer"
            >
              Previous
            </button>
            <span className="px-2 font-mono">
              {effectivePage + 1} / {Math.max(1, pageCount)}
            </span>
            <button
              type="button"
              disabled={effectivePage + 1 >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-surface-hover cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
