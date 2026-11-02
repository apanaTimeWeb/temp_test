'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Armchair,
  ShieldAlert,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';

export interface FloorTurnoverItem {
  id: string;
  studentId: string;
  studentName: string;
  smartId: string;
  seatNumber: string;
  shift: string;
  type: 'CHECKOUT_VERIFICATION' | 'OVERSTAY_ALERT';
  timeRecorded: string;
  overstayMinutes?: number;
  fineAmount?: number;
}

const INITIAL_TURNOVER_ITEMS: FloorTurnoverItem[] = [
  {
    id: 'turnover-1',
    studentId: '1',
    studentName: 'Rahul Sharma',
    smartId: 'SL-001',
    seatNumber: 'Seat A-14',
    shift: 'Morning (06:00 - 14:00)',
    type: 'CHECKOUT_VERIFICATION',
    timeRecorded: '01:52 PM',
  },
  {
    id: 'turnover-2',
    studentId: '3',
    studentName: 'Amit Kumar',
    smartId: 'SL-003',
    seatNumber: 'Seat B-08',
    shift: 'Morning (06:00 - 14:00)',
    type: 'OVERSTAY_ALERT',
    timeRecorded: '02:15 PM',
    overstayMinutes: 15,
    fineAmount: 50,
  },
  {
    id: 'turnover-3',
    studentId: '5',
    studentName: 'Rohan Das',
    smartId: 'SL-005',
    seatNumber: 'Seat C-21',
    shift: 'Morning (06:00 - 14:00)',
    type: 'CHECKOUT_VERIFICATION',
    timeRecorded: '01:58 PM',
  },
];

export function ManagerAttendanceDailyFloorTurnoverQueue() {
  const t = useTranslations('manager.manager_attendance.ui');
  const [items, setItems] = useState<FloorTurnoverItem[]>(INITIAL_TURNOVER_ITEMS);
  const [finesRecovered, setFinesRecovered] = useState(0);

  const pendingVerification = items.filter((i) => i.type === 'CHECKOUT_VERIFICATION');
  const activeOverstays = items.filter((i) => i.type === 'OVERSTAY_ALERT');

  const handleConfirmVacated = (id: string, seat: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success(t('vacated_success'), {
      description: `${seat} is now vacant and clean.`,
    });
  };

  const handleFlagOverstay = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setFinesRecovered((prev) => prev + 50);
    toast.success(t('overstay_fined_success'), {
      description: `₹50 overstay fine billed to ${name}.`,
    });
  };

  const handleReportFake = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.warning(t('fake_checkout_flagged'), {
      description: `${name} desk kept occupied; student notified.`,
    });
  };

  return (
    <div className="space-y-5">
      {/* ── Sub-header Stat Bar ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-info-subtle text-info-text">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">{t('stat_pending_verification')}</p>
            <p className="text-lg font-bold text-text-primary">{pendingVerification.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-danger-subtle text-danger-text">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">{t('stat_active_overstays')}</p>
            <p className="text-lg font-bold text-danger-text">{activeOverstays.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-success-subtle text-success-text">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">{t('stat_recovered_fines')}</p>
            <p className="text-lg font-bold text-success-text">₹{finesRecovered}</p>
          </div>
        </div>
      </div>

      {/* ── Queue Cards List ── */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center bg-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-subtle text-success-text mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-text-primary">{t('no_turnover_alerts')}</h3>
          <p className="mt-1 text-xs text-text-secondary">
            All morning and evening shift handovers have been physically inspected.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isOverstay = item.type === 'OVERSTAY_ALERT';

            return (
              <article
                key={item.id}
                className={`relative flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm transition-all sm:flex-row sm:items-center ${
                  isOverstay
                    ? 'border-danger-border bg-danger-subtle/10'
                    : 'border-border bg-card'
                }`}
              >
                {/* Left Info Stack */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      isOverstay
                        ? 'bg-danger-subtle text-danger-text'
                        : 'bg-primary-subtle text-primary'
                    }`}
                  >
                    {isOverstay ? (
                      <ShieldAlert className="h-5 w-5" />
                    ) : (
                      <Armchair className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-text-primary">{item.seatNumber}</span>
                      <span className="text-sm text-text-secondary">· {item.studentName} ({item.smartId})</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                          isOverstay
                            ? 'bg-danger-bg text-danger-text'
                            : 'bg-info-bg text-info-text'
                        }`}
                      >
                        {isOverstay ? `⚠️ Overstay +${item.overstayMinutes}m` : '📱 Mobile Checkout'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">
                      {item.shift} · Recorded at <strong className="text-text-primary">{item.timeRecorded}</strong>
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {isOverstay
                        ? 'Student exceeded shift end time without checking out. Verify desk immediately.'
                        : 'Student recorded check-out on mobile. Inspect desk before next student arrives.'}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {isOverstay ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleConfirmVacated(item.id, item.seatNumber)}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {t('manual_clear')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFlagOverstay(item.id, item.studentName)}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-danger-bg text-danger-text px-3 py-1.5 text-xs font-semibold hover:opacity-90"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {t('flag_overstay_fine')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReportFake(item.id, item.studentName)}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-danger-border bg-card px-3 py-1.5 text-xs font-medium text-danger-text hover:bg-danger-subtle/20"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {t('report_fake_checkout')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmVacated(item.id, item.seatNumber)}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:bg-primary-hover"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {t('confirm_vacated')}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ManagerAttendanceDailyFloorTurnoverQueue;

