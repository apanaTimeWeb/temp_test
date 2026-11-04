'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, X, Building2, Clock, UserCheck } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import type {
  StaffAttendanceRecord,
  AttendanceStatus,
  RegularizeAttendanceInput,
} from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';

interface RegularizeModalProps {
  record: StaffAttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: RegularizeAttendanceInput) => void;
}

export function AdminStaffAttendanceMarkModal({
  record,
  isOpen,
  onClose,
  onSubmit,
}: RegularizeModalProps) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');

  const [newStatus, setNewStatus] = useState<AttendanceStatus>('PRESENT');
  const [clockIn, setClockIn] = useState('');
  const [clockOut, setClockOut] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (record) {
      setNewStatus(record.status);
      setClockIn(record.clockIn ?? '07:00 AM');
      setClockOut(record.clockOut ?? '03:00 PM');
      setReason('');
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit({
      recordId: record.id,
      newStatus,
      clockIn,
      clockOut: clockOut || undefined,
      reason,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('MODAL_REGULARIZE_TITLE')}</DialogTitle>
          <DialogDescription>{t('MODAL_REGULARIZE_DESC')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-sm font-semibold text-text-primary">{record.staffName}</p>
            <p className="text-xs text-text-secondary">{record.role} · {record.branchName}</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary">
              {t('FIELD_STATUS')}
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
              className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="PRESENT">{t('STATUS_PRESENT')}</option>
              <option value="LATE">{t('STATUS_LATE')}</option>
              <option value="ON_LEAVE">{t('STATUS_ON_LEAVE')}</option>
              <option value="ABSENT">{t('STATUS_ABSENT')}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">
                {t('FIELD_CLOCK_IN')}
              </label>
              <input
                type="text"
                value={clockIn}
                onChange={(e) => setClockIn(e.target.value)}
                placeholder="07:00 AM"
                className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">
                {t('FIELD_CLOCK_OUT')}
              </label>
              <input
                type="text"
                value={clockOut}
                onChange={(e) => setClockOut(e.target.value)}
                placeholder="03:00 PM"
                className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary">
              {t('FIELD_REASON')}
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('FIELD_REASON_PLACEHOLDER')}
              required
              className="w-full rounded-md border border-border bg-input p-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 rounded-md border border-border px-4 text-xs font-medium text-text-primary hover:bg-surface-hover"
            >
              {t('BTN_CANCEL')}
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-medium text-on-primary hover:bg-primary-hover disabled:opacity-50"
            >
              <CheckCircle2 size={15} />
              {t('BTN_CONFIRM_REGULARIZE')}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface InspectModalProps {
  record: StaffAttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminStaffAttendanceInspectModal({
  record,
  isOpen,
  onClose,
}: InspectModalProps) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('MODAL_INSPECT_TITLE')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-secondary">{t('COL_STAFF')}</span>
            <span className="font-semibold text-text-primary">{record.staffName} ({record.staffId})</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-secondary">{t('COL_ROLE')}</span>
            <span className="font-medium text-text-primary">{record.role}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-secondary">{t('COL_BRANCH')}</span>
            <span className="font-medium text-text-primary">{record.branchName}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-secondary">{t('COL_SHIFT')}</span>
            <span className="font-medium text-text-primary">{record.shiftType} ({record.shiftTiming})</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-secondary">{t('COL_CLOCK_IN')}</span>
            <span className="font-mono text-text-primary">{record.clockIn || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-secondary">{t('COL_CLOCK_OUT')}</span>
            <span className="font-mono text-text-primary">{record.clockOut || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-secondary">{t('COL_STATUS')}</span>
            <span className="font-semibold text-primary">{record.status}</span>
          </div>
          {record.notes && (
            <div className="rounded-md border border-border bg-surface p-2.5 text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">Notes: </span>
              {record.notes}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2 flex justify-end border-t border-border pt-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-md bg-primary px-4 text-xs font-medium text-on-primary hover:bg-primary-hover"
          >
            {t('BTN_CLOSE')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

