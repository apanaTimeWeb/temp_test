'use client';
// RESPONSIBILITY: AdminAccountingSeatGapTableSection component owned by admin_accounting; responsibility folder: admin_accounting_components_tables.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminAccountingSeatGapRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';

export default function AdminAccountingSeatGapTableSection({ rows, columns, emptyMessage, title }: {
  rows: readonly AdminAccountingSeatGapRow[];
  columns: DataGridColumn<AdminAccountingSeatGapRow>[];
  emptyMessage: string;
  title: string;
}) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-accounting-admin-accounting-seat-gap-table-section-1-page', 0);

  return <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4" aria-label={title}>{rows.length === 0 ? <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center py-12"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary" aria-hidden="true">🪑</div><p className="text-section-title font-semibold text-text-primary">{emptyMessage}</p></div> : <DataGrid rowData={[...rows]} columnDefs={columns} rowHeight={56} pagination pageSize={10} emptyMessage={emptyMessage}  page={urlTablePage0} onPageChange={setUrlTablePage0}/>}</section>;
}
