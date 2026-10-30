// RESPONSIBILITY: AdminAccountingShiftGapSummarySection component owned by admin_accounting; responsibility folder: admin_accounting_components_cards.
export default function AdminAccountingShiftGapSummarySection({ totalLossLabel, totalVacant, averageOccupancy, shiftCount, labels }: {
  totalLossLabel: string; totalVacant: number; averageOccupancy: number; shiftCount: number;
  labels: { totalRevenueLoss: string; totalVacantSeats: string; averageOccupancy: string; shiftsAnalyzed: string };
}) {
  return (
    <section aria-label={labels.totalRevenueLoss} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.totalRevenueLoss}</p><p className="mt-2 text-kpi font-bold text-text-primary text-danger-text">{totalLossLabel}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.totalVacantSeats}</p><p className="mt-2 text-kpi font-bold text-text-primary text-warning-text">{totalVacant}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.averageOccupancy}</p><p className="mt-2 text-kpi font-bold text-text-primary">{averageOccupancy}%</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.shiftsAnalyzed}</p><p className="mt-2 text-kpi font-bold text-text-primary">{shiftCount}</p></div>
    </section>
  );
}
