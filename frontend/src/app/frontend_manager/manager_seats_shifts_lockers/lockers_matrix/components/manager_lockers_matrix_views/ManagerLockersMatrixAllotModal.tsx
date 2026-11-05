'use client';

import React from 'react';
import { KeyRound, ShieldCheck, User, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ManagerLockersMatrixAllotModalProps {
  assignTarget: string;
  dialogRef: React.Ref<HTMLDivElement>;
  studentName: string;
  setStudentName: (val: string) => void;
  studentSmartId: string;
  setStudentSmartId: (val: string) => void;
  keyNumber: string;
  setKeyNumber: (val: string) => void;
  depositAmount: string;
  setDepositAmount: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ManagerLockersMatrixAllotModal({
  assignTarget,
  dialogRef,
  studentName,
  setStudentName,
  studentSmartId,
  setStudentSmartId,
  keyNumber,
  setKeyNumber,
  depositAmount,
  setDepositAmount,
  onClose,
  onSubmit,
}: ManagerLockersMatrixAllotModalProps) {
  const tManagerUi = useTranslations('manager.manager_locker_matrix.ui');

  return (
    <div className="ss-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="ss-modal max-w-md w-full p-6 rounded-2xl bg-card border border-border shadow-dialog space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ss-locker-matrix-assign-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary flex items-center justify-center">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 id="ss-locker-matrix-assign-title" className="text-base font-bold text-primary">
                Allot Locker #{assignTarget}
              </h2>
              <p className="text-xs text-secondary">Assign vacant locker to an active library member</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary"
            aria-label={tManagerUi('cancel')}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Student Full Name *</label>
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                required
                className="mgr-input pl-8 text-xs"
                placeholder="e.g. Rahul Sharma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Student Smart ID</label>
              <input
                type="text"
                className="mgr-input text-xs font-mono"
                value={studentSmartId}
                onChange={(e) => setStudentSmartId(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Physical Key No.</label>
              <input
                type="text"
                className="mgr-input text-xs font-mono"
                value={keyNumber}
                onChange={(e) => setKeyNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Monthly Rent</label>
              <input
                type="text"
                readOnly
                className="mgr-input text-xs bg-floating cursor-not-allowed"
                value="₹200 / month"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Security Deposit</label>
              <input
                type="number"
                className="mgr-input text-xs"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-floating border border-border text-xs space-y-1 text-secondary">
            <p className="flex items-center gap-1.5 font-medium text-primary">
              <ShieldCheck size={14} className="text-success" /> Key Handover Policy
            </p>
            <p>₹{depositAmount} refundable security deposit will be logged under Member Finance profile.</p>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" className="mgr-btn-ghost text-xs" onClick={onClose}>
              {tManagerUi('cancel')}
            </button>
            <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
              <KeyRound size={14} /> Confirm & Handover Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

