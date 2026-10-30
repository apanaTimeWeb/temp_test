import type { HTMLAttributes, ReactNode } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemCardHeaderProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


export function AdminSystemCardHeader({ children, className, ...props }: AdminSystemCardHeaderProps) {
  return <div className={joinAdminPrimitiveClasses('mb-5 flex flex-col gap-1', className)} {...props}>{children}</div>;
}
export default AdminSystemCardHeader;


export type { AdminSystemCardHeaderProps };
