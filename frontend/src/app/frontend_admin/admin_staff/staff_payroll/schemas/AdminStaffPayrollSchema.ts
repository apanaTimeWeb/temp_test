import { z } from 'zod';

export const PayrollStatusSchema = z.enum(['DISBURSED', 'PENDING', 'ON_HOLD']);
export type PayrollStatus = z.infer<typeof PayrollStatusSchema>;

export const PaymentMethodSchema = z.enum(['BANK_TRANSFER', 'UPI', 'CASH']);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const BankDetailsSchema = z.object({
  accountNoMasked: z.string(),
  ifsc: z.string(),
  bankName: z.string(),
});
export type BankDetails = z.infer<typeof BankDetailsSchema>;

export const AttendanceStatsSchema = z.object({
  totalWorkingDays: z.number(),
  presentDays: z.number(),
  absentDays: z.number(),
  leavesTaken: z.number(),
});
export type AttendanceStats = z.infer<typeof AttendanceStatsSchema>;

export const StaffSalaryRecordSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  staffName: z.string(),
  role: z.string(),
  branchId: z.string(),
  branchName: z.string(),
  month: z.string(),
  baseSalary: z.number(),
  allowances: z.number(),
  deductions: z.number(),
  advanceSalaryDeduction: z.number().optional().default(0),
  netPayable: z.number(),
  status: PayrollStatusSchema,
  disbursedAt: z.string().nullable(),
  paymentMethod: PaymentMethodSchema.nullable(),
  transactionRef: z.string().nullable(),
  bankDetails: BankDetailsSchema,
  attendanceStats: AttendanceStatsSchema,
});
export type StaffSalaryRecord = z.infer<typeof StaffSalaryRecordSchema>;

export const DisburseSalaryInputSchema = z.object({
  payrollId: z.string().min(1, 'Payroll record ID is required'),
  paymentMethod: PaymentMethodSchema,
  transactionRef: z.string().min(2, 'Transaction reference/UTR is required'),
  notes: z.string().optional(),
});
export type DisburseSalaryInput = z.infer<typeof DisburseSalaryInputSchema>;

