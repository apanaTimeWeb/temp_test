'use client';

import { useState, useEffect } from 'react';
import { Percent, ShieldCheck, Sparkles, Lock, Armchair, Layers } from 'lucide-react';
import { toast } from 'sonner';
import {
  getLibraryPricingConfig,
  saveLibraryPricingConfig,
  type LibraryPricingConfig,
} from '@/lib/pricing/libraryPricingEngine';

export function AdminMembersPlansPricingRuleSettings() {
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
    saveLibraryPricingConfig(draftConfig);
    setConfig(draftConfig);
    setIsEditing(false);
    toast.success('Dynamic Shift Pricing & Tenure rules updated successfully.');
  };

  const handleCancel = () => {
    setDraftConfig(config);
    setIsEditing(false);
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-base font-bold text-text-primary">
              Shift Multiplier & Tenure Discount Engine
            </h2>
            <span className="rounded-full bg-primary-subtle px-2 py-0.5 text-badge font-semibold text-primary">
              Auto-Applied in New Admission
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Manager New Admission auto-calculates plan rates based on these shift rules, tenure tiers, and add-on surcharges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-sm"
              >
                Save Pricing Rules
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface-hover"
            >
              Configure Rates & Discounts
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {draftConfig.durationTiers.map((tier, idx) => (
          <div key={tier.id} className="rounded-lg border border-border bg-surface-highlight p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary">{tier.name}</span>
              <span className="text-xs font-semibold text-primary">
                {tier.months} {tier.months === 1 ? 'Month' : 'Months'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Percent size={12} /> Discount Rate
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
                    className="w-16 rounded border border-border bg-card px-1.5 py-0.5 text-right text-xs font-semibold text-text-primary"
                  />
                  <span className="text-xs text-text-secondary">%</span>
                </div>
              ) : (
                <span className="rounded bg-card px-2 py-0.5 text-xs font-bold text-success-text border border-border">
                  {tier.discountPercent > 0 ? `${tier.discountPercent}% Off` : 'Standard Rate'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-border pt-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-text-primary">Locker Monthly Fee</p>
              <p className="text-badge text-text-secondary">Added to monthly shift rate</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-text-secondary">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={draftConfig.lockerMonthlyFee}
                onChange={(e) => setDraftConfig({ ...draftConfig, lockerMonthlyFee: Number(e.target.value) || 0 })}
                className="w-20 rounded border border-border bg-surface px-2 py-1 text-right text-xs font-bold"
              />
            </div>
          ) : (
            <span className="text-xs font-bold text-text-primary">₹{config.lockerMonthlyFee} / mo</span>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Armchair size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-text-primary">Reserved Desk Surcharge</p>
              <p className="text-badge text-text-secondary">Floor 3 / Private Cabin</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-text-secondary">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={draftConfig.reservedSeatMonthlyFee}
                onChange={(e) => setDraftConfig({ ...draftConfig, reservedSeatMonthlyFee: Number(e.target.value) || 0 })}
                className="w-20 rounded border border-border bg-surface px-2 py-1 text-right text-xs font-bold"
              />
            </div>
          ) : (
            <span className="text-xs font-bold text-text-primary">₹{config.reservedSeatMonthlyFee} / mo</span>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-text-primary">Multi-Shift Combo Discount</p>
              <p className="text-badge text-text-secondary">When 2+ shifts selected</p>
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
                className="w-16 rounded border border-border bg-surface px-2 py-1 text-right text-xs font-bold"
              />
              <span className="text-xs text-text-secondary">%</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-success-text">{config.multiShiftDiscountPercent}% Combo Off</span>
          )}
        </div>
      </div>
    </div>
  );
}

