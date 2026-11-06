'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';

interface AdminNavigationSidebarLogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminNavigationSidebarLogoutModal({
  open,
  onOpenChange,
}: AdminNavigationSidebarLogoutModalProps) {
  const t = useTranslations('ADMIN_NAVIGATION');

  const handleSignOut = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('admin_user');
        sessionStorage.clear();
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      }
    } catch {
      // Storage access resilience
    }
    toast.success('Signed out successfully');
    onOpenChange(false);
    window.location.href = '/public_auth/auth_sign_in';
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-overlay border-border">
        <DialogHeader>
          <DialogTitle>{t('LOG_OUT_TITLE')}</DialogTitle>
          <DialogDescription>{t('LOG_OUT_DESCRIPTION')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <button
            data-testid="admin_sidebar-AdminNavigationSidebar-control-004"
            type="button"
            onClick={() => onOpenChange(false)}
            className="border border-border rounded-md px-4 py-2 text-text-secondary hover:bg-surface-hover transition-colors"
          >
            {t('CANCEL')}
          </button>
          <button
            data-testid="admin_sidebar-AdminNavigationSidebar-control-005"
            type="button"
            onClick={handleSignOut}
            className="bg-danger text-on-danger rounded-md px-4 py-2 font-medium hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            {t('LOG_OUT')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminNavigationSidebarLogoutModal;

