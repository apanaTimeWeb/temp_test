'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';

export interface BranchNotice {
  id: string;
  title: string;
  message: string;
  targetBranch: string;
  priority: 'URGENT' | 'ANNOUNCEMENT' | 'MAINTENANCE';
  effectiveDate: string;
  publishedBy: string;
}

interface AdminSettingsBranchesNoticeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNotice: (notice: BranchNotice) => void;
}

export function AdminSettingsBranchesNoticeDialog({
  isOpen,
  onOpenChange,
  onAddNotice,
}: AdminSettingsBranchesNoticeDialogProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeBranch, setNoticeBranch] = useState('All Branches (Network)');
  const [noticePriority, setNoticePriority] = useState<BranchNotice['priority']>('ANNOUNCEMENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: BranchNotice = {
      id: `ntc-${Date.now()}`,
      title: noticeTitle.trim(),
      message: noticeMessage.trim(),
      targetBranch: noticeBranch,
      priority: noticePriority,
      effectiveDate: new Date().toISOString().slice(0, 10),
      publishedBy: 'SuperAdmin (Central)',
    };
    onAddNotice(newNotice);
    onOpenChange(false);
    setNoticeTitle('');
    setNoticeMessage('');
    toast.success('Central digital notice broadcasted successfully across branches.', {
      id: `notice-broadcast-${newNotice.id}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{t('MODAL_NOTICE_TITLE')}</DialogTitle>
            <DialogDescription>{t('MODAL_NOTICE_DESC')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label htmlFor="notice-title" className="font-semibold text-foreground">
                Notice Headline *
              </label>
              <input
                id="notice-title"
                type="text"
                required
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="e.g. Diwali Operating Hours Notice"
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label htmlFor="notice-target" className="font-semibold text-foreground">
                  Target Branch Scope *
                </label>
                <select
                  id="notice-target"
                  value={noticeBranch}
                  onChange={(e) => setNoticeBranch(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                >
                  <option value="All Branches (Network)">All Branches (Network)</option>
                  <option value="Karol Bagh Central">Karol Bagh Central</option>
                  <option value="Laxmi Nagar Hub">Laxmi Nagar Hub</option>
                  <option value="Noida Sector 62">Noida Sector 62</option>
                  <option value="Mukherjee Nagar">Mukherjee Nagar</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="notice-priority" className="font-semibold text-foreground">
                  Priority / Category *
                </label>
                <select
                  id="notice-priority"
                  value={noticePriority}
                  onChange={(e) => setNoticePriority(e.target.value as BranchNotice['priority'])}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                >
                  <option value="ANNOUNCEMENT">Announcement / Festival</option>
                  <option value="MAINTENANCE">Maintenance Alert</option>
                  <option value="URGENT">Urgent Notice</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="notice-message" className="font-semibold text-foreground">
                Broadcast Message *
              </label>
              <textarea
                id="notice-message"
                rows={3}
                required
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
                placeholder="Enter notice message visible to managers and students..."
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              Broadcast Notice
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminSettingsBranchesNoticeDialog;

