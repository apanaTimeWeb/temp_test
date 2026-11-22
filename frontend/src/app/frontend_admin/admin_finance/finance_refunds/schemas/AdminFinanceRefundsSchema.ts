import { z } from 'zod';

export const AdminFinanceRefundApiRecordSchema = z.object({
  id: z.union([z.string(), z.number()]),
  studentName: z.string(),
  smartId: z.string().optional(),
  exitDate: z.string().optional(),
  depositHeld: z.number().int().nonnegative().safe(),
  deductionAmount: z.number().int().nonnegative().safe(),
  netRefund: z.number().int().nonnegative().safe(),
  currencyCode: z.string().regex(/^[A-Z]{3}$/).optional(),
  amountUnit: z.enum(['minor', 'major']).optional(),
  status: z.enum(['pending', 'approved', 'processed', 'rejected']),
  rejectionReason: z.string().optional(),
  processedDate: z.string().optional(),
  paymentMethod: z.string().optional(),
}).passthrough();

export const AdminFinanceRefundsResponseSchema = z.array(AdminFinanceRefundApiRecordSchema);

export type AdminFinanceRefundApiRecord = z.infer<typeof AdminFinanceRefundApiRecordSchema>;
