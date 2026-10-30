// RESPONSIBILITY: AdminAccountingMaintenanceTableSection component owned by admin_accounting; responsibility folder: admin_accounting_components_tables.
'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminAccountingMaintenanceLog } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/types/AdminAssetsMaintenanceTypes';

export default function AdminAccountingMaintenanceTableSection({ logs, columns, emptyMessage, tableLabel }: {
  logs: readonly AdminAccountingMaintenanceLog[];
  columns: DataGridColumn<AdminAccountingMaintenanceLog>[];
  emptyMessage: string;
  tableLabel: string;
}) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-accounting-admin-accounting-maintenance-table-section-1-page', 0);

  return <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4" aria-label={tableLabel}><DataGrid rowData={[...logs]} columnDefs={columns} rowHeight={56} pagination pageSize={10} emptyMessage={emptyMessage}  page={urlTablePage0} onPageChange={setUrlTablePage0}/></section>;
}
