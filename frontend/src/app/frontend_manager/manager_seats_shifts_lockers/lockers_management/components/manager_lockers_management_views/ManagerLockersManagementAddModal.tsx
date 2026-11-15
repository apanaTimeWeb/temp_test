'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DoorClosed, X, Plus, Key } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ss-locker-add-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <DoorClosed size={20} />
            </div>
            <div>
              <h2 id="ss-locker-add-title" className="text-base font-bold text-primary">
                {tManagerUi('add_locker_e8e079')}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Register a new physical locker into library inventory
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-secondary uppercase tracking-wider"
              htmlFor="rbg4-managerseatsshiftslockerslockersclient-153"
            >
              {tManagerUi('locker_id')} <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                <Key size={15} />
              </div>
              <input
                id="rbg4-managerseatsshiftslockerslockersclient-153"
                autoFocus
                className={`mgr-input !pl-10 pr-3 text-xs w-full uppercase font-mono tracking-wider h-9 rounded-xl border border-border bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary ${
                  addError ? 'border-danger focus:ring-danger' : ''
                }`}
                placeholder="e.g. L-105, D-01"
                value={newLockerId}
                onChange={(e) => onLockerIdChange(e.target.value)}
              />
            </div>
            {addError && (
              <p className="text-xs text-danger font-medium mt-1" role="alert">
                {tManagerUi(addError)}
              </p>
            )}
            <p className="text-[11px] text-secondary">
              A standard physical key tag and ₹500 security deposit requirement will be initialized for this locker.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              className="mgr-btn-outline text-xs px-3.5 py-2 rounded-xl"
              onClick={onClose}
            >
              {tManagerUi('cancel')}
            </button>
            <button
              type="submit"
              className="mgr-btn-primary flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-semibold shadow-xs"
            >
              <Plus size={14} />
              {tManagerUi('add_locker')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
