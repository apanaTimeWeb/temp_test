'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { maskManagerCollectFeePhone } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import type { MANAGER_FINANCE_COLLECT_FEE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/mocks/manager_finance_collect_fee_fixtures/ManagerFinanceCollectFeeMocks';

export interface ManagerFinanceCollectFeeStudentInfoProps {
  selectedStudent: (typeof MANAGER_FINANCE_COLLECT_FEE_STUDENTS)[number] | null;
  dueAmountText: string;
  formatCurrency: (n: number) => string;
}

export default function ManagerFinanceCollectFeeStudentInfo({
  selectedStudent,
  dueAmountText,
  formatCurrency,
}: ManagerFinanceCollectFeeStudentInfoProps) {
  if (!selectedStudent) return null;

  return (
    <>
      <div className="fin-student-confirmed">
        <CheckCircle size={16} />
        <span className="fin-cell-name">{selectedStudent.name}</span>
        <span className="fin-cell-subtext">({selectedStudent.smartId})</span>
        <span className="fin-cell-subtext">· +91-{maskManagerCollectFeePhone(selectedStudent.phone)}</span>
      </div>
      {selectedStudent.dueAmount > 0 && (
        <div className="fin-badge fin-badge--danger w-full justify-center py-2">
          {dueAmountText} {formatCurrency(selectedStudent.dueAmount)}
        </div>
      )}
    </>
  );
}

