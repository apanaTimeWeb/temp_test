'use client';

import React from 'react';
import { Key } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';

interface ManagerLockersManagementVacateModalProps {
  freeTarget: Locker;
  dialogRef: React.Ref<HTMLDivElement>;
  keyStatus: 'returned' | 'lost';
  setKeyStatus: (val: 'returned' | 'lost') => void;
  remarks: string;
  setRemarks: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function ManagerLockersManagementVacateModal({
  freeTarget,
  dialogRef,
  keyStatus,
  setKeyStatus,
  remarks,
  setRemarks,
  onClose,
  onConfirm,
}: ManagerLockersManagementVacateModalProps) {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');

  return (
    <div className="ss-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="ss-modal max-w-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ss-locker-free-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 text-primary mb-1">
          <Key size={20} />
          <h2 id="ss-locker-free-title" className="ss-modal-title">
            {tManagerUi('vacate_and_clear_title')}
          </h2>
        </div>
        <p className="ss-modal-desc">
          Locker <strong>{freeTarget.lockerId}</strong> · Currently assigned to{' '}
          <strong>{freeTarget.assignedTo}</strong>
        </p>

        <div className="space-y-4 my-4">
          {/* Escrow deposit card */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
            <span className="text-secondary">{tManagerUi('security_deposit_held')}</span>
            <span className="font-bold text-primary">₹500.00</span>
          </div>

          {/* Physical Key inspection options */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              {tManagerUi('key_status_label')}
            </label>

            <label
              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                keyStatus === 'returned'
                  ? 'border-primary bg-primary-subtle'
                  : 'border-border bg-card'
              }`}
            >
              <input
                type="radio"
                name="keyStatus"
                value="returned"
                checked={keyStatus === 'returned'}
                onChange={() => setKeyStatus('returned')}
                className="mt-0.5 text-primary"
              />
              <div>
                <p className="text-sm font-semibold text-primary">
                  {tManagerUi('key_returned_option')}
                </p>
                <p className="text-xs text-secondary">
                  Original physical locker key returned undamaged. Full deposit refundable.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                keyStatus === 'lost'
                  ? 'border-danger bg-danger-bg'
                  : 'border-border bg-card'
              }`}
            >
              <input
                type="radio"
                name="keyStatus"
                value="lost"
                checked={keyStatus === 'lost'}
                onChange={() => setKeyStatus('lost')}
                className="mt-0.5 text-danger"
              />
              <div>
                <p className="text-sm font-semibold text-danger">
                  {tManagerUi('key_lost_option')}
                </p>
                <p className="text-xs text-secondary">
                  Lock must be re-keyed. ₹150 penalty deducted from deposit.
                </p>
              </div>
            </label>
          </div>

          {/* Financial Calculation Box */}
          <div className="rounded-lg border border-border bg-surface-highlight p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-secondary">
              <span>{tManagerUi('deduction_amount')}</span>
              <span className={keyStatus === 'lost' ? 'font-bold text-danger' : 'font-medium'}>
                - ₹{keyStatus === 'lost' ? '150.00' : '0.00'}
              </span>
            </div>
            <div className="flex justify-between font-bold text-sm text-primary pt-1.5 border-t border-border">
              <span>{tManagerUi('net_refund_payable')}</span>
              <span className="text-success">₹{keyStatus === 'lost' ? '350.00' : '500.00'}</span>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="ss-label" htmlFor="clearance-remarks">
              {tManagerUi('clearance_remarks')}
            </label>
            <input
              id="clearance-remarks"
              className="ss-input"
              placeholder={tManagerUi('clearance_remarks_placeholder')}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>

        <div className="ss-modal-footer">
          <button type="button" className="ss-btn-ghost" onClick={onClose}>
            {tManagerUi('cancel')}
          </button>
          <button type="button" className="ss-btn-primary" onClick={onConfirm}>
            {tManagerUi('submit_vacate_and_refund')}
          </button>
        </div>
      </div>
    </div>
  );
}

