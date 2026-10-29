'use client';
import type { ManagerAssetsRegisterMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';
import { useTranslations } from 'next-intl';

import { useManagerAssetsCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterFormattingHook';
import { MANAGER_ACCOUNTING_SAMPLE_ASSETS } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/mocks/manager_assets_register_fixtures/ManagerAssetsRegisterAssetSampleFixtures';


// RESPONSIBILITY: Entry page for the manager_assets module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { ManagerAssetsRegisterEmptyState } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_empty_states/ManagerAssetsRegisterEmptyState';

const STATUS_BADGE: Record<string, string> = {
  active:      'fin-badge--success',
  maintenance: 'fin-badge--warning',
  disposed:    'fin-badge--neutral',
};

// RESPONSIBILITY: Render the assets_register feature view while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerAssetsRegisterPage({ view, id, name, phone, smartId }: ManagerAssetsRegisterMainProps) {
  const tManagerUi = useTranslations('manager.manager_assets.ui');
  const formatManagerAssetsCurrency = useManagerAssetsCurrencyFormatter();
  const assets = MANAGER_ACCOUNTING_SAMPLE_ASSETS;
  const [catFilter, setCatFilter] = useState('all');

  const categories = [...new Set(MANAGER_ACCOUNTING_SAMPLE_ASSETS.map(a => a.category))];
  const categoryLabel = (category: string) => {
    switch (category) {
      case 'Appliance': return tManagerUi('category_appliance');
      case 'Security': return tManagerUi('category_security');
      case 'Furniture': return tManagerUi('category_furniture');
      case 'Electronics': return tManagerUi('category_electronics');
      default: return category;
    }
  };
  const statusLabel = (status: ManagerAssetsRegisterAsset['status']) => ({ active: tManagerUi('asset_status_active'), maintenance: tManagerUi('asset_status_maintenance'), disposed: tManagerUi('asset_status_disposed') } as const)[status];
  const visible = catFilter === 'all' ? assets : assets.filter(a => a.category === catFilter);
  const totalValue = assets.filter(a => a.status !== 'disposed').reduce((s, a) => s + a.currentValue, 0);

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">{tManagerUi('asset_manager')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('review_the_sample_asset_register_asset_changes_are_unava_f6b9af')}</p>
        </div>
        <button type="button" disabled title={tManagerUi('asset_creation_unavailable_host_mutation_contract_not_su_ca30d9')} className="fin-badge fin-badge--info cursor-not-allowed">{tManagerUi('add_asset_unavailable')}</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card"><p className="fin-kpi-label">{tManagerUi('total_assets')}</p><p className="fin-kpi-value">{assets.length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-success">{tManagerUi('current_value')}</p><p className="fin-kpi-value fin-text-success">{formatManagerAssetsCurrency(totalValue)}</p></div>
        <div className="fin-kpi-card fin-kpi-card--warning"><p className="fin-kpi-label fin-kpi-label--warning">{tManagerUi('under_maintenance')}</p><p className="fin-kpi-value fin-kpi-value--warning">{assets.filter(a=>a.status==='maintenance').length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-muted">{tManagerUi('disposed')}</p><p className="fin-kpi-value fin-text-muted">{assets.filter(a=>a.status==='disposed').length}</p></div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-44" value={catFilter} onChange={e => setCatFilter(e.target.value)} aria-label={tManagerUi('all_categories')}>
          <option value="all">{tManagerUi('all_categories')}</option>
          {categories.map(c => <option key={c} value={c}>{categoryLabel(c)}</option>)}
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tManagerUi('asset_name')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('category')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('purchase_date')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('purchase_value_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('current_value_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('location')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7}><ManagerAssetsRegisterEmptyState className="fin-empty-state"><div className="fin-empty-state__icon">🏷️</div><p className="fin-empty-state__title">{tManagerUi('no_assets_found')}</p></ManagerAssetsRegisterEmptyState></td></tr>
            ) : visible.map(a => (
              <tr key={a.id} className={`fin-table-hover-row fin-table-row ${a.status === 'disposed' ? 'opacity-50' : ''}`}>
                <td className="py-3 px-4 fin-cell-name">{a.name}</td>
                <td className="py-3 px-4"><span className="fin-badge fin-badge--neutral">{categoryLabel(a.category)}</span></td>
                <td className="py-3 px-4 fin-cell-subtext">{a.purchaseDate}</td>
                <td className="py-3 px-4 text-right fin-cell-subtext">{formatManagerAssetsCurrency(a.purchaseValue)}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatManagerAssetsCurrency(a.currentValue)}</td>
                <td className="py-3 px-4 fin-cell-subtext">{a.location}</td>
                <td className="py-3 px-4"><span className={`fin-badge ${STATUS_BADGE[a.status]}`}>{statusLabel(a.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-accounting-assets-contract-warning">{tManagerUi('sample_data_only_asset_values_and_rows_are_not_persisted_80ac83')}</p>
    </div>
  );
}
