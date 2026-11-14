'use client';

import { useSuperadminSubscriptionsOverviewMemberAutoSuspendPolicyConfirm } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/hooks/useSuperadminSubscriptionsOverviewMemberAutoSuspendPolicyConfirm';
import SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyEmptyState from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/components/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyEmptyState';
/** Responsibility: Superadmin Finance Auto Suspend Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { toast } from 'sonner';
import { Settings, Ban, RotateCcw, Bell, Save, UserCheck, ShieldAlert } from 'lucide-react';
import { SUPERADMIN_FINANCE_AUTO_SUSPEND_SAMPLE_CONFIG } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/mocks/fixtures/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyMockFixtures';
import { SUPERADMIN_FINANCE_AUTO_SUSPEND_SAMPLE_STUDENTS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/mocks/fixtures/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyMockFixtures';
import type { Config, SuspendedStudent } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/types/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClientComponentTypes';





/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient`.
 * Uses immutable sample preview records for `config` and `suspended`; owns UI state for `editing`, `days` and related form/selection state.
 * Effect lifecycle boundaries are `[]`; listeners/timers/focus are cleaned up by their owning effects.
 */
export default function SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient() {
  const confirm = useSuperadminSubscriptionsOverviewMemberAutoSuspendPolicyConfirm();
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const config: Config = SUPERADMIN_FINANCE_AUTO_SUSPEND_SAMPLE_CONFIG;
  const suspended: SuspendedStudent[] = SUPERADMIN_FINANCE_AUTO_SUSPEND_SAMPLE_STUDENTS;
  const [editing, setEditing] = useState(false);
  const [days, setDays] = useState('');
  const [restoreDialog, setRestoreDialog] = useState<{ id: number; name: string } | null>(null);
  const [restoreReason, setRestoreReason] = useState('');

  // Sample preview data is available immediately; no network delay is simulated without a verified read contract.

  const handleSave = () => {
    if (!days || !Number.isFinite(Number(days)) || !Number.isInteger(Number(days)) || Number(days) < 1 || Number(days) > 365) {
      toast.error(tCopy("COPY.ENTER_SUSPENSION_THRESHOLD_RANGE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient:error:1" });
      return;
    }
    toast.error(tCopy("COPY.AUTO_SUSPENSION_POLICY_UNAVAILABLE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient:error:2" });
  };

  const handleRestore = () => {
    if (!restoreDialog || !restoreReason.trim()) return;
    toast.error(tCopy("COPY.RESTORATION_UNAVAILABLE_FOR_NAME", { name: restoreDialog.name }), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient:error:3" });
  };

  const handleCancelEdit = async () => {
    const changed = Boolean(config) && days !== String(config.daysBeforeSuspend);
    if (changed && !await confirm(tCopy('COPY.UNSAVED_CHANGES_WARNING'))) return;
    if (config) setDays(String(config.daysBeforeSuspend));
    setEditing(false);
  };
  const closeRestoreDialog = async () => {
    if (restoreReason.trim() && !await confirm(tCopy('COPY.UNSAVED_CHANGES_WARNING'))) return;
    setRestoreDialog(null);
    setRestoreReason('');
  };



  const KPI_CARDS = [
    { label: tCopy('COPY.DAYS_BEFORE_SUSPEND'), value: config.daysBeforeSuspend, icon: Settings, variant: 'default' },
    { label: tCopy('COPY.CURRENTLY_SUSPENDED'), value: config.currentlySuspended, icon: Ban, variant: 'danger' },
    { label: tCopy('COPY.AUTO_RESTORED_MONTH'), value: config.autoRestoredThisMonth, icon: RotateCcw, variant: 'default' },
    { label: tCopy('COPY.MANUAL_RESTORES'), value: config.manualRestores, icon: UserCheck, variant: 'default' },
  ] as const;

  return (
    <div className="space-y-6">
      {(suspended?.length === 0) && <SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyEmptyState filtered />}

      <div>
        <h1 className="fin-page-title">{tCopy("COPY.AUTO_SUSPEND_POLICY")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.MANAGE_AUTOMATIC_SUSPENSION_AND_STUDENT_RESTORATION")}</p>
      </div>

      <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SUSPENSION_FIGURES_AND_ROWS_ARE_SAMPLE_RECORDS_POLICY_UPDATES_REST_62F2EDBE")}</p>
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
            {tCopy("COPY.POLICY_CONFIGURATION")}</div>
          {!editing && (
            <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => { if (config) setDays(String(config.daysBeforeSuspend)); setEditing(true); }} data-testid="superadmin-finance-finance-auto-suspend-edit-1">
              {tCopy("COPY.EDIT")}</button>
          )}
        </div>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="fin-label" htmlFor="superadmin-superadminfinanceautosuspendpageclient-96-input">{tCopy("COPY.DAYS_BEFORE_AUTO_SUSPEND")}</label>
              <input id="superadmin-superadminfinanceautosuspendpageclient-96-input" type="number" min={1} max={365} step={1} inputMode="numeric" aria-invalid={days !== '' && (!Number.isInteger(Number(days)) || Number(days) < 1 || Number(days) > 365)} className="fin-input" value={days} onChange={(e) => setDays(e.target.value)}  data-testid="superadmin-finance-finance-auto-suspend-superadmin-superadminfinanceautosuspendpageclient-96-input-2"/>
              <p className="fin-input-hint">{tCopy("COPY.STUDENTS_OVERDUE_BEYOND_THIS_PERIOD_ARE_AUTOMATICALLY_SUSPENDED")}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="fin-badge fin-badge--success cursor-not-allowed opacity-50" onClick={handleSave} disabled title={tCopy("COPY.AUTO_SUSPENSION_POLICY_UNAVAILABLE")} data-testid="superadmin-finance-finance-auto-suspend-saving-ellipsis-3">
                <Save size={11} /> {tCopy('COPY.SAVE_CONFIG')}
              </button>
              <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={handleCancelEdit} data-testid="superadmin-finance-finance-auto-suspend-cancel-4">{tCopy("COPY.CANCEL")}</button>
            </div>
          </div>
        ) : (
          <p className="fin-policy-text">
            {tCopy("COPY.STUDENTS_ARE_AUTOMATICALLY_SUSPENDED_AFTER")}<strong>{config.daysBeforeSuspend}</strong> {tCopy("COPY.DAYS_OF_NON_PAYMENT_PAST_DUE_DATE")}</p>
        )}
      </div>

      {/* Suspended Students Table */}
      <div className="fin-card overflow-x-auto">
        <div className="flex items-center gap-2 p-4 fin-border-bottom">
          <Ban size={18} className="fin-text-danger" />
          <span className="fin-text-body font-semibold">{tCopy("COPY.SUSPENDED_STUDENTS")}</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.STUDENT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SEAT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SHIFT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.LAST_PAYMENT_DATE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.DAYS_OVERDUE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SUSPENDED_SINCE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.ACTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {suspended.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">🔓</div>
                    <p className="fin-empty-state__title">{tCopy("COPY.NO_STUDENTS_CURRENTLY_SUSPENDED")}</p>
                  </div>
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
                    <span className="fin-badge fin-badge--neutral">{s.shift}</span>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">—</td>
                  <td className="py-3 px-4">
                    <span className="fin-text-danger font-semibold">{s.daysOverdue}{tCopy("COPY.D")}</span>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{s.suspendedSince}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button"
                        className="fin-badge fin-badge--neutral cursor-pointer"
                        onClick={() => toast.error(tCopy("COPY.WHATSAPP_REMINDER_UNAVAILABLE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient:error:4" })}
                       data-testid={`superadmin-finance-finance-auto-suspend-whatsapp-reminder-unavailable-5-${String(s.id)}`}>
                        <Bell size={11} /> {tCopy("COPY.SEND_REMINDER")}</button>
                      <button type="button"
                        className="fin-badge fin-badge--success cursor-pointer"
                        onClick={() => setRestoreDialog({ id: s.studentId, name: s.studentName })}
                       data-testid={`superadmin-finance-finance-auto-suspend-manual-restore-6-${String(s.id)}`}>
                        <RotateCcw size={11} /> {tCopy("COPY.MANUAL_RESTORE")}</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {restoreDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">{tCopy("COPY.RESTORE_STUDENT")}{restoreDialog.name}</h2>
            <button type="button" className="fin-dialog__close" aria-label={tCopy("COPY.CLOSE")} onClick={closeRestoreDialog} data-testid="superadmin-finance-finance-auto-suspend-close-7">✕</button>
            <p className="fin-dialog-helper">{tCopy("COPY.MANUALLY_RESTORE_ACCESS_FOR")}{restoreDialog.name}?</p>
            <div className="mt-2">
              <label className="fin-label" htmlFor="superadmin-superadminfinanceautosuspendpageclient-198-input">{tCopy("COPY.OVERRIDE_REASON")}<span className="fin-text-danger">*</span></label>
              <input id="superadmin-superadminfinanceautosuspendpageclient-198-input" className="fin-input mt-1" value={restoreReason} onChange={(e) => setRestoreReason(e.target.value)} placeholder={tCopy("COPY.ENTER_REASON")}  data-testid="superadmin-finance-finance-auto-suspend-superadmin-superadminfinanceautosuspendpageclient-198-input-8"/>
            </div>
            <div className="fin-dialog__footer">
              <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={closeRestoreDialog} data-testid="superadmin-finance-finance-auto-suspend-cancel-9">{tCopy("COPY.CANCEL")}</button>
              <button type="button"
                className="fin-badge fin-badge--success cursor-not-allowed opacity-50"
                onClick={handleRestore}
                disabled title={tCopy("COPY.RESTORATION_UNAVAILABLE_FOR_NAME", { name: restoreDialog.name })}
               data-testid="superadmin-finance-finance-auto-suspend-restoring-10">
                {tCopy('COPY.RESTORE')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
