'use client';
/**
 * Responsibility: Render and edit Default Subscription, Trial & Grace Period Rules for Library Tenants.
 * Flow: FormProvider context -> SuperadminSettingsGeneralSubscriptionGraceCard -> subscriptionGrace state updates.
 */
import { useFormContext } from 'react-hook-form';
import { CreditCard, Clock, Bell, AlertOctagon, Sparkles, CheckCircle2 } from 'lucide-react';
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
      className="sa-card p-6 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-subtle text-primary">
            <CreditCard size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 id="heading-subscription-grace" className="text-base font-bold text-primary">
              Subscription Lifecycle & Grace Period Rules
            </h2>
            <p className="text-xs text-secondary">
              Govern tenant trial durations, overdue grace windows, and automated billing suspension hooks.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-hover text-secondary">
          Billing Automation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Default Free Trial Days */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-sub-trial-days" className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Sparkles size={14} aria-hidden="true" />
              Default Free Trial Duration
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
              {trialDays} Days
            </span>
          </div>
          <input
            id="settings-sub-trial-days"
            type="number"
            min={0}
            max={90}
            {...register('subscriptionGrace.defaultTrialDays', { valueAsNumber: true })}
            className="sa-input"
            data-testid="settings-sub-trial-days-input"
          />
          <span className="text-[11px] text-secondary">
            Complimentary access allocated to newly registered library branches upon onboarding.
          </span>
          {errors.subscriptionGrace?.defaultTrialDays && (
            <p className="text-xs text-danger" role="alert">
              Trial duration must be between 0 and 90 days.
            </p>
          )}
        </div>

        {/* Payment Grace Period */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-sub-grace-days" className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              Overdue Grace Period
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
              {graceDays} Days
            </span>
          </div>
          <input
            id="settings-sub-grace-days"
            type="number"
            min={0}
            max={60}
            {...register('subscriptionGrace.paymentGracePeriodDays', { valueAsNumber: true })}
            className="sa-input"
            data-testid="settings-sub-grace-days-input"
          />
          <span className="text-[11px] text-secondary">
            Days a tenant remains functional after invoice generation before automated suspension.
          </span>
          {errors.subscriptionGrace?.paymentGracePeriodDays && (
            <p className="text-xs text-danger" role="alert">
              Grace period must be between 0 and 60 days.
            </p>
          )}
        </div>

        {/* Expiry Reminder Days */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-sub-reminder-days" className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Bell size={14} aria-hidden="true" />
              Renewal Reminder Lead
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
              {reminderDays} Days
            </span>
          </div>
          <input
            id="settings-sub-reminder-days"
            type="number"
            min={1}
            max={30}
            {...register('subscriptionGrace.reminderTriggerDaysBefore', { valueAsNumber: true })}
            className="sa-input"
            data-testid="settings-sub-reminder-days-input"
          />
          <span className="text-[11px] text-secondary">
            Days prior to subscription end date when automated payment notices start dispatching.
          </span>
          {errors.subscriptionGrace?.reminderTriggerDaysBefore && (
            <p className="text-xs text-danger" role="alert">
              Lead time must be between 1 and 30 days.
            </p>
          )}
        </div>
      </div>

      {/* Enforcement & Automation Policies */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border">
        {/* Auto-Suspend Overdue */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-subtle">
          <div className="flex items-start gap-3">
            <AlertOctagon className="text-danger mt-0.5" size={18} aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-primary block">
                Automatic Tenant Suspension After Grace Expiration
              </span>
              <span className="text-xs text-secondary">
                Automatically transition tenant organization into SUSPENDED state when invoice remains unpaid past grace days.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            id="settings-sub-auto-suspend"
            {...register('subscriptionGrace.autoSuspendOverdue')}
            className="h-4 w-4 rounded accent-primary cursor-pointer"
            data-testid="settings-sub-auto-suspend-input"
          />
        </div>

        {/* Read-Only During Grace */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-subtle">
          <div className="flex items-start gap-3">
            <Clock className="text-primary mt-0.5" size={18} aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-primary block">
                Restrict to Read-Only Mode During Grace Period
              </span>
              <span className="text-xs text-secondary">
                Permit branch admins to view student records and collect fees, but block new branch provisioning and bulk imports.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            id="settings-sub-readonly-grace"
            {...register('subscriptionGrace.readOnlyDuringGrace')}
            className="h-4 w-4 rounded accent-primary cursor-pointer"
            data-testid="settings-sub-readonly-grace-input"
          />
        </div>

        {/* Prorate Plan Upgrades */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-subtle">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-primary mt-0.5" size={18} aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-primary block">
                Prorate Subscription Upgrades & Add-ons
              </span>
              <span className="text-xs text-secondary">
                Credit unused days on the current tier when calculating the initial invoice for higher plan tiers.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            id="settings-sub-prorate-upgrades"
            {...register('subscriptionGrace.proratePlanUpgrades')}
            className="h-4 w-4 rounded accent-primary cursor-pointer"
            data-testid="settings-sub-prorate-upgrades-input"
          />
        </div>
      </div>
    </section>
  );
}
