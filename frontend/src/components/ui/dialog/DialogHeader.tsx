import type { ReactNode } from 'react';
import type { DialogHeaderProps } from '@/app/frontend_admin/components/ui/dialog/types/AdminUiDialogComponentTypes';
  export function DialogHeader({children,className=''}:DialogHeaderProps){return <div className={`space-y-1 ${className}`}>{children}</div>;} export default DialogHeader;


export type { DialogHeaderProps };
