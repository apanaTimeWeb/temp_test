'use client';

import React, { useMemo } from 'react';
import { KeyRound, ShieldCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';

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

  const studentOptions: ComboboxOption[] = useMemo(() => {
    return MANAGER_MEMBERS_DEMO_RECORDS.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.id})`,
      subLabel: s.seat ? `Seat ${s.seat} · ${s.status}` : s.status,
      badge: s.status,
    }));
  }, []);

  const handleStudentSelect = (val: string) => {
    if (!val) {
      setStudentName('');
      setStudentSmartId('');
      return;
    }
    const matched = MANAGER_MEMBERS_DEMO_RECORDS.find((s) => s.id === val);
    if (matched) {
      setStudentName(matched.name);
      setStudentSmartId(matched.id);
    } else {
      setStudentName(val);
      setStudentSmartId(val);
    }
  };

  const selectedValue = studentSmartId || (studentName ? studentOptions.find(o => o.label.includes(studentName))?.value : undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" onClick={onClose}>
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
            className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover"
            aria-label={tManagerUi('cancel')}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-primary block mb-1">
              Select Library Student *
            </label>
            <SearchableCombobox
              options={studentOptions}
              value={selectedValue}
              onChange={handleStudentSelect}
              placeholder="Search student by name or Smart ID..."
              searchPlaceholder="Type student name or LIB-ID..."
              aria-label="Select library student for locker allotment"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Student Smart ID</label>
              <input
                type="text"
                readOnly
                placeholder="Auto-filled on select"
                className="mgr-input text-xs font-mono bg-surface cursor-default"
                value={studentSmartId}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Physical Key No. *</label>
              <input
                type="text"
                required
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
                className="mgr-input text-xs bg-surface cursor-not-allowed"
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

          <div className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1 text-secondary">
            <p className="flex items-center gap-1.5 font-medium text-primary">
              <ShieldCheck size={14} className="text-success" /> Key Handover Policy
            </p>
            <p>₹{depositAmount} refundable security deposit will be logged under Member Finance profile.</p>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" className="mgr-btn-ghost text-xs" onClick={onClose}>
              {tManagerUi('cancel')}
            </button>
            <button
              type="submit"
              disabled={!studentName.trim()}
              className="mgr-btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <KeyRound size={14} /> Confirm & Handover Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
