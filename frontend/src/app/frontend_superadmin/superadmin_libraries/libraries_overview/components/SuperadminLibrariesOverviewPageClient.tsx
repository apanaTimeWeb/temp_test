'use client';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_libraries overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminLibrariesOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewSemanticTable';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Edit2, Eye, Plus, ShieldAlert } from 'lucide-react';
import { useSuperadminLibrariesOverview } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverview';
import SuperadminLibrariesOverviewPanel from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewPanel';
import type { SuperadminLibrariesLibrary, SuperadminLibrariesPanelMode } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';
import { SUPERADMIN_LIBRARIES_TOASTS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/constants/SuperadminLibrariesOverviewConstants';
import { SuperadminLibrariesFormatMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewFormattingUtilities';
import { SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES as __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_overview/config/superadmin_libraries_overview.url_config";
import { useTranslations, useLocale } from 'next-intl';



/** Canonical feature entry component. The supplied archive has no approved live Libraries API contract. */
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
 * Owns local state for the active view, filtering, and row-level preview actions.
 * Keeps fixture-only library changes local and displays empty/filtered results without implying server persistence.
 */
export default function SuperadminLibrariesOverviewPageClient() {
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_LIBRARIES');
  const { libraries, loading, error, updateLibrary, toggleStatus, refetch } = useSuperadminLibrariesOverview();
  const totalRevenue = libraries.reduce((sum, library) => sum + library.revenue, 0);
  const [selected, setSelected] = useState<SuperadminLibrariesLibrary | null>(null);
  const [panelMode, setPanelMode] = useState<SuperadminLibrariesPanelMode>('view');
  const showToast = useCallback((message: string) => { toast.message(message, { id: 'superadmin:superadmin_libraries:SuperadminLibrariesOverviewPageClient:feedback' }); }, []);

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
      headerName: t("COPY.LIBRARY_NAME"), field: 'name', flex: 2, minWidth: 180,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <div>
          <p className="font-medium text-primary">{params.data?.name}</p>
          <p className="text-xs text-secondary">{params.data?.plan} {t("COPY.PLAN")}</p>
        </div>
      ),
    },
    { headerName: t("COPY.LOCATION"), field: 'location', flex: 1.5, minWidth: 160, cellClass: 'sa-cell-muted' },
    {
      headerName: t("COPY.TABLE_COLUMN_CAPACITY_BRANCHES_USERS"), flex: 1.5, minWidth: 160,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <div className="flex flex-col gap-1 justify-center h-full">
          <p className="text-sm font-bold text-primary">{params.data?.branches} {t("COPY.BRANCHES")}</p>
          <p className="text-xs text-secondary">{params.data?.students} {t("COPY.ACTIVE_STUDENTS")}</p>
        </div>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_LTV_REVENUE_SAMPLE"), field: 'revenue', flex: 1, minWidth: 140,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        <span className="text-sm text-secondary">{t("COPY.FINANCIAL_DETAIL_ONLY")}</span>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_STATUS"), field: 'status', flex: 1, minWidth: 120,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => (
        params.data?.status === 'Active'
          ? <span className="sa-badge sa-badge--success">{t("COPY.ACTIVE")}</span>
          : <span className="sa-badge sa-badge--warning">{t("COPY.MAINTENANCE")}</span>
      ),
    },
    {
      headerName: t("COPY.TABLE_COLUMN_ACTIONS"), field: 'id', flex: 1, minWidth: 140, sortable: false, filter: false,
      cellRenderer: (params: SemanticCellParams<SuperadminLibrariesLibrary>) => {
        
        if (!params.data) return null;
        return (
          <div className="flex items-center gap-1 h-full">
            <button type="button" className="sa-btn-icon" aria-label={t("COPY.VIEW_LIBRARY_ARIA_LABEL", { name: params.data.name })} onClick={(event) => { event.stopPropagation(); setPanelMode('view'); setSelected(params.data); }} data-testid={`superadmin-libraries-libraries-overview-view-library-aria-label-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}><Eye size={15} aria-hidden="true" /></button>
            <button type="button" className="sa-btn-icon sa-btn-icon--success" aria-label={t("COPY.EDIT_LIBRARY_PREVIEW_ARIA_LABEL", { name: params.data.name })} onClick={(event) => { event.stopPropagation(); setPanelMode('edit'); setSelected(params.data); }} data-testid={`superadmin-libraries-libraries-overview-edit-library-preview-aria-label-2-${getSuperadminInteractiveTestIdSuffix(params.data)}`}><Edit2 size={15} aria-hidden="true" /></button>
            <button type="button" className="sa-btn-icon sa-btn-icon--danger" aria-label={t("COPY.TOGGLE_LIBRARY_STATUS_PREVIEW_ARIA_LABEL", { name: params.data.name })} onClick={(event) => { event.stopPropagation(); void handleSuspend(params.data.id); }} data-testid={`superadmin-libraries-libraries-overview-toggle-library-status-preview-aria-label-3-${getSuperadminInteractiveTestIdSuffix(params.data)}`}><ShieldAlert size={15} aria-hidden="true" /></button>
          </div>
        );
      },
    },
  ], [handleSuspend, locale, t]);


  if (loading) return <div className="sa-loading-block" role="status" aria-live="polite">{t("COPY.LOADING_SAMPLE_LIBRARY_RECORDS")}</div>;

  return (
    <>
      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">
        {t("COPY.SAMPLE_LIBRARY_FIXTURE_DATA_ONLY_EDITS_AND_STATUS_CHANGES_ARE_LOCAL_PREVIEWS_NO_VERIFIED_LIBRARY_API_INTEGRATION_IS_SUPPLIED")}
      </p>
      {error && <div className="mb-4 rounded-lg border border-border bg-danger-bg p-3 text-sm text-danger" role="alert">{error}</div>}
      {selected && (
        <SuperadminLibrariesOverviewPanel
          lib={selected}
          mode={panelMode}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onSuspend={handleSuspend}
        />
      )}

      <div className="flex flex-col gap-1 mb-6">
        <div className="sa-breadcrumb" aria-label={t("COPY.BREADCRUMB")}>
          <span>{t("COPY.LIBRARY_OS")}</span><span aria-hidden="true">/</span><span>{t("COPY.SUPER_ADMIN")}</span><span aria-hidden="true">/</span><span>{t("COPY.LIBRARIES")}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <h1 className="sa-page-title">{t("COPY.REGISTERED_LIBRARIES")}</h1>
          <Link href={__SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_URLS.ADD_LIBRARY} className="sa-btn-primary" data-testid="superadmin-libraries-libraries_overview-link-1"><Plus size={15} aria-hidden="true" /> {t("COPY.ADD_LIBRARY")}</Link>
        </div>
      </div>

      <div className="sa-card p-4 mb-4"><p className="text-sm text-secondary">{t("COPY.TABLE_COLUMN_LTV_REVENUE_SAMPLE")}</p><p className="mt-2 text-2xl font-bold text-primary">{SuperadminLibrariesFormatMajorPreviewCurrency(totalRevenue, 'INR', locale)}</p></div>
      <section className="sa-card overflow-hidden" aria-label={t("COPY.REGISTERED_LIBRARIES_2")}>
        <div className="sa-actions-bar justify-between gap-3">
          <span className="text-xs text-secondary" aria-live="polite">{libraries.length} {t("COPY.SAMPLE_LIBRARIES")}</span>
        </div>
        <div className="sa-libraries-grid-height">
          {libraries.length === 0 ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 p-6 text-center" role="status">
              <p className="text-sm text-secondary">{t("COPY.NO_SAMPLE_LIBRARY_RECORDS_ARE_AVAILABLE_IN_THIS_PREVIEW")}</p>
              <button type="button" className="sa-btn-secondary" onClick={() => { void refetch(); }} data-testid="superadmin-libraries-libraries-overview-restore-sample-records-5">{t("COPY.RESTORE_SAMPLE_RECORDS")}</button>
            </div>
          ) : <SuperadminLibrariesOverviewSemanticTable<SuperadminLibrariesLibrary> rowData={libraries} columnDefs={columnDefinitions} pagination paginationPageSize={10} getRowId={({ data }) => data.id} onRowClick={(library) => { setPanelMode('view'); setSelected(library); }} />}
        </div>
      </section>
    </>
  );
}
