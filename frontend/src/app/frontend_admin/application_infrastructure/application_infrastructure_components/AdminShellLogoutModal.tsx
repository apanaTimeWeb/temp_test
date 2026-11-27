'use client';

// RESPONSIBILITY: AdminShellLogoutModal component owned by application_infrastructure_components.

import { LogOut, User } from 'lucide-react';
import { createPortal } from 'react-dom';

interface AdminShellLogoutModalProps {
  open: boolean;
  userName: string;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AdminShellLogoutModal({
  open,
  userName,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: AdminShellLogoutModalProps) {
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-logout-title"
      aria-describedby="admin-logout-desc"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      data-testid="admin-logout-overlay"
    >
      <button
        type="button"
        tabIndex={-1}
        className="fixed inset-0 w-full h-full border-0 bg-overlay-backdrop backdrop-blur-md motion-safe:transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog focus:outline-none"
        data-testid="admin-logout-modal"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-danger bg-danger-bg text-danger-text">
            <LogOut size={24} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <h2 id="admin-logout-title" className="text-center text-lg font-bold text-text-primary">
            {title}
          </h2>
          <p id="admin-logout-desc" className="mt-1 text-center text-sm text-text-secondary">
            {description}
          </p>
        </div>

        <div className="my-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary">
            <User size={20} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-semibold text-text-primary">{userName} (Administrator)</p>
            <p className="truncate text-caption text-text-secondary">john@libraryos.com</p>
          </div>
          <span className="rounded border border-warning bg-warning-bg px-1.5 py-0.5 text-micro font-bold text-warning-text">
            ADMIN
          </span>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2.5">
          <button
            type="button"
            data-testid="admin-logout-cancel"
            onClick={onCancel}
            className="min-h-11 cursor-pointer rounded-lg border border-border bg-transparent px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            data-testid="admin-logout-confirm"
            onClick={onConfirm}
            className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-on-danger hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring motion-safe:transition-opacity"
          >
            <LogOut size={14} strokeWidth={2} aria-hidden="true" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </section>,
    document.body,
  );
}
