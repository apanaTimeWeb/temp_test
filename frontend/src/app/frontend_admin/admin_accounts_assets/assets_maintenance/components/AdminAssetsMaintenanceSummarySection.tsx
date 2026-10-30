// RESPONSIBILITY: AdminAccountingMaintenanceSummarySection component owned by admin_accounting; responsibility folder: admin_accounting_components_cards.
import type { AdminAccountingMaintenanceLog } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/types/AdminAssetsMaintenanceTypes';

export default function AdminAccountingMaintenanceSummarySection({ logs, totalCostLabel, labels }: {
  logs: readonly AdminAccountingMaintenanceLog[];
  totalCostLabel: string;
  labels: { pending: string; inProgress: string; completed: string; totalCost: string };
}) {
  return (
    <section aria-label={labels.totalCost} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.pending}</p><p className="mt-2 text-kpi font-bold text-text-primary text-warning-text">{logs.filter((log) => log.status === 'pending').length}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.inProgress}</p><p className="mt-2 text-kpi font-bold text-text-primary text-info-text">{logs.filter((log) => log.status === 'in-progress').length}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.completed}</p><p className="mt-2 text-kpi font-bold text-text-primary text-success-text">{logs.filter((log) => log.status === 'completed').length}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.totalCost}</p><p className="mt-2 text-kpi font-bold text-text-primary text-danger-text">{totalCostLabel}</p></div>
    </section>
  );
}
