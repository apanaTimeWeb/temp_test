import type {
  StaffSalaryRecord,
  PayrollStatus,
  PaymentMethod,
  DisburseSalaryInput,
} from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';

export interface StaffPayrollFilterState {
  selectedBranchId: string;
  selectedMonth: string;
  statusFilter: string;
  searchQuery: string;
}

export interface StaffPayrollKpiSummary {
  totalPayrollAmount: number;
  disbursedAmount: number;
  pendingAmount: number;
  totalStaffCount: number;
  disbursedStaffCount: number;
  pendingStaffCount: number;
  totalDeductions: number;
}

export interface AdminStaffPayrollModel {
  filters: StaffPayrollFilterState;
  setSelectedBranchId: (branchId: string) => void;
  setSelectedMonth: (month: string) => void;
  setStatusFilter: (status: string) => void;
  setSearchQuery: (query: string) => void;
  kpis: StaffPayrollKpiSummary;
  records: StaffSalaryRecord[];
  isDemoMode: boolean;
  selectedRecordForSlip: StaffSalaryRecord | null;
  setSelectedRecordForSlip: (record: StaffSalaryRecord | null) => void;
  selectedRecordForDisbursal: StaffSalaryRecord | null;
  setSelectedRecordForDisbursal: (record: StaffSalaryRecord | null) => void;
  handleDisburseConfirm: (input: DisburseSalaryInput) => void;
}

