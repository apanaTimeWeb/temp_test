// schemas/AdminAccountsDailySettlementSchemas.ts
import { z } from 'zod';

export const SettlementStatusSchema = z.enum(['PENDING_APPROVAL', 'APPROVED', 'DISCREPANCY_FLAGGED']);

export const DailySettlementRecordSchema = z.object({
  id: z.string().min(1),
  date: z.string(),
  branchId: z.string().min(1),
  branchName: z.string(),
  shiftName: z.string(),
  managerId: z.string(),
  managerName: z.string(),
  openingCash: z.number().int().nonnegative(),
  cashCollected: z.number().int().nonnegative(),
  upiCollected: z.number().int().nonnegative(),
  expensesPaid: z.number().int().nonnegative(),
  expectedClosingCash: z.number().int(),
  actualHandoverCash: z.number().int().nonnegative(),
  difference: z.number().int(),
  bankDepositSlipUrl: z.string().nullable().optional(),
  bankReferenceNumber: z.string().nullable().optional(),
  managerNotes: z.string().nullable().optional(),
  adminNotes: z.string().nullable().optional(),
  status: SettlementStatusSchema,
  createdAt: z.string(),
  approvedAt: z.string().nullable().optional(),
  approvedBy: z.string().nullable().optional(),
});

export const DailySettlementKpiSummarySchema = z.object({
  expectedCashToday: z.number().int(),
  clearedCashToday: z.number().int(),
  pendingHandoverAmount: z.number().int(),
  discrepancyShortageAmount: z.number().int(),
  totalPendingCount: z.number().int().nonnegative(),
  totalFlaggedCount: z.number().int().nonnegative(),
});

export const ApproveSettlementFormSchema = z.object({
  adminNotes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  verifiedCashAmount: z.number({ required_error: 'Verified cash amount is required' }).nonnegative('Amount must be positive'),
});

export const FlagDiscrepancyFormSchema = z.object({
  discrepancyReason: z.string().min(3, 'Reason must be at least 3 characters'),
  adminNotes: z.string().min(5, 'Detailed audit notes are required for discrepancy flagging'),
});

