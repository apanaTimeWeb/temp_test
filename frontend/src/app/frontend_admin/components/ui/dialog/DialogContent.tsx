'use client';
import { Children, isValidElement, useEffect, useRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { useDialog } from '@/components/ui/dialog/Dialog';
import { DialogTitle } from '@/components/ui/dialog/DialogTitle';
import { DialogDescription } from '@/components/ui/dialog/DialogDescription';
import { useTranslations } from 'next-intl';
import type { DialogContentProps } from '@/app/frontend_admin/components/ui/dialog/types/AdminUiDialogComponentTypes';


function containsDialogSlot(children: ReactNode, slot: typeof DialogTitle | typeof DialogDescription): boolean {
  let found = false;
  const targetName = (slot as any)?.name ?? (slot as any)?.displayName;
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || found) return;
    const type = child.type as any;
    if (type === slot || (targetName && (type?.name === targetName || type?.displayName === targetName))) {
      found = true;
      return;
    }
    const nestedChildren = (child.props as { children?: ReactNode }).children;
    if (nestedChildren !== undefined) found = containsDialogSlot(nestedChildren, slot);
  });
  return found;
}

let lastInteractedElement: HTMLElement | null = null;
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (e.target instanceof HTMLElement) lastInteractedElement = e.target;
  }, true);
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function DialogContent({ className = '', children, ...surfaceProps }: DialogContentProps) {
  const { open, onOpenChange, titleId, descriptionId } = useDialog();
  const t = useTranslations('ADMIN_SHELL');
  const contentRef = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  const hasTitle = containsDialogSlot(children, DialogTitle);
  const hasDescription = containsDialogSlot(children, DialogDescription);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body)
      ? document.activeElement
      : lastInteractedElement;
    const content = contentRef.current;
    const focusable = content?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusable?.[0] ?? content)?.focus();

    function getFocusableItems() {
      return content ? Array.from(content.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChangeRef.current(false);
        return;
      }
      if (event.key !== 'Tab' || !content) return;
      const items = getFocusableItems();
      if (items.length === 0) {
        event.preventDefault();
        content.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === content)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    function handleFocusIn(event: FocusEvent) {
      if (!content || !(event.target instanceof Node) || content.contains(event.target)) return;
      const first = getFocusableItems()[0];
      (first ?? content).focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (target === event.currentTarget || (target instanceof HTMLElement && target.dataset.dialogBackdrop === 'true')) {
      onOpenChangeRef.current(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center p-4" onMouseDown={handleBackdropClick}>
      <div aria-hidden="true" data-dialog-backdrop="true" className="absolute inset-0 cursor-default bg-overlay-backdrop" />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={!hasTitle ? t('DIALOG') : undefined}
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        tabIndex={-1}
        className={`relative z-10 admin-dialog-viewport overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog ${className}`}
        {...surfaceProps}
      >
        {children}
      </div>
    </div>
  );
}

export default DialogContent;


export type { DialogContentProps };
