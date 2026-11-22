import type { HTMLAttributes, ReactNode } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemCardFooterProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


export function AdminSystemCardFooter({ children, className, ...props }: AdminSystemCardFooterProps) {
  return <div className={joinAdminPrimitiveClasses('mt-5 flex items-center gap-3', className)} {...props}>{children}</div>;
}
export default AdminSystemCardFooter;


export type { AdminSystemCardFooterProps };
