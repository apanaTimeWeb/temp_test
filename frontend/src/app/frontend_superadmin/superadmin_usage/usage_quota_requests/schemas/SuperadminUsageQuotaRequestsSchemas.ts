// schemas/SuperadminUsageQuotaRequestsSchemas.ts
import { z } from 'zod';

export const ApproveQuotaRequestSchema = z.object({
  requestId: z.string().min(1, { message: 'Request ID is required' }),
  approvedLimit: z.number().int().positive({ message: 'Approved limit must be greater than 0' }),
  addonFeeMonthlyInr: z.number().min(0, { message: 'Addon monthly fee must be 0 or greater' }).default(0),
  reviewNotes: z.string().max(500, { message: 'Notes must not exceed 500 characters' }).optional(),
});

export type ApproveQuotaRequestFormValues = z.infer<typeof ApproveQuotaRequestSchema>;

export const RejectQuotaRequestSchema = z.object({
  requestId: z.string().min(1, { message: 'Request ID is required' }),
  rejectionReason: z
    .string()
    .min(5, { message: 'Rejection reason must be at least 5 characters' })
    .max(500, { message: 'Rejection reason must not exceed 500 characters' }),
});

export type RejectQuotaRequestFormValues = z.infer<typeof RejectQuotaRequestSchema>;
