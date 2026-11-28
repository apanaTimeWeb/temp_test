import { useState } from 'react';
import type { RenewalRecord } from '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_views/ManagerFinanceRenewalsBulkWhatsAppModal';

interface UseRenewalsActionsParams<T extends RenewalRecord> {
  renewalsList: T[];
  setRenewalsList: React.Dispatch<React.SetStateAction<T[]>>;
  pastGraceList: T[];
  confirm: (msg: string, cancelText: string, okText: string) => Promise<boolean>;
  setFeedbackMsg: (msg: string | null) => void;
  tManagerUi: (key: string) => string;
}

export function useManagerFinanceRenewalsActions<T extends RenewalRecord>({
  renewalsList,
  setRenewalsList,
  pastGraceList,
  confirm,
  setFeedbackMsg,
  tManagerUi,
}: UseRenewalsActionsParams<T>) {
  const handleAutoReleaseSeats = async () => {
    const count = pastGraceList.length;
    if (count === 0) return;
    const ok = await confirm(
      `Release ${count} seats overdue by > 3 days? These seats will become vacant immediately for new admissions.`,
      tManagerUi('cancel') || 'Cancel',
      `Release ${count} Seats`
    );
    if (!ok) return;
    setRenewalsList((prev) =>
      prev.map((item) => (item.daysLeft < -3 ? { ...item, isSeatReleased: true } : item))
    );
    setFeedbackMsg(`Successfully released ${count} seats past 3-day grace period.`);
  };

  const handleReleaseSingleSeat = async (id: number | string, studentName: string) => {
    const ok = await confirm(
      `Release seat for ${studentName} (overdue > 3 days)? This will mark their seat as vacant.`,
      tManagerUi('cancel') || 'Cancel',
      'Release Seat'
    );
    if (!ok) return;
    setRenewalsList((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, isSeatReleased: true } : item))
    );
    setFeedbackMsg(`Seat for ${studentName} successfully vacated and released.`);
  };

  const handleRenewStudent = async (id: number | string, studentName: string) => {
    const confirmed = await confirm(
      `Confirm subscription renewal: Extend subscription for ${studentName} by 30 days?`,
      tManagerUi('cancel') || 'Cancel',
      'Renew (+30 Days)'
    );
    if (!confirmed) return;
    setRenewalsList((prev) =>
      prev.map((item) => {
        if (String(item.id) === String(id)) {
          const currentExpiry = new Date(item.expiryDate);
          const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
          return {
            ...item,
            expiryDate: newExpiry.toISOString().split('T')[0],
            daysLeft: 30,
            due: 0,
            lastPaymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
    setFeedbackMsg(`Subscription renewed successfully for ${studentName} (+30 days added).`);
  };

  return {
    handleAutoReleaseSeats,
    handleReleaseSingleSeat,
    handleRenewStudent,
  };
}
