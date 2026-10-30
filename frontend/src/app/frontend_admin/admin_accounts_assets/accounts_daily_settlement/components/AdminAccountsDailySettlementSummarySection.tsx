// RESPONSIBILITY: AdminAccountsDailySettlementSummarySection component owned by admin_accounting; responsibility folder: admin_accounting_components_cards.
export default function AdminAccountsDailySettlementSummarySection({ values, labels }: {
  values: { cash: string; upi: string; expenses: string; net: string };
  labels: { cashCollected: string; upiCollected: string; expenses: string; net: string };
}) {
  return (
    <section aria-label={labels.net} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-success-text">{labels.cashCollected}</p><p className="mt-2 text-kpi font-bold text-success-text">{values.cash}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-info-text">{labels.upiCollected}</p><p className="mt-2 text-kpi font-bold text-info-text">{values.upi}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card border-danger-bg bg-danger-bg"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-danger-text">{labels.expenses}</p><p className="mt-2 text-kpi font-bold text-danger-text">{values.expenses}</p></div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card"><p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.net}</p><p className="mt-2 text-kpi font-bold text-text-primary">{values.net}</p></div>
    </section>
  );
}
