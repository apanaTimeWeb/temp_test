'use client';

import type { AdminPlansFormValues } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import { Layers, Percent } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';

interface AdminMembersPlansShiftRateSectionProps {
  register: UseFormRegister<AdminPlansFormValues>;
}

const SHIFT_RATE_FIELDS: Array<{ name: keyof AdminPlansFormValues; label: string; placeholder: string }> = [
  { name: 'morningRate', label: 'Morning (6A-12P)', placeholder: '₹800' },
  { name: 'afternoonRate', label: 'Afternoon (12P-5P)', placeholder: '₹700' },
  { name: 'eveningRate', label: 'Evening (5P-10P)', placeholder: '₹900' },
  { name: 'nightRate', label: 'Night (10P-6A)', placeholder: '₹1000' },
  { name: 'fullDayRate', label: 'Full Day (24/7)', placeholder: '₹2000' },
];

export function AdminMembersPlansShiftRateSection({ register }: AdminMembersPlansShiftRateSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-highlight p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
          <Layers size={14} className="text-info-text" aria-hidden="true" />
          Shift-Specific Pricing Engine
        </span>
        <span className="text-[11px] text-text-secondary">Used by Manager Admission workflow</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
        {SHIFT_RATE_FIELDS.map((field) => (
          <div key={field.name}>
            <label className="text-[10px] text-text-secondary block mb-1">{field.label}</label>
            <input
              maxLength={100}
              type="number"
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-border bg-input px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none"
              min="0"
              {...register(field.name)}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs border-t border-border pt-2.5">
        <Percent size={13} className="text-warning-text" aria-hidden="true" />
        <span className="text-text-secondary">Multi-Shift Discount (% off for 2+ shifts):</span>
        <input
          maxLength={100}
          type="number"
          max="50"
          min="0"
          placeholder="10"
          className="w-20 rounded-lg border border-border bg-input px-2 py-1 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none"
          {...register('multiShiftDiscount')}
        />
      </div>
    </div>
  );
}
