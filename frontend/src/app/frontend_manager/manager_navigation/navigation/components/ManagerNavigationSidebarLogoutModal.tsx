'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface ManagerNavigationSidebarLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManagerNavigationSidebarLogoutModal({
  isOpen,
  onClose,
}: ManagerNavigationSidebarLogoutModalProps) {
  const tManagerUi = useTranslations('manager.manager_navigation.ui');
  const logoutDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = logoutDialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = (): HTMLElement[] =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
      );
    (getFocusable()[0] ?? dialog).focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (!items.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mgr-modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        ref={logoutDialogRef}
        tabIndex={-1}
        className="mgr-modal mgr-logout-modal"
        role="dialog"
        data-testid="manager-logout-dialog"
        aria-modal="true"
        aria-labelledby="manager-logout-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p id="manager-logout-title" className="mgr-modal-title">
          {tManagerUi('log_out')}
        </p>
        <p className="mgr-modal-desc" role="status">
          Are you sure you want to sign out of the manager portal?
        </p>
        <div className="mgr-modal-footer">
          <button
            type="button"
            className="mgr-btn-ghost"
            data-testid="manager-logout-cancel"
            onClick={onClose}
          >
            {tManagerUi('close')}
          </button>
          <button
            type="button"
            className="mgr-btn-danger"
            data-testid="manager-logout-confirm"
            onClick={() => {
              try {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('manager_session');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('admin_user');
                sessionStorage.clear();
                document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
                document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
              } catch {
                // ignore
              }
              window.location.href = '/login';
            }}
          >
            {tManagerUi('log_out')}
          </button>
        </div>
      </div>
    </div>
  );
}

