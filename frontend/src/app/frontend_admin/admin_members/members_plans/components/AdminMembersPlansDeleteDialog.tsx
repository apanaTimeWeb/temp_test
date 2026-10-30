// RESPONSIBILITY: AdminPlansDeleteDialog component owned by admin_plans; responsibility folder: admin_plans_delete_dialog.
"use client";

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import type { AdminPlansDeleteDialogProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';


export default function AdminPlansDeleteDialog({ open, planName, onClose, onConfirm }: AdminPlansDeleteDialogProps) {
  const t = useTranslations('ADMIN_PLANS');
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) { event.preventDefault(); dialog?.focus(); return; }
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1]?.focus(); }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0]?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previousFocus?.focus(); };
  }, [onClose, open]);
  if (!open) return null;
  return (
    <div data-testid="admin_plans-AdminMembersPlansMain-control-011" className="admin-modal-overlay" onClick={onClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="admin-plans-delete-dialog-title" tabIndex={-1} data-testid="admin_plans-AdminMembersPlansMain-control-012" className="admin-modal max-w-[400px]" onClick={(event) => event.stopPropagation()} >
        <h2 id="admin-plans-delete-dialog-title" className="admin-modal-title flex items-center gap-2 text-danger-text" ><Trash2 size={18} strokeWidth={2} /> {t('DELETE_PLAN')}</h2>
        <p className="admin-modal-desc">{t('DELETE_CONFIRMATION', { name: planName })}</p>
        <div className="admin-modal-footer">
          <button type="button" data-testid="admin_plans-AdminMembersPlansMain-control-013" className="admin-btn-ghost" onClick={onClose}>{t('CANCEL')}</button>
          <button type="button" data-testid="admin_plans-AdminMembersPlansMain-control-014" className="admin-btn-danger" onClick={onConfirm}>{t('DELETE_PLAN')}</button>
        </div>
      </div>
    </div>
  );
}


export type { AdminPlansDeleteDialogProps };
