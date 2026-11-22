'use client';

import {
getLibraryPricingConfig,
saveLibraryPricingConfig,
type LibraryPricingConfig,
} from '@/lib/pricing/libraryPricingEngine';
import { Armchair,Layers,Lock,Percent } from 'lucide-react';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';

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
    <div className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <Percent size={16} />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Shift Multiplier & Tenure Discount Engine
            </h2>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
              Auto-Applied in New Admission
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manager New Admission auto-calculates plan rates based on these shift rules, tenure tiers, and add-on surcharges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:from-indigo-600 hover:to-indigo-700 shadow-sm transition-all"
              >
                Save Pricing Rules
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all shadow-xs"
            >
              Configure Rates & Discounts
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {draftConfig.durationTiers.map((tier, idx) => (
          <div key={tier.id} className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700/80 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{tier.name}</span>
              <span className="text-xs font-semibold text-indigo-400 font-mono">
                {tier.months} {tier.months === 1 ? 'Month' : 'Months'}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Percent size={12} className="text-slate-500" /> Discount Rate
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
                    className="w-16 rounded-lg border border-slate-700 bg-slate-900 px-2 py-0.5 text-right text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
              ) : (
                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold border ${
                  tier.discountPercent > 0
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700/60 bg-slate-800/60 text-slate-300'
                }`}>
                  {tier.discountPercent > 0 ? `${tier.discountPercent}% Off` : 'Standard Rate'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
              <Lock size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Locker Monthly Fee</p>
              <p className="text-[11px] text-slate-400">Added to monthly shift rate</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={draftConfig.lockerMonthlyFee}
                onChange={(e) => setDraftConfig({ ...draftConfig, lockerMonthlyFee: Number(e.target.value) || 0 })}
                className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-right text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          ) : (
            <span className="text-xs font-bold text-white font-mono">₹{config.lockerMonthlyFee} / mo</span>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
              <Armchair size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Reserved Desk Surcharge</p>
              <p className="text-[11px] text-slate-400">Floor 3 / Private Cabin</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={draftConfig.reservedSeatMonthlyFee}
                onChange={(e) => setDraftConfig({ ...draftConfig, reservedSeatMonthlyFee: Number(e.target.value) || 0 })}
                className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-right text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          ) : (
            <span className="text-xs font-bold text-white font-mono">₹{config.reservedSeatMonthlyFee} / mo</span>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-800/90 bg-slate-950/50 p-3.5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <Layers size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Multi-Shift Combo Discount</p>
              <p className="text-[11px] text-slate-400">When 2+ shifts selected</p>
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
                className="w-16 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-right text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs text-slate-400">%</span>
            </div>
          ) : (
            <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
              {config.multiShiftDiscountPercent}% Combo Off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMembersPlansPricingRuleSettings;
