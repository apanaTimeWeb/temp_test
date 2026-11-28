'use client';

import type { ManagerMembersNewAdmissionAdmissionFormValues } from '@/app/frontend_manager/manager_members/members_new_admission/schemas/ManagerMembersNewAdmissionAdmissionSchema';
import { formatAdmissionInr } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionStorageAndFormat';
import { AlertCircle, Calendar, IndianRupee, Info, MessageSquare, ShieldCheck, Tag } from 'lucide-react';
import type { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface SecurityDepositCardProps {
  register: UseFormRegister<ManagerMembersNewAdmissionAdmissionFormValues>;
  setValue?: UseFormSetValue<ManagerMembersNewAdmissionAdmissionFormValues>;
  watchedSecurityDeposit: string;
  watchedLocker?: string;
}

export function ManagerMembersNewAdmissionSecurityDepositCard({
  register,
  setValue,
  watchedSecurityDeposit,
  watchedLocker,
}: SecurityDepositCardProps) {
  return (
    <div className="mgr-form-field mgr-form-field-full p-4 rounded-xl border border-indigo-500/25 bg-surface space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-indigo-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <label className="mgr-label !mb-0 font-bold text-primary" htmlFor="admission-security-deposit">
                Refundable Security Deposit
              </label>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                100% Refundable on Exit
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Refundable deposit held securely in student account; returned upon membership exit and no-dues clearance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { val: '0', label: `${formatAdmissionInr(0)} None`, active: !watchedSecurityDeposit || watchedSecurityDeposit === '0' },
            { val: '500', label: `${formatAdmissionInr(500)} Standard Desk`, active: watchedSecurityDeposit === '500' },
            { val: '1000', label: `${formatAdmissionInr(1000)} Desk + Locker`, active: watchedSecurityDeposit === '1000' },
          ].map((preset) => (
            <button
              key={preset.val}
              type="button"
              onClick={() => setValue?.('securityDeposit', preset.val, { shouldValidate: true, shouldDirty: true })}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium motion-safe:transition-colors cursor-pointer ${
                preset.active
                  ? 'bg-secondary-bg border-primary text-primary font-bold'
                  : 'bg-surface border-border text-secondary hover:text-primary'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="mgr-input-icon-wrap flex-1">
          <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
          <input
            maxLength={30}
            id="admission-security-deposit"
            {...register('securityDeposit')}
            type="number"
            min="0"
            step="1"
            onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
            className="mgr-input mgr-input-with-icon"
            placeholder="500"
          />
        </div>
        {watchedLocker && (
          <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0">
            <Info size={14} />
            <span>Personal locker allotted — {formatAdmissionInr(500)} or {formatAdmissionInr(1000)} security deposit recommended.</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface PaymentStructureSelectorProps {
  setValue?: UseFormSetValue<ManagerMembersNewAdmissionAdmissionFormValues>;
  watchedPaymentType: string;
  finalPayable: number;
}

export function ManagerMembersNewAdmissionPaymentStructureSelector({
  setValue,
  watchedPaymentType,
  finalPayable,
}: PaymentStructureSelectorProps) {
  return (
    <div className="mgr-form-field mgr-form-field-full space-y-2">
      <label className="mgr-label font-bold text-primary">Payment Structure</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setValue?.('paymentType', 'full', { shouldValidate: true, shouldDirty: true });
            if (finalPayable > 0) setValue?.('amountPaid', String(finalPayable), { shouldValidate: true, shouldDirty: true });
            setValue?.('promiseDueDate', '', { shouldDirty: true });
            setValue?.('promiseRemarks', '', { shouldDirty: true });
          }}
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left motion-safe:transition-all cursor-pointer ${
            watchedPaymentType !== 'partial'
              ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30'
              : 'border-border bg-surface hover:bg-surface-hover'
          }`}
        >
          <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
            watchedPaymentType !== 'partial' ? 'border-emerald-500 bg-emerald-500' : 'border-border'
          }`}>
            {watchedPaymentType !== 'partial' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Full Payment (Pay in Full)</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Pay entire total fee of {formatAdmissionInr(finalPayable || 0)} today. No pending dues.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setValue?.('paymentType', 'partial', { shouldValidate: true, shouldDirty: true });
            const half = Math.round((finalPayable || 1000) / 2);
            const defaultPaid = (finalPayable || 1000) > 1000 ? '500' : String(half);
            setValue?.('amountPaid', defaultPaid, { shouldValidate: true, shouldDirty: true });
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            setValue?.('promiseDueDate', nextWeek.toISOString().slice(0, 10), { shouldDirty: true });
            setValue?.('promiseRemarks', 'Balance token payment commitment recorded at admission.', { shouldDirty: true });
          }}
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left motion-safe:transition-all cursor-pointer ${
            watchedPaymentType === 'partial'
              ? 'border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/30'
              : 'border-border bg-surface hover:bg-surface-hover'
          }`}
        >
          <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
            watchedPaymentType === 'partial' ? 'border-amber-500 bg-amber-500' : 'border-border'
          }`}>
            {watchedPaymentType === 'partial' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-foreground">Partial Payment (Token Advance)</p>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">Auto Promise</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Pay a token / partial amount today and auto-schedule a verified Payment Promise for the balance.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

interface PartialPromiseCardProps {
  register: UseFormRegister<ManagerMembersNewAdmissionAdmissionFormValues>;
  setValue?: UseFormSetValue<ManagerMembersNewAdmissionAdmissionFormValues>;
  balanceDue: number;
  currentPaid: number;
  totalDue: number;
}

export function ManagerMembersNewAdmissionPartialPromiseCard({
  register,
  setValue,
  balanceDue,
  currentPaid,
  totalDue,
}: PartialPromiseCardProps) {
  const setDaysOffset = (days: number | 'monthEnd') => {
    const now = new Date();
    const target = days === 'monthEnd' ? new Date(now.getFullYear(), now.getMonth() + 1, 0) : new Date(now.getTime() + days * 24 * 3600 * 1000);
    setValue?.('promiseDueDate', target.toISOString().slice(0, 10), { shouldDirty: true });
  };

  return (
    <div className="mgr-form-field mgr-form-field-full p-4 rounded-xl border border-amber-500/35 bg-amber-500/10 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-amber-200">
              Balance Due: {formatAdmissionInr(balanceDue)} (Token Advance Received)
            </h4>
            <p className="text-[11px] text-amber-300/80">
              Paid {formatAdmissionInr(currentPaid)} out of {formatAdmissionInr(totalDue)}. Remaining balance will be registered as an auto-tracked Payment Promise.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
          DUE: {formatAdmissionInr(balanceDue)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="mgr-label !mb-0 text-amber-200" htmlFor="admission-promise-date">Promise Due Date *</label>
            <div className="flex items-center gap-1 text-[10px]">
              <button type="button" onClick={() => setDaysOffset(7)} className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">+7 Days</button>
              <button type="button" onClick={() => setDaysOffset(14)} className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">+14 Days</button>
              <button type="button" onClick={() => setDaysOffset('monthEnd')} className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">Month End</button>
            </div>
          </div>
          <div className="mgr-input-icon-wrap">
            <Calendar size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
            <input id="admission-promise-date" {...register('promiseDueDate')} type="date" className="mgr-input mgr-input-with-icon" />
          </div>
        </div>

        <div>
          <label className="mgr-label text-amber-200" htmlFor="admission-promise-remarks">Promise Remarks / Notes</label>
          <div className="mgr-input-icon-wrap">
            <MessageSquare size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
            <input maxLength={250} id="admission-promise-remarks" {...register('promiseRemarks')} type="text" className="mgr-input mgr-input-with-icon" placeholder="e.g. Student promised to pay remaining balance next week" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-amber-300/90 pt-1">
        <Tag size={14} className="text-amber-400 shrink-0" />
        <span>
          <strong>Auto-Creates Payment Promise:</strong> Saving admission will automatically record this {formatAdmissionInr(balanceDue)} promise into Finance › Payment Promises with automatic due date alerts.
        </span>
      </div>
    </div>
  );
}
