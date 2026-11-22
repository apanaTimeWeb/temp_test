import type { HTMLAttributes, ReactNode } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemCardProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


export function AdminSystemCard({ children, className, ...props }: AdminSystemCardProps) {
  return <div className={joinAdminPrimitiveClasses('admin-card p-6', className)} {...props}>{children}</div>;
}
export default AdminSystemCard;


export type { AdminSystemCardProps };
