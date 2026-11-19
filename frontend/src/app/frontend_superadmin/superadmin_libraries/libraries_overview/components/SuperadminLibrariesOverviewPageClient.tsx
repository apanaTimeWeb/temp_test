'use client';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_libraries overview route UI with rich cards, filters, responsive layout, and action controls. */
import SuperadminLibrariesOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewSemanticTable';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Edit2, Eye, Plus, ShieldAlert, Building2, Store, Users, IndianRupee,
  TrendingUp, Sparkles, MapPin, Building, RotateCcw, Search, X, CheckCircle
} from 'lucide-react';
import { useSuperadminLibrariesOverview } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverview';
import SuperadminLibrariesOverviewPanel from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewPanel';
import type { SuperadminLibrariesLibrary, SuperadminLibrariesPanelMode } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';
import { SUPERADMIN_LIBRARIES_TOASTS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/constants/SuperadminLibrariesOverviewConstants';
import { SuperadminLibrariesFormatMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewFormattingUtilities';
import { SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_overview/config/superadmin_libraries_overview.url_config";
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import { useTranslations, useLocale } from 'next-intl';

const PLAN_STYLES: Record<string, string> = {
  Enterprise: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Pro:        'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Starter:    'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Basic:      'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_libraries` overview and its module-owned library table.
 */
export default function SuperadminLibrariesOverviewPageClient() {
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_LIBRARIES');
  const { libraries, loading, error, updateLibrary, toggleStatus, refetch } = useSuperadminLibrariesOverview();
  
  const [selected, setSelected] = useState<SuperadminLibrariesLibrary | null>(null);
  const [panelMode, setPanelMode] = useState<SuperadminLibrariesPanelMode>('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const showToast = useCallback((message: string) => {
    toast.message(message, { id: 'superadmin:superadmin_libraries:SuperadminLibrariesOverviewPageClient:feedback' });
  }, []);

  const totalRevenue = libraries.reduce((sum, library) => sum + library.revenue, 0);
  const activeCount = libraries.filter((l) => l.status === 'Active').length;
  const totalStudents = libraries.reduce((sum, l) => sum + (l.students || 0), 0);

  // Client-side quick filter
  const filteredLibraries = useMemo(() => {
    return libraries.filter((lib) => {
      const matchesSearch = !searchQuery.trim() ||
        lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lib.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lib.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = planFilter === 'all' || lib.plan.toLowerCase() === planFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || lib.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [libraries, searchQuery, planFilter, statusFilter]);

  const hasActiveFilters = searchQuery !== '' || planFilter !== 'all' || statusFilter !== 'all';
  const handleResetFilters = () => {
    setSearchQuery('');
    setPlanFilter('all');
    setStatusFilter('all');
  };

  const handleSave = useCallback(async (updated: SuperadminLibrariesLibrary) => {
    try {
      await updateLibrary(updated.id, updated);
      setSelected(updated);
      setPanelMode('view');
      showToast(SUPERADMIN_LIBRARIES_TOASTS.UPDATE_SUCCESS(updated.name));
    } catch {
      showToast(SUPERADMIN_LIBRARIES_TOASTS.UPDATE_ERROR);
    }
  }, [showToast, updateLibrary]);

  const handleSuspend = useCallback(async (id: string) => {
    try {
      const current = libraries.find((library) => library.id === id);
      if (!current) throw new Error('Sample library not found.');
      await toggleStatus(id);
      setSelected((previous) => previous?.id === id
        ? { ...previous, status: previous.status === 'Active' ? 'Maintenance' : 'Active' }
        : previous);
      showToast(SUPERADMIN_LIBRARIES_TOASTS.STATUS_SUCCESS);
    } catch {
      showToast(SUPERADMIN_LIBRARIES_TOASTS.STATUS_ERROR);
    }
  }, [libraries, showToast, toggleStatus]);

  const columnDefinitions = useMemo<SemanticColumnDef<SuperadminLibrariesLibrary>[]>(() => [
    {
      headerName: t("COPY.LIBRARY_NAME"),
      field: 'name',
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => {
        const plan = params.data?.plan ?? 'Basic';
        const planCls = PLAN_STYLES[plan] ?? PLAN_STYLES.Basic;
        const initials = params.data?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'LB';

        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{params.data?.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${planCls}`}>
                  {plan}
                </span>
                <span className="text-[11px] text-slate-400">{params.data?.owner}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      headerName: t("COPY.LOCATION"),
      field: 'location',
      flex: 1.5,
      minWidth: 160,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <MapPin size={13} className="text-indigo-400 shrink-0" />
          <span className="truncate">{params.data?.location}</span>
        </div>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_CAPACITY_BRANCHES_USERS"),
      flex: 1.5,
      minWidth: 160,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <div className="flex flex-col gap-0.5 justify-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Building size={12} className="text-indigo-400 shrink-0" />
            <span>{params.data?.branches} {t("COPY.BRANCHES")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Users size={11} className="text-sky-400 shrink-0" />
            <span>{params.data?.students?.toLocaleString() ?? 0} {t("COPY.ACTIVE_STUDENTS")}</span>
          </div>
        </div>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_LTV_REVENUE_SAMPLE"),
      field: 'revenue',
      flex: 1.2,
      minWidth: 140,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <div className="flex items-center gap-1 font-bold text-amber-300 text-xs sm:text-sm">
          <IndianRupee size={13} className="text-amber-400 shrink-0" />
          <span>{SuperadminLibrariesFormatMajorPreviewCurrency(params.data?.revenue ?? 0, 'INR', locale)}</span>
        </div>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_STATUS"),
      field: 'status',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => {
        const isActive = params.data?.status === 'Active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isActive ? t("COPY.ACTIVE") : t("COPY.MAINTENANCE")}</span>
          </span>
        );
      },
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTIONS"),
      field: 'id',
      flex: 1.2,
      minWidth: 140,
      sortable: false,
      filter: false,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => {
        if (!params.data) return null;
        const testIdSuffix = getSuperadminInteractiveTestIdSuffix(params.data);

        return (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label={t("COPY.VIEW_LIBRARY_ARIA_LABEL", { name: params.data.name })}
              onClick={(event) => {
                event.stopPropagation();
                setPanelMode('view');
                setSelected(params.data);
              }}
              title="View Library Details"
              data-testid={`superadmin-libraries-libraries-overview-view-library-aria-label-1-${testIdSuffix}`}
            >
              <Eye size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label={t("COPY.EDIT_LIBRARY_PREVIEW_ARIA_LABEL", { name: params.data.name })}
              onClick={(event) => {
                event.stopPropagation();
                setPanelMode('edit');
                setSelected(params.data);
              }}
              title="Edit Library Settings"
              data-testid={`superadmin-libraries-libraries-overview-edit-library-preview-aria-label-2-${testIdSuffix}`}
            >
              <Edit2 size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:text-white hover:bg-rose-600/30 transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label={t("COPY.TOGGLE_LIBRARY_STATUS_PREVIEW_ARIA_LABEL", { name: params.data.name })}
              onClick={(event) => {
                event.stopPropagation();
                void handleSuspend(params.data.id);
              }}
              title="Toggle Operating Status"
              data-testid={`superadmin-libraries-libraries-overview-toggle-library-status-preview-aria-label-3-${testIdSuffix}`}
            >
              <ShieldAlert size={14} aria-hidden="true" />
            </button>
          </div>
        );
      },
    },
  ], [handleSuspend, locale, t]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-secondary" role="status" aria-live="polite">
        {t("COPY.LOADING_SAMPLE_LIBRARY_RECORDS")}
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 pb-10">
      {/* ─── Hero / Header Banner ─── */}
      <div className="w-full max-w-full min-w-0 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md transition-all mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Titles & Meta Chips */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Tenants Directory
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Building2 size={11} className="text-indigo-400" />
                Multi-Tenant Enterprise Scope
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <Building2 className="text-indigo-400 shrink-0" size={28} />
                {t("COPY.REGISTERED_LIBRARIES")}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Global directory of licensed library facilities, branch infrastructure, capacity metrics, and multi-tenant operating subscriptions.
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <Link
              href={SUPERADMIN_NAVIGATION_ROUTES.libraries_onboarding_setup}
              className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Sparkles size={14} className="text-indigo-400" />
              <span>Setup Wizard</span>
            </Link>

            <Link
              href={SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_URLS.ADD_LIBRARY}
              className="inline-flex items-center gap-1.5 min-h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-950/50 transition-all hover:scale-[1.02] cursor-pointer"
              data-testid="superadmin-libraries-libraries_overview-link-1"
            >
              <Plus size={15} className="text-white" />
              <span>{t("COPY.ADD_LIBRARY")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Warning Notice */}
      <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200" role="status">
        {t("COPY.SAMPLE_LIBRARY_FIXTURE_DATA_ONLY_EDITS_AND_STATUS_CHANGES_ARE_LOCAL_PREVIEWS_NO_VERIFIED_LIBRARY_API_INTEGRATION_IS_SUPPLIED")}
      </p>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-200" role="alert">
          {error}
        </div>
      )}

      {/* Side Details Drawer */}
      {selected && (
        <SuperadminLibrariesOverviewPanel
          lib={selected}
          mode={panelMode}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onSuspend={handleSuspend}
        />
      )}

      {/* ─── 4 KPI Cards Grid — matches dashboard card size exactly ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6" aria-label="Libraries Statistics">
        {/* Card 1: Total Registered Libraries */}
        <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#1a1f4e] to-indigo-900/60 p-5 sm:p-6 shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-indigo-400/60">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q15,22 35,18 T75,14 T115,8 T150,4" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="flex items-start justify-between relative z-10 gap-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Total Libraries</p>
            <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 shrink-0 transition-transform group-hover:scale-110">
              <Building2 size={20} className="text-indigo-400" aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 mt-3 sm:mt-4">
            <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">{libraries.length.toLocaleString()}</p>
            <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
                <TrendingUp size={12} className="text-emerald-400" />
                <span>+12 this month</span>
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1"><span>Goal Progress</span><span>78%</span></div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 w-[78%] transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Active Tenants */}
        <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0f2d22] to-emerald-900/60 p-5 sm:p-6 shadow-lg shadow-emerald-950/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-emerald-400/60">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,20 40,24 T80,16 T120,10 T150,6" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="flex items-start justify-between relative z-10 gap-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Tenants</p>
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 shrink-0 transition-transform group-hover:scale-110">
              <Store size={20} className="text-emerald-400" aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 mt-3 sm:mt-4">
            <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">{activeCount.toLocaleString()}</p>
            <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>98.2% Active</span>
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1"><span>Goal Progress</span><span>98%</span></div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[98%] transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Enrolled Students */}
        <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0f2540] to-sky-900/60 p-5 sm:p-6 shadow-lg shadow-sky-950/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-sky-400/60">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,34 Q18,24 38,20 T78,12 T118,8 T150,4" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="flex items-start justify-between relative z-10 gap-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">Enrolled Students</p>
            <div className="p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/15 shrink-0 transition-transform group-hover:scale-110">
              <Users size={20} className="text-sky-400" aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 mt-3 sm:mt-4">
            <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">{totalStudents.toLocaleString()}</p>
            <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
                <TrendingUp size={12} className="text-emerald-400" />
                <span>+1,240 this week</span>
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1"><span>Goal Progress</span><span>84%</span></div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 w-[84%] transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: LTV Revenue */}
        <div className="sa-kpi-card group relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#2d1f08] to-amber-900/60 p-5 sm:p-6 shadow-lg shadow-amber-950/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-amber-400/60">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,36 Q16,26 36,22 T76,14 T116,8 T150,4" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="flex items-start justify-between relative z-10 gap-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">{t("COPY.TABLE_COLUMN_LTV_REVENUE_SAMPLE")}</p>
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 shrink-0 transition-transform group-hover:scale-110">
              <IndianRupee size={20} className="text-amber-400" aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 mt-3 sm:mt-4">
            <p className="sa-kpi-value text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white truncate">
              {SuperadminLibrariesFormatMajorPreviewCurrency(totalRevenue, 'INR', locale)}
            </p>
            <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
                <TrendingUp size={12} className="text-emerald-400" />
                <span>+14.7% MoM</span>
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1"><span>Goal Progress</span><span>91%</span></div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 w-[91%] transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Manager Style Filter & Search Bar ─── */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5 p-3 sm:p-3.5 rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 w-full max-w-full min-w-0 shadow-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] w-full sm:w-auto">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none z-10" />
          <input
            type="search"
            placeholder="Search by library name, owner, city, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white placeholder:text-secondary focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors cursor-pointer p-0.5"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Plan Filter */}
        <select
          aria-label="Filter by plan"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Membership Plans</option>
          <option value="Enterprise">Enterprise Plan</option>
          <option value="Pro">Pro Plan</option>
          <option value="Starter">Starter Plan</option>
          <option value="Basic">Basic Plan</option>
        </select>

        {/* Status Filter */}
        <select
          aria-label="Filter by operating status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Operating Statuses</option>
          <option value="Active">Active Facilities</option>
          <option value="Maintenance">Under Maintenance</option>
        </select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/35 hover:text-rose-100 transition-all cursor-pointer shadow-sm shadow-rose-950/40"
            title="Clear all active filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium px-2 py-1 rounded-md bg-surface border border-border">
            {filteredLibraries.length} of {libraries.length} Libraries
          </span>
        </div>
      </div>

      {/* ─── Registered Libraries Table ─── */}
      <section className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-hidden" aria-label={t("COPY.REGISTERED_LIBRARIES_2")}>
        <div className="sa-libraries-grid-height">
          {filteredLibraries.length === 0 ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 p-8 text-center" role="status">
              <Building2 size={32} className="text-indigo-400/50 mb-1" />
              <p className="text-sm text-secondary">{t("COPY.NO_SAMPLE_LIBRARY_RECORDS_ARE_AVAILABLE_IN_THIS_PREVIEW")}</p>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm active:scale-95 cursor-pointer"
                onClick={() => { void refetch(); handleResetFilters(); }}
                data-testid="superadmin-libraries-libraries-overview-restore-sample-records-5"
              >
                <RotateCcw size={13} />
                <span>{t("COPY.RESTORE_SAMPLE_RECORDS")}</span>
              </button>
            </div>
          ) : (
            <SuperadminLibrariesOverviewSemanticTable<SuperadminLibrariesLibrary>
              rowData={filteredLibraries}
              columnDefs={columnDefinitions}
              pagination
              paginationPageSize={10}
              getRowId={({ data }) => data.id}
              hideFilter={true}
              onRowClick={(library) => {
                setPanelMode('view');
                setSelected(library);
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
