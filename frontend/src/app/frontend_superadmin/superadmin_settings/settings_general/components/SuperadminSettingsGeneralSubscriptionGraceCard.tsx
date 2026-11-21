'use client';
/**
 * Responsibility: Render and edit Default Subscription, Trial & Grace Period Rules for Library Tenants.
 * Flow: FormProvider context -> SuperadminSettingsGeneralSubscriptionGraceCard -> subscriptionGrace state updates.
 */
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import { CreditCard, Clock, Bell, AlertOctagon, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';

export function SuperadminSettingsGeneralSubscriptionGraceCard() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SuperadminSettingsFormValues>();

  const trialDays = watch('subscriptionGrace.defaultTrialDays') ?? 14;
  const graceDays = watch('subscriptionGrace.paymentGracePeriodDays') ?? 7;
  const reminderDays = watch('subscriptionGrace.reminderTriggerDaysBefore') ?? 3;

  return (
    <section
      id="section-subscription_grace"
      aria-labelledby="heading-subscription-grace"
      className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-6 space-y-6 hover:border-indigo-500/35 transition-all"
    >
      <div className="flex items-center justify-between border-b border-indigo-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <CreditCard size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="heading-subscription-grace" className="text-base font-bold text-slate-100">
              7. Subscription Lifecycle & Grace Period Rules
            </h2>
            <p className="text-xs text-slate-400">
              Govern tenant trial durations, overdue grace windows, and automated billing suspension hooks.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/superadmin/superadmin_plans/plans_pricing_catalog"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all shadow-xs cursor-pointer no-underline"
          >
            <span>Open Plans Module 05</span>
            <ExternalLink size={12} />
          </Link>
          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300">
            Billing Automation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Default Free Trial Days */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-sub-trial-days" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" aria-hidden="true" />
              Default Free Trial Duration
            </label>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
              {trialDays} Days
            </span>
          </div>
          <input
            id="settings-sub-trial-days"
            type="number"
            min={0}
            max={90}
            {...register('subscriptionGrace.defaultTrialDays', { valueAsNumber: true })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-sub-trial-days-input"
          />
          <span className="text-[11px] text-slate-400">
            Complimentary access allocated to newly registered library branches upon onboarding.
          </span>
          {errors.subscriptionGrace?.defaultTrialDays && (
            <p className="text-xs text-rose-400" role="alert">
              Trial duration must be between 0 and 90 days.
            </p>
          )}
        </div>

        {/* Payment Grace Period */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-sub-grace-days" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock size={13} className="text-amber-400" aria-hidden="true" />
              Overdue Grace Period
            </label>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
              {graceDays} Days
            </span>
          </div>
          <input
            id="settings-sub-grace-days"
            type="number"
            min={0}
            max={60}
            {...register('subscriptionGrace.paymentGracePeriodDays', { valueAsNumber: true })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-sub-grace-days-input"
          />
          <span className="text-[11px] text-slate-400">
            Days a tenant remains functional after invoice generation before automated suspension.
          </span>
          {errors.subscriptionGrace?.paymentGracePeriodDays && (
            <p className="text-xs text-rose-400" role="alert">
              Grace period must be between 0 and 60 days.
            </p>
          )}
        </div>

        {/* Expiry Reminder Days */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-sub-reminder-days" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Bell size={13} className="text-amber-400" aria-hidden="true" />
              Renewal Reminder Lead
            </label>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
              {reminderDays} Days
            </span>
          </div>
          <input
            id="settings-sub-reminder-days"
            type="number"
            min={1}
            max={30}
            {...register('subscriptionGrace.reminderTriggerDaysBefore', { valueAsNumber: true })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-sub-reminder-days-input"
          />
          <span className="text-[11px] text-slate-400">
            Days prior to subscription end date when automated payment notices start dispatching.
          </span>
          {errors.subscriptionGrace?.reminderTriggerDaysBefore && (
            <p className="text-xs text-rose-400" role="alert">
              Lead time must be between 1 and 30 days.
            </p>
          )}
        </div>
      </div>

      {/* Enforcement & Automation Policies */}
      <div className="flex flex-col gap-3 pt-3 border-t border-indigo-500/15">
        {/* Auto-Suspend Overdue */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-slate-950/60">
          <div className="flex items-start gap-3">
            <AlertOctagon className="text-rose-400 mt-0.5" size={18} aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                Automatic Tenant Suspension After Grace Expiration
              </span>
              <span className="text-xs text-slate-400">
                Automatically transition tenant organization into SUSPENDED state when invoice remains unpaid past grace days.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            id="settings-sub-auto-suspend"
            {...register('subscriptionGrace.autoSuspendOverdue')}
            className="h-4 w-4 rounded-md border-indigo-500/40 bg-slate-950 text-amber-400 accent-amber-500 cursor-pointer"
            data-testid="settings-sub-auto-suspend-input"
          />
        </div>

        {/* Read-Only During Grace */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-slate-950/60">
          <div className="flex items-start gap-3">
            <Clock className="text-indigo-400 mt-0.5" size={18} aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                Restrict to Read-Only Mode During Grace Period
              </span>
              <span className="text-xs text-slate-400">
                Permit branch admins to view student records and collect fees, but block new branch provisioning and bulk imports.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            id="settings-sub-readonly-grace"
            {...register('subscriptionGrace.readOnlyDuringGrace')}
            className="h-4 w-4 rounded-md border-indigo-500/40 bg-slate-950 text-amber-400 accent-amber-500 cursor-pointer"
            data-testid="settings-sub-readonly-grace-input"
          />
        </div>

        {/* Prorate Plan Upgrades */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-slate-950/60">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-emerald-400 mt-0.5" size={18} aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                Prorate Subscription Upgrades & Add-ons
              </span>
              <span className="text-xs text-slate-400">
                Credit unused days on the current tier when calculating the initial invoice for higher plan tiers.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            id="settings-sub-prorate-upgrades"
            {...register('subscriptionGrace.proratePlanUpgrades')}
            className="h-4 w-4 rounded-md border-indigo-500/40 bg-slate-950 text-amber-400 accent-amber-500 cursor-pointer"
            data-testid="settings-sub-prorate-upgrades-input"
          />
        </div>
      </div>
    </section>
  );
}
