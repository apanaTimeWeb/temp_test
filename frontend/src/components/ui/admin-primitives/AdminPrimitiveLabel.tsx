'use client';
import { type LabelHTMLAttributes, forwardRef } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemLabelProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


const AdminSystemLabel = forwardRef<HTMLLabelElement, AdminSystemLabelProps>(({ className, ...props }, ref) => (
  <label ref={ref} className={joinAdminPrimitiveClasses('mb-1 block text-sm font-medium text-text-secondary', className)} {...props} />
));
AdminSystemLabel.displayName = 'AdminSystemLabel';
export { AdminSystemLabel, AdminSystemLabel as Label };
export default AdminSystemLabel;


export type { AdminSystemLabelProps };
