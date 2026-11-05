'use client';

import React from 'react';
import type { ManagerFinanceCollectFeeContractStatus } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeComponentTypes';

export interface ManagerFinanceCollectFeeDiscountsSectionProps {
  couponCode: string;
  onCouponCodeChange: (code: string) => void;
  couponStatus: ManagerFinanceCollectFeeContractStatus;
  onApplyCoupon: () => void;
  lateFee: string;
  onLateFeeChange: (val: string) => void;
  lateFeeOverride: boolean;
  onLateFeeOverrideChange: (override: boolean) => void;
  remark: string;
  onRemarkChange: (remark: string) => void;
  couponCodeLabel: string;
  enterCouponCodePlaceholder: string;
  applyLabel: string;
  couponValidationUnavailableText: string;
  lateFeeLabel: string;
  overrideLabel: string;
  remarkOptionalLabel: string;
  anyNotesPlaceholder: string;
}

export default function ManagerFinanceCollectFeeDiscountsSection({
  couponCode,
  onCouponCodeChange,
  couponStatus,
  onApplyCoupon,
  lateFee,
  onLateFeeChange,
  lateFeeOverride,
  onLateFeeOverrideChange,
  remark,
  onRemarkChange,
  couponCodeLabel,
  enterCouponCodePlaceholder,
  applyLabel,
  couponValidationUnavailableText,
  lateFeeLabel,
  overrideLabel,
  remarkOptionalLabel,
  anyNotesPlaceholder,
}: ManagerFinanceCollectFeeDiscountsSectionProps) {
  return (
    <>
      <div>
        <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-160">{couponCodeLabel}</label>
        <div className="flex gap-2 mt-1">
          <input
            id="rbg4-managerfinancecollectfeepage-160"
            className="fin-input flex-1"
            placeholder={enterCouponCodePlaceholder}
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value)}
          />
          <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={onApplyCoupon}>
            {applyLabel}
          </button>
        </div>
        {couponStatus === 'unavailable' && (
          <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-finance-coupon-contract-warning">
            {couponValidationUnavailableText}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="fin-label" htmlFor="manager-collect-fee-late-fee">{lateFeeLabel}</label>
          <label className="flex items-center gap-1 fin-text-xs cursor-pointer">
            <input type="checkbox" checked={lateFeeOverride} onChange={(e) => onLateFeeOverrideChange(e.target.checked)} /> {overrideLabel}
          </label>
        </div>
        <input
          id="manager-collect-fee-late-fee"
          type="number"
          className="fin-input w-full mt-1"
          value={lateFee}
          onChange={(e) => onLateFeeChange(e.target.value)}
          readOnly={!lateFeeOverride}
        />
      </div>
      <div>
        <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-178">{remarkOptionalLabel}</label>
        <textarea
          id="rbg4-managerfinancecollectfeepage-178"
          className="fin-textarea mt-1"
          rows={2}
          placeholder={anyNotesPlaceholder}
          value={remark}
          onChange={(e) => onRemarkChange(e.target.value)}
        />
      </div>
    </>
  );
}

