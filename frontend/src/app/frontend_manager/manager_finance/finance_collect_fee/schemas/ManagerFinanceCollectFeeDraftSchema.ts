import { z } from 'zod';

/** Client-side preview draft only. This schema is not a payment API contract. */
export const managerFinanceCollectFeeDraftSchema = z.object({
  member: z.string().trim().min(1, 'validation_field_required'),
  amount: z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, 'enter_valid_amount').refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'enter_valid_amount'),
  mode: z.enum(['cash', 'upi', 'card', 'bank']),
  txnId: z.string(),
  couponCode: z.string(),
  lateFee: z.string().trim().refine((value) => value === '' || (/^\d+(?:\.\d{1,2})?$/.test(value) && Number.isFinite(Number(value)) && Number(value) >= 0), 'enter_valid_amount'),
  monthsToRenew: z.enum(['1', '3', '6', '12']),
  remark: z.string().max(2000),
}).superRefine((draft, context) => {
  if (draft.mode !== 'cash' && !draft.txnId.trim()) {
    context.addIssue({ code: 'custom', path: ['txnId'], message: 'transaction_reference_required' });
  }
});

export type ManagerFinanceCollectFeeDraft = z.infer<typeof managerFinanceCollectFeeDraftSchema>;
