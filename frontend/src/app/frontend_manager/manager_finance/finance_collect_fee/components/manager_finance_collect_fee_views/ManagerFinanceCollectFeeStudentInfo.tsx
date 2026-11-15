'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { maskManagerCollectFeePhone } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import type { MANAGER_FINANCE_COLLECT_FEE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/mocks/manager_finance_collect_fee_fixtures/ManagerFinanceCollectFeeMocks';

export interface ManagerFinanceCollectFeeStudentInfoProps {
  selectedStudent: (typeof MANAGER_FINANCE_COLLECT_FEE_STUDENTS)[number] | null;
  dueAmountText: string;
  formatCurrency: (n: number) => string;
  onAutofillDue?: (dueAmountInMajorUnits: number) => void;
}

export default function ManagerFinanceCollectFeeStudentInfo({
  selectedStudent,
  dueAmountText,
  formatCurrency,
  onAutofillDue,
}: ManagerFinanceCollectFeeStudentInfoProps) {
  if (!selectedStudent) return null;

  const isSuspended = selectedStudent.status === 'suspended';
  const isExpired = selectedStudent.status === 'expired';
  const isActive = selectedStudent.status === 'active';
  const dueMajorUnits = selectedStudent.dueAmount > 0 ? selectedStudent.dueAmount / 100 : 0;

  return (
    <div className="space-y-3 pt-2">
      <div className="fin-student-confirmed flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-success shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="fin-cell-name font-semibold">{selectedStudent.name}</span>
              <span className="fin-cell-subtext font-mono text-xs text-secondary">({selectedStudent.smartId})</span>
              <span
                className={`fin-badge text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'fin-badge--success'
                    : isSuspended
                    ? 'fin-badge--danger'
                    : 'fin-badge--warning'
                }`}
              >
                {selectedStudent.status.toUpperCase()}
              </span>
            </div>
            <div className="fin-cell-subtext text-xs text-secondary mt-0.5">
              +91-{maskManagerCollectFeePhone(selectedStudent.phone)} · {selectedStudent.plan} · {selectedStudent.shift} Shift (Seat: {selectedStudent.seat})
            </div>
            <div className="text-xs text-secondary mt-0.5">
              Current Validity: <span className="font-medium text-text-primary">{selectedStudent.validUpto}</span>
            </div>
          </div>
        </div>
      </div>

      {isSuspended && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2.5 text-xs text-danger" role="alert">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Caution: Student Account is Suspended</span>
            <span>This student account is currently flagged as suspended. Verify administrative approval before recording payments.</span>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-400" role="status">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Membership Expired ({selectedStudent.validUpto})</span>
            <span>Collecting renewal fees will automatically restore seat access for the selected cycle.</span>
          </div>
        </div>
      )}

      {selectedStudent.dueAmount > 0 && (
        <div className="fin-badge fin-badge--danger w-full justify-between py-2 px-3 flex items-center">
          <span className="font-medium">
            {dueAmountText} {formatCurrency(selectedStudent.dueAmount)}
          </span>
          {onAutofillDue && (
            <button
              type="button"
              onClick={() => onAutofillDue(dueMajorUnits)}
              className="text-xs bg-danger text-on-danger hover:bg-danger/90 px-2.5 py-1 rounded-md font-semibold cursor-pointer inline-flex items-center gap-1 transition-colors"
              title="Click to autofill this outstanding due into the payment amount"
            >
              <span>Pay Full Due (₹{dueMajorUnits})</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

