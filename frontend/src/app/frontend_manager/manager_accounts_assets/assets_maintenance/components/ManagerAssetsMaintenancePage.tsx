'use client';
import type { ManagerAssetsMaintenanceMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceTypes.ts';
import { getManagerAssetsMaintenanceSampleLogs } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/mocks/ManagerAssetsMaintenanceRepository';
import { useTranslations } from 'next-intl';

import { useManagerAssetsMaintenanceCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/hooks/useManagerAssetsMaintenanceAssetMaintenanceCurrencyFormatter';


// RESPONSIBILITY: Entry page for the manager_asset_maintenance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import ManagerAssetsMaintenanceEmptyState from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceEmptyState';



const MOCK = getManagerAssetsMaintenanceSampleLogs();

const STATUS_BADGE: Record<string, string> = {
  pending:     'fin-badge--warning',
  'in-progress': 'fin-badge--info',
  completed:   'fin-badge--success',
};

export default function ManagerAssetsMaintenancePage({ view, id }: ManagerAssetsMaintenanceMainProps) {
  const tManagerUi = useTranslations('manager.manager_assets_maintenance.ui');
  const formatManagerAssetMaintenanceCurrency = useManagerAssetsMaintenanceCurrencyFormatter();
  const logs = MOCK;
  const [statusFilter, setStatusFilter] = useState('all');

  const visible = statusFilter === 'all' ? logs : logs.filter(l => l.status === statusFilter);
  const totalCost = logs.filter(l => l.status === 'completed').reduce((s, l) => s + l.cost, 0);

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">{tManagerUi('asset_maintenance')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('review_the_sample_maintenance_register_updates_are_unava_163c7f')}</p>
        </div>
        <button type="button" disabled title={tManagerUi('logging_maintenance_unavailable_host_mutation_contract_n_40db9f')} className="fin-badge fin-badge--info cursor-not-allowed">{tManagerUi('log_request_unavailable')}</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card fin-kpi-card--warning"><p className="fin-kpi-label fin-kpi-label--warning">{tManagerUi('pending')}</p><p className="fin-kpi-value fin-kpi-value--warning">{logs.filter(l=>l.status==='pending').length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-info">{tManagerUi('in_progress')}</p><p className="fin-kpi-value fin-text-info">{logs.filter(l=>l.status==='in-progress').length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-success">{tManagerUi('completed')}</p><p className="fin-kpi-value fin-text-success">{logs.filter(l=>l.status==='completed').length}</p></div>
        <div className="fin-kpi-card fin-kpi-card--danger"><p className="fin-kpi-label fin-kpi-label--danger">{tManagerUi('total_cost')}</p><p className="fin-kpi-value fin-kpi-value--danger">{formatManagerAssetMaintenanceCurrency(totalCost)}</p></div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="pending">{tManagerUi('pending')}</option>
          <option value="in-progress">{tManagerUi('in_progress')}</option>
          <option value="completed">{tManagerUi('completed')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tManagerUi('asset')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('issue')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('reported')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('scheduled')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('vendor')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('cost_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('action')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={8}><ManagerAssetsMaintenanceEmptyState title={tManagerUi('no_maintenance_records_found')} /></td></tr>
            ) : visible.map(l => (
              <tr key={l.id} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4 fin-cell-name">{l.assetName}</td>
                <td className="py-3 px-4 fin-text-body">{l.issue}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.reportedDate}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.scheduledDate}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.vendor}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatManagerAssetMaintenanceCurrency(l.cost)}</td>
                <td className="py-3 px-4"><span className={`fin-badge ${STATUS_BADGE[l.status]}`}>{l.status === 'pending' ? tManagerUi('pending') : l.status === 'in-progress' ? tManagerUi('in_progress') : l.status === 'completed' ? tManagerUi('completed') : l.status}</span></td>
                <td className="py-3 px-4 text-right">
                  {l.status !== 'completed' && (
                    <button type="button" disabled title={tManagerUi('status_update_unavailable_host_mutation_contract_not_sup_953486')} className="fin-badge fin-badge--success cursor-not-allowed">
                      {tManagerUi('update_unavailable')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-accounting-maintenance-contract-warning">{tManagerUi('sample_data_only_creating_maintenance_logs_or_completing_cfeb24')}</p>
    </div>
  );
}
