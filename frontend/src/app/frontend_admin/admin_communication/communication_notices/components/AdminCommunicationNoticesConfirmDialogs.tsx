'use client';

import { useTranslations } from 'next-intl';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import type { Notice } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';

interface AdminCommunicationNoticesConfirmDialogsProps {
  deleteItem: Notice | null;
  broadcastItem: Notice | null;
  isDemoMode: boolean;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  onCloseBroadcast: () => void;
  onConfirmBroadcast: () => void;
}

export function AdminCommunicationNoticesConfirmDialogs({
  deleteItem,
  broadcastItem,
  isDemoMode,
  onCloseDelete,
  onConfirmDelete,
  onCloseBroadcast,
  onConfirmBroadcast,
}: AdminCommunicationNoticesConfirmDialogsProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  return (
    <>
      {/* Delete Confirmation */}
      {deleteItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseDelete(); }}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[400px]">
            <DialogTitle className="text-lg mb-2 font-bold text-text-primary">{t('NOTICE_DELETE_DIALOG_TITLE')}</DialogTitle>
            <DialogDescription className="mb-5 text-sm text-text-secondary">{t('NOTICE_DELETE_BLOCKED_DESCRIPTION', { title: deleteItem.title })}</DialogDescription>
            <div className="flex-wrap border-border pt-3 mt-6 flex justify-end gap-3">
              <button type="button" data-testid="admin_communication-page-control-008" onClick={onCloseDelete} className="min-h-11 px-4 py-2 border border-border text-primary rounded hover:bg-surface-hover motion-safe:transition-colors">{t('NOTICE_CANCEL')}</button>
              <button type="button" data-testid="admin_communication-page-control-009" disabled={!isDemoMode} title={!isDemoMode ? t('NOTICE_DELETE_BLOCKED_TOAST') : undefined} onClick={onConfirmDelete} className="min-h-11 px-4 py-2 bg-danger-bg text-danger-text rounded motion-safe:transition-colors">{t('NOTICE_WHY_UNAVAILABLE')}</button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Broadcast Confirmation */}
      {broadcastItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseBroadcast(); }}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[400px]">
            <DialogTitle className="text-lg mb-2 font-bold text-text-primary">{t('NOTICE_BROADCAST_DIALOG_TITLE')}</DialogTitle>
            <DialogDescription className="mb-5 text-sm text-text-secondary">{t('NOTICE_BROADCAST_BLOCKED_DESCRIPTION', { title: broadcastItem.title })}</DialogDescription>
            <div className="flex-wrap border-border pt-3 mt-6 flex justify-end gap-3">
              <button type="button" data-testid="admin_communication-page-control-010" onClick={onCloseBroadcast} className="min-h-11 px-4 py-2 border border-border text-primary rounded hover:bg-surface-hover motion-safe:transition-colors">{t('NOTICE_CLOSE')}</button>
              <button type="button" data-testid="admin_communication-page-control-011" disabled title={t('NOTICE_BROADCAST_BLOCKED_DESCRIPTION', { title: broadcastItem.title })} onClick={onConfirmBroadcast} className="min-h-11 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors">{t('NOTICE_WHY_UNAVAILABLE')}</button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AdminCommunicationNoticesConfirmDialogs;

