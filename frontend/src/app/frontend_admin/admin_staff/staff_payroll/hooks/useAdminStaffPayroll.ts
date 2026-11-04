'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_STAFF_PAYROLL_FIXTURES } from '@/app/frontend_admin/admin_staff/staff_payroll/mocks/scenarios/admin_staff_payroll.scenarios';
import type {
  StaffSalaryRecord,
  DisburseSalaryInput,
} from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';
import type {
  StaffPayrollFilterState,
  StaffPayrollKpiSummary,
  AdminStaffPayrollModel,
} from '@/app/frontend_admin/admin_staff/staff_payroll/types/AdminStaffPayrollTypes';

export function useAdminStaffPayroll(): AdminStaffPayrollModel {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  const { selectedBranchId: globalBranchId } = useAdminBranch();
  const isDemoMode = isFrontendDemoModeEnabled();

  const [selectedBranchId, setSelectedBranchId] = useState<string>(globalBranchId || 'all');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [records, setRecords] = useState<StaffSalaryRecord[]>(ADMIN_STAFF_PAYROLL_FIXTURES);
  const [selectedRecordForSlip, setSelectedRecordForSlip] = useState<StaffSalaryRecord | null>(null);
  const [selectedRecordForDisbursal, setSelectedRecordForDisbursal] = useState<StaffSalaryRecord | null>(null);

  const effectiveBranchId = selectedBranchId === 'all' && globalBranchId !== 'all' ? globalBranchId : selectedBranchId;

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (effectiveBranchId !== 'all' && r.branchId !== effectiveBranchId) return false;
      if (selectedMonth && r.month !== selectedMonth) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = r.staffName.toLowerCase().includes(q);
        const matchesId = r.staffId.toLowerCase().includes(q);
        const matchesRole = r.role.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesRole) return false;
      }
      return true;
    });
  }, [records, effectiveBranchId, selectedMonth, statusFilter, searchQuery]);

  const kpis: StaffPayrollKpiSummary = useMemo(() => {
    let totalPayrollAmount = 0;
    let disbursedAmount = 0;
    let pendingAmount = 0;
    let disbursedStaffCount = 0;
    let pendingStaffCount = 0;
    let totalDeductions = 0;

    for (const r of filteredRecords) {
      totalPayrollAmount += r.netPayable;
      totalDeductions += r.deductions;
      if (r.status === 'DISBURSED') {
        disbursedAmount += r.netPayable;
        disbursedStaffCount += 1;
      } else {
        pendingAmount += r.netPayable;
        pendingStaffCount += 1;
      }
    }

    return {
      totalPayrollAmount,
      disbursedAmount,
      pendingAmount,
      totalStaffCount: filteredRecords.length,
      disbursedStaffCount,
      pendingStaffCount,
      totalDeductions,
    };
  }, [filteredRecords]);

  const handleDisburseConfirm = useCallback((input: DisburseSalaryInput) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === input.payrollId
          ? {
              ...r,
              status: 'DISBURSED',
              disbursedAt: new Date().toISOString(),
              paymentMethod: input.paymentMethod,
              transactionRef: input.transactionRef,
            }
          : r
      )
    );
    const target = records.find((r) => r.id === input.payrollId);
    toast.success(
      t('TOAST_DISBURSE_SUCCESS', {
        name: target?.staffName ?? 'Staff Member',
        amount: target?.netPayable.toLocaleString('en-IN') ?? '0',
      })
    );
    setSelectedRecordForDisbursal(null);
  }, [records, t]);

  const filters: StaffPayrollFilterState = {
    selectedBranchId: effectiveBranchId,
    selectedMonth,
    statusFilter,
    searchQuery,
  };

  return {
    filters,
    setSelectedBranchId,
    setSelectedMonth,
    setStatusFilter,
    setSearchQuery,
    kpis,
    records: filteredRecords,
    isDemoMode,
    selectedRecordForSlip,
    setSelectedRecordForSlip,
    selectedRecordForDisbursal,
    setSelectedRecordForDisbursal,
    handleDisburseConfirm,
  };
}

export default useAdminStaffPayroll;

