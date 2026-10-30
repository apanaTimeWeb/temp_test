import { z } from 'zod';
import { ADMIN_COLLECT_FEE_PAYMENT_MODES } from '@/app/frontend_admin/admin_finance/finance_collect_fee/types/AdminFinanceCollectFeeTypes';

export interface AdminCollectFeeValidationMessages {
  amountPositive: string;
  amountPrecision: string;
  studentRequired: string;
  transactionTooLong: string;
  transactionRequired: string;
  couponTooLong: string;
  lateFeeNegative: string;
  remarkTooLong: string;
}

/** Builds the canonical collect-fee schema using the active module locale. */
export function createAdminCollectFeeSchema(messages: AdminCollectFeeValidationMessages) {
  return z.object({
    selectedStudentId: z.string().trim().min(1, messages.studentRequired),
    amountMajor: z.coerce.number().finite().min(0.01, messages.amountPositive).refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7, messages.amountPrecision),
    mode: z.enum(ADMIN_COLLECT_FEE_PAYMENT_MODES),
    txnId: z.string().trim().max(100, messages.transactionTooLong),
    couponCode: z.string().trim().max(30, messages.couponTooLong),
    lateFeeMajor: z.coerce.number().finite().min(0, messages.lateFeeNegative).refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7, messages.amountPrecision),
    monthsToRenew: z.enum(['1', '3', '6', '12']),
    remark: z.string().trim().max(500, messages.remarkTooLong),
  }).superRefine((values, ctx) => {
    if (values.mode !== 'cash' && !values.txnId.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['txnId'], message: messages.transactionRequired });
  });
}

export type AdminCollectFeeFormInput = z.input<ReturnType<typeof createAdminCollectFeeSchema>>;
export type AdminCollectFeeFormValues = z.output<ReturnType<typeof createAdminCollectFeeSchema>>;
