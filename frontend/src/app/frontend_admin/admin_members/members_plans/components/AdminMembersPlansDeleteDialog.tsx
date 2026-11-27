'use client';
// RESPONSIBILITY: AdminPlansDeleteDialog component owned by admin_plans; responsibility folder: admin_plans_delete_dialog.

import type { AdminPlansDeleteDialogProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdminPlansDeleteDialog({ open, planName, onClose, onConfirm }: AdminPlansDeleteDialogProps) {
  const t = useTranslations('ADMIN_PLANS');

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent
        data-testid="admin_plans-AdminMembersPlansMain-control-012"
        className="max-w-[400px] rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-danger-text">
            <Trash2 size={18} strokeWidth={2} aria-hidden="true" />
            <span>{t('DELETE_PLAN')}</span>
          </DialogTitle>
          <DialogDescription className="mt-2 text-xs text-text-secondary">
            {t('DELETE_CONFIRMATION', { name: planName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            data-testid="admin_plans-AdminMembersPlansMain-control-013"
            className="admin-btn-ghost"
            onClick={onClose}
          >
            {t('CANCEL')}
          </button>
          <button
            type="button"
            data-testid="admin_plans-AdminMembersPlansMain-control-014"
            className="admin-btn-danger"
            onClick={onConfirm}
          >
            {t('DELETE_PLAN')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { AdminPlansDeleteDialogProps };
