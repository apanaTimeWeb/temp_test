import { z } from 'zod';
export const AdminBlacklistApiRecordSchema = z.object({ id: z.union([z.string(), z.number()]), name: z.string().optional(), fullName: z.string().optional(), phone: z.string().optional(), reason: z.string().optional(), blacklistedBy: z.string().optional(), blacklistedOn: z.string().optional(), date: z.string().optional(), previousSeat: z.string().optional() }).passthrough();
export const AdminBlacklistApiResponseSchema = z.array(AdminBlacklistApiRecordSchema);
export type AdminBlacklistValidationKey = 'VALIDATION_NAME_REQUIRED' | 'VALIDATION_PHONE_REQUIRED' | 'VALIDATION_PHONE_FORMAT' | 'VALIDATION_REASON_REQUIRED';
export type AdminBlacklistTranslate = (key: AdminBlacklistValidationKey) => string;

const ADMIN_BLACKLIST_VALIDATION_ENGLISH: Record<AdminBlacklistValidationKey, string> = {
  VALIDATION_NAME_REQUIRED: 'Student name is required.',
  VALIDATION_PHONE_REQUIRED: 'Enter a valid phone number.',
  VALIDATION_PHONE_FORMAT: 'Enter a phone number with 10–15 digits.',
  VALIDATION_REASON_REQUIRED: 'Reason is required.',
};

export function createAdminBlacklistFormSchema(t: AdminBlacklistTranslate) {
  return z.object({
    name: z.string().trim().min(1, t('VALIDATION_NAME_REQUIRED')),
    phone: z.string().trim().min(10, t('VALIDATION_PHONE_REQUIRED')).refine((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15;
    }, t('VALIDATION_PHONE_FORMAT')),
    reason: z.string().trim().min(1, t('VALIDATION_REASON_REQUIRED')),
    previousSeat: z.string().trim(),
  });
}
export const AdminBlacklistFormSchema = createAdminBlacklistFormSchema((key) => ADMIN_BLACKLIST_VALIDATION_ENGLISH[key]);
export type AdminBlacklistFormSchemaType = z.infer<typeof AdminBlacklistFormSchema>;
