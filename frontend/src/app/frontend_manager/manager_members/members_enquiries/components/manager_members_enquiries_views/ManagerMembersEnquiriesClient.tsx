'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import {
  useManagerMembersEnquiries,
  type ManagerCrmTimeHorizon,
} from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesEnquiries';
import { ManagerMembersEnquiriesHeaderBanner } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_sections/ManagerMembersEnquiriesHeaderBanner';
import { ManagerMembersEnquiriesBulkToolbar } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesBulkToolbar';
import { ManagerMembersEnquiriesBulkWhatsAppModal } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesBulkWhatsAppModal';
import { ManagerMembersEnquiriesKanban } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesKanban';
import { ManagerMembersEnquiriesTable } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_table_parts/ManagerMembersEnquiriesTable';
import { ManagerMembersEnquiriesKpis } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesKpis';
import { ManagerMembersEnquiriesTimeHorizonBar } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesTimeHorizonBar';
import { ManagerMembersEnquiriesToolbar } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesToolbar';

// RESPONSIBILITY: Main Client view for CRM Enquiries with Executive Pipeline Analytics, Horizon Filtering and Bulk WhatsApp Dispatch.

export function ManagerMembersEnquiriesClient() {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const router = useRouter();

  const {
    isError,
    isPending,
    isFetching,
    refetch,
    filtered,
    view,
    setView,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    timeHorizon,
    setTimeHorizon,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    stats,
    getCardsByStatus,
    selectedIds,
    selectedEnquiries,
    bulkWhatsAppModalOpen,
    setBulkWhatsAppModalOpen,
    toggleSelectOne,
    toggleSelectAll,
    selectByStatus,
    selectAllFiltered,
    clearSelection,
  } = useManagerMembersEnquiries();

  const statusLabels = {
    New: tManagerUi('new'),
    Visited: tManagerUi('visited'),
    Interested: tManagerUi('interested'),
    Converted: tManagerUi('converted'),
    Lost: tManagerUi('lost'),
  };

  const horizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'all': return 'All Time';
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom':
        return customStartDate && customEndDate
          ? `${customStartDate} to ${customEndDate}`
          : 'Custom Range';
      default: return 'All Time';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const handleExportCsv = () => {
    const headers = `CRM Enquiries Export - Scope: ${horizonLabel}\nName,Phone,Shift,Status,Handled By,Date\n`;
    const rows = filtered
      .map((e) => `"${e.name}","${e.phone}","${e.shift}","${e.status}","${e.handledBy || ''}","${e.addedDate || ''}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `crm_enquiries_${horizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const timeHorizonOptions: Array<{ id: ManagerCrmTimeHorizon; label: string }> = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  if (isError) {
    return (
      <section className="crm-page p-6 sm:p-8" role="alert" aria-live="assertive">
        <div className="rounded-2xl border border-border bg-danger-bg p-8 text-center max-w-xl mx-auto shadow-xs">
          <p className="text-destructive font-semibold text-base mb-1">{tManagerUi('unable_to_load_the_enquiry_pipeline')}</p>
          <p className="text-secondary text-sm mb-6">{tManagerUi('check_your_connection_and_try_again')}</p>
          <button
            type="button"
            className="mgr-btn-primary inline-flex items-center gap-2"
            onClick={() => { void refetch(); }}
            disabled={isFetching}
          >
            <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
            {isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}
          </button>
        </div>
      </section>
    );
  }

  const hasActiveFilters = Boolean(search || statusFilter !== 'All' || timeHorizon !== 'all');

  return (
    <div className="crm-page space-y-6">
      {/* ── Executive Header Banner ── */}
      <ManagerMembersEnquiriesHeaderBanner
        filteredCount={filtered.length}
        horizonLabel={horizonLabel}
        isFetching={isFetching}
        onRefresh={() => { void refetch(); }}
        view={view}
        onViewChange={setView}
        onAddEnquiry={() => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADD)}
        selectedCount={selectedIds.length}
        onOpenBulkWhatsApp={() => setBulkWhatsAppModalOpen(true)}
      />

      {/* ── Bulk Actions Floating Toolbar (When items selected) ── */}
      <ManagerMembersEnquiriesBulkToolbar
        selectedCount={selectedIds.length}
        totalFilteredCount={filtered.length}
        onSelectAllFiltered={selectAllFiltered}
        onSelectByStatus={selectByStatus}
        onClearSelection={clearSelection}
        onOpenBulkWhatsApp={() => setBulkWhatsAppModalOpen(true)}
        visitedCount={stats.visited}
        newCount={stats.newLeads}
        interestedCount={stats.interested}
      />

      {/* ── Main Global Time Horizon Filter Bar ── */}
      <ManagerMembersEnquiriesTimeHorizonBar
        timeHorizon={timeHorizon}
        setTimeHorizon={setTimeHorizon}
        timeHorizonOptions={timeHorizonOptions}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
      />

      {/* ── Executive CRM Funnel KPI Cards Grid ── */}
      <ManagerMembersEnquiriesKpis stats={stats} horizonLabel={horizonLabel} />

      {/* ── Toolbar: Search, Status Filter & CSV Export ── */}
      <ManagerMembersEnquiriesToolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusLabels={statusLabels}
        filteredCount={filtered.length}
        horizonLabel={horizonLabel}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={() => {
          setSearch('');
          setStatusFilter('All');
          setTimeHorizon('all');
          setCustomStartDate('');
          setCustomEndDate('');
          clearSelection();
        }}
        onExportCsv={handleExportCsv}
      />

      {/* ── Views: Kanban Board or Table ── */}
      {filtered.length === 0 && !isPending ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-card rounded-2xl border border-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-xl font-bold">
            🔍
          </div>
          <p className="text-base font-bold text-foreground">
            No enquiries found for {horizonLabel}
          </p>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are no leads matching your selected time horizon or filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setTimeHorizon('all');
              setSearch('');
              setStatusFilter('All');
              setCustomStartDate('');
              setCustomEndDate('');
              clearSelection();
            }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover shadow-xs transition-all cursor-pointer"
          >
            View All Time Leads
          </button>
        </div>
      ) : isPending ? (
        <div className="flex flex-col items-center justify-center p-24 text-secondary gap-3 bg-card rounded-2xl border border-border">
          <RefreshCw size={28} className="animate-spin text-primary" />
          <p className="text-sm font-medium">{tManagerUi('loading_pipeline')}</p>
        </div>
      ) : view === 'kanban' ? (
        <ManagerMembersEnquiriesKanban
          isEmpty={filtered.length === 0}
          getCardsByStatus={getCardsByStatus}
        />
      ) : (
        <ManagerMembersEnquiriesTable
          filtered={filtered}
          selectedIds={selectedIds}
          onToggleSelectOne={toggleSelectOne}
          onToggleSelectAll={toggleSelectAll}
          onQuickWhatsApp={(enq) => {
            const digits = enq.phone.replace(/\D/g, '');
            const phone = digits.length === 10 ? `91${digits}` : digits;
            const text = encodeURIComponent(
              `Hello ${enq.name}, thank you for inquiring at Central Library! How can we assist you with seat booking today?`
            );
            const w = window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
            if (w) w.opener = null;
          }}
        />
      )}

      {/* ── Bulk WhatsApp Queue Dialog Modal ── */}
      <ManagerMembersEnquiriesBulkWhatsAppModal
        isOpen={bulkWhatsAppModalOpen}
        onClose={() => setBulkWhatsAppModalOpen(false)}
        recipients={selectedEnquiries.length > 0 ? selectedEnquiries : filtered}
        onClearSelection={clearSelection}
      />
    </div>
  );
}
