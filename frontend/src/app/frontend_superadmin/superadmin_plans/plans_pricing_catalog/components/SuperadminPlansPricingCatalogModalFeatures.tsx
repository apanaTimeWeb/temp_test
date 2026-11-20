'use client';

import type { UseFormRegister } from 'react-hook-form';
import type { SuperadminSubscriptionPlanFormValues } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes';

interface SuperadminPlansPricingCatalogModalFeaturesProps {
  register: UseFormRegister<SuperadminSubscriptionPlanFormValues>;
}

export default function SuperadminPlansPricingCatalogModalFeatures({
  register,
}: SuperadminPlansPricingCatalogModalFeaturesProps) {
  return (
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
  );
}
