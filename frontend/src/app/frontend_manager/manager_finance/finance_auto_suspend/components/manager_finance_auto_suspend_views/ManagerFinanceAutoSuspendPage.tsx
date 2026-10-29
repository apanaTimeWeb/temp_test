'use client';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG, MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/hooks/ManagerFinanceAutoSuspendDemoRepository';
import type { ManagerFinanceAutoSuspendConfig as Config, ManagerFinanceAutoSuspendSuspendedStudent as SuspendedStudent } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';

// RESPONSIBILITY: Entry page for the manager_auto_suspend module.
// DATA FLOW: Next.js Router -> Page -> Components

// RESPONSIBILITY: Entry page for the manager_auto_suspend module.
// DATA FLOW: Next.js Router -> Page -> Components
import { Settings, Ban, RotateCcw, Bell, UserCheck, ShieldAlert } from 'lucide-react';
import { ManagerFinanceAutoSuspendEmptyState } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_empty_states/ManagerFinanceAutoSuspendEmptyState';
import type { ManagerFinanceAutoSuspendRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendComponentTypes';



export default function ManagerFinanceAutoSuspendPage(_routeQuery: ManagerFinanceAutoSuspendRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_auto_suspend.ui');
  const config: Config = MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG;
  const suspended: SuspendedStudent[] = MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS;
  const shiftLabels: Record<string, string> = { Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day') };

  const KPI_CARDS = [
    { label: tManagerUi('days_before_suspend'), value: config?.daysBeforeSuspend, icon: Settings, variant: 'default' },
    { label: tManagerUi('currently_suspended'), value: config?.currentlySuspended ?? 0, icon: Ban, variant: 'danger' },
    { label: tManagerUi('auto_restored_month'), value: config?.autoRestoredThisMonth ?? 0, icon: RotateCcw, variant: 'default' },
    { label: tManagerUi('manual_restores'), value: config?.manualRestores ?? 0, icon: UserCheck, variant: 'default' },
  ] as const;

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div>
        <p className="fin-input-hint fin-text-warning" role="status">{tManagerUi('configuration_and_suspended_student_records_are_sample_d_1f1c42')}</p>
        <h1 className="fin-page-title">{tManagerUi('auto_suspend_policy')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('manage_automatic_suspension_and_student_restoration')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {KPI_CARDS.map(({ label, value, icon: Icon, variant }) => (
          <div key={label} className={`fin-kpi-card ${variant === 'danger' ? 'fin-kpi-card--danger' : ''}`}>
            <div className="fin-kpi-card__header">
              <span className={`fin-kpi-label ${variant === 'danger' ? 'fin-kpi-label--danger' : ''}`}>{label}</span>
              <Icon size={16} className={variant === 'danger' ? 'fin-text-danger' : 'fin-icon-muted'} />
            </div>
            <p className={`fin-kpi-value ${variant === 'danger' ? 'fin-kpi-value--danger' : ''}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Policy Config */}
      <div className="fin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 fin-text-body font-semibold">
            <ShieldAlert size={18} className="fin-icon-muted" />
            {tManagerUi('policy_configuration')}
          </div>
          <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed" disabled title={tManagerUi('save_unavailable_verified_api_contract_not_supplied')}>
            {tManagerUi('edit')}
          </button>
        </div>
        <p className="fin-policy-text">
          {tManagerUi('students_are_automatically_suspended_after')} <strong>{config?.daysBeforeSuspend}</strong> {tManagerUi('days_of_non_payment_past_due_date')}
        </p>
      </div>

      {/* Suspended Students Table */}
      <div className="fin-card overflow-x-auto">
        <div className="flex items-center gap-2 p-4 fin-border-bottom">
          <Ban size={18} className="fin-text-danger" />
          <span className="fin-text-body font-semibold">{tManagerUi('suspended_students')}</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('seat')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('shift')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('last_payment_date')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('days_overdue')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('suspended_since')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {suspended.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <ManagerFinanceAutoSuspendEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon">🔓</div>
                    <p className="fin-empty-state__title">{tManagerUi('no_students_currently_suspended')}</p>
                  </ManagerFinanceAutoSuspendEmptyState>
                </td>
              </tr>
            ) : (
              suspended.map((s) => (
                <tr key={s.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{s.studentName}</div>
                    <div className="fin-cell-subtext">{s.smartId}</div>
                  </td>
                  <td className="py-3 px-4 fin-text-body">{s.seat}</td>
                  <td className="py-3 px-4">
                    <span className="fin-badge fin-badge--neutral">{shiftLabels[s.shift] ?? s.shift}</span>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">—</td>
                  <td className="py-3 px-4">
                    <span className="fin-text-danger font-semibold">{s.daysOverdue}{tManagerUi('d')}</span>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{s.suspendedSince}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button"
                        className="fin-badge fin-badge--neutral cursor-pointer"
                        disabled title={tManagerUi('whatsapp_sending_requires_a_supplied_contact_integration_c618bf')}
                      >
                        <Bell size={11} /> {tManagerUi('send_reminder')}
                      </button>
                      <button
                        type="button"
                        className="fin-badge fin-badge--success cursor-not-allowed"
                        disabled
                        title={tManagerUi('manual_restore_unavailable_verified_backend_mutation_con_3a75b9')}
                      >
                        <RotateCcw size={11} /> {tManagerUi('manual_restore_unavailable')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
