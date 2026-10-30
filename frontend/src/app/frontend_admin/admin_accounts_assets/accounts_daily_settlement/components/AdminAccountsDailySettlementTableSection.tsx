// RESPONSIBILITY: AdminAccountsDailySettlementTableSection component owned by admin_accounting; responsibility folder: admin_accounting_components_tables.
import { DataGrid, type DataGridColumn, type DataGridCellParams } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminAccountsDailySettlementEntry } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import type { Entry } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';


export default function AdminAccountsDailySettlementTableSection({ entries, columns, emptyMessage, tableLabel }: {
  entries: readonly Entry[];
  columns: DataGridColumn<Entry>[];
  emptyMessage: string;
  tableLabel: string;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4" aria-label={tableLabel}>
      {entries.length === 0 ? <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center py-12"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary" aria-hidden="true">📋</div><p className="text-section-title font-semibold text-text-primary">{emptyMessage}</p></div> : <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card h-80"><DataGrid rowData={[...entries]} columnDefs={columns} rowHeight={56} pagination={false} /></div>}
    </section>
  );
}
