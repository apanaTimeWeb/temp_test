'use client';

import { CheckSquare, MessageCircle, X, Users, UserCheck, Flame, UserPlus, Trash2 } from 'lucide-react';
import type { ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

export interface ManagerMembersEnquiriesBulkToolbarProps {
  selectedCount: number;
  totalFilteredCount: number;
  onSelectAllFiltered: () => void;
  onSelectByStatus: (status: ManagerMembersEnquiriesEnquiryStatus) => void;
  onClearSelection: () => void;
  onOpenBulkWhatsApp: () => void;
  onBulkDelete?: () => void;
  visitedCount: number;
  newCount: number;
  interestedCount: number;
}

export function ManagerMembersEnquiriesBulkToolbar({
  selectedCount,
  totalFilteredCount,
  onSelectAllFiltered,
  onSelectByStatus,
  onClearSelection,
  onOpenBulkWhatsApp,
  onBulkDelete,
  visitedCount,
  newCount,
  interestedCount,
}: ManagerMembersEnquiriesBulkToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      aria-label="Bulk Lead Actions Toolbar"
      className="p-3.5 sm:p-4 rounded-2xl bg-[#0c0f28]/98 border border-emerald-500/40 shadow-xl shadow-black/40 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Left: Selection Counter & Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
          <CheckSquare size={14} className="text-emerald-400" />
          <span>{selectedCount} Leads Selected</span>
        </div>

        <span className="text-slate-500 text-xs hidden sm:inline">•</span>

        {/* Quick selection chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={onSelectAllFiltered}
            className="px-2.5 py-1 rounded-lg border border-indigo-500/25 bg-[#060818] hover:bg-indigo-500/15 text-slate-200 font-medium transition-colors cursor-pointer"
            title="Select all current filtered leads"
          >
            <span className="flex items-center gap-1.5">
              <Users size={12} className="text-indigo-400" />
              All Filtered ({totalFilteredCount})
            </span>
          </button>

          {visitedCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectByStatus('Visited')}
              className="px-2.5 py-1 rounded-lg border border-cyan-500/25 bg-[#060818] hover:bg-cyan-500/15 text-slate-200 font-medium transition-colors cursor-pointer"
              title="Select all leads who visited"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck size={12} className="text-cyan-400" />
                Visited ({visitedCount})
              </span>
            </button>
          )}

          {newCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectByStatus('New')}
              className="px-2.5 py-1 rounded-lg border border-sky-500/25 bg-[#060818] hover:bg-sky-500/15 text-slate-200 font-medium transition-colors cursor-pointer"
              title="Select all new leads"
            >
              <span className="flex items-center gap-1.5">
                <UserPlus size={12} className="text-sky-400" />
                New ({newCount})
              </span>
            </button>
          )}

          {interestedCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectByStatus('Interested')}
              className="px-2.5 py-1 rounded-lg border border-purple-500/25 bg-[#060818] hover:bg-purple-500/15 text-slate-200 font-medium transition-colors cursor-pointer"
              title="Select all interested leads"
            >
              <span className="flex items-center gap-1.5">
                <Flame size={12} className="text-purple-400" />
                Interested ({interestedCount})
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 hover:underline px-2 py-1 transition-colors cursor-pointer"
          >
            <X size={12} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Right: Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {onBulkDelete && (
          <button
            type="button"
            onClick={onBulkDelete}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition-all hover:scale-[1.02] cursor-pointer"
            title="Delete selected leads"
          >
            <Trash2 size={15} />
            <span>Delete Selected ({selectedCount})</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenBulkWhatsApp}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <MessageCircle size={16} />
          <span>Launch WhatsApp Queue ({selectedCount})</span>
        </button>
      </div>
    </div>
  );
}
