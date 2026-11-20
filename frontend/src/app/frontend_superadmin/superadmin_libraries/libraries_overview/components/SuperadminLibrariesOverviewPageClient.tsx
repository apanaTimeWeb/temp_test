'use client';
import { toast } from 'sonner';
/** Responsibility: Superadmin Libraries Overview Page Client; orchestrates KPI cards, filter controls, semantic table with horizontal actions, and management dialogs. */
import SuperadminLibrariesOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewSemanticTable';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Building2, Users, IndianRupee, MapPin, Building } from 'lucide-react';
import { useSuperadminLibrariesOverview } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverview';
import SuperadminLibrariesOverviewPanel from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewPanel';
import SuperadminLibrariesBranchManagerModal from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesBranchManagerModal';
import SuperadminLibrariesManagerModulesModal from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesManagerModulesModal';
import SuperadminLibrariesOverviewHeader from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewHeader';
import SuperadminLibrariesCreateAccountModal from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateAccountModal';
import SuperadminLibrariesOverviewActionButtons from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewActionButtons';
import SuperadminLibrariesOverviewStatsCards from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewStatsCards';
import SuperadminLibrariesOverviewFilterBar from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewFilterBar';
import type { LibraryProvisioningResult } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes';
import type { SuperadminLibrariesLibrary, SuperadminLibrariesPanelMode, SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';
import { SUPERADMIN_LIBRARIES_TOASTS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/constants/SuperadminLibrariesOverviewConstants';
import { SuperadminLibrariesFormatMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewFormattingUtilities';
import { downloadSuperadminLibrariesCsv, downloadSuperadminLibrariesExcel, printSuperadminLibrariesRoster } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewExportUtils';
import { useTranslations, useLocale } from 'next-intl';

const PLAN_STYLES: Record<string, string> = {
  Enterprise: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Pro:        'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Starter:    'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Basic:      'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'code', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

export default function SuperadminLibrariesOverviewPageClient() {
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_LIBRARIES');
  const { libraries, loading, error, updateLibrary, toggleStatus } = useSuperadminLibrariesOverview();
  
  const [selected, setSelected] = useState<SuperadminLibrariesLibrary | null>(null);
  const [panelMode, setPanelMode] = useState<SuperadminLibrariesPanelMode>('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchModalLib, setBranchModalLib] = useState<SuperadminLibrariesLibrary | null>(null);
  const [modulesModalLib, setModulesModalLib] = useState<SuperadminLibrariesLibrary | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('action') === 'create' || searchParams?.get('create') === 'true') {
      setIsCreateModalOpen(true);
    }
  }, [searchParams]);

  const showToast = useCallback((msg: string, isErr = false) => {
    if (isErr) toast.error(msg, { id: 'superadmin:superadmin_libraries:feedback' });
    else toast.success(msg, { id: 'superadmin:superadmin_libraries:feedback' });
  }, []);

  const handleToggleAdminPanel = useCallback(async (tenantId: string) => {
    const cur = libraries.find((l) => l.id === tenantId);
    if (!cur) return;
    const nextState = !(cur.adminPanelEnabled ?? true);
    await updateLibrary(tenantId, { adminPanelEnabled: nextState });
    setBranchModalLib((prev) => (prev?.id === tenantId ? { ...prev, adminPanelEnabled: nextState } : prev));
    showToast(`Admin Panel for "${cur.name}" is now ${nextState ? 'ENABLED (Multi-Branch)' : 'DISABLED (Manager Desk Mode)'}`);
  }, [libraries, showToast, updateLibrary]);

  const handleAddBranch = useCallback(async (tenantId: string, newBranch: SuperadminBranchRecord) => {
    const cur = libraries.find((l) => l.id === tenantId);
    if (!cur) return;
    const updated = [...(cur.branchList || []), newBranch];
    await updateLibrary(tenantId, { branchList: updated, branches: updated.length });
    setBranchModalLib((prev) => (prev?.id === tenantId ? { ...prev, branchList: updated, branches: updated.length } : prev));
    showToast(`Branch "${newBranch.name}" created under "${cur.owner}"!`);
  }, [libraries, showToast, updateLibrary]);

  const handleSaveModules = useCallback(async (tenantId: string, updatedModules: Record<string, boolean>) => {
    const cur = libraries.find((l) => l.id === tenantId);
    if (!cur) return;
    await updateLibrary(tenantId, { managerModules: updatedModules });
    showToast(`Manager modules updated for "${cur.name}"!`);
  }, [libraries, showToast, updateLibrary]);

  const handleLibraryCreated = useCallback((newLib: SuperadminLibrariesLibrary, res: LibraryProvisioningResult) => {
    libraries.unshift(newLib);
    showToast(`Library "${newLib.name}" provisioned with Tenant ID "${res.tenantId}" and ${res.branchesCreatedCount} branch(es)!`);
  }, [libraries, showToast]);

  const handleSave = useCallback(async (updated: SuperadminLibrariesLibrary) => {
    try {
      await updateLibrary(updated.id, updated);
      setSelected(updated);
      setPanelMode('view');
      showToast(`Library "${updated.name}" updated successfully!`);
    } catch { showToast(SUPERADMIN_LIBRARIES_TOASTS.UPDATE_ERROR, true); }
  }, [showToast, updateLibrary]);

  const handleSuspend = useCallback(async (id: string) => {
    try {
      const cur = libraries.find((l) => l.id === id);
      if (!cur) throw new Error('Not found');
      await toggleStatus(id);
      const nextStatus = cur.status === 'Active' ? 'Maintenance' : 'Active';
      setSelected((prev) => prev?.id === id ? { ...cur, status: nextStatus } : prev);
      showToast(`Library "${cur.name}" status changed to ${nextStatus}!`);
    } catch { showToast(SUPERADMIN_LIBRARIES_TOASTS.STATUS_ERROR, true); }
  }, [libraries, showToast, toggleStatus]);

  const totalRevenue = libraries.reduce((sum, l) => sum + l.revenue, 0);
  const activeCount = libraries.filter((l) => l.status === 'Active').length;
  const totalStudents = libraries.reduce((sum, l) => sum + (l.students || 0), 0);

  const filteredLibraries = useMemo(() => libraries.filter((lib) => {
    const matchSearch = !searchQuery.trim() || lib.name.toLowerCase().includes(searchQuery.toLowerCase()) || lib.owner.toLowerCase().includes(searchQuery.toLowerCase()) || lib.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlan = planFilter === 'all' || lib.plan.toLowerCase() === planFilter.toLowerCase();
    const matchStatus = statusFilter === 'all' || lib.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchPlan && matchStatus;
  }), [libraries, searchQuery, planFilter, statusFilter]);

  const columnDefinitions = useMemo<SemanticColumnDef<SuperadminLibrariesLibrary>[]>(() => [
    {
      headerName: t('COPY.LIBRARY_NAME'),
      field: 'name',
      flex: 2,
      minWidth: 220,
      cellRenderer: (p: SemanticCellParams<SuperadminLibrariesLibrary>) => {
        const plan = p.data?.plan ?? 'Basic';
        const planCls = PLAN_STYLES[plan] ?? PLAN_STYLES.Basic;
        const initials = p.data?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'LB';
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{p.data?.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold border uppercase tracking-wider ${planCls}`}>{plan}</span>
                <span className="text-[11px] text-slate-400 truncate">{p.data?.owner}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase tracking-wider ${p.data?.adminPanelEnabled ?? true ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`}>
                  {p.data?.adminPanelEnabled ?? true ? 'Admin: ON' : 'Admin: OFF'}
                </span>
                <button type="button" onClick={(e) => { e.stopPropagation(); if (p.data) setBranchModalLib(p.data); }} className="text-[10px] text-sky-400 hover:text-sky-300 hover:underline font-medium cursor-pointer">
                  {p.data?.branchList?.length || p.data?.branches || 1} Branches
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      headerName: t('COPY.LOCATION'),
      field: 'location',
      flex: 1.4,
      minWidth: 150,
      cellRenderer: (p: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300"><MapPin size={13} className="text-indigo-400 shrink-0" /><span className="truncate">{p.data?.location}</span></div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_CAPACITY_BRANCHES_USERS'),
      flex: 1.3,
      minWidth: 140,
      cellRenderer: (p: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <div className="flex flex-col gap-0.5 justify-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white"><Building size={12} className="text-indigo-400 shrink-0" /><span>{p.data?.branches} Branches</span></div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><Users size={11} className="text-sky-400 shrink-0" /><span>{p.data?.students?.toLocaleString() ?? 0} Students</span></div>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_LTV_REVENUE_SAMPLE'),
      field: 'revenue',
      flex: 1.1,
      minWidth: 130,
      cellRenderer: (p: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <div className="flex items-center gap-1 font-bold text-amber-300 text-xs sm:text-sm"><IndianRupee size={13} className="text-amber-400 shrink-0" /><span>{SuperadminLibrariesFormatMajorPreviewCurrency(p.data?.revenue ?? 0, 'INR', locale)}</span></div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_STATUS'),
      field: 'status',
      flex: 1,
      minWidth: 110,
      cellRenderer: (p: SemanticCellParams<SuperadminLibrariesLibrary>) => {
        const isActive = p.data?.status === 'Active';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${isActive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isActive ? 'Active' : 'Maintenance'}</span>
          </span>
        );
      },
    },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 2.5,
      minWidth: 380,
      sortable: false,
      filter: false,
      cellRenderer: (p: SemanticCellParams<SuperadminLibrariesLibrary>) => {
        if (!p.data) return null;
        return (
          <SuperadminLibrariesOverviewActionButtons
            library={p.data}
            testIdSuffix={getSuperadminInteractiveTestIdSuffix(p.data)}
            onView={(lib) => { setPanelMode('view'); setSelected(lib); }}
            onEdit={(lib) => { setPanelMode('edit'); setSelected(lib); }}
            onToggleStatus={(id) => void handleSuspend(id)}
            onManageBranches={(lib) => setBranchModalLib(lib)}
            onConfigureModules={(lib) => setModulesModalLib(lib)}
            onToggleAdminPanel={(id) => void handleToggleAdminPanel(id)}
            showToast={showToast}
          />
        );
      },
    },
  ], [handleSuspend, handleToggleAdminPanel, locale, showToast, t]);

  if (loading) return <div className="rounded-2xl border border-border bg-card p-8 text-center text-secondary">{t('COPY.LOADING_SAMPLE_LIBRARY_RECORDS')}</div>;

  return (
    <div className="w-full max-w-full min-w-0 pb-10">
      {error && <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200">{error}</div>}
      <SuperadminLibrariesOverviewHeader onCreateNew={() => setIsCreateModalOpen(true)} onExportCsv={() => downloadSuperadminLibrariesCsv(filteredLibraries, 'libraries.csv')} onExportExcel={() => downloadSuperadminLibrariesExcel(filteredLibraries, 'libraries.xls')} onPrintRoster={() => printSuperadminLibrariesRoster(filteredLibraries, 'Registered Facilities')} />
      <SuperadminLibrariesCreateAccountModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onLibraryCreated={handleLibraryCreated} existingCodes={libraries.map((l) => l.id)} />
      <SuperadminLibrariesOverviewStatsCards totalCount={libraries.length} activeCount={activeCount} totalStudents={totalStudents} totalRevenue={totalRevenue} locale={locale} />
      <SuperadminLibrariesOverviewFilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} planFilter={planFilter} setPlanFilter={setPlanFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} hasActiveFilters={searchQuery !== '' || planFilter !== 'all' || statusFilter !== 'all'} onResetFilters={() => { setSearchQuery(''); setPlanFilter('all'); setStatusFilter('all'); }} onExportCsv={() => downloadSuperadminLibrariesCsv(filteredLibraries, 'libraries.csv')} onExportExcel={() => downloadSuperadminLibrariesExcel(filteredLibraries, 'libraries.xls')} onPrintRoster={() => printSuperadminLibrariesRoster(filteredLibraries, 'Registered Facilities')} filteredCount={filteredLibraries.length} totalCount={libraries.length} />
      <section className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-hidden">
        <SuperadminLibrariesOverviewSemanticTable<SuperadminLibrariesLibrary>
          rowData={filteredLibraries}
          columnDefs={columnDefinitions}
          pagination
          paginationPageSize={5}
          getRowId={({ data }) => data.id}
          hideFilter={true}
          onRowClick={(lib) => { setPanelMode('view'); setSelected(lib); }}
        />
      </section>
      {selected && <SuperadminLibrariesOverviewPanel lib={selected} mode={panelMode} onClose={() => setSelected(null)} onSave={handleSave} onSuspend={handleSuspend} />}
      {branchModalLib && <SuperadminLibrariesBranchManagerModal library={branchModalLib} onClose={() => setBranchModalLib(null)} onToggleAdminPanel={handleToggleAdminPanel} onAddBranch={handleAddBranch} />}
      {modulesModalLib && <SuperadminLibrariesManagerModulesModal library={modulesModalLib} onClose={() => setModulesModalLib(null)} onSaveModules={handleSaveModules} />}
    </div>
  );
}
