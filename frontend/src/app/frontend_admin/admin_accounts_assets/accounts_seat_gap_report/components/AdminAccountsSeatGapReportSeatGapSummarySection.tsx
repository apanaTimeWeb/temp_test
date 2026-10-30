// RESPONSIBILITY: AdminAccountingSeatGapSummarySection component owned by admin_accounting; responsibility folder: admin_accounting_components_cards.
import type { AdminAccountingSeatGapRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';

export default function AdminAccountingSeatGapSummarySection({ rows, totalLossLabel, labels }: {
  rows: readonly AdminAccountingSeatGapRow[];
  totalLossLabel: string;
  labels: { totalGapSeats: string; revenueLoss: string; averageGapDays: string; underMaintenance: string };
}) {
  const averageGapDays = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.gapDays, 0) / rows.length) : 0;
  const maintenanceSeatCount = rows.filter((row) => row.status === 'maintenance').length;
  return (
    <section aria-label={labels.totalGapSeats} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.totalGapSeats}</p><p className="mt-2 text-kpi font-bold text-text-primary">{rows.length}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.revenueLoss}</p><p className="mt-2 text-kpi font-bold text-text-primary text-warning-text">{totalLossLabel}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.averageGapDays}</p><p className="mt-2 text-kpi font-bold text-text-primary">{averageGapDays}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.underMaintenance}</p><p className="mt-2 text-kpi font-bold text-text-primary">{maintenanceSeatCount}</p></div>
    </section>
  );
}
