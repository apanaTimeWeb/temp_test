'use client';

import React, { type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { useDialog } from '@/components/ui/dialog/Dialog';
import type { DialogCloseProps } from '@/app/frontend_admin/components/ui/dialog/types/AdminUiDialogComponentTypes';


export function DialogClose({ children, asChild = false, className = '' }: DialogCloseProps) {
  const context = useDialog();
  if (asChild && React.isValidElement(children)) {
    const element = children as ReactElement<{ className?: string; onClick?: (event: MouseEvent<HTMLElement>) => void }>;
    return React.cloneElement(element, {
      className: ['min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page', className, element.props.className].filter(Boolean).join(' '),
      onClick: (event: MouseEvent<HTMLElement>) => {
        element.props.onClick?.(event);
        if (!event.defaultPrevented) context.onOpenChange(false);
      },
    });
  }
  return (
    <button
      type="button"
      onClick={() => context.onOpenChange(false)}
      className={`min-h-11 motion-safe:transition-colors motion-safe:duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export default DialogClose;


export type { DialogCloseProps };
