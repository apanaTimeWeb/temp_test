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
    { label: tCopy('COPY.DAYS_BEFORE_SUSPEND'), value: config.daysBeforeSuspend, icon: Settings, theme: 'sky' as const, sub: 'Auto-Trigger' },
    { label: tCopy('COPY.CURRENTLY_SUSPENDED'), value: config.currentlySuspended, icon: Ban, theme: 'rose' as const, sub: 'Action Required' },
    { label: tCopy('COPY.AUTO_RESTORED_MONTH'), value: config.autoRestoredThisMonth, icon: RotateCcw, theme: 'emerald' as const, sub: 'Automated' },
    { label: tCopy('COPY.MANUAL_RESTORES'), value: config.manualRestores, icon: UserCheck, theme: 'indigo' as const, sub: 'Admin Overrides' },
  ] as const;

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {(suspended?.length === 0) && <SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyEmptyState filtered />}

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  {tCopy("COPY.AUTO_SUSPEND_POLICY")}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Policy Guard Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  <Settings size={12} className="text-indigo-400" />
                  Grace Period: {config.daysBeforeSuspend}d
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                {tCopy("COPY.MANAGE_AUTOMATIC_SUSPENSION_AND_STUDENT_RESTORATION")}
              </p>
              <p className="mt-2 text-xs text-slate-400" role="status">{tCopy("COPY.SUSPENSION_FIGURES_AND_ROWS_ARE_SAMPLE_RECORDS_POLICY_UPDATES_REST_62F2EDBE")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map(({ label, value, icon: Icon, theme, sub }) => {
          const isRose = theme === 'rose';
          const isEmerald = theme === 'emerald';
          const isSky = theme === 'sky';
          const borderClass = isRose
            ? 'border-rose-500/30 from-rose-950/40'
            : isEmerald
            ? 'border-emerald-500/30 from-emerald-950/40'
            : isSky
            ? 'border-sky-500/30 from-sky-950/40'
            : 'border-indigo-500/30 from-indigo-950/40';
          const iconBoxClass = isRose
            ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
            : isEmerald
            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
            : isSky
            ? 'border-sky-500/30 bg-sky-500/15 text-sky-400'
            : 'border-indigo-500/30 bg-indigo-500/15 text-indigo-400';
          const textClass = isRose ? 'text-rose-400' : isEmerald ? 'text-emerald-400' : isSky ? 'text-sky-400' : 'text-indigo-300';
          const barClass = isRose ? 'from-rose-500 to-pink-500' : isEmerald ? 'from-emerald-500 to-teal-400' : isSky ? 'from-sky-500 to-cyan-400' : 'from-indigo-500 to-indigo-400';

          return (
            <div key={label} className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br via-slate-900/90 to-slate-900/90 p-5 shadow-lg ${borderClass}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${textClass}`}>{label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${iconBoxClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
                {value}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${iconBoxClass}`}>
                  {sub}
                </span>
                <span className="text-[11px] text-slate-400">Live Status</span>
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full bg-gradient-to-r ${barClass}`} style={{ width: '65%' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Policy Config */}
      <div className="rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/95 p-6 shadow-md backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-500/15">
          <div className="flex items-center gap-2.5 font-semibold text-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
              <ShieldAlert size={16} />
            </div>
            <span>{tCopy("COPY.POLICY_CONFIGURATION")}</span>
          </div>
          {!editing && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
              onClick={() => { if (config) setDays(String(config.daysBeforeSuspend)); setEditing(true); }}
              data-testid="superadmin-finance-finance-auto-suspend-edit-1"
            >
              <Settings size={13} className="text-indigo-400" />
              <span>{tCopy("COPY.EDIT")}</span>
            </button>
          )}
        </div>
        {editing ? (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="superadmin-superadminfinanceautosuspendpageclient-96-input">
                {tCopy("COPY.DAYS_BEFORE_AUTO_SUSPEND")}
              </label>
              <input
                id="superadmin-superadminfinanceautosuspendpageclient-96-input"
                type="number"
                min={1}
                max={365}
                step={1}
                inputMode="numeric"
                aria-invalid={days !== '' && (!Number.isInteger(Number(days)) || Number(days) < 1 || Number(days) > 365)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                data-testid="superadmin-finance-finance-auto-suspend-superadmin-superadminfinanceautosuspendpageclient-96-input-2"
              />
              <p className="mt-1.5 text-xs text-slate-400">{tCopy("COPY.STUDENTS_OVERDUE_BEYOND_THIS_PERIOD_ARE_AUTOMATICALLY_SUSPENDED")}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all opacity-50 cursor-not-allowed"
                onClick={handleSave}
                disabled
                title={tCopy("COPY.AUTO_SUSPENSION_POLICY_UNAVAILABLE")}
                data-testid="superadmin-finance-finance-auto-suspend-saving-ellipsis-3"
              >
                <Save size={13} />
                <span>{tCopy('COPY.SAVE_CONFIG')}</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-card/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 transition-all cursor-pointer"
                onClick={handleCancelEdit}
                data-testid="superadmin-finance-finance-auto-suspend-cancel-4"
              >
                {tCopy("COPY.CANCEL")}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-300">
            {tCopy("COPY.STUDENTS_ARE_AUTOMATICALLY_SUSPENDED_AFTER")}{' '}
            <strong className="font-bold text-indigo-400">{config.daysBeforeSuspend}</strong>{' '}
            {tCopy("COPY.DAYS_OF_NON_PAYMENT_PAST_DUE_DATE")}
          </p>
        )}
      </div>

      {/* Suspended Students Table */}
      <div className="rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/95 shadow-md backdrop-blur-md overflow-hidden">
        <div className="flex items-center gap-2.5 p-4 border-b border-indigo-500/15 bg-slate-900/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
            <Ban size={15} />
          </div>
          <span className="font-semibold text-slate-100">{tCopy("COPY.SUSPENDED_STUDENTS")}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <tr>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.STUDENT")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.SEAT")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.SHIFT")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.LAST_PAYMENT_DATE")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.DAYS_OVERDUE")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.SUSPENDED_SINCE")}</th>
                <th className="text-right py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.ACTIONS")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10">
              {suspended.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyEmptyState filtered />
                  </td>
                </tr>
              ) : (
                suspended.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-indigo-500/[0.04]">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{s.studentName}</div>
                      <div className="text-xs font-mono text-indigo-400/80">{s.smartId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">{s.seat}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-xs font-medium text-slate-300">
                        {s.shift}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">—</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
                        {s.daysOverdue}{tCopy("COPY.D")} overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">{s.suspendedSince}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                          onClick={() => toast.error(tCopy("COPY.WHATSAPP_REMINDER_UNAVAILABLE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient:error:4" })}
                          data-testid={`superadmin-finance-finance-auto-suspend-whatsapp-reminder-unavailable-5-${String(s.id)}`}
                        >
                          <Bell size={12} className="text-amber-400" />
                          <span>{tCopy("COPY.SEND_REMINDER")}</span>
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                          onClick={() => setRestoreDialog({ id: s.studentId, name: s.studentName })}
                          data-testid={`superadmin-finance-finance-auto-suspend-manual-restore-6-${String(s.id)}`}
                        >
                          <RotateCcw size={12} className="text-emerald-400" />
                          <span>{tCopy("COPY.MANUAL_RESTORE")}</span>
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

      {restoreDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-emerald-400" />
                <span>{tCopy("COPY.RESTORE_STUDENT")} {restoreDialog.name}</span>
              </h2>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1"
                aria-label={tCopy("COPY.CLOSE")}
                onClick={closeRestoreDialog}
                data-testid="superadmin-finance-finance-auto-suspend-close-7"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">{tCopy("COPY.MANUALLY_RESTORE_ACCESS_FOR")}{restoreDialog.name}?</p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="superadmin-superadminfinanceautosuspendpageclient-198-input">
                {tCopy("COPY.OVERRIDE_REASON")}<span className="text-rose-400">*</span>
              </label>
              <input
                id="superadmin-superadminfinanceautosuspendpageclient-198-input"
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                value={restoreReason}
                onChange={(e) => setRestoreReason(e.target.value)}
                placeholder={tCopy("COPY.ENTER_REASON")}
                data-testid="superadmin-finance-finance-auto-suspend-superadmin-superadminfinanceautosuspendpageclient-198-input-8"
              />
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-indigo-500/20">
              <button
                type="button"
                className="inline-flex items-center rounded-xl border border-border/80 bg-card/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 cursor-pointer"
                onClick={closeRestoreDialog}
                data-testid="superadmin-finance-finance-auto-suspend-cancel-9"
              >
                {tCopy("COPY.CANCEL")}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/25 opacity-50 cursor-not-allowed"
                onClick={handleRestore}
                disabled
                title={tCopy("COPY.RESTORATION_UNAVAILABLE_FOR_NAME", { name: restoreDialog.name })}
                data-testid="superadmin-finance-finance-auto-suspend-restoring-10"
              >
                <RotateCcw size={12} />
                <span>{tCopy('COPY.RESTORE')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
