import { z } from 'zod';

export const AdminShiftsMigrationSchema = z.object({
  newShift: z.string(),
  newSeat: z.string(),
  showCustomSlot: z.boolean(),
  customStart: z.string(),
  customEnd: z.string(),
  payMode: z.enum(['Cash', 'UPI', 'Card']),
  txnId: z.string(),
  isPaying: z.boolean(),
}).superRefine((value, context) => {
  if (value.showCustomSlot) {
    const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if (!timePattern.test(value.customStart)) context.addIssue({ code: z.ZodIssueCode.custom, path: ['customStart'], message: 'CUSTOM_START_REQUIRED' });
    if (!timePattern.test(value.customEnd)) context.addIssue({ code: z.ZodIssueCode.custom, path: ['customEnd'], message: 'CUSTOM_END_REQUIRED' });
    if (timePattern.test(value.customStart) && timePattern.test(value.customEnd) && value.customStart >= value.customEnd) context.addIssue({ code: z.ZodIssueCode.custom, path: ['customEnd'], message: 'CUSTOM_SLOT_ORDER' });
  }
  if (value.isPaying && value.payMode !== 'Cash' && !value.txnId.trim()) context.addIssue({ code: z.ZodIssueCode.custom, path: ['txnId'], message: 'TRANSACTION_REFERENCE_REQUIRED' });
});
export type AdminShiftsMigrationFormValues = z.infer<typeof AdminShiftsMigrationSchema>;
