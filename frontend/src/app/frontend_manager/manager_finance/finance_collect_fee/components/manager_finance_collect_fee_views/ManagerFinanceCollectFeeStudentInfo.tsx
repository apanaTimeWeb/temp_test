'use client';

import type { ManagerFinanceCollectionType } from '@/app/frontend_manager/manager_finance/finance_collect_fee/constants/ManagerFinanceCollectFeeConstants';
import type { ManagerFinanceCollectFeeStudent } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import {
  formatCollectFeeInr,
  maskManagerCollectFeePhone,
} from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { AlertCircle, AlertTriangle, ArrowRight, Check, CheckCircle } from 'lucide-react';

export interface ManagerFinanceCollectFeeStudentInfoProps {
  selectedStudent: ManagerFinanceCollectFeeStudent | null;
  dueAmountText: string;
  formatCurrency: (n: number) => string;
  onAutofillDue?: (dueAmountInMajorUnits: number) => void;
  onSelectCollectionType?: (type: ManagerFinanceCollectionType) => void;
  activeCollectionType?: ManagerFinanceCollectionType;
}

export default function ManagerFinanceCollectFeeStudentInfo({
  selectedStudent,
  dueAmountText,
  formatCurrency,
  onAutofillDue,
  onSelectCollectionType,
  activeCollectionType,
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
                  isActive ? 'fin-badge--success' : isSuspended ? 'fin-badge--danger' : 'fin-badge--warning'
                }`}
              >
                {selectedStudent.status.toUpperCase()}
              </span>
            </div>
            <div className="fin-cell-subtext text-xs text-secondary mt-0.5">
              +91-{maskManagerCollectFeePhone(selectedStudent.phone)} · {selectedStudent.plan} · {selectedStudent.shift} Shift (Seat:{' '}
              {selectedStudent.seat})
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

      {selectedStudent.dueAmount > 0 ? (
        <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-danger flex items-center gap-1.5">
              <AlertTriangle size={14} />
              <span>
                {dueAmountText} {formatCurrency(selectedStudent.dueAmount)}
              </span>
            </span>
            <span className="text-[11px] text-secondary">Unpaid backlog</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {onSelectCollectionType && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectCollectionType('dues')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer motion-safe:transition-colors flex items-center gap-1 ${
                    activeCollectionType === 'dues'
                      ? 'bg-danger text-on-danger font-semibold shadow-xs'
                      : 'bg-card border border-border hover:bg-muted text-text-primary'
                  }`}
                  title="Auto-fetch and clear the full pending due amount"
                >
                  {activeCollectionType === 'dues' && <Check size={12} />}
                  <span>Clear Full Due ({formatCollectFeeInr(dueMajorUnits)})</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectCollectionType('partial')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer motion-safe:transition-colors flex items-center gap-1 ${
                    activeCollectionType === 'partial'
                      ? 'bg-amber-600 text-white font-semibold shadow-xs'
                      : 'bg-card border border-border hover:bg-muted text-text-primary'
                  }`}
                  title="Make a partial payment toward this due"
                >
                  {activeCollectionType === 'partial' && <Check size={12} />}
                  <span>Pay Partial</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectCollectionType('monthly')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer motion-safe:transition-colors flex items-center gap-1 ${
                    activeCollectionType === 'monthly'
                      ? 'bg-primary text-on-primary font-semibold shadow-xs'
                      : 'bg-card border border-border hover:bg-muted text-text-primary'
                  }`}
                  title={`Pay for next month renewal (${formatCollectFeeInr(1200)})`}
                >
                  {activeCollectionType === 'monthly' && <Check size={12} />}
                  <span>1-Month Renewal ({formatCollectFeeInr(1200)})</span>
                </button>
              </>
            )}
            {!onSelectCollectionType && onAutofillDue && (
              <button
                type="button"
                onClick={() => onAutofillDue(dueMajorUnits)}
                className="text-xs bg-danger text-on-danger hover:opacity-90 px-2.5 py-1 rounded-md font-semibold cursor-pointer inline-flex items-center gap-1 motion-safe:transition-colors"
                title="Click to autofill this outstanding due into the payment amount"
              >
                <span>Pay Full Due ({formatCollectFeeInr(dueMajorUnits)})</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400">
          <span className="font-medium flex items-center gap-1.5">
            <CheckCircle size={14} />
            <span>All past dues cleared (Dues: {formatCollectFeeInr(0, true)})</span>
          </span>
          {onSelectCollectionType && activeCollectionType !== 'monthly' && (
            <button
              type="button"
              onClick={() => onSelectCollectionType('monthly')}
              className="font-semibold underline cursor-pointer hover:opacity-80"
            >
              Collect Monthly Renewal ({formatCollectFeeInr(1200)})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
