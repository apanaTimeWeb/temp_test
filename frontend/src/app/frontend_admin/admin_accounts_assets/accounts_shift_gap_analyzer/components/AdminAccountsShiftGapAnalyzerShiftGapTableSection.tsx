'use client';
// RESPONSIBILITY: AdminAccountingShiftGapTableSection component owned by admin_accounting; responsibility folder: admin_accounting_components_tables.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminAccountingDayGap } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/types/AdminAccountsShiftGapAnalyzerTypes';

export default function AdminAccountingShiftGapTableSection({ rows, columns, emptyMessage, title }: {
  rows: readonly AdminAccountingDayGap[]; columns: DataGridColumn<AdminAccountingDayGap>[]; emptyMessage: string; title: string;
}) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-accounting-admin-accounting-shift-gap-table-section-1-page', 0);

  return <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4" aria-label={title}><DataGrid rowData={[...rows]} columnDefs={columns} rowHeight={56} pagination pageSize={10} emptyMessage={emptyMessage}  page={urlTablePage0} onPageChange={setUrlTablePage0}/></section>;
}
