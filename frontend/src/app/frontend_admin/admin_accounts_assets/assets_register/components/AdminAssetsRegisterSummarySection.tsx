// Responsibility: summary KPIs derived from the supplied asset rows.
import type { AdminAssetsRegisterAsset } from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterFormSchemas';
import type { AdminAssetsRegisterSummaryLabels } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterComponentTypes';


export default function AdminAssetsRegisterSummarySection({ assets, totalValueLabel, labels }: { assets: readonly AdminAssetsRegisterAsset[]; totalValueLabel: string; labels: AdminAssetsRegisterSummaryLabels }) {
  const cards = [
    { label: labels.totalAssets, value: String(assets.length), valueClass: 'text-primary' },
    { label: labels.currentValue, value: totalValueLabel, valueClass: 'text-success-text' },
    { label: labels.underMaintenance, value: String(assets.filter((asset) => asset.status === 'maintenance').length), valueClass: 'text-info-text' },
    { label: labels.disposed, value: String(assets.filter((asset) => asset.status === 'disposed').length), valueClass: 'text-text-secondary' },
  ] as const;
  return (
    <section aria-label={labels.totalAssets} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => <article key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-card"><p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{card.label}</p><p className={`mt-2 text-kpi font-bold ${card.valueClass}`}>{card.value}</p></article>)}
    </section>
  );
}


export type { AdminAssetsRegisterSummaryLabels };
