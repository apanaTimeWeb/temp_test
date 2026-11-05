'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ManagerLockersManagementAddModalProps {
  dialogRef: React.Ref<HTMLDivElement>;
  newLockerId: string;
  addError?: string;
  onLockerIdChange: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function ManagerLockersManagementAddModal({
  dialogRef,
  newLockerId,
  addError,
  onLockerIdChange,
  onClose,
  onSubmit,
}: ManagerLockersManagementAddModalProps) {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');

  return (
    <div className="ss-modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="ss-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ss-locker-add-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ss-locker-add-title" className="ss-modal-title">
          {tManagerUi('add_locker_e8e079')}
        </h2>
        <div className="ss-form-field">
          <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockerslockersclient-153">
            {tManagerUi('locker_id')} <span className="ss-text-danger">*</span>
          </label>
          <input
            id="rbg4-managerseatsshiftslockerslockersclient-153"
            className={`ss-input ss-input--no-icon${addError ? ' ss-input--error' : ''}`}
            placeholder={tManagerUi('e_g_d01')}
            value={newLockerId}
            onChange={(e) => onLockerIdChange(e.target.value)}
          />
          {addError && (
            <p className="ss-error" role="alert">
              {tManagerUi(addError)}
            </p>
          )}
        </div>
        <div className="ss-modal-footer">
          <button type="button" className="ss-btn-ghost" onClick={onClose}>
            {tManagerUi('cancel')}
          </button>
          <button type="button" className="ss-btn-primary" onClick={onSubmit}>
            {tManagerUi('add_locker')}
          </button>
        </div>
      </div>
    </div>
  );
}

