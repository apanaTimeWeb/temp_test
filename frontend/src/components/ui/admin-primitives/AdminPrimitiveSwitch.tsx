'use client';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemSwitchProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


export function AdminSystemSwitch({ checked, onCheckedChange, disabled, id, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, className }: AdminSystemSwitchProps) {
  return <SwitchPrimitive.Root id={id} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} className={joinAdminPrimitiveClasses('group relative inline-flex min-h-11 min-w-11 items-center justify-start rounded-full border border-border bg-surface-highlight p-1 motion-safe:transition-colors motion-safe:duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary', className)}>
    <SwitchPrimitive.Thumb className="pointer-events-none block size-5 rounded-full bg-card shadow-card motion-safe:transition-transform motion-safe:duration-base group-data-[state=checked]:translate-x-5" />
  </SwitchPrimitive.Root>;
}


export type { AdminSystemSwitchProps };
