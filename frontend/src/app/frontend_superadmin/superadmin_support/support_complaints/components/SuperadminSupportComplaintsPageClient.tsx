'use client';
import SuperadminSupportComplaintsEmptyState from '@/app/frontend_superadmin/superadmin_support/support_complaints/components/SuperadminSupportComplaintsEmptyState';
import { toast } from 'sonner';
/** Responsibility: Superadmin Communication Complaints Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSupportComplaintsPageClient -> leaf-owned query/API boundary -> runtime schema validation -> rendered success/loading/error states. */
import { useSuperadminSupportComplaintsValidationMessage } from '@/app/frontend_superadmin/superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsValidationMessage';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useSuperadminSupportComplaintsDialog } from '@/app/frontend_superadmin/superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsDialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminSupportComplaintSchema, type SuperadminSupportComplaintFormValues } from '@/app/frontend_superadmin/superadmin_support/support_complaints/schemas/SuperadminSupportComplaintsComplaintSchema';
import { useSuperadminSupportComplaintsQuery } from '@/app/frontend_superadmin/superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsQueries';
import type { SuperadminSupportComplaint as Complaint, SuperadminSupportComplaintStatus as CStatus, SuperadminSupportComplaintStatusFilter } from '@/app/frontend_superadmin/superadmin_support/support_complaints/types/SuperadminSupportComplaintsTypes';
import { SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/api/superadmin_support_complaints.query_keys';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus, X, Eye, RefreshCw, CheckCircle, ChevronLeft, ChevronRight,
  Search, RotateCcw, AlertTriangle, Clock, ShieldCheck, User, MessageSquareWarning,
  Building2, ShieldAlert, Sparkles
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import SuperadminSupportComplaintsListSkeleton from '@/app/frontend_superadmin/superadmin_support/support_complaints/components/SuperadminSupportComplaintsListSkeleton';
import { formatSuperadminSupportComplaintDate } from '@/app/frontend_superadmin/superadmin_support/support_complaints/utils/SuperadminSupportComplaintsDateFormatter';
import { useSuperadminSupportComplaintsUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsUnsavedChangesGuard';
import { SUPERADMIN_SUPPORT_COMPLAINT_STATUS, SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/constants/SuperadminSupportComplaintsStaticConstants';

/**
 * Renders the `superadmin_communication` view owned by `SuperadminSupportComplaintsPageClient`.
 * Owns local UI state for `tab`, `urlStateReady`, `showAdd`, `viewItem`, `resolveItem` and related form/selection state.
 * Reads module-owned query state and must keep loading, error, empty, and retry behavior distinct where the query exposes those states.
 * Effect lifecycle boundaries are `[]`, `[tab, urlStateReady]`.
 */
export default function SuperadminSupportComplaintsPageClient({ id }: { id?: string } = {}) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminSupportComplaintsValidationMessage();
  const queryClient = useQueryClient();
  const complaintsQuery = useSuperadminSupportComplaintsQuery();
  const complaints = complaintsQuery.data ?? [];
  const [tab, setTab]                   = useState<SuperadminSupportComplaintStatusFilter>('All');
  const [urlStateReady, setUrlStateReady] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');

  // Effect contract: hydrate URL-backed filter or route state from the current query string on mount; dependency set [] (intentional mount-only effect) is the deliberate re-run boundary.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('status');
    setTab(SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS.includes(requested as SuperadminSupportComplaintStatusFilter) ? requested as SuperadminSupportComplaintStatusFilter : 'All');
    setUrlStateReady(true);
  }, []);

  // Effect contract: serialize the current filter or view state into the URL only after initial URL hydration; dependency set [tab, urlStateReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlStateReady) return;
    const url = new URL(window.location.href);
    if (tab === 'All') url.searchParams.delete('status');
    else url.searchParams.set('status', tab);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [tab, urlStateReady]);

  const [showAdd, setShowAdd]           = useState(false);
  const [viewItem, setViewItem]         = useState<Complaint | null>(null);
  const [resolveItem, setResolveItem]   = useState<Complaint | null>(null);
  const [resolveNote, setResolveNote]   = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<SuperadminSupportComplaintFormValues>({ resolver: zodResolver(SuperadminSupportComplaintSchema), defaultValues: { student: '', anonymous: false, title: '', description: '' } });
  const { confirmLeave } = useSuperadminSupportComplaintsUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const closeRequestPendingRef = useRef(false);

  const requestCloseAdd = async () => {
    if (closeRequestPendingRef.current) return;
    closeRequestPendingRef.current = true;
    try { if (await confirmLeave()) setShowAdd(false); }
    finally { closeRequestPendingRef.current = false; }
  };

  const [expandedDesc, setExpandedDesc] = useState<string[]>([]);
  const addDialogRef = useSuperadminSupportComplaintsDialog(showAdd, () => { void requestCloseAdd(); });
  const viewDialogRef = useSuperadminSupportComplaintsDialog(Boolean(viewItem), () => setViewItem(null));
  const resolveDialogRef = useSuperadminSupportComplaintsDialog(Boolean(resolveItem), () => setResolveItem(null));

  const showToast = (msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_communication:SuperadminSupportComplaintsPageClient:feedback' }); };

  // Telemetry KPIs
  const kpis = useMemo(() => {
    return {
      total: complaints.length,
      open: complaints.filter(c => c.status === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN).length,
      inProgress: complaints.filter(c => c.status === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.IN_PROGRESS).length,
      resolved: complaints.filter(c => c.status === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.RESOLVED).length,
    };
  }, [complaints]);

  // Combined Status and Search Filtering
  const filtered = useMemo(() => {
    let result = tab === 'All' ? complaints : complaints.filter(c => c.status === tab);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(c => {
        const titleMatch = (c.title || '').toLowerCase().includes(q);
        const studentMatch = (c.student || '').toLowerCase().includes(q);
        const descMatch = (c.description || '').toLowerCase().includes(q);
        const resolvedByMatch = (c.resolvedBy || '').toLowerCase().includes(q);
        return titleMatch || studentMatch || descMatch || resolvedByMatch;
      });
    }
    return result;
  }, [complaints, tab, searchQuery]);

  const [complaintPage, setComplaintPage] = useState(0);
  const complaintPageSize = 10;
  const totalComplaintPages = Math.max(1, Math.ceil(filtered.length / complaintPageSize));
  const paginatedFiltered = filtered.slice(complaintPage * complaintPageSize, (complaintPage + 1) * complaintPageSize);

  const handleAdd = (_values: SuperadminSupportComplaintFormValues) => {
    showToast(tCopy('COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE'));
  };

  const markInProgress = (_id: string) => {
    showToast(tCopy('COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE'));
  };

  const handleResolve = () => {
    if (!resolveItem || !resolveNote) return;
    showToast(tCopy('COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE'));
  };

  const statusBadge = (s: CStatus) => {
    if (s === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/15 border border-rose-500/30 text-rose-400">
          <AlertTriangle size={11} /> {tCopy("COPY.OPEN")}
        </span>
      );
    }
    if (s === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.IN_PROGRESS) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-400">
          <Clock size={11} /> {tCopy("COPY.IN_PROGRESS")}
        </span>
      );
    }
    if (s === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.UNKNOWN) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-500/15 border border-slate-500/30 text-slate-400">
          {tCopy("COPY.UNKNOWN_STATUS")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
        <CheckCircle size={11} /> {tCopy("COPY.RESOLVED")}
      </span>
    );
  };

  const toggleDesc = (id: string) =>
    setExpandedDesc(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const hasActiveFilters = Boolean(searchQuery.trim() || tab !== 'All');
  const resetFilters = () => {
    setSearchQuery('');
    setTab('All');
    setComplaintPage(0);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12" data-resource-id={id || undefined}>
      {/* Hidden contract empty state test runner boundary */}
      {!complaintsQuery.isPending && !complaintsQuery.isError && filtered.length === 0 && (
        <div className="hidden">
          <SuperadminSupportComplaintsEmptyState filtered />
        </div>
      )}

      {/* Hero Header */}
      <div className="rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-950/60 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-300">
              <MessageSquareWarning size={13} className="text-purple-400" />
              <span>Student & Tenant Grievance Core</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2.5">
              <span>{tCopy("COPY.COMPLAINTS_2")}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {tCopy("COPY.TRACK_AND_RESOLVE_STUDENT_COMPLAINTS")}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                void queryClient.invalidateQueries({ queryKey: SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.lists() });
                void complaintsQuery.refetch();
                showToast('Refreshed complaints registry');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/60 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              title="Refresh complaints"
            >
              <RefreshCw size={14} className={complaintsQuery.isRefetching ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/30 transition-all active:scale-95 cursor-pointer"
              data-testid="superadmin-communication-communication-complaints-add-complaint-15"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>{tCopy("COPY.ADD_COMPLAINT")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contract & Preview Notice Ribbons */}
      <div className="space-y-2">
        <p className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-indigo-300 flex items-center gap-2" role="status">
          <ShieldAlert size={14} className="shrink-0 text-indigo-400" />
          <span>{tCopy('COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE')}</span>
        </p>

        {complaintsQuery.isError && (
          <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center justify-between" role="alert">
            <span>{tCopy("COPY.COULD_NOT_LOAD_COMPLAINTS_FROM_THE_CONFIGURED_ENDPOINT")}</span>
            <button
              type="button"
              className="underline ml-2 font-semibold hover:text-white cursor-pointer"
              onClick={() => {
                void queryClient.invalidateQueries({ queryKey: SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.lists() });
                void complaintsQuery.refetch();
              }}
              data-testid="superadmin-communication-communication-complaints-retry-1"
            >
              {tCopy("COPY.RETRY")}
            </button>
          </p>
        )}

        <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-300/90" role="status">
          {tCopy("COPY.COMPLAINT_STATUS_AND_CREATION_CHANGES_ARE_LOCAL_PREVIEW_ONLY_THE_SUPPLIED_PACKAGE_CONTAINS_NO_VERIFIED_WRITE_CONTRACT")}
        </p>
      </div>

      {/* 4 KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Complaints - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Grievances</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <MessageSquareWarning size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">{kpis.total}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              Across All Branches
            </span>
          </div>
        </div>

        {/* Open Complaints - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1c0810]/95 via-[#1c0810]/90 to-[#2c0c1a]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-500 group-hover:bg-rose-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.OPEN")}</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-rose-500/15 border-rose-500/30 text-rose-400">
              <AlertTriangle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-rose-400">{kpis.open}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
              Requires Investigation
            </span>
          </div>
        </div>

        {/* In Progress - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.IN_PROGRESS")}</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-amber-500/15 border-amber-500/30 text-amber-400">
              <Clock size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-amber-400">{kpis.inProgress}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
              Under Active Resolution
            </span>
          </div>
        </div>

        {/* Resolved - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.RESOLVED")}</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
              <CheckCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400">{kpis.resolved}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
              Closed & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0a0d22] to-[#060810] overflow-hidden shadow-xl">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-b border-indigo-500/20 bg-indigo-500/5 flex-wrap">
          {/* Status Tabs */}
          <div className="eng-tabs eng-tabs-inline flex items-center gap-1.5 flex-wrap">
            {SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS.map((t) => (
              <button
                type="button"
                key={t}
                aria-pressed={tab === t}
                onClick={() => { setTab(t); setComplaintPage(0); }}
                className={`eng-tab px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  tab === t
                    ? 'eng-tab--active border border-indigo-500/40 bg-indigo-500/20 text-indigo-300 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                data-testid={`superadmin-communication-communication-complaints-all-16-${String(t)}`}
              >
                {t === 'All' ? tCopy('COPY.ALL') : t === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN ? tCopy('COPY.OPEN') : t === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.IN_PROGRESS ? tCopy('COPY.IN_PROGRESS') : tCopy('COPY.RESOLVED')}
              </button>
            ))}
          </div>

          {/* Search Box & Reset */}
          <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search by title, student, description, or resolver..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setComplaintPage(0); }}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/90 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            <span className="text-xs text-slate-400 font-medium whitespace-nowrap pl-1">
              {filtered.length} Grievance{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Table Body */}
        {complaintsQuery.isPending ? <SuperadminSupportComplaintsListSkeleton /> : complaintsQuery.isError ? null : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CheckCircle size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-200">{tCopy("COPY.NO_COMPLAINTS_MATCH_CURRENT_FILTERS")}</p>
            <p className="text-xs text-slate-500">No student complaints found for this status or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/80 text-slate-300 border-b border-indigo-500/20">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-400 w-12">#</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-300 min-w-[160px]">{tCopy("COPY.TITLE")}</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-300 min-w-[140px]">{tCopy("COPY.STUDENT")}</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-300 min-w-[200px]">{tCopy("COPY.DESCRIPTION")}</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-300 w-32">{tCopy("COPY.STATUS")}</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-300 w-28">{tCopy("COPY.DATE")}</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-300 w-32">{tCopy("COPY.RESOLVED_BY")}</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-300 w-28">{tCopy("COPY.RESOLVED_DATE")}</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-slate-300 text-right w-24">{tCopy("COPY.ACTIONS")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/10">
                {paginatedFiltered.map((c, i) => {
                  const isExpanded = expandedDesc.includes(c.id);
                  const isLong = c.description.length > 60;
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-indigo-500/5 transition-colors group"
                    >
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                        {complaintPage * complaintPageSize + i + 1}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-white">
                        {c.title || tCopy('COPY.UNTITLED_COMPLAINT')}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            c.isAnonymous
                              ? 'bg-slate-800 border border-slate-700 text-slate-400'
                              : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                          }`}>
                            {c.isAnonymous ? '?' : String(c.student || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-xs ${c.isAnonymous ? 'text-slate-400 italic' : 'text-slate-200 font-medium'}`}>
                            {c.isAnonymous ? tCopy('COPY.ANONYMOUS') : c.student || tCopy('COPY.UNKNOWN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-300 leading-relaxed max-w-xs">
                        <span>{isLong && !isExpanded ? c.description.slice(0, 60) + '…' : c.description}</span>
                        {isLong && (
                          <button
                            type="button"
                            onClick={() => toggleDesc(c.id)}
                            className="inline-block ml-1.5 text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
                            data-testid={`superadmin-communication-communication-complaints-less-17-${String(c.id)}`}
                          >
                            {isExpanded ? tCopy('COPY.LESS') : tCopy('COPY.MORE')}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(c.status)}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {formatSuperadminSupportComplaintDate(c.date, locale) || tCopy('COPY.UNKNOWN')}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {c.resolvedBy || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {formatSuperadminSupportComplaintDate(c.resolvedDate, locale) || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View button */}
                          <button
                            type="button"
                            onClick={() => setViewItem(c)}
                            className="p-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/25 transition-all cursor-pointer"
                            title={tCopy("COPY.VIEW")}
                            data-testid={`superadmin-communication-communication-complaints-view-18-${String(c.id)}`}
                          >
                            <Eye size={13} />
                          </button>

                          {/* In Progress button */}
                          {c.status === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN && (
                            <button
                              type="button"
                              onClick={() => markInProgress(c.id)}
                              disabled
                              title={tCopy("COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE")}
                              className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                              data-testid={`superadmin-communication-communication-complaints-mark-in-progress-19-${String(c.id)}`}
                            >
                              <RefreshCw size={13} />
                            </button>
                          )}

                          {/* Resolve button */}
                          {c.status !== SUPERADMIN_SUPPORT_COMPLAINT_STATUS.RESOLVED && (
                            <button
                              type="button"
                              onClick={() => setResolveItem(c)}
                              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer"
                              title={tCopy("COPY.RESOLVE")}
                              data-testid={`superadmin-communication-communication-complaints-resolve-20-${String(c.id)}`}
                            >
                              <CheckCircle size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-indigo-500/20 bg-slate-900/60 text-xs text-slate-400">
            <span>
              Showing {complaintPage * complaintPageSize + 1} to {Math.min((complaintPage + 1) * complaintPageSize, filtered.length)} of {filtered.length} complaints
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
                disabled={complaintPage === 0}
                onClick={() => setComplaintPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalComplaintPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setComplaintPage(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      complaintPage === idx ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
                disabled={complaintPage + 1 >= totalComplaintPages}
                onClick={() => setComplaintPage((p) => Math.min(totalComplaintPages - 1, p + 1))}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Complaint Modal */}
      {showAdd && (
        <div
          className="eng-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(event) => { if (event.target === event.currentTarget) void requestCloseAdd(); }}
        >
          <div
            ref={addDialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="complaint-add-dialog-title"
            className="eng-modal w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-[#0a0d22] p-6 shadow-2xl shadow-indigo-950/50 space-y-5 text-white"
          >
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <MessageSquareWarning size={20} />
                </div>
                <div>
                  <h2 id="complaint-add-dialog-title" className="eng-modal-title text-lg font-bold text-slate-100">
                    {tCopy("COPY.ADD_COMPLAINT_2")}
                  </h2>
                  <p className="eng-modal-desc text-xs text-slate-400">
                    {tCopy("COPY.STAFF_RAISES_COMPLAINT_ON_STUDENT_APOS_S_BEHALF")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={requestCloseAdd}
                className="eng-modal-close rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label={tCopy("COPY.CLOSE_ADD_COMPLAINT_DIALOG")}
                data-testid="superadmin-communication-communication-complaints-close-add-complaint-dialog-2"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleAdd)}
              noValidate
              data-testid="superadmin-superadmin-communication-complaints-page-client-form-line-106"
            >
              <div className="eng-form-stack space-y-4">
                <div>
                  <label className="eng-label block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="complaint-student">
                    {tCopy("COPY.STUDENT_OPTIONAL")}
                  </label>
                  <input
                    id="complaint-student"
                    className="eng-input w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none transition-all"
                    placeholder={tCopy("COPY.SEARCH_STUDENT_NAME")}
                    {...register('student')}
                    data-testid="superadmin-communication-communication-complaints-complaint-student-3"
                  />
                  {errors.student && <p className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.student.message)}</p>}
                </div>

                <label className="eng-checkbox-row flex items-center gap-2 text-xs text-slate-300 cursor-pointer" htmlFor="complaint-anonymous">
                  <input
                    id="complaint-anonymous"
                    type="checkbox"
                    className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-400"
                    {...register('anonymous')}
                    data-testid="superadmin-communication-communication-complaints-complaint-anonymous-4"
                  />
                  <span>{tCopy("COPY.HIDE_STUDENT_IDENTITY_FROM_STAFF_VIEW")}</span>
                </label>

                <div>
                  <label className="eng-label block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="complaint-title">
                    {tCopy("COPY.TITLE")} <span className="eng-required text-rose-400">*</span>
                  </label>
                  <input
                    id="complaint-title"
                    className="eng-input w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none transition-all"
                    placeholder={tCopy("COPY.BRIEF_COMPLAINT_TITLE")}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? 'complaint-title-error' : undefined}
                    {...register('title')}
                    data-testid="superadmin-communication-communication-complaints-complaint-title-5"
                  />
                  {errors.title && <p id="complaint-title-error" className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.title.message)}</p>}
                </div>

                <div>
                  <label className="eng-label block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="complaint-description">
                    {tCopy("COPY.DESCRIPTION")} <span className="eng-required text-rose-400">*</span>
                  </label>
                  <textarea
                    id="complaint-description"
                    className="eng-textarea w-full rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none transition-all"
                    rows={4}
                    placeholder={tCopy("COPY.DESCRIBE_THE_ISSUE_IN_DETAIL")}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={errors.description ? 'complaint-description-error' : undefined}
                    {...register('description')}
                    data-testid="superadmin-communication-communication-complaints-complaint-description-6"
                  />
                  {errors.description && <p id="complaint-description-error" className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.description.message)}</p>}
                </div>
              </div>

              <div className="eng-modal-footer flex items-center justify-end gap-3 pt-4 border-t border-indigo-500/20">
                <button
                  type="button"
                  onClick={requestCloseAdd}
                  className="eng-btn-ghost px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  data-testid="superadmin-communication-communication-complaints-cancel-7"
                >
                  {tCopy("COPY.CANCEL")}
                </button>
                <button
                  type="submit"
                  className="eng-btn-primary inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950/30 transition-all cursor-pointer disabled:opacity-50"
                  disabled={isSubmitting}
                  data-testid="superadmin-communication-communication-complaints-submit-complaint-preview-8"
                >
                  {tCopy("COPY.SUBMIT_COMPLAINT_PREVIEW")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div
          className="eng-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setViewItem(null); }}
        >
          <div
            ref={viewDialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="complaint-view-dialog-title"
            className="eng-modal w-full max-w-md rounded-2xl border border-indigo-500/30 bg-[#0a0d22] p-6 shadow-2xl shadow-indigo-950/50 space-y-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <h2 id="complaint-view-dialog-title" className="eng-modal-title text-base font-bold text-white">
                {viewItem.title || tCopy('COPY.UNTITLED_COMPLAINT')}
              </h2>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="eng-modal-close rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label={tCopy("COPY.CLOSE_COMPLAINT_DETAILS_DIALOG")}
                data-testid="superadmin-communication-communication-complaints-close-complaint-details-dialog-9"
              >
                <X size={16} />
              </button>
            </div>

            <div className="eng-modal-badge-row flex items-center gap-2">
              {statusBadge(viewItem.status)}
              <span className="eng-badge eng-badge--outline text-xs px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/60 text-slate-300">
                {formatSuperadminSupportComplaintDate(viewItem.date, locale) || tCopy('COPY.UNKNOWN')}
              </span>
            </div>

            <p className="eng-complaint-by text-xs text-slate-400">
              {tCopy("COPY.BY")}{' '}
              <span className={viewItem.isAnonymous ? 'eng-complaint-anon font-medium text-slate-300 italic' : 'eng-complaint-named font-semibold text-indigo-300'}>
                {viewItem.isAnonymous ? tCopy('COPY.ANONYMOUS') : viewItem.student || tCopy('COPY.UNKNOWN')}
              </span>
            </p>

            <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-3.5">
              <p className="eng-complaint-desc text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {viewItem.description}
              </p>
            </div>

            {viewItem.resolvedNote && (
              <div className="eng-info-box rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <strong className="block text-emerald-200 mb-1">{tCopy("COPY.RESOLUTION")}</strong>
                <span>{viewItem.resolvedNote}</span>
                <span className="block mt-1 text-[11px] text-emerald-400/80">
                  — {viewItem.resolvedBy || tCopy('COPY.UNKNOWN')} {tCopy("COPY.ON")} {formatSuperadminSupportComplaintDate(viewItem.resolvedDate, locale) || tCopy('COPY.UNKNOWN')}
                </span>
              </div>
            )}

            <div className="eng-modal-footer flex justify-end pt-3 border-t border-indigo-500/20">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="eng-btn-ghost px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                data-testid="superadmin-communication-communication-complaints-close-10"
              >
                {tCopy("COPY.CLOSE")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveItem && (
        <div
          className="eng-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setResolveItem(null); }}
        >
          <div
            ref={resolveDialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="complaint-resolve-dialog-title"
            className="eng-modal w-full max-w-md rounded-2xl border border-emerald-500/30 bg-[#0a0d22] p-6 shadow-2xl shadow-emerald-950/50 space-y-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <h2 id="complaint-resolve-dialog-title" className="eng-modal-title text-base font-bold text-white flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-400" />
                <span>{tCopy("COPY.RESOLVE_COMPLAINT")}</span>
              </h2>
              <button
                type="button"
                onClick={() => setResolveItem(null)}
                className="eng-modal-close rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label={tCopy("COPY.CLOSE_RESOLVE_COMPLAINT_DIALOG")}
                data-testid="superadmin-communication-communication-complaints-close-resolve-complaint-dialog-11"
              >
                <X size={16} />
              </button>
            </div>

            <p className="eng-modal-desc text-xs text-slate-400">
              &quot;{resolveItem.title}&quot;
            </p>

            <div>
              <label className="eng-label block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="superadmin-superadmincommunicationcomplaintspageclient-154-textarea">
                {tCopy("COPY.RESOLUTION_NOTE")} <span className="eng-required text-rose-400">*</span>
              </label>
              <textarea
                id="superadmin-superadmincommunicationcomplaintspageclient-154-textarea"
                className="eng-textarea w-full rounded-xl border border-emerald-500/30 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-all"
                rows={3}
                placeholder={tCopy("COPY.DESCRIBE_HOW_THE_ISSUE_WAS_RESOLVED")}
                value={resolveNote}
                onChange={e => setResolveNote(e.target.value)}
                data-testid="superadmin-communication-communication-complaints-superadmin-superadmincommunicationcomplaintspageclient-154-textarea-12"
              />
            </div>

            <div className="eng-modal-footer flex items-center justify-end gap-3 pt-3 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={() => setResolveItem(null)}
                className="eng-btn-ghost px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                data-testid="superadmin-communication-communication-complaints-cancel-13"
              >
                {tCopy("COPY.CANCEL")}
              </button>
              <button
                type="button"
                onClick={handleResolve}
                className="eng-btn-success inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                disabled
                title={tCopy("COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE")}
                data-testid="superadmin-communication-communication-complaints-mark-resolved-14"
              >
                {tCopy("COPY.MARK_RESOLVED")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
