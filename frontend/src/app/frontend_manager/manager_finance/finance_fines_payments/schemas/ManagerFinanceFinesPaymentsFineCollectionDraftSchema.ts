import { z } from 'zod';

/** Local draft validation only; not a payment/collection API contract. */
export const managerFinanceFineCollectionDraftSchema = z.object({
  member: z.string().trim().min(1, 'validation_field_required'),
  fineId: z.string(),
  amount: z.string().trim().min(1, 'validation_field_required').refine((value) => Number.isFinite(Number(value)) && Number(value) >= 1, 'enter_valid_amount'),
  mode: z.enum(['cash', 'upi', 'card', 'bank', 'other']),
  txnId: z.string(),
}).superRefine((draft, context) => {
  if (['upi', 'card', 'bank'].includes(draft.mode) && !draft.txnId.trim()) {
    context.addIssue({ code: 'custom', path: ['txnId'], message: 'transaction_reference_required' });
  }
});

export type ManagerFinanceFinesPaymentsFineCollectionDraft = z.infer<typeof managerFinanceFineCollectionDraftSchema>;
