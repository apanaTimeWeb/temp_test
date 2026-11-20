'use client';

import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, X, Sparkles, Building2, Users, Database, Shield, MessageSquare, Check } from 'lucide-react';
import { SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/schemas/SuperadminPlansPricingCatalogPlanSchema';
import type { SuperadminSubscriptionPlan, SuperadminSubscriptionPlanFormValues } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes';

interface SuperadminPlansPricingCatalogModalProps {
  isOpen: boolean;
  editPlan: SuperadminSubscriptionPlan | null;
  onClose: () => void;
  onSave: (values: SuperadminSubscriptionPlanFormValues) => void;
  translateValidationMessage: (msg?: string) => string;
  t: (key: string) => string;
}

export default function SuperadminPlansPricingCatalogModal({
  isOpen,
  editPlan,
  onClose,
  onSave,
  translateValidationMessage,
  t,
}: SuperadminPlansPricingCatalogModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<SuperadminSubscriptionPlanFormValues>({
    resolver: zodResolver(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA),
    defaultValues: {
      name: '',
      price: 0,
      priceHalfYearly: undefined,
      priceAnnual: undefined,
      branches: 1,
      members: 250,
      storage: '5 GB',
      adminUsers: 1,
      staffUsers: 3,
      smsCredits: 500,
      whatsappCredits: 200,
      apiAccess: false,
      exportAccess: true,
      advancedReports: false,
      backupPolicy: 'Daily',
      supportLevel: 'Standard',
      freeTrial: true,
      trialDays: 14,
      tierType: 'Starter',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editPlan) {
        reset({
          name: editPlan.name,
          price: editPlan.price,
          priceHalfYearly: editPlan.priceHalfYearly ?? Math.round(editPlan.price * 6 * 0.9),
          priceAnnual: editPlan.priceAnnual ?? Math.round(editPlan.price * 10),
          branches: editPlan.branches,
          members: editPlan.members,
          storage: editPlan.storage ?? '5 GB',
          adminUsers: editPlan.adminUsers ?? 1,
          staffUsers: editPlan.staffUsers ?? 3,
          smsCredits: editPlan.smsCredits ?? 500,
          whatsappCredits: editPlan.whatsappCredits ?? 200,
          apiAccess: editPlan.apiAccess ?? false,
          exportAccess: editPlan.exportAccess ?? true,
          advancedReports: editPlan.advancedReports ?? false,
          backupPolicy: editPlan.backupPolicy ?? 'Daily',
          supportLevel: editPlan.supportLevel ?? 'Standard',
          freeTrial: editPlan.freeTrial ?? true,
          trialDays: editPlan.trialDays ?? 14,
          tierType: editPlan.tierType ?? 'Starter',
        });
      } else {
        reset({
          name: '',
          price: 999,
          priceHalfYearly: 5394,
          priceAnnual: 9990,
          branches: 1,
          members: 250,
          storage: '5 GB',
          adminUsers: 1,
          staffUsers: 3,
          smsCredits: 500,
          whatsappCredits: 200,
          apiAccess: false,
          exportAccess: true,
          advancedReports: false,
          backupPolicy: 'Daily',
          supportLevel: 'Standard',
          freeTrial: true,
          trialDays: 14,
          tierType: 'Starter',
        });
      }
    }
  }, [isOpen, editPlan, reset]);

  const applyPreset = (preset: 'starter' | 'pro' | 'enterprise') => {
    if (preset === 'starter') {
      setValue('name', 'Starter Tier');
      setValue('price', 999);
      setValue('priceHalfYearly', 5394);
      setValue('priceAnnual', 9990);
      setValue('branches', 1);
      setValue('members', 250);
      setValue('storage', '5 GB');
      setValue('adminUsers', 1);
      setValue('staffUsers', 3);
      setValue('smsCredits', 500);
      setValue('whatsappCredits', 200);
      setValue('apiAccess', false);
      setValue('advancedReports', false);
      setValue('supportLevel', 'Standard');
      setValue('tierType', 'Starter');
    } else if (preset === 'pro') {
      setValue('name', 'Professional Tier');
      setValue('price', 2999);
      setValue('priceHalfYearly', 16194);
      setValue('priceAnnual', 29990);
      setValue('branches', 3);
      setValue('members', 1500);
      setValue('storage', '35 GB');
      setValue('adminUsers', 5);
      setValue('staffUsers', 15);
      setValue('smsCredits', 3500);
      setValue('whatsappCredits', 1500);
      setValue('apiAccess', true);
      setValue('advancedReports', true);
      setValue('supportLevel', 'Priority');
      setValue('tierType', 'Professional');
    } else {
      setValue('name', 'Enterprise Cloud');
      setValue('price', 4999);
      setValue('priceHalfYearly', 26994);
      setValue('priceAnnual', 49990);
      setValue('branches', 10);
      setValue('members', 5000);
      setValue('storage', '100 GB');
      setValue('adminUsers', 20);
      setValue('staffUsers', 50);
      setValue('smsCredits', 10000);
      setValue('whatsappCredits', 5000);
      setValue('apiAccess', true);
      setValue('advancedReports', true);
      setValue('supportLevel', 'Dedicated 24/7');
      setValue('tierType', 'Enterprise');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-5 sm:p-6 shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-plan-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-indigo-400" />
            <h2 id="subscription-plan-modal-title" className="text-base sm:text-lg font-bold text-slate-100">
              {editPlan ? t('COPY.EDIT_PRICING_PLAN_PREVIEW') : t('COPY.CREATE_PRICING_PLAN_PREVIEW')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('COPY.CLOSE_PRICING_PLAN_DIALOG')}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
            data-testid="superadmin-subscriptions-subscriptions-overview-close-pricing-plan-dialog-5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Tier Presets */}
        <div className="flex items-center gap-2 pb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
          <button type="button" onClick={() => applyPreset('starter')} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30">
            Starter (1 Branch)
          </button>
          <button type="button" onClick={() => applyPreset('pro')} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30">
            Pro (3 Branches)
          </button>
          <button type="button" onClick={() => applyPreset('enterprise')} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30">
            Enterprise (10+ Branches)
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-4">
          {/* Plan Name & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="subscription-plan-name">
                {t('COPY.PLAN_NAME')}
              </label>
              <input
                id="subscription-plan-name"
                type="text"
                maxLength={60}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500"
                {...register('name')}
                data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-name-6"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-400">{translateValidationMessage(errors.name.message)}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="subscription-plan-price">
                {t('COPY.PRICE_MO')} (₹)
              </label>
              <input
                id="subscription-plan-price"
                type="number"
                min={0.01}
                step="0.01"
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
                {...register('price', { valueAsNumber: true })}
                data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-price-7"
              />
              {errors.price && <p className="mt-1 text-xs text-rose-400">{translateValidationMessage(errors.price.message)}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="subscription-plan-price-half">
                {t('COPY.PRICE_HALF_YEARLY')} (₹)
              </label>
              <input
                id="subscription-plan-price-half"
                type="number"
                step="0.01"
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
                {...register('priceHalfYearly', { valueAsNumber: true })}
                data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-price-half-10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1" htmlFor="subscription-plan-price-annual">
                {t('COPY.PRICE_ANNUAL')} (₹)
              </label>
              <input
                id="subscription-plan-price-annual"
                type="number"
                step="0.01"
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
                {...register('priceAnnual', { valueAsNumber: true })}
                data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-price-annual-11"
              />
            </div>
          </div>

          {/* Branch, User & Member Limits */}
          <div className="pt-2 border-t border-indigo-500/15">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2.5">Capacity & Entitlements</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1" htmlFor="subscription-plan-branches">
                  {t('COPY.MAX_BRANCHES')}
                </label>
                <input
                  id="subscription-plan-branches"
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
                  {...register('branches', { valueAsNumber: true })}
                  data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-branches-8"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Max Admins</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
                  {...register('adminUsers', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Max Staff</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
                  {...register('staffUsers', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1" htmlFor="subscription-plan-members">
                  {t('COPY.MAX_MEMBERS')}
                </label>
                <input
                  id="subscription-plan-members"
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
                  {...register('members', { valueAsNumber: true })}
                  data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-members-9"
                />
              </div>
            </div>
          </div>

          {/* Storage & Messaging */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Storage Limit</label>
              <input
                type="text"
                placeholder="e.g. 25 GB"
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
                {...register('storage')}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">SMS Credits / mo</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
                {...register('smsCredits', { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">WhatsApp Credits / mo</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
                {...register('whatsappCredits', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Policies & Features */}
          <div className="pt-2 border-t border-indigo-500/15">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2.5">Policies & Advanced Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Backup Policy</label>
                <select className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500" {...register('backupPolicy')}>
                  <option value="Daily">Daily Automated Backup</option>
                  <option value="Weekly">Weekly Backup</option>
                  <option value="Realtime">Real-time Continuous Replication</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Support Level</label>
                <select className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500" {...register('supportLevel')}>
                  <option value="Standard">Standard (Email 24-48h)</option>
                  <option value="Priority">Priority (Chat + 12h SLA)</option>
                  <option value="Dedicated 24/7">Dedicated 24/7 Account Manager</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-border/40 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-600" {...register('apiAccess')} />
                <span className="text-slate-200">API Access</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-border/40 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-600" {...register('exportAccess')} />
                <span className="text-slate-200">Data Export</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-border/40 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-600" {...register('advancedReports')} />
                <span className="text-slate-200">Adv Reports</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-border/40 cursor-pointer">
                <input type="checkbox" className="rounded text-indigo-600" {...register('freeTrial')} />
                <span className="text-slate-200">Free Trial</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-500/20">
            <button
              type="button"
              className="rounded-xl border border-border/80 bg-card/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 cursor-pointer transition-all"
              onClick={onClose}
              data-testid="superadmin-subscriptions-subscriptions-overview-cancel-11"
            >
              {t('COPY.CANCEL')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              data-testid="superadmin-subscriptions-subscriptions-overview-updating-preview-12"
            >
              <span>{isSubmitting ? t('COPY.UPDATING_PREVIEW') : editPlan ? t('COPY.UPDATE_PREVIEW') : t('COPY.CREATE_PREVIEW_PLAN')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
