'use client';
import type { DialogTitleProps } from '@/app/frontend_admin/components/ui/dialog/types/AdminUiDialogComponentTypes';
import { useDialog } from '@/components/ui/dialog/Dialog';


export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  const { titleId } = useDialog();
  return <h2 id={titleId} className={`text-section-title font-semibold text-text-primary ${className}`}>{children}</h2>;
}
export default DialogTitle;


export type { DialogTitleProps };
