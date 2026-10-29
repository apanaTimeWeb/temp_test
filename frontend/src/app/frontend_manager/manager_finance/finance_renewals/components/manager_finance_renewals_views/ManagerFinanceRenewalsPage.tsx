'use client';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_RENEWALS } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsDemoRepository';
import { useManagerRenewalsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/useManagerFinanceRenewalsUrlFilters';
import ManagerFinanceRenewalsNativeTable, { type NativeCellParams } from '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_table_parts/ManagerFinanceRenewalsNativeTable';

import { useManagerRenewalsFormatting } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsFormattingHook';

// RESPONSIBILITY: Entry page for the manager_renewals module.
// DATA FLOW: Next.js Router -> Page -> Components


// RESPONSIBILITY: Entry page for the manager_renewals module.
// DATA FLOW: Next.js Router -> Page -> Components
import { Send, MessageSquare, Upload, Mail } from 'lucide-react';
import { MANAGER_FINANCE_RENEWAL_FILTERS } from '@/app/frontend_manager/manager_finance/finance_renewals/constants/ManagerFinanceRenewalsRenewalConstants';
import type { FilterType, ManagerFinanceRenewalsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsComponentTypes';




const URL_FILTERS = { filter: { defaultValue: 'expiring_7', allowedValues: ['expired', 'expiring_7', 'expiring_15'] } } as const;


export default function ManagerFinanceRenewalsPage(_routeQuery: ManagerFinanceRenewalsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_renewals.ui');
  const { formatCurrency, formatDate } = useManagerRenewalsFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerRenewalsUrlFilters(URL_FILTERS);
  const filter = urlFilters.filter as FilterType;
  const allRenewals = MANAGER_FINANCE_SAMPLE_RENEWALS;

  const visible = allRenewals.filter((r) => {
    if (filter === 'expired')     return r.daysLeft < 0;
    if (filter === 'expiring_7')  return r.daysLeft >= 0 && r.daysLeft <= 7;
    if (filter === 'expiring_15') return r.daysLeft >= 0 && r.daysLeft <= 15;
    return true;
  });

  const translateShift = (value: string) => {
    switch (value) {
      case 'Morning': return tManagerUi('morning');
      case 'Evening': return tManagerUi('evening');
      case 'Full Day': return tManagerUi('full_day');
      default: return value;
    }
  };
  const translatePlanTier = (value: string) => {
    switch (value) {
      case 'Basic': return tManagerUi('basic_tier');
      case 'Premium': return tManagerUi('premium_tier');
      case 'Elite': return tManagerUi('elite_tier');
      default: return value;
    }
  };

  const colDefs = [
    { field: 'studentName', headerName: tManagerUi('student'), flex: 1, minWidth: 150, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-name font-medium">{p.value}</span> },
    { field: 'smartId', headerName: tManagerUi('smart_id'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="fin-mono text-sm">{p.value}</span> },
    { field: 'shift', headerName: tManagerUi('shift'), width: 110, cellRenderer: (p: NativeCellParams) => <div className="h-full flex items-center"><span className="fin-badge fin-badge--neutral">{typeof p.value === 'string' ? translateShift(p.value) : '—'}</span></div> },
    { field: 'plan', headerName: tManagerUi('plan'), width: 110, cellRenderer: (p: NativeCellParams) => <span className="fin-text-body">{typeof p.value === 'string' ? translatePlanTier(p.value) : '—'}</span> },
    { field: 'expiryDate', headerName: tManagerUi('expiry_date'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-subtext">{typeof p.value === 'string' ? formatDate(p.value) : p.value}</span> },
    { 
      field: 'daysLeft', 
      headerName: tManagerUi('days_left'), 
      width: 120,
      cellRenderer: (p: NativeCellParams) => {
        const daysLeft = typeof p.value === 'number' ? p.value : 0;
        return <span className={daysLeft < 0 ? 'fin-text-danger font-semibold' : daysLeft <= 7 ? 'fin-text-warning font-semibold' : 'fin-text-body'}>
          {daysLeft < 0 ? tManagerUi('days_ago_count', { count: Math.abs(daysLeft) }) : tManagerUi('days_count', { count: daysLeft })}
        </span>;
      }
    },
    { field: 'lastPaymentDate', headerName: tManagerUi('last_payment'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-subtext">{typeof p.value === 'string' ? formatDate(p.value) : p.value}</span> },
    { 
      field: 'due', 
      headerName: tManagerUi('due_inr'), 
      width: 110,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: NativeCellParams) => {
        const due = typeof p.value === 'number' ? p.value : 0;
        return <span className={due > 0 ? 'fin-text-danger' : 'fin-text-body'}>{formatCurrency(due)}</span>;
      }
    },
    {
      headerName: tManagerUi('actions'),
      width: 180,
      sortable: false,
      cellRenderer: () => (
        <div className="flex items-center gap-2 h-full">
          {/* Admin is View-Only: Renew button removed */}
          <button
            type="button"
            className="fin-badge fin-badge--neutral cursor-not-allowed"
            disabled
            title={tManagerUi('reminder_unavailable_verified_messaging_contract_not_sup_8204c0')}
          >
            <Send size={12} className="mr-1" /> {tManagerUi('remind')}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="fin-input-hint fin-text-warning" role="status">{tManagerUi('renewal_records_are_sample_data_reminder_sending_and_sub_1a7d9e')}</p>
          <h1 className="fin-page-title">{tManagerUi('subscription_renewals')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('subscriptions_needing_renewal_attention')}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button type="button" className="fin-btn fin-btn-secondary" disabled title={tManagerUi('import_is_disabled_because_the_supplied_frontend_contrac_0dd58d')}>
            <Upload size={14} /> {tManagerUi('import')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary cursor-not-allowed" disabled title={tManagerUi('export_unavailable_renewal_rows_are_sample_data_not_veri_034db3')} data-testid="manager-finance-renewals-export-disabled">
            {tManagerUi('csv_unavailable')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary cursor-not-allowed" disabled title={tManagerUi('official_printing_unavailable_renewal_rows_are_sample_da_5fb9ad')} data-testid="manager-finance-renewals-print-disabled">
            {tManagerUi('print_unavailable')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary text-success" disabled title={tManagerUi('whatsapp_sending_requires_a_supplied_contact_integration_c618bf')}>
            <MessageSquare size={14} /> {tManagerUi('wa_all')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary text-purple" disabled title={tManagerUi('email_sending_requires_a_supplied_contact_integration_co_68e954')}>
            <Mail size={14} /> {tManagerUi('email_all')}
          </button>
          <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('reminders_unavailable_verified_messaging_contract_not_su_2396f5')}>
            <Send size={14} className="mr-1" /> {tManagerUi('remind_all')}
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {MANAGER_FINANCE_RENEWAL_FILTERS.map((f) => (
          <button type="button"
            key={f.value}
            onClick={() => setUrlFilter('filter', f.value)}
            className={filter === f.value ? 'fin-badge fin-badge--info cursor-pointer' : 'fin-badge fin-badge--neutral cursor-pointer'}
          >
            {f.emoji} {tManagerUi(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="fin-card p-4">
        <div className="mgr-table-wrapper h-112">
          <ManagerFinanceRenewalsNativeTable getRowKey={(row) => String(row.id)} emptyMessage={tManagerUi('no_subscriptions_found')} rows={visible} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
        </div>
      </div>

    </div>
  );
}
