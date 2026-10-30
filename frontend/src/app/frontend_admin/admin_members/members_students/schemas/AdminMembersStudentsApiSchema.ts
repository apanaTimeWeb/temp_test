import { z } from 'zod';

export const AdminStudentsApiRecordSchema = z.object({
  id: z.union([z.string(), z.number()]),
  fullName: z.string().optional(), name: z.string().optional(), phone: z.string().optional(), shift: z.string().optional(), seat: z.string().optional(), plan: z.string().optional(), joinDate: z.string().optional(), expiryDate: z.string().optional(), status: z.string().optional(), branch: z.string().optional(), feeStatus: z.string().optional(), locker: z.string().optional(), consecutiveAbsent: z.number().optional(), totalPaid: z.string().optional(), dueFee: z.string().optional(), totalPaidMinor: z.number().int().safe().nonnegative().optional(), dueFeeMinor: z.number().int().safe().nonnegative().optional(), currencyCode: z.string().regex(/^[A-Z]{3}$/).optional(),
}).passthrough().superRefine((record, context) => {
  if ((record.totalPaidMinor !== undefined || record.dueFeeMinor !== undefined) && !record.currencyCode) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['currencyCode'], message: 'Currency code is required for typed minor-unit amounts.' });
  }
});
export const AdminStudentsApiResponseSchema = z.array(AdminStudentsApiRecordSchema);
export type AdminStudentsApiRecord = z.infer<typeof AdminStudentsApiRecordSchema>;
