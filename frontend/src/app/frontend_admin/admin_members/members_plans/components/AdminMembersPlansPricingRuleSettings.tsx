'use client';

import {
  formatAdminMembersPlansInr,
  getAdminMembersPlansCurrencySymbol,
} from '@/app/frontend_admin/admin_members/members_plans/utils/formatAdminMembersPlansInr';
import {
  getLibraryPricingConfig,
  saveLibraryPricingConfig,
  type LibraryPricingConfig,
} from '@/lib/pricing/libraryPricingEngine';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Armchair, Layers, Lock, Percent } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function AdminMembersPlansPricingRuleSettings() {
  const t = useTranslations('ADMIN_PLANS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const currencySymbol = getAdminMembersPlansCurrencySymbol(locale);
  const [config, setConfig] = useState<LibraryPricingConfig>(() => getLibraryPricingConfig());
  const [isEditing, setIsEditing] = useState(false);
  const [draftConfig, setDraftConfig] = useState<LibraryPricingConfig>(config);

  useEffect(() => {
    const handleUpdate = () => {
      const current = getLibraryPricingConfig();
      setConfig(current);
      setDraftConfig(current);
    };
    window.addEventListener('library_pricing_updated', handleUpdate);
    return () => window.removeEventListener('library_pricing_updated', handleUpdate);
  }, []);

  const handleSave = () => {
    if (!isDemoMode) {
      toast.info(t('PERSISTENCE_BLOCKED'), { id: 'admin-plans-pricing-rules-blocked' });
      setIsEditing(false);
      return;
    }
    saveLibraryPricingConfig(draftConfig);
    setConfig(draftConfig);
    setIsEditing(false);
    toast.success('Dynamic Shift Pricing & Tenure rules updated successfully.', { id: 'admin-plans-pricing-rules-updated' });
  };

  const handleCancel = () => {
    setDraftConfig(config);
    setIsEditing(false);
  };

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-subtle text-primary">
              <Percent size={16} aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Shift Multiplier & Tenure Discount Engine
            </h2>
            <span className="rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              Auto-Applied in New Admission
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Manager New Admission auto-calculates plan rates based on these shift rules, tenure tiers, and add-on surcharges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary-hover shadow-card motion-safe:transition-colors"
              >
                Save Pricing Rules
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!isDemoMode}
              title={!isDemoMode ? t('PERSISTENCE_BLOCKED') : undefined}
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-border-focus bg-primary-subtle px-3.5 py-1.5 text-xs font-semibold text-primary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 motion-safe:transition-opacity shadow-card"
            >
              Configure Rates & Discounts
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {draftConfig.durationTiers.map((tier, idx) => (
          <div key={tier.id} className="rounded-xl border border-border bg-surface-highlight p-3.5 hover:border-border-focus motion-safe:transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary">{tier.name}</span>
              <span className="text-xs font-semibold text-primary font-mono">
                {tier.months} {tier.months === 1 ? 'Month' : 'Months'}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Percent size={12} className="text-text-secondary" aria-hidden="true" /> Discount Rate
              </span>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={tier.discountPercent}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const nextTiers = [...draftConfig.durationTiers];
                      const targetTier = nextTiers[idx];
                      if (targetTier) {
                        nextTiers[idx] = { ...targetTier, discountPercent: val };
                        setDraftConfig({ ...draftConfig, durationTiers: nextTiers });
                      }
                    }}
                    className="w-16 rounded-lg border border-border bg-input px-2 py-0.5 text-right text-xs font-bold text-text-primary focus:outline-none focus:border-border-focus"
                  />
                  <span className="text-xs text-text-secondary">%</span>
                </div>
              ) : (
                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-bold border ${
                    tier.discountPercent > 0
                      ? 'border-success bg-success-bg text-success-text'
                      : 'border-border bg-card text-text-secondary'
                  }`}
                >
                  {tier.discountPercent > 0 ? `${tier.discountPercent}% Off` : 'Standard Rate'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-border pt-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-highlight p-3.5 hover:border-border-focus motion-safe:transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-bg text-info-text border border-info">
              <Lock size={16} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">Locker Monthly Fee</p>
              <p className="text-[11px] text-text-secondary">Added to monthly shift rate</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-text-secondary">{currencySymbol}</span>
              <input
                type="number"
                min="0"
                step="50"
                value={draftConfig.lockerMonthlyFee}
                onChange={(e) => setDraftConfig({ ...draftConfig, lockerMonthlyFee: Number(e.target.value) || 0 })}
                className="w-20 rounded-lg border border-border bg-input px-2 py-1 text-right text-xs font-bold text-text-primary focus:outline-none focus:border-border-focus"
              />
            </div>
          ) : (
            <span className="text-xs font-bold text-text-primary font-mono">{t('PRICING_PER_MO', { amount: formatAdminMembersPlansInr(config.lockerMonthlyFee, locale) })}</span>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-highlight p-3.5 hover:border-border-focus motion-safe:transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-bg text-purple border border-border">
              <Armchair size={16} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">{t('PRICING_RESERVED_DESK')}</p>
              <p className="text-[11px] text-text-secondary">{t('PRICING_RESERVED_SUB')}</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-text-secondary">{currencySymbol}</span>
              <input
                type="number"
                min="0"
                step="50"
                value={draftConfig.reservedSeatMonthlyFee}
                onChange={(e) => setDraftConfig({ ...draftConfig, reservedSeatMonthlyFee: Number(e.target.value) || 0 })}
                className="w-20 rounded-lg border border-border bg-input px-2 py-1 text-right text-xs font-bold text-text-primary focus:outline-none focus:border-border-focus"
              />
            </div>
          ) : (
            <span className="text-xs font-bold text-text-primary font-mono">{t('PRICING_PER_MO', { amount: formatAdminMembersPlansInr(config.reservedSeatMonthlyFee, locale) })}</span>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-highlight p-3.5 hover:border-border-focus motion-safe:transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary border border-border-focus">
              <Layers size={16} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">Multi-Shift Combo Discount</p>
              <p className="text-[11px] text-text-secondary">When 2+ shifts selected</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="50"
                value={draftConfig.multiShiftDiscountPercent}
                onChange={(e) => setDraftConfig({ ...draftConfig, multiShiftDiscountPercent: Number(e.target.value) || 0 })}
                className="w-16 rounded-lg border border-border bg-input px-2 py-1 text-right text-xs font-bold text-text-primary focus:outline-none focus:border-border-focus"
              />
              <span className="text-xs text-text-secondary">%</span>
            </div>
          ) : (
            <span className="rounded-lg border border-success bg-success-bg px-2.5 py-1 text-xs font-bold text-success-text">
              {config.multiShiftDiscountPercent}% Combo Off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMembersPlansPricingRuleSettings;
