'use client';

import type { ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { CheckCircle2, Clock, Flame, MapPin, Moon, Sun, Sunset, UserPlus, XCircle } from 'lucide-react';

export function ManagerMembersEnquiriesShiftBadge({
  shift,
  shiftLabels,
}: {
  shift: string;
  shiftLabels: Record<string, string>;
}) {
  const label = shiftLabels[shift] ?? shift;
  switch (shift) {
    case 'Morning':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Sun size={12} className="text-amber-400" />
          {label}
        </span>
      );
    case 'Afternoon':
    case 'Evening':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          <Sunset size={12} className="text-indigo-400" />
          {label}
        </span>
      );
    case 'Night':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <Moon size={12} className="text-purple-400" />
          {label}
        </span>
      );
    case 'Full Day':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          <Clock size={12} className="text-cyan-400" />
          {label}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">
          {label}
        </span>
      );
  }
}

export function ManagerMembersEnquiriesTablePagination({
  startItem,
  endItem,
  totalRows,
  pageSize,
  effectivePage,
  pageCount,
  onPageSizeChange,
  onPageChange,
}: {
  startItem: number;
  endItem: number;
  totalRows: number;
  pageSize: number;
  effectivePage: number;
  pageCount: number;
  onPageSizeChange: (nextSize: number) => void;
  onPageChange: (nextPage: number) => void;
}) {
  return (
    <div className="menq-table-footer flex flex-col sm:flex-row items-center justify-between gap-3 border-t px-4 py-3 text-sm text-slate-300">
      <span>Showing {startItem}–{endItem} of {totalRows} results</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <label htmlFor="rows-per-page-members-enquiries" className="text-xs text-slate-400 whitespace-nowrap">Rows per page:</label>
          <select
            id="rows-per-page-members-enquiries"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="menq-dark-select rounded-lg border px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-400 cursor-pointer"
          >
            <option value={10} className="menq-dark-option">10</option>
            <option value={25} className="menq-dark-option">25</option>
            <option value={50} className="menq-dark-option">50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-all"
            disabled={effectivePage <= 0}
            onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 px-1 font-medium">Page {effectivePage + 1} of {pageCount}</span>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-all"
            disabled={effectivePage >= pageCount - 1}
            onClick={() => onPageChange(Math.min(pageCount - 1, effectivePage + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export function ManagerMembersEnquiriesStatusBadge({
  status,
  statusLabels,
  lostReason,
}: {
  status: ManagerMembersEnquiriesEnquiryStatus;
  statusLabels: Record<ManagerMembersEnquiriesEnquiryStatus, string>;
  lostReason?: string;
}) {
  const label = statusLabels[status];
  switch (status) {
    case 'New':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
          <UserPlus size={11} className="text-sky-400" />
          {label}
        </span>
      );
    case 'Visited':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <MapPin size={11} className="text-amber-400" />
          {label}
        </span>
      );
    case 'Interested':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
          <Flame size={11} className="text-purple-400" />
          {label}
        </span>
      );
    case 'Converted':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 size={11} className="text-emerald-400" />
          {label}
        </span>
      );
    case 'Lost':
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30"
          title={lostReason ? `Lost Reason: ${lostReason}` : undefined}
        >
          <XCircle size={11} className="text-rose-400" />
          {label}
          {lostReason && (
            <span className="text-[10px] font-normal text-rose-300/80 ml-1">
              ({lostReason.split('/')[0].trim()})
            </span>
          )}
        </span>
      );
  }
}
