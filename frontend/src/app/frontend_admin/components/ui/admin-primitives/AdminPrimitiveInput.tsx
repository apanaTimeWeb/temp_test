'use client';
import { type InputHTMLAttributes, forwardRef } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemInputProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


const AdminSystemInput = forwardRef<HTMLInputElement, AdminSystemInputProps>(({ className, type, ...props }, ref) => (
  <input type={type} ref={ref} className={joinAdminPrimitiveClasses('min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60', className)} {...props} />
));
AdminSystemInput.displayName = 'AdminSystemInput';
export { AdminSystemInput, AdminSystemInput as Input };
export default AdminSystemInput;


export type { AdminSystemInputProps };
