'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';

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

  const handleConfirmLogout = () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('manager_session');
      localStorage.removeItem('token');
      localStorage.removeItem('admin_user');
      sessionStorage.clear();
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;';
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;';
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;';
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;';
    } catch {
      // ignore
    }
    window.location.href = '/auth/login';
  };

  return (
    <div className="mgr-modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        ref={logoutDialogRef}
        tabIndex={-1}
        className="mgr-modal mgr-logout-modal mgr-logout-modal--enhanced"
        role="dialog"
        data-testid="manager-logout-dialog"
        aria-modal="true"
        aria-labelledby="manager-logout-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mgr-logout-modal-icon-badge" aria-hidden="true">
          <LogOut size={26} strokeWidth={2.2} />
        </div>

        <div className="mgr-logout-modal-header">
          <h2 id="manager-logout-title" className="mgr-modal-title">
            Sign Out of Manager Portal
          </h2>
          <p className="mgr-modal-desc" role="status">
            Are you sure you want to end your manager session? You will be safely signed out and returned to the sign-in screen.
          </p>
        </div>

        <div className="mgr-logout-session-pill">
          <span className="mgr-logout-session-dot" aria-hidden="true" />
          <span>Active Session: <strong>manager@library.com</strong></span>
        </div>

        <div className="mgr-modal-footer">
          <button
            type="button"
            className="mgr-btn-ghost mgr-logout-cancel-btn"
            data-testid="manager-logout-cancel"
            onClick={onClose}
          >
            {tManagerUi('close') || 'Cancel'}
          </button>
          <button
            type="button"
            className="mgr-btn-danger mgr-logout-confirm-btn"
            data-testid="manager-logout-confirm"
            onClick={handleConfirmLogout}
          >
            <LogOut size={16} strokeWidth={2} />
            <span>{tManagerUi('log_out') || 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

