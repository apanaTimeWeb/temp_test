'use client';
import type { DialogDescriptionProps } from '@/app/frontend_admin/components/ui/dialog/types/AdminUiDialogComponentTypes';
import { useDialog } from '@/components/ui/dialog/Dialog';


export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  const { descriptionId } = useDialog();
  return <p id={descriptionId} className={`text-caption text-text-secondary ${className}`}>{children}</p>;
}
export default DialogDescription;


export type { DialogDescriptionProps };
