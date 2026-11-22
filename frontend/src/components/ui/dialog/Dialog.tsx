'use client';

import { createContext, useCallback, useContext, useId, useState, type ReactNode } from 'react';
import type { DialogProps, DialogContextValue } from '@/app/frontend_admin/components/ui/dialog/types/AdminUiDialogComponentTypes';


const DialogContext = createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => undefined,
  titleId: 'dialog-title',
  descriptionId: 'dialog-description',
});

export function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const generatedId = useId();
  const isOpen = open ?? uncontrolledOpen;
  const changeOpen = useCallback((nextOpen: boolean) => {
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }, [onOpenChange, open]);

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: changeOpen, titleId: `${generatedId}-title`, descriptionId: `${generatedId}-description` }}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}

export { DialogContext };
export default Dialog;


export type { DialogProps, DialogContextValue };
