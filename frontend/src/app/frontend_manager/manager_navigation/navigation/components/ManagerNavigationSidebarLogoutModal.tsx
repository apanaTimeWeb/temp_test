'use client';

import { clearBrowserSessionStorage, expireBrowserCookie, removeBrowserStorageItem } from '@/lib/browserStorage';
import { LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !mounted) return;
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
  }, [isOpen, onClose, mounted]);

  if (!isOpen || !mounted) return null;

  const handleConfirmLogout = () => {
    removeBrowserStorageItem('access_token');
    removeBrowserStorageItem('user');
    removeBrowserStorageItem('auth_token');
    removeBrowserStorageItem('manager_session');
    removeBrowserStorageItem('token');
    removeBrowserStorageItem('admin_user');
    clearBrowserSessionStorage();
    expireBrowserCookie('access_token');
    expireBrowserCookie('auth_token');
    expireBrowserCookie('session');
    expireBrowserCookie('token');
    window.location.href = '/auth/login';
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager-logout-title"
      aria-describedby="manager-logout-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid="manager-logout-overlay"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md motion-safe:transition-opacity motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={logoutDialogRef}
        tabIndex={-1}
        className="mgr-logout-dialog-surface relative z-10 w-full max-w-sm rounded-2xl border border-indigo-500/30 p-6 text-white shadow-2xl motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:fade-in motion-safe:duration-200 focus:outline-none"
        data-testid="manager-logout-dialog"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-3">
            <LogOut size={24} strokeWidth={2.2} />
          </div>
          <h2 id="manager-logout-title" className="text-white text-lg font-bold text-center">
            {tManagerUi('log_out_title') || 'Log out?'}
          </h2>
          <p id="manager-logout-desc" className="text-slate-400 text-sm mt-1 text-center">
            {tManagerUi('log_out_description') || 'Are you sure you want to log out of this session?'}
          </p>
        </div>

        <div className="my-4 rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
            <User size={20} strokeWidth={2.2} />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{tManagerUi('manager') || 'Branch Manager'}</p>
            <p className="text-[11px] text-slate-400 truncate">{tManagerUi('manager_library_com') || 'manager@library.com'}</p>
          </div>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 rounded px-1.5 py-0.5">
            MANAGER
          </span>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2.5">
          <button
            type="button"
            data-testid="manager-logout-cancel"
            onClick={onClose}
            className="border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {tManagerUi('cancel') || 'Cancel'}
          </button>
          <button
            type="button"
            data-testid="manager-logout-confirm"
            onClick={handleConfirmLogout}
            className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut size={14} strokeWidth={2} />
            <span>{tManagerUi('log_out') || 'Log out'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
