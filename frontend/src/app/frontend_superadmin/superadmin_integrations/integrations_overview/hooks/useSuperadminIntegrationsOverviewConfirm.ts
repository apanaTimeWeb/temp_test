// hooks/useSuperadminIntegrationsOverviewConfirm.ts
// Accessible double-verification confirm modal hook complying with Rule 71.
'use client';

import { useCallback } from 'react';

export interface ConfirmDialogOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export function useSuperadminIntegrationsOverviewConfirm() {
  return useCallback((message: string, options: ConfirmDialogOptions = {}): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      if (typeof document === 'undefined') {
        resolve(false);
        return;
      }

      const dialog = document.createElement('dialog');
      dialog.className =
        'm-auto max-w-md rounded-2xl border border-border bg-card p-0 text-foreground shadow-dialog backdrop:bg-black/60 backdrop:backdrop-blur-xs';
      dialog.setAttribute('aria-modal', 'true');

      const panel = document.createElement('div');
      panel.className = 'p-6 space-y-4';

      const title = document.createElement('h3');
      title.className = 'text-base font-bold text-foreground';
      title.textContent = options.title || 'Confirm Action';

      const desc = document.createElement('p');
      desc.className = 'text-xs text-muted-foreground leading-relaxed';
      desc.textContent = message;

      const btnGroup = document.createElement('div');
      btnGroup.className = 'flex items-center justify-end gap-3 pt-3 border-t border-border/80';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className =
        'px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground cursor-pointer transition-colors';
      cancelBtn.textContent = options.cancelLabel || 'Cancel';

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = options.destructive
        ? 'px-4 py-2 text-xs font-semibold rounded-lg bg-danger text-on-danger hover:opacity-90 cursor-pointer transition-opacity'
        : 'px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:opacity-90 cursor-pointer transition-opacity';
      confirmBtn.textContent = options.confirmLabel || 'Proceed';

      const cleanup = () => {
        try {
          dialog.close();
        } catch {
          // Dialog might already be closed
        }
        if (dialog.parentNode) {
          dialog.parentNode.removeChild(dialog);
        }
      };

      cancelBtn.onclick = () => {
        cleanup();
        resolve(false);
      };

      confirmBtn.onclick = () => {
        cleanup();
        resolve(true);
      };

      dialog.oncancel = () => {
        cleanup();
        resolve(false);
      };

      btnGroup.appendChild(cancelBtn);
      btnGroup.appendChild(confirmBtn);
      panel.appendChild(title);
      panel.appendChild(desc);
      panel.appendChild(btnGroup);
      dialog.appendChild(panel);
      document.body.appendChild(dialog);

      dialog.showModal();
      confirmBtn.focus();
    });
  }, []);
}
