import type { ReactNode } from 'react';
import type { DialogFooterProps } from '@/app/frontend_admin/components/ui/dialog/types/AdminUiDialogComponentTypes';
  export function DialogFooter({children,className=''}:DialogFooterProps){return <div className={`mt-5 flex justify-end gap-2 ${className}`}>{children}</div>;} export default DialogFooter;


export type { DialogFooterProps };
