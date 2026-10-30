// Responsibility: AdminSystemProgress component owned by admin_system; responsibility folder: admin_system_progress.
'use client';

// RESPONSIBILITY: Renders the AdminSystemProgress component for the admin_system module.
// DATA FLOW: Parent -> AdminSystemProgress -> DOM

import { cn } from '@/app/frontend_admin/admin_system/system_power_saving/utils/AdminSystemPowerSavingUtils';
import type { AdminSystemProgressProps } from '@/app/frontend_admin/admin_system/system_power_saving/types/AdminSystemPowerSavingComponentTypes';


export function AdminSystemProgress({ value, max = 100, className, barClassName, label = 'Progress' }: AdminSystemProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0;
  const pct = Math.min(100, Math.max(0, (safeValue / safeMax) * 100));
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-highlight', className)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue}>
      <div
        className={cn('h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-base', barClassName, `admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(pct)))}`)}
      />
    </div>
  );
}
