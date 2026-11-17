// RESPONSIBILITY: AdminAccountingSeatGapSummarySection component owned by admin_accounting; responsibility folder: admin_accounting_components_cards.
import { Armchair, AlertTriangle, Clock, Wrench } from 'lucide-react';
import type { AdminAccountingSeatGapRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';

export default function AdminAccountingSeatGapSummarySection({
  rows,
  totalLossLabel,
  labels,
  periodBadge,
}: {
  rows: readonly AdminAccountingSeatGapRow[];
  totalLossLabel: string;
  labels: { totalGapSeats: string; revenueLoss: string; averageGapDays: string; underMaintenance: string };
  periodBadge?: string;
}) {
  const averageGapDays = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.gapDays, 0) / rows.length) : 0;
  const maintenanceSeatCount = rows.filter((row) => row.status === 'maintenance').length;

  return (
    <section aria-label={labels.totalGapSeats} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {/* Total Gap Seats */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-card to-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{labels.totalGapSeats}</p>
            {periodBadge && (
              <span className="inline-flex items-center rounded-md bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400">
                {periodBadge}
              </span>
            )}
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Armchair size={16} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl sm:text-3xl font-black tabular-nums tracking-tight text-cyan-400">{rows.length}</p>
      </div>

      {/* Revenue Loss */}
      <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-card to-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-500/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{labels.revenueLoss}</p>
            {periodBadge && (
              <span className="inline-flex items-center rounded-md bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-400">
                {periodBadge}
              </span>
            )}
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle size={16} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl sm:text-3xl font-black tabular-nums tracking-tight text-rose-400">{totalLossLabel}</p>
      </div>

      {/* Average Gap Days */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{labels.averageGapDays}</p>
            {periodBadge && (
              <span className="inline-flex items-center rounded-md bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                {periodBadge}
              </span>
            )}
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock size={16} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl sm:text-3xl font-black tabular-nums tracking-tight text-amber-400">{averageGapDays}d</p>
      </div>

      {/* Under Maintenance */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-card to-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{labels.underMaintenance}</p>
            {periodBadge && (
              <span className="inline-flex items-center rounded-md bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">
                {periodBadge}
              </span>
            )}
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Wrench size={16} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-2 text-2xl sm:text-3xl font-black tabular-nums tracking-tight text-purple-400">{maintenanceSeatCount}</p>
      </div>
    </section>
  );
}
