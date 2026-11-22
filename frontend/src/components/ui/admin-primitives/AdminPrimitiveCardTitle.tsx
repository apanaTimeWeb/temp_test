import type { HTMLAttributes, ReactNode } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemCardTitleProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


export function AdminSystemCardTitle({ children, className, ...props }: AdminSystemCardTitleProps) {
  return <h3 className={joinAdminPrimitiveClasses('admin-section-title', className)} {...props}>{children}</h3>;
}
export default AdminSystemCardTitle;


export type { AdminSystemCardTitleProps };
