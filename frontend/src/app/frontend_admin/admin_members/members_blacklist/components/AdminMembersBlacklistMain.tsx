'use client';
// RESPONSIBILITY: AdminMembersBlacklistMain component owned by admin_blacklist; responsibility folder: admin_blacklist_components_tables.

import { AdminMembersBlacklistActionModals } from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistActionModals';
import { AdminMembersBlacklistDetailDossier } from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistDetailDossier';
import { AdminBlacklistFormDialog } from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistFormDialog';
import { AdminMembersBlacklistKpiGrid } from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistKpiGrid';
import AdminBlacklistRecordsSection from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistRecordsSection';
import useAdminMembersBlacklistState from '@/app/frontend_admin/admin_members/members_blacklist/hooks/useAdminMembersBlacklistState';
import type { AdminBlacklistFormSchemaType } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import type { AdminBlacklistFormDialogProps, AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import {
  exportBlacklistCsv,
  exportBlacklistExcel,
  formatAdminBlacklistDate,
} from '@/app/frontend_admin/admin_members/members_blacklist/utils/adminMembersBlacklistExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { type DataGridCellParams, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { AlertOctagon, Download, FileSpreadsheet, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Toaster } from 'sonner';

export { formatAdminBlacklistDate, AdminBlacklistFormDialog };
export type { AdminBlacklistFormDialogProps };

const BLACKLIST_CATEGORY_LABELS: Record<string, string> = {
  THEFT_STOLEN_PROPERTY: '🚨 Theft / Chori',
  INDISCIPLINE_MISCONDUCT: '⚡ Indiscipline',
  PHYSICAL_ALTERCATION: '⚠️ Altercation',
  PROPERTY_VANDALISM: '🔨 Vandalism',
  UNAUTHORIZED_OCCUPANCY: '🚫 Illegal Seat',
  FEE_DEFAULT_FRAUD: '💳 Fee Default',
  OTHER: '⚠️ Disciplinary',
};

/** Renders blacklist records and dialogs; query and mutation orchestration belongs to the module hook. */
export default function AdminMembersBlacklistMain() {
  const t = useTranslations('ADMIN_BLACKLIST');
  const locale = useLocale();
  const {
    isDemoMode,
    recordsQuery,
    records,
    showForm,
    setShowForm,
    removeId,
    setRemoveId,
    selectedRecord,
    setSelectedRecord,
    submit,
    pardonStudent,
    confirmRemove,
  } = useAdminMembersBlacklistState();
  const [pardonTarget, setPardonTarget] = useState<AdminBlacklistRecord | null>(null);
  const [pardonReason, setPardonReason] = useState('');

  const columns = useMemo<readonly DataGridColumn<AdminBlacklistRecord>[]>(() => [
    { field: 'name', headerName: t('TABLE_STUDENT'), flex: 1.8, minWidth: 170, sortable: true },
    {
      field: 'banScope',
      headerName: 'Ban Scope',
      flex: 1.3,
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }: DataGridCellParams<AdminBlacklistRecord>) => {
        const isNetwork = data.banScope === 'NETWORK_WIDE' || !data.banScope;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              isNetwork ? 'bg-danger-bg text-danger-text border-danger' : 'bg-warning-bg text-warning-text border-warning'
            }`}
          >
            {isNetwork ? '🌐 Network-Wide' : `🏢 ${data.branch || 'Branch'}`}
          </span>
        );
      },
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1.4,
      minWidth: 140,
      sortable: true,
      cellRenderer: ({ data }: DataGridCellParams<AdminBlacklistRecord>) => {
        const cat = data.category || 'INDISCIPLINE_MISCONDUCT';
        return <span className="text-xs font-semibold text-text-secondary">{BLACKLIST_CATEGORY_LABELS[cat] || cat}</span>;
      },
    },
    { field: 'reason', headerName: t('TABLE_REASON'), flex: 2.2, minWidth: 200, sortable: true },
    {
      field: 'blacklistedOn',
      headerName: t('TABLE_DATE'),
      flex: 1,
      minWidth: 110,
      sortable: true,
      cellRenderer: ({ value }: DataGridCellParams<AdminBlacklistRecord>) => formatAdminBlacklistDate(typeof value === 'string' ? value : undefined, locale),
    },
    { field: 'previousSeat', headerName: t('TABLE_PREVIOUS_SEAT'), flex: 0.8, minWidth: 90, sortable: true },
    {
      field: 'status',
      headerName: t('TABLE_STATUS'),
      flex: 1,
      minWidth: 110,
      sortable: true,
      cellRenderer: ({ value }: DataGridCellParams<AdminBlacklistRecord>) =>
        value === 'Pardoned' ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-bg text-success-text border border-success">
            Pardoned
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-danger-bg text-danger-text border border-danger">
            {t('STATUS_BLACKLISTED')}
          </span>
        ),
    },
    {
      headerName: t('TABLE_ACTIONS'),
      minWidth: 110,
      sortable: false,
      cellRenderer: ({ data }: DataGridCellParams<AdminBlacklistRecord>) => (
        <button
          type="button"
          disabled={!isDemoMode}
          className="admin-btn-icon min-h-11 min-w-11 disabled:cursor-not-allowed disabled:opacity-50 text-danger-text hover:bg-danger-bg"
          aria-label={t('REMOVE_ARIA', { name: data.name })}
          title={!isDemoMode ? t('LIVE_UNAVAILABLE') : undefined}
          onClick={() => setRemoveId(data.id)}
        >
          <X size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      ),
    },
  ], [isDemoMode, t, locale, setRemoveId]);

  const errorMessage = recordsQuery.isError ? t('LOAD_ERROR') : null;
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const visibleRecords = useMemo(() => {
    if (isAllBranches || !selectedBranch) return records;
    return records.filter(
      (r) =>
        !r.branch ||
        r.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
        selectedBranch.name.toLowerCase().includes(r.branch.toLowerCase()),
    );
  }, [records, isAllBranches, selectedBranch]);

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="w-full space-y-6 text-text-primary pb-10">
        {!isDemoMode && <p role="status" className="rounded-xl border border-warning bg-warning-bg p-4 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">{t('TITLE')}</h1>
              <p className="text-xs sm:text-sm text-text-secondary">{t('SUBTITLE')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => exportBlacklistCsv(visibleRecords, 'smart-library-blacklist-report.csv', true)}
                disabled={visibleRecords.length === 0}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-danger bg-danger-bg px-3.5 py-2 text-xs font-semibold text-danger-text hover:opacity-90 motion-safe:transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-card"
                title="Export Blacklist to CSV"
              >
                <Download size={14} aria-hidden="true" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => exportBlacklistExcel(visibleRecords, 'smart-library-blacklist-report.xls', true)}
                disabled={visibleRecords.length === 0}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-success bg-success-bg px-3.5 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-card"
                title="Export Blacklist to Excel"
              >
                <FileSpreadsheet size={14} aria-hidden="true" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-on-danger shadow-card hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => { if (isDemoMode) setShowForm(true); }}
                disabled={!isDemoMode}
                title={!isDemoMode ? t('LIVE_UNAVAILABLE') : undefined}
              >
                <AlertOctagon size={16} strokeWidth={2} aria-hidden="true" />
                <span>{t('ADD_ACTION')}</span>
              </button>
            </div>
          </div>
        </div>

        <AdminMembersBlacklistKpiGrid records={visibleRecords} branchCode={selectedBranch?.code ?? null} />

        <AdminBlacklistRecordsSection
          records={visibleRecords}
          columns={columns}
          isLoading={recordsQuery.isPending}
          isError={recordsQuery.isError}
          errorMessage={errorMessage}
          onRetry={() => { void recordsQuery.refetch(); }}
          onRowClicked={setSelectedRecord}
        />

        {selectedRecord && (
          <AdminMembersBlacklistDetailDossier
            record={selectedRecord}
            locale={locale}
            isDemoMode={isDemoMode}
            onPardon={(rec) => { setPardonTarget(rec); setPardonReason(''); }}
            onClose={() => setSelectedRecord(null)}
          />
        )}

        <AdminBlacklistFormDialog open={showForm} onOpenChange={setShowForm} onSubmit={(values: AdminBlacklistFormSchemaType) => submit(values)} isDemoMode={isDemoMode} />

        <AdminMembersBlacklistActionModals
          isDemoMode={isDemoMode}
          removeId={removeId}
          onCloseRemove={() => setRemoveId(null)}
          onConfirmRemove={confirmRemove}
          pardonTarget={pardonTarget}
          pardonReason={pardonReason}
          onChangePardonReason={setPardonReason}
          onClosePardon={() => { setPardonTarget(null); setPardonReason(''); }}
          onConfirmPardon={pardonStudent}
        />
      </div>
    </>
  );
}
