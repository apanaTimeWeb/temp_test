'use client';

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { useTranslations } from 'next-intl';
import type { AdminSettingsProfileUnsavedChangesDialogProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';


/** Confirmation dialog for discarding unsaved profile drafts; no browser confirm() is used. */
export default function AdminSettingsProfileUnsavedChangesDialog({ open, onOpenChange, onStay, onLeave }: AdminSettingsProfileUnsavedChangesDialogProps) {
  const t = useTranslations('ADMIN_PROFILE');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg" data-testid="admin_settings-profile-unsaved-changes-dialog">
        <DialogHeader>
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-wrap">
          <button type="button" className="admin-btn-ghost min-h-11" onClick={onStay}>{t('UNSAVED_CHANGES_STAY')}</button>
          <button type="button" className="admin-btn-primary min-h-11" onClick={onLeave}>{t('UNSAVED_CHANGES_LEAVE')}</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
