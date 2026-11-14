'use client';

import { useTranslations } from 'next-intl';
import { RefreshCw, LayoutGrid, List, Plus, MessageCircle } from 'lucide-react';
import type { ManagerMembersEnquiriesBoardViewMode } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';

export interface ManagerMembersEnquiriesHeaderBannerProps {
  filteredCount: number;
  horizonLabel: string;
  isFetching: boolean;
  onRefresh: () => void;
  view: ManagerMembersEnquiriesBoardViewMode;
  onViewChange: (view: ManagerMembersEnquiriesBoardViewMode) => void;
  onAddEnquiry: () => void;
  selectedCount?: number;
  onOpenBulkWhatsApp?: () => void;
}

export function ManagerMembersEnquiriesHeaderBanner({
  filteredCount,
  horizonLabel,
  isFetching,
  onRefresh,
  view,
  onViewChange,
  onAddEnquiry,
  selectedCount = 0,
  onOpenBulkWhatsApp,
}: ManagerMembersEnquiriesHeaderBannerProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Titles & Meta Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Enquiries
            </span>
            {selectedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 animate-in fade-in">
                ✓ {selectedCount} Selected
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Student Enquiries
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
              {filteredCount} Enquiries • {horizonLabel}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            Manage incoming student enquiries, seat requirement follow-ups, and admissions.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
          {/* Quick Bulk WhatsApp CTA if selected */}
          {selectedCount > 0 && onOpenBulkWhatsApp && (
            <button
              type="button"
              onClick={onOpenBulkWhatsApp}
              className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] cursor-pointer"
              title="Dispatch WhatsApp Queue to selected leads"
            >
              <MessageCircle size={15} />
              <span>Bulk WhatsApp ({selectedCount})</span>
            </button>
          )}

          {/* Live Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            title="Refresh CRM Pipeline"
            className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 motion-safe:transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin text-indigo-400' : 'text-indigo-400'} />
            <span className="hidden sm:inline">{isFetching ? 'Syncing...' : 'Sync Pipeline'}</span>
          </button>

          {/* View Mode Toggle */}
          <div className="inline-flex bg-[#060818] p-1 rounded-xl border border-indigo-500/25">
            <button
              type="button"
              className={`min-h-9 min-w-9 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 motion-safe:transition-all cursor-pointer ${
                view === 'kanban'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => onViewChange('kanban')}
              title={tManagerUi('kanban_view')}
              aria-label={tManagerUi('show_kanban_view')}
              aria-pressed={view === 'kanban'}
            >
              <LayoutGrid size={15} />
              <span className="hidden md:inline">Kanban</span>
            </button>
            <button
              type="button"
              className={`min-h-9 min-w-9 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 motion-safe:transition-all cursor-pointer ${
                view === 'table'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => onViewChange('table')}
              title={tManagerUi('table_view')}
              aria-label={tManagerUi('show_table_view')}
              aria-pressed={view === 'table'}
            >
              <List size={15} />
              <span className="hidden md:inline">Table</span>
            </button>
          </div>

          {/* Add Enquiry Primary CTA */}
          <button
            type="button"
            className="min-h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-950/50 inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            onClick={onAddEnquiry}
          >
            <Plus size={16} />
            <span>{tManagerUi('add_enquiry')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
