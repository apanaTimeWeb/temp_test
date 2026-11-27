'use client';

import type { ManagerFinanceCollectFeeMode, ManagerFinanceCollectFeeStudent } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import { formatCollectFeeInr } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { AlertTriangle, Calendar, CheckCircle, IndianRupee, UserCheck } from 'lucide-react';

interface ManagerFinanceCollectFeePaymentInputsProps {
  paymentDate?: string;
  todayDateStr: string;
  isFuturePaymentDate: boolean;
  amount: string;
  isAmountInvalid: boolean;
  amountError?: string;
  selectedStudent: ManagerFinanceCollectFeeStudent | null;
  studentDueMajor: number;
  studentDuePaise: number;
  targetReconciliationAmount: number;
  total: number;
  isPartialPayment: boolean;
  isFullPayment: boolean;
  isAdvancePayment: boolean;
  remainingDuePaise: number;
  collectionType: string;
  mode: ManagerFinanceCollectFeeMode;
  txnId: string;
  isTxnIdMissing: boolean;
  txnIdError?: string;
  isSubmitted: boolean;
  collectedBy: string;
  labels: {
    amountLabel: string;
    transactionId: string;
    collectedBy: string;
  };
  formatCurrency: (n: number) => string;
  toMinorUnits: (n: number) => number;
  onPaymentDateChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onTxnIdChange: (val: string) => void;
  onCollectedByChange: (val: string) => void;
}

export default function ManagerFinanceCollectFeePaymentInputs({
  paymentDate,
  todayDateStr,
  isFuturePaymentDate,
  amount,
  isAmountInvalid,
  amountError,
  selectedStudent,
  studentDueMajor,
  studentDuePaise,
  targetReconciliationAmount,
  total,
  isPartialPayment,
  isFullPayment,
  isAdvancePayment,
  remainingDuePaise,
  collectionType,
  mode,
  txnId,
  isTxnIdMissing,
  txnIdError,
  isSubmitted,
  collectedBy,
  labels,
  formatCurrency,
  toMinorUnits,
  onPaymentDateChange,
  onAmountChange,
  onTxnIdChange,
  onCollectedByChange,
}: ManagerFinanceCollectFeePaymentInputsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="fin-label flex items-center gap-1.5" htmlFor="manager-collect-fee-payment-date">
            <Calendar size={13} className="fin-icon-muted" />
            <span>Payment Date</span>
            <span className="fin-text-danger">*</span>
          </label>
          <input
            maxLength={30}
            id="manager-collect-fee-payment-date"
            type="date"
            max={todayDateStr}
            className={`fin-input w-full mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isFuturePaymentDate ? 'border-danger' : ''}`}
            value={paymentDate || todayDateStr}
            onChange={(e) => onPaymentDateChange(e.target.value)}
          />
          {isFuturePaymentDate && (
            <p className="fin-input-hint fin-text-danger mt-1 text-xs" role="alert">
              Payment date cannot be in the future.
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-137">
              {labels.amountLabel} <span className="fin-text-danger">*</span>
            </label>
            <span className="text-[10px] text-primary font-medium">
              {collectionType === 'dues'
                ? 'Auto-filled Due'
                : collectionType === 'monthly'
                  ? 'Auto-filled Cycle'
                  : collectionType === 'fine'
                    ? 'Auto-filled Fine'
                    : 'Amount'}
            </span>
          </div>
          <div className="relative mt-1">
            <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
            <input
              maxLength={30}
              id="rbg4-managerfinancecollectfeepage-137"
              type="number"
              min="0.01"
              step="0.01"
              className={`fin-input fin-input--pl8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${amountError || (amount !== '' && isAmountInvalid) ? 'border-danger' : ''}`}
              placeholder="0.00"
              value={amount}
              aria-invalid={Boolean(amountError || (amount !== '' && isAmountInvalid))}
              aria-describedby={amountError ? 'manager-collect-fee-amount-error' : undefined}
              onChange={(e) => onAmountChange(e.target.value)}
            />
          </div>
          {amountError && (
            <p id="manager-collect-fee-amount-error" className="fin-input-hint fin-text-danger mt-1 text-xs" role="alert">
              {amountError}
            </p>
          )}
          {!amountError && amount !== '' && isAmountInvalid && (
            <p className="fin-input-hint fin-text-danger mt-1 text-xs" role="alert">
              {`Amount must be greater than ${formatCollectFeeInr(0, true)}.`}
            </p>
          )}
        </div>
      </div>

      {selectedStudent && (studentDueMajor > 0 || total > 0) && (
        <div className="p-3 rounded-lg border text-xs space-y-1.5 motion-safe:transition-colors bg-card border-border">
          <div className="flex justify-between items-center text-secondary">
            <span>
              Target Due / Fee:{' '}
              <span className="font-semibold text-danger">
                {formatCurrency(studentDuePaise > 0 ? studentDuePaise : toMinorUnits(targetReconciliationAmount))}
              </span>
            </span>
            <span>
              Amount Paying: <span className="font-semibold text-text-primary">{formatCollectFeeInr(total)}</span>
            </span>
          </div>
          {isPartialPayment && (
            <div className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
              <AlertTriangle size={13} className="shrink-0" />
              <span>Partial Payment: Remaining balance due will be {formatCurrency(remainingDuePaise)}.</span>
            </div>
          )}
          {isFullPayment && (
            <div className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle size={13} className="shrink-0" />
              <span>Full Settlement: Total pending dues of {formatCurrency(studentDuePaise)} will be completely cleared.</span>
            </div>
          )}
          {isAdvancePayment && (
            <div className="text-blue-700 dark:text-blue-400 font-medium">
              {`Advance Payment: Outstanding dues cleared + ${formatCollectFeeInr(total - studentDueMajor)} credited to subsequent cycle.`}
            </div>
          )}
        </div>
      )}

      {mode !== 'cash' && (
        <div>
          <label className="fin-label flex items-center justify-between" htmlFor="rbg4-managerfinancecollectfeepage-155">
            <span>
              {labels.transactionId} <span className="fin-text-danger">*</span>
            </span>
            <span className="text-[10px] text-secondary">Mandatory for {mode.toUpperCase()}</span>
          </label>
          <input
            maxLength={30}
            id="rbg4-managerfinancecollectfeepage-155"
            className={`fin-input w-full mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isTxnIdMissing && (isSubmitted || txnId !== '') ? 'border-danger bg-red-500/5' : ''}`}
            placeholder={
              mode === 'upi'
                ? 'Enter UPI UTR / Txn Reference (e.g. 425123456789)'
                : mode === 'card'
                  ? 'Enter POS Authorization Code / Slip No.'
                  : 'Enter IMPS / NEFT / RTGS Reference Number'
            }
            value={txnId}
            aria-invalid={isTxnIdMissing}
            aria-describedby={txnIdError || isTxnIdMissing ? 'manager-collect-fee-txnid-error' : undefined}
            onChange={(e) => onTxnIdChange(e.target.value)}
          />
          {(txnIdError || isTxnIdMissing) && (
            <p id="manager-collect-fee-txnid-error" className="fin-input-hint fin-text-danger mt-1 text-xs" role="alert">
              {txnIdError}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-collected-by">
          {labels.collectedBy} <span className="fin-text-danger">*</span>
        </label>
        <div className="relative mt-1">
          <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
          <input
            maxLength={30}
            id="rbg4-managerfinancecollectfeepage-collected-by"
            type="text"
            className="fin-input fin-input--pl8"
            placeholder="Collector Name"
            value={collectedBy}
            onChange={(e) => onCollectedByChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
