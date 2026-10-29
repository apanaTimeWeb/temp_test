import { z } from 'zod';
export const managerFinancePaymentApiSchema = z.object({
  id: z.union([z.string(), z.number()]), date: z.string(), studentName: z.string(),
  amount: z.number().int().nonnegative(), status: z.string(), mode: z.string().optional(),
  txnId: z.string().optional(), lateFee: z.number().int().nonnegative().optional(),
  receivedBy: z.string().optional(), remark: z.string().optional(), smartId: z.string().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).optional(),
});
export const managerFinancePaymentResponseSchema = z.array(managerFinancePaymentApiSchema);
