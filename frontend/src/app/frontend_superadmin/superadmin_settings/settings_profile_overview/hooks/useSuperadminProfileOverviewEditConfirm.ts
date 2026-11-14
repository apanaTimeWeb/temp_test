// RESPONSIBILITY: Own module-local state or interaction logic for settings profile overview; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_settings/settings_profile_overview/hooks/useSuperadminProfileOverviewEditConfirm.ts -> local state/typed dependencies -> returned state and actions.
"use client";
/** Leaf-local accessible confirmation dialog hook. No backend/API behavior is inferred here. */
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createElement, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Defines the public SuperadminProfileOverviewEditConfirmOptions contract for this owning feature. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property title Display label for the owning feature. Declared type: string.
 * @property confirmLabel Display label for the owning feature. Declared type: string.
 * @property cancelLabel Boolean state used by the owning feature. Declared type: string.
 * @property destructive Value defined by the existing feature-local contract. Declared type: boolean.
 */
export type SuperadminProfileOverviewEditConfirmOptions = {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

/** Uses the native modal-dialog focus/keyboard model with design-system semantic tokens. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminProfileOverviewEditConfirm() {
  const t = useTranslations('SUPERADMIN_PROFILE');
  return useCallback((message: string, options: SuperadminProfileOverviewEditConfirmOptions = {}): Promise<boolean> =>
    new Promise<boolean>((resolve) => {
      if (typeof document === 'undefined') {
        resolve(false);
        return;
      }

      const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const destructive = options.destructive ?? /\b(delete|remove|revoke|suspend|terminate|settle|reset|restore|disable|permanent)\b/i.test(message);
      const dialog = document.createElement('dialog');
      const instanceId = `superadmin-confirm-${Date.now()}-${document.querySelectorAll('dialog[data-superadmin-confirm]').length + 1}`;
      const titleId = `${instanceId}-title`;
      const descriptionId = `${instanceId}-description`;
      dialog.dataset.superadminConfirm = 'true';
      dialog.className = 'm-auto sa-confirm-dialog max-w-lg rounded-xl border border-border bg-overlay p-0 text-primary shadow-dialog ';
      dialog.setAttribute('aria-labelledby', titleId);
      dialog.setAttribute('aria-describedby', descriptionId);
      dialog.setAttribute('aria-modal', 'true');

      const panel = document.createElement('div');
      panel.className = 'space-y-5 p-6 bg-overlay rounded-xl border border-border shadow-dialog w-full max-w-lg';
      const heading = document.createElement('h2');
      heading.id = titleId;
      heading.className = 'text-lg font-semibold text-primary';
      heading.textContent = options.title || t('COPY.CONFIRM_DIALOG_TITLE');
      let warningRoot: ReturnType<typeof createRoot> | undefined;
      if (destructive) {
        const warningIcon = document.createElement('span');
        warningIcon.className = 'inline-flex h-5 w-5 shrink-0 text-danger';
        warningIcon.setAttribute('aria-hidden', 'true');
        warningRoot = createRoot(warningIcon);
        warningRoot.render(createElement(AlertTriangle, { size: 18, strokeWidth: 2, 'aria-hidden': true }));
        heading.prepend(warningIcon);
      }
      const body = document.createElement('p');
      body.id = descriptionId;
      body.className = 'text-sm leading-6 text-secondary';
      body.textContent = message;
      const actions = document.createElement('div');
      actions.className = 'flex flex-wrap justify-end gap-3';
      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
      cancelButton.textContent = options.cancelLabel || t('COPY.CONFIRM_DIALOG_CANCEL');
      const confirmButton = document.createElement('button');
      confirmButton.type = 'button';
      confirmButton.className = destructive
        ? 'inline-flex min-h-11 items-center justify-center rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
        : 'inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
      confirmButton.textContent = options.confirmLabel || t('COPY.CONFIRM_DIALOG_CONTINUE');
      actions.append(cancelButton, confirmButton);
      panel.append(heading, body, actions);
      dialog.append(panel);

      const restoreFallbackBackground: Array<{ element: HTMLElement; inert: boolean; ariaHidden: string | null }> = [];
      const getFallbackFocusableElements = () => Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');
      const handleFallbackKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') { event.preventDefault(); finish(false); return; }
        if (event.key !== 'Tab') return;
        const focusable = getFallbackFocusableElements();
        if (focusable.length === 0) { event.preventDefault(); dialog.focus(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      };
      const activateAccessibleFallback = () => {
        dialog.dataset.superadminConfirmFallback = 'true';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('tabindex', '-1');
        // Emulate the native modal overlay when showModal() is unavailable.
        dialog.className = 'sa-confirm-dialog-fallback fixed inset-0 m-0 h-screen w-screen max-w-none max-h-none flex items-center justify-center bg-overlay text-primary p-0';
        for (const child of Array.from(document.body.children)) {
          if (child === dialog || !(child instanceof HTMLElement)) continue;
          restoreFallbackBackground.push({ element: child, inert: child.hasAttribute('inert'), ariaHidden: child.getAttribute('aria-hidden') });
          child.setAttribute('inert', '');
          (child as HTMLElement & { inert: boolean }).inert = true;
          child.setAttribute('aria-hidden', 'true');
        }
        dialog.addEventListener('keydown', handleFallbackKeyDown);
        dialog.setAttribute('open', '');
      };
      const restoreAccessibleFallback = () => {
        dialog.removeEventListener('keydown', handleFallbackKeyDown);
        for (const saved of restoreFallbackBackground) {
          if (saved.inert) saved.element.setAttribute('inert', '');
          else { saved.element.removeAttribute('inert'); (saved.element as HTMLElement & { inert: boolean }).inert = false; }
          if (saved.ariaHidden === null) saved.element.removeAttribute('aria-hidden');
          else saved.element.setAttribute('aria-hidden', saved.ariaHidden);
        }
        restoreFallbackBackground.length = 0;
      };

      let settled = false;
      const finish = (approved: boolean) => {
        if (settled) return;
        settled = true;
        try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch { /* DOM cleanup remains authoritative. */ }
        restoreAccessibleFallback();
        warningRoot?.unmount();
        dialog.remove();
        if (previousFocus?.isConnected) previousFocus.focus();
        resolve(approved);
      };
      cancelButton.addEventListener('click', () => finish(false));
      confirmButton.addEventListener('click', () => finish(true));
      dialog.addEventListener('cancel', (event) => { event.preventDefault(); finish(false); });
      dialog.addEventListener('click', (event) => { if (event.target === dialog) finish(false); });
      dialog.addEventListener('close', () => { if (!settled) finish(false); });
      document.body.append(dialog);
      let nativeModalOpened = false;
      try {
        if (typeof dialog.showModal === 'function') { dialog.showModal(); nativeModalOpened = true; }
      } catch {
        nativeModalOpened = false;
      }
      if (!nativeModalOpened) activateAccessibleFallback();
      cancelButton.focus();
    }), [t]);
}
