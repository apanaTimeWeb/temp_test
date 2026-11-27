// RESPONSIBILITY: AdminAccountingSeatGapSummarySection component owned by admin_accounting; responsibility folder: admin_accounting_components_cards.
import type { AdminAccountingSeatGapRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';
import { AlertTriangle, Armchair, Clock, Wrench } from 'lucide-react';

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

  const cards = [
    {
      label: labels.totalGapSeats,
      value: rows.length,
      valCls: 'text-text-primary',
      iconCls: 'border-info bg-info-bg text-info-text',
      badgeCls: 'bg-info-bg border-info text-info-text',
      stroke: 'var(--chart-info)',
      Icon: Armchair,
    },
    {
      label: labels.revenueLoss,
      value: totalLossLabel,
      valCls: 'text-danger-text',
      iconCls: 'border-danger bg-danger-bg text-danger-text',
      badgeCls: 'bg-danger-bg border-danger text-danger-text',
      stroke: 'var(--chart-danger)',
      Icon: AlertTriangle,
    },
    {
      label: labels.averageGapDays,
      value: `${averageGapDays}d`,
      valCls: 'text-warning-text',
      iconCls: 'border-warning bg-warning-bg text-warning-text',
      badgeCls: 'bg-warning-bg border-warning text-warning-text',
      stroke: 'var(--chart-warning)',
      Icon: Clock,
    },
    {
      label: labels.underMaintenance,
      value: maintenanceSeatCount,
      valCls: 'text-text-primary',
      iconCls: 'border-purple-text bg-purple-bg text-purple-text',
      badgeCls: 'bg-purple-bg border-purple-text text-purple-text',
      stroke: 'var(--chart-primary)',
      Icon: Wrench,
    },
  ];

  return (
    <section aria-label={labels.totalGapSeats} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {cards.map(({ label, value, valCls, iconCls, badgeCls, stroke, Icon }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
        >
          <svg
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2 mb-2">
            <div className="flex flex-col gap-1.5 min-w-0">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">{label}</p>
              {periodBadge && (
                <span className={`self-start rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-card ${badgeCls}`}>
                  {periodBadge}
                </span>
              )}
            </div>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${iconCls}`}>
              <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>
          <p className={`relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums tracking-tight ${valCls}`}>
            {value}
          </p>
        </div>
      ))}
    </section>
  );
}
