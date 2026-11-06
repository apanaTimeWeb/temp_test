'use client';

import { useTranslations } from 'next-intl';
import { Target, RefreshCw, LayoutGrid, List, Plus, MessageCircle } from 'lucide-react';
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
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Titles & Meta Chips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-primary uppercase tracking-wider">{tManagerUi('crm_to_enquiries')}</span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-warning-bg text-warning border border-border">
              <Target size={12} />
              Lead Intelligence Pipeline
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-muted text-secondary border border-border">
              📍 Central Branch
            </span>
            {selectedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-success-bg text-success border border-border animate-in fade-in">
                ✓ {selectedCount} Selected
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {tManagerUi('enquiry_pipeline')}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-md bg-primary-subtle text-primary font-bold">
              {filteredCount} Leads • Scope: {horizonLabel}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {tManagerUi('track_every_prospect_from_enquiry_to_admission')}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
          {/* Quick Bulk WhatsApp CTA if selected */}
          {selectedCount > 0 && onOpenBulkWhatsApp && (
            <button
              type="button"
              onClick={onOpenBulkWhatsApp}
              className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
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
            className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-foreground hover:border-border hover:bg-surface-hover motion-safe:transition-all shadow-xs active:scale-95 disabled:opacity-60"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary' : ''} />
            <span className="hidden sm:inline">{isFetching ? 'Syncing...' : 'Sync Pipeline'}</span>
          </button>

          {/* View Mode Toggle */}
          <div className="inline-flex bg-muted p-1 rounded-xl border border-border">
            <button
              type="button"
              className={`min-h-9 min-w-9 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 motion-safe:transition-all ${
                view === 'kanban'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
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
              className={`min-h-9 min-w-9 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 motion-safe:transition-all ${
                view === 'table'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
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
            className="mgr-btn-primary min-h-11 px-4 rounded-xl shadow-xs inline-flex items-center gap-2 text-sm font-semibold"
            onClick={onAddEnquiry}
          >
            <Plus size={16} />
            <span>{tManagerUi('add_enquiry')}</span>
          </button>
        </div>
      </div>

      {/* Contract Warning Banner */}
      <div
        className="crm-contract-warning mt-4 flex items-center justify-between text-xs"
        role="status"
        data-testid="manager-crm-pipeline-contract-warning"
      >
        <span>{tManagerUi('crm_mutations_unavailable_host_contract')}</span>
        <span className="hidden sm:inline font-mono text-[10px] text-muted-foreground">LIVE MOCK PIPELINE ACTIVE</span>
      </div>
    </div>
  );
}

