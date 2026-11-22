'use client';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemButtonProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';

const ADMIN_BUTTON_VARIANTS = { primary: 'admin-btn-primary', ghost: 'admin-btn-outline', destructive: 'admin-btn-ghost-danger border border-danger', secondary: 'admin-btn-outline', link: 'admin-btn-link' } as const;
const ADMIN_BUTTON_SIZES = { sm: 'admin-btn-sm', md: '', lg: 'admin-btn-lg', icon: 'admin-btn-icon' } as const;

const AdminSystemButton = forwardRef<HTMLButtonElement, AdminSystemButtonProps>(({ className, variant = 'primary', size = 'md', ...props }, ref) => (
  <button ref={ref} className={joinAdminPrimitiveClasses(ADMIN_BUTTON_VARIANTS[variant], ADMIN_BUTTON_SIZES[size], className)} {...props} />
));
AdminSystemButton.displayName = 'AdminSystemButton';
export { AdminSystemButton, AdminSystemButton as Button };
export default AdminSystemButton;


export type { AdminSystemButtonProps };
