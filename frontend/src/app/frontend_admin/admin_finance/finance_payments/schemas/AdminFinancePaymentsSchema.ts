import { z } from 'zod';

export const AdminFinancePaymentApiRecordSchema = z.object({
  id: z.union([z.string(), z.number()]),
  receiptNumber: z.string().optional(),
  date: z.string(),
  studentName: z.string(),
  smartId: z.string().optional(),
  amount: z.number().int().nonnegative().safe(),
  currencyCode: z.string().regex(/^[A-Z]{3}$/).optional(),
  amountUnit: z.enum(['minor', 'major']).optional(),
  mode: z.enum(['cash', 'upi', 'card', 'bank']).optional(),
  txnId: z.string().optional(),
  lateFee: z.number().int().nonnegative().safe().optional(),
  receivedBy: z.string().optional(),
  remark: z.string().optional(),
  status: z.string().optional(),
  deletionReason: z.string().optional(),
}).passthrough();

export const AdminFinancePaymentsResponseSchema = z.array(AdminFinancePaymentApiRecordSchema);

export type AdminFinancePaymentApiRecord = z.infer<typeof AdminFinancePaymentApiRecordSchema>;
