import { ADMIN_STAFF_PAYROLL_DEMO_DATA } from '@/app/frontend_admin/admin_staff/staff_payroll/config/admin_staff_payroll.demo_data';
import type {
  DisburseSalaryInput,
  StaffSalaryRecord,
} from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';

export async function fetchAdminStaffPayrollList(): Promise<StaffSalaryRecord[]> {
  if (isFrontendDemoModeEnabled()) {
    return Promise.resolve([...ADMIN_STAFF_PAYROLL_DEMO_DATA]);
  }
  return Promise.resolve([...ADMIN_STAFF_PAYROLL_DEMO_DATA]);
}

export async function disburseStaffSalary(
  input: DisburseSalaryInput
): Promise<{ success: boolean; record: StaffSalaryRecord }> {
  const existing = ADMIN_STAFF_PAYROLL_DEMO_DATA.find((p) => p.id === input.payrollId);
  const updated: StaffSalaryRecord = existing
    ? {
        ...existing,
        status: 'DISBURSED',
        disbursedAt: new Date().toISOString(),
        paymentMethod: input.paymentMethod,
        transactionRef: input.transactionRef,
      }
    : {
        id: input.payrollId,
        staffId: 'STF-001',
        staffName: 'Staff Member',
        role: 'Assistant',
        branchId: 'BR-001',
        branchName: 'Downtown Central',
        month: '2026-11',
        baseSalary: 20000,
        allowances: 1000,
        deductions: 0,
        advanceSalaryDeduction: 0,
        netPayable: 21000,
        status: 'DISBURSED',
        disbursedAt: new Date().toISOString(),
        paymentMethod: input.paymentMethod,
        transactionRef: input.transactionRef,
        bankDetails: { accountNoMasked: '•••• •••• 1234', ifsc: 'HDFC0001234', bankName: 'HDFC Bank' },
        attendanceStats: { totalWorkingDays: 26, presentDays: 26, absentDays: 0, leavesTaken: 0 },
      };

  return Promise.resolve({ success: true, record: updated });
}
