import type { HTMLAttributes, ReactNode } from 'react';
import { joinAdminPrimitiveClasses } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveClassNames';
import type { AdminSystemCardDescriptionProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


export function AdminSystemCardDescription({ children, className, ...props }: AdminSystemCardDescriptionProps) {
  return <p className={joinAdminPrimitiveClasses('text-ui text-text-secondary', className)} {...props}>{children}</p>;
}
export default AdminSystemCardDescription;


export type { AdminSystemCardDescriptionProps };
