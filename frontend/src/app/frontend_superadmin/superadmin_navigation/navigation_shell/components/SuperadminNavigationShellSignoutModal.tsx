'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, Shield } from 'lucide-react';

interface SignoutModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  t: (key: string) => string;
}

export default function SuperadminNavigationShellSignoutModal({
  show,
  onClose,
  onConfirm,
  userName,
  t,
}: SignoutModalProps) {
  if (!show || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="superadmin-logout-title"
      aria-describedby="superadmin-logout-description"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      data-testid="superadmin-logout-overlay"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in motion-safe:duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        className="relative z-10 w-full max-w-sm rounded-2xl border border-indigo-500/30 bg-[#0b0c20] p-6 text-white shadow-2xl animate-in zoom-in-95 fade-in motion-safe:duration-200 focus:outline-none"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="superadmin-logout-title"
        aria-describedby="superadmin-logout-description"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
          }
        }}
        data-testid="superadmin-superadmin-navigation-shell-sidebar-section-line-75"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-3">
            <LogOut size={24} strokeWidth={2.2} />
          </div>
          <h2 id="superadmin-logout-title" className="text-white text-lg font-bold text-center">
            {t('COPY.LOG_OUT_2')}
          </h2>
          <p id="superadmin-logout-description" className="text-slate-400 text-sm mt-1 text-center">
            {t('COPY.ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT_OF_THE_SUPER_ADMIN_PANEL')}
          </p>
        </div>

        <div className="my-4 rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
            <Shield size={20} strokeWidth={2.2} />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userName}</p>
            <p className="text-[11px] text-slate-400 truncate">superadmin@library.com</p>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded px-1.5 py-0.5">
            SUPER ADMIN
          </span>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2.5">
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {t('COPY.CANCEL')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut size={14} strokeWidth={2} />
            <span>{t('COPY.LOG_OUT')}</span>
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
