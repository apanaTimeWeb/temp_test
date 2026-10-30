// RESPONSIBILITY: AdminAccountingShiftGapCardsSection component owned by admin_accounting; responsibility folder: admin_accounting_components_cards.
import type { AdminAccountingShiftGap } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/types/AdminAccountsShiftGapAnalyzerTypes';

export default function AdminAccountingShiftGapCardsSection({ shifts, getShiftLabel, formatCurrency, labels }: {
  shifts: readonly AdminAccountingShiftGap[];
  getShiftLabel: (shift: AdminAccountingShiftGap['shift']) => string;
  formatCurrency: (value: number) => string;
  labels: { full: string; occupied: string; vacant: string; loss: string };
}) {
  return (
    <section aria-label={labels.occupied} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {shifts.map((shift) => <article key={shift.shift} className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card space-y-3 p-5">
        <div className="flex items-center justify-between"><p className="text-body font-semibold text-text-primary">{getShiftLabel(shift.shift)}</p><span className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap ${shift.occupancyPct >= 90 ? 'bg-success-bg text-success-text border-success-bg' : shift.occupancyPct >= 70 ? 'bg-warning-bg text-warning-text border-warning-bg' : 'bg-danger-bg text-danger-text border-danger-bg'}`}>{shift.occupancyPct}% {labels.full}</span></div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-highlight"><progress className={`h-2 w-full rounded-full ${shift.occupancyPct >= 90 ? 'accent-success' : shift.occupancyPct >= 70 ? 'accent-warning' : 'accent-danger'}`} max={100} value={Math.min(100, Math.max(0, shift.occupancyPct))} aria-label={labels.full} /></div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-caption text-success-text">{labels.occupied}</p><p className="font-semibold text-success-text">{shift.occupied}</p></div>
          <div><p className="text-caption text-danger-text">{labels.vacant}</p><p className="font-semibold text-danger-text">{shift.vacant}</p></div>
          <div><p className="text-caption text-warning-text">{labels.loss}</p><p className="font-semibold text-warning-text">{formatCurrency(shift.revenueLoss)}</p></div>
        </div>
      </article>)}
    </section>
  );
}
