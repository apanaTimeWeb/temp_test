'use client';
import type { ReactNode } from 'react';
import { useDialog } from '@/components/ui/dialog/Dialog';
import type { DialogDescriptionProps } from '@/app/frontend_admin/components/ui/dialog/types/AdminUiDialogComponentTypes';


export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  const { descriptionId } = useDialog();
  return <p id={descriptionId} className={`text-caption text-text-secondary ${className}`}>{children}</p>;
}
export default DialogDescription;


export type { DialogDescriptionProps };
