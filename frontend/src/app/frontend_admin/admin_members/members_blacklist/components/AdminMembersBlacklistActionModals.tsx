'use client';

import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminMembersBlacklistActionModalsProps {
  isDemoMode: boolean;
  removeId: string | null;
  onCloseRemove: () => void;
  onConfirmRemove: () => void;
  pardonTarget: AdminBlacklistRecord | null;
  pardonReason: string;
  onChangePardonReason: (value: string) => void;
  onClosePardon: () => void;
  onConfirmPardon: (recordId: string, reason: string) => void;
}

export function AdminMembersBlacklistActionModals({
  isDemoMode,
  removeId,
  onCloseRemove,
  onConfirmRemove,
  pardonTarget,
  pardonReason,
  onChangePardonReason,
  onClosePardon,
  onConfirmPardon,
}: AdminMembersBlacklistActionModalsProps) {
  const t = useTranslations('ADMIN_BLACKLIST');

  return (
    <>
      <Dialog open={removeId !== null} onOpenChange={(open) => { if (!open) onCloseRemove(); }}>
        <DialogContent className="rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog">
          <DialogTitle className="text-base font-bold text-text-primary tracking-tight">{t('REMOVE_TITLE')}</DialogTitle>
          <DialogDescription className="mt-2 text-xs text-text-secondary">
            {t(isDemoMode ? 'REMOVE_DEMO_DESCRIPTION' : 'REMOVE_DESCRIPTION')}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
              onClick={onCloseRemove}
            >
              {t('CANCEL')}
            </button>
            <button
              type="button"
              className="rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-on-danger hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isDemoMode}
              onClick={onConfirmRemove}
            >
              {t('CONFIRM')}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={pardonTarget !== null} onOpenChange={(open) => { if (!open) onClosePardon(); }}>
        <DialogContent className="rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog max-w-md">
          <DialogTitle className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
            <RotateCcw size={18} className="text-success-text" aria-hidden="true" />
            <span>Revoke Ban & Pardon Student</span>
          </DialogTitle>
          <DialogDescription className="mt-2 text-xs text-text-secondary">
            Lifting the ban will reinstate member access and restore turnstile permissions for <strong>{pardonTarget?.name}</strong>.
          </DialogDescription>
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="admin-blacklist-pardon-reason" className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                Pardon Justification & Undertaking Note
              </label>
              <textarea
                maxLength={1000}
                id="admin-blacklist-pardon-reason"
                rows={3}
                value={pardonReason}
                onChange={(e) => onChangePardonReason(e.target.value)}
                placeholder="e.g. Unconditional written apology submitted, full damages compensated, signed parent undertaking..."
                className="w-full rounded-xl border border-border bg-input p-3 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              onClick={onClosePardon}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-success px-4 py-2 text-xs font-semibold text-on-success hover:opacity-90 disabled:opacity-40"
              disabled={!isDemoMode || !pardonReason.trim()}
              onClick={() => {
                if (!isDemoMode || !pardonTarget) return;
                onConfirmPardon(pardonTarget.id, pardonReason);
                onClosePardon();
              }}
            >
              Confirm & Reinstate Access
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
