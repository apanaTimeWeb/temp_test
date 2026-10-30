import type { HTMLAttributes, ReactNode } from 'react';
import type { AdminSystemCardContentProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


export function AdminSystemCardContent({ children, className, ...props }: AdminSystemCardContentProps) {
  return <div className={className} {...props}>{children}</div>;
}
export default AdminSystemCardContent;


export type { AdminSystemCardContentProps };
