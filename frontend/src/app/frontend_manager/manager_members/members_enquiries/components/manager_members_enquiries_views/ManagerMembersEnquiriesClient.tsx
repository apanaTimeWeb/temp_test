'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Download,
  RefreshCw,
  Sparkles,
  Users,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Filter,
  X,
  Target,
  ArrowRight,
} from 'lucide-react';
import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import {
  useManagerMembersEnquiries,
  type ManagerCrmTimeHorizon,
} from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesEnquiries';
import { ManagerMembersEnquiriesKanban } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesKanban';
import { ManagerMembersEnquiriesTable } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_table_parts/ManagerMembersEnquiriesTable';
import { MANAGER_CRM_STATUS_OPTIONS } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';

// RESPONSIBILITY: Main Client view for CRM Enquiries with Executive Pipeline Analytics and Global Horizon Filtering.

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
      case 'all':
        return 'All Time';
      case 'today':
        return 'Today';
      case 'this_week':
        return 'This Week';
      case 'this_month':
        return 'This Month';
      case 'custom':
        return customStartDate && customEndDate
          ? `${customStartDate} to ${customEndDate}`
          : 'Custom Range';
      default:
        return 'All Time';
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
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-xl mx-auto shadow-sm">
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

  return (
    <div className="crm-page space-y-6">
      {/* ── Executive Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Titles & Meta Chips */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-primary uppercase tracking-wider">{tManagerUi('crm_to_enquiries')}</span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Target size={12} />
                Lead Intelligence Pipeline
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-secondary/10 text-secondary border border-border">
                📍 Central Branch
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                {tManagerUi('enquiry_pipeline')}
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-md bg-primary-subtle text-primary font-bold">
                {filtered.length} Leads • Scope: {horizonLabel}
              </span>
            </div>

            <p className="text-sm text-secondary">
              {tManagerUi('track_every_prospect_from_enquiry_to_admission')}
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            {/* Live Refresh Button */}
            <button
              type="button"
              onClick={() => { void refetch(); }}
              disabled={isFetching}
              title="Refresh CRM Pipeline"
              className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm active:scale-95 disabled:opacity-60"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary' : ''} />
              <span className="hidden sm:inline">{isFetching ? 'Syncing...' : 'Sync Pipeline'}</span>
            </button>

            {/* View Mode Toggle */}
            <div className="inline-flex bg-muted/60 p-1 rounded-xl border border-border">
              <button
                type="button"
                className={`min-h-9 min-w-9 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 motion-safe:transition-all ${
                  view === 'kanban'
                    ? 'bg-card text-primary shadow-sm font-semibold'
                    : 'text-secondary hover:text-primary'
                }`}
                onClick={() => setView('kanban')}
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
                    ? 'bg-card text-primary shadow-sm font-semibold'
                    : 'text-secondary hover:text-primary'
                }`}
                onClick={() => setView('table')}
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
              className="mgr-btn-primary min-h-11 px-4 rounded-xl shadow-sm inline-flex items-center gap-2 text-sm font-semibold"
              onClick={() => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADD)}
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
          <span className="hidden sm:inline font-mono text-[10px] opacity-75">LIVE MOCK PIPELINE ACTIVE</span>
        </div>
      </div>

      {/* ── Main Global Time Horizon Filter Bar ── */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Pipeline Time Horizon:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Time Horizon Pills */}
          <div className="inline-flex bg-muted/60 p-1 rounded-xl border border-border flex-wrap">
            {timeHorizonOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeHorizon(opt.id)}
                className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                  timeHorizon === opt.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Inline Custom Date Inputs if Custom Range is active */}
          {timeHorizon === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap text-xs bg-muted/40 p-1.5 rounded-lg border border-border">
              <label className="flex items-center gap-1 text-secondary">
                <span>From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-center gap-1 text-secondary">
                <span>To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
                />
              </label>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className="p-1 text-secondary hover:text-destructive"
                  title="Clear custom dates"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Executive CRM Funnel KPI Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Enquiries */}
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Total Leads</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-primary">{stats.total}</div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                [{horizonLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary flex items-center gap-1">
              <span>All enquiries in {horizonLabel}</span>
            </p>
          </div>
        </div>

        {/* KPI 2: New Prospects */}
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">New Leads</span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{stats.newLeads}</div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                [{horizonLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">Awaiting response ({horizonLabel})</p>
          </div>
        </div>

        {/* KPI 3: Active Pipeline (Visited + Interested) */}
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">In Pipeline</span>
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <PhoneCall size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">{stats.activePipeline}</div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                [{horizonLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">{stats.visited} visited · {stats.interested} interested ({horizonLabel})</p>
          </div>
        </div>

        {/* KPI 4: Admissions Converted */}
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Admitted / Won</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{stats.converted}</div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                [{horizonLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.conversionRate}%</span> conversion rate ({horizonLabel})
            </p>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search, Status Filter & CSV Export ── */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-3 flex-grow max-w-xl">
          {/* Search Input */}
          <div className="relative flex-grow min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              className="w-full pl-9 pr-8 py-2 bg-muted/40 border border-border rounded-lg text-sm text-primary outline-none focus:border-primary focus:bg-card motion-safe:transition-all"
              placeholder={tManagerUi('search_by_name_or_phone')}
              aria-label={tManagerUi('search_by_name_or_phone')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter size={14} className="text-secondary shrink-0" />
            <select
              className="min-h-10 py-1.5 px-3 bg-muted/40 border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card motion-safe:transition-all cursor-pointer"
              aria-label={tManagerUi('status')}
              value={statusFilter}
              onChange={(event) => {
                const nextStatus = event.currentTarget.value;
                if (
                  nextStatus === 'All' ||
                  MANAGER_CRM_STATUS_OPTIONS.includes(nextStatus as (typeof MANAGER_CRM_STATUS_OPTIONS)[number])
                ) {
                  setStatusFilter(nextStatus as typeof statusFilter);
                }
              }}
            >
              <option value="All">{tManagerUi('all_statuses')}</option>
              {MANAGER_CRM_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Reset Button */}
          {(search || statusFilter !== 'All' || timeHorizon !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setTimeHorizon('all');
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              className="text-xs font-semibold text-primary hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}

          <span className="text-xs font-semibold text-secondary px-1 shrink-0">
            Showing {filtered.length} leads ({horizonLabel})
          </span>
        </div>

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm shrink-0"
          title="Export CRM Enquiries as CSV"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* ── Views: Kanban Board or Table ── */}
      {filtered.length === 0 && !isPending ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-card rounded-2xl border border-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
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
        <ManagerMembersEnquiriesTable filtered={filtered} />
      )}
    </div>
  );
}
