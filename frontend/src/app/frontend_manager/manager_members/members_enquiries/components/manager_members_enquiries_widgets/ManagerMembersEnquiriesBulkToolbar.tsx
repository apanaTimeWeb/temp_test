'use client';

import { CheckSquare, MessageCircle, X, Users, UserCheck, Flame, Sparkles } from 'lucide-react';
import type { ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

export interface ManagerMembersEnquiriesBulkToolbarProps {
  selectedCount: number;
  totalFilteredCount: number;
  onSelectAllFiltered: () => void;
  onSelectByStatus: (status: ManagerMembersEnquiriesEnquiryStatus) => void;
  onClearSelection: () => void;
  onOpenBulkWhatsApp: () => void;
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
  visitedCount,
  newCount,
  interestedCount,
}: ManagerMembersEnquiriesBulkToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      aria-label="Bulk Lead Actions Toolbar"
      className="p-3.5 sm:p-4 rounded-2xl bg-card border-2 border-emerald-500 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Left: Selection Counter & Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success-bg text-success border border-border text-xs font-bold">
          <CheckSquare size={14} />
          <span>{selectedCount} Leads Selected</span>
        </div>

        <span className="text-muted-foreground text-xs hidden sm:inline">•</span>

        {/* Quick selection chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={onSelectAllFiltered}
            className="px-2.5 py-1 rounded-lg border border-border bg-surface-highlight hover:bg-surface-hover text-foreground font-medium transition-colors cursor-pointer"
            title="Select all current filtered leads"
          >
            <span className="flex items-center gap-1">
              <Users size={12} className="text-primary" />
              All Filtered ({totalFilteredCount})
            </span>
          </button>

          {visitedCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectByStatus('Visited')}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface-highlight hover:bg-surface-hover text-foreground font-medium transition-colors cursor-pointer"
              title="Select all leads who visited"
            >
              <span className="flex items-center gap-1">
                <UserCheck size={12} className="text-info" />
                Visited ({visitedCount})
              </span>
            </button>
          )}

          {newCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectByStatus('New')}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface-highlight hover:bg-surface-hover text-foreground font-medium transition-colors cursor-pointer"
              title="Select all new leads"
            >
              <span className="flex items-center gap-1">
                <Sparkles size={12} className="text-warning" />
                New ({newCount})
              </span>
            </button>
          )}

          {interestedCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectByStatus('Interested')}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface-highlight hover:bg-surface-hover text-foreground font-medium transition-colors cursor-pointer"
              title="Select all interested leads"
            >
              <span className="flex items-center gap-1">
                <Flame size={12} className="text-danger" />
                Interested ({interestedCount})
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline px-2 py-1 transition-colors cursor-pointer"
          >
            <X size={12} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Right: Primary Action Button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenBulkWhatsApp}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm hover:shadow transition-all hover:scale-[1.02] cursor-pointer"
        >
          <MessageCircle size={16} />
          <span>Launch WhatsApp Queue ({selectedCount})</span>
        </button>
      </div>
    </div>
  );
}
