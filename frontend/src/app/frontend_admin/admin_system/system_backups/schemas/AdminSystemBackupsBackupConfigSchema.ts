import { z } from 'zod';

export interface AdminSystemBackupConfigValidationMessages {
  backupTimeInvalid: string;
  retentionMinimum: string;
  retentionMaximum: string;
  cloudProviderInvalid: string;
}

const DEFAULT_MESSAGES: AdminSystemBackupConfigValidationMessages = {
  backupTimeInvalid: 'Enter a valid 24-hour time',
  retentionMinimum: 'Retention must be at least 7 days',
  retentionMaximum: 'Retention cannot exceed 365 days',
  cloudProviderInvalid: 'Choose a supported cloud provider',
};

export function createAdminSystemBackupConfigSchema(messages: AdminSystemBackupConfigValidationMessages) {
  return z.object({
    backupTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, messages.backupTimeInvalid),
    retention: z.number().int().min(7, messages.retentionMinimum).max(365, messages.retentionMaximum),
    cloudProvider: z.enum(['Google Drive', 'AWS S3', 'Dropbox', 'Custom S3-Compatible'], { errorMap: () => ({ message: messages.cloudProviderInvalid }) }),
  });
}

export const AdminSystemBackupConfigSchema = createAdminSystemBackupConfigSchema(DEFAULT_MESSAGES);
export type AdminSystemBackupConfigFormValues = z.infer<typeof AdminSystemBackupConfigSchema>;
