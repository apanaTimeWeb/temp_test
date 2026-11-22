import type { HTMLAttributes } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemBadgeProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';

const VARIANT_CLASS = { default: 'border-border bg-card text-primary', primary: 'border-primary bg-primary-subtle text-primary', success: 'border-success-text bg-success-bg text-success-text', warning: 'border-warning-text bg-warning-bg text-warning-text', danger: 'border-danger-text bg-danger-bg text-danger-text', info: 'border-info-text bg-info-bg text-info-text', outline: 'border-border bg-card text-primary' } as const;

export function AdminSystemBadge({ className, variant = 'default', ...props }: AdminSystemBadgeProps) {
  return <span className={joinAdminPrimitiveClasses('inline-flex min-h-6 items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium', VARIANT_CLASS[variant], className)} {...props} />;
}
export default AdminSystemBadge;


export type { AdminSystemBadgeProps };
