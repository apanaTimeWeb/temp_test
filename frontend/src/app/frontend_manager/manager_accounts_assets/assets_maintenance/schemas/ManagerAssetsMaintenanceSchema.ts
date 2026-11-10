import { z } from 'zod';

export const managerAssetsMaintenanceOrderSchema = z.object({
  assetName: z
    .string()
    .trim()
    .min(1, 'Please select or enter a registered asset.'),
  issue: z
    .string()
    .trim()
    .min(3, 'Issue description must be at least 3 characters.'),
  vendor: z
    .string()
    .trim()
    .optional()
    .default(''),
  cost: z
    .preprocess(
      (val) => {
        if (val === '' || val === undefined || val === null) return 0;
        const num = Number(val);
        return isNaN(num) ? -1 : num;
      },
      z.number({ invalid_type_error: 'Cost must be a valid number.' })
        .min(0, 'Estimated cost cannot be negative.')
    ),
  scheduledDate: z
    .string()
    .trim()
    .min(1, 'Scheduled date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Scheduled date must be in YYYY-MM-DD format.'),
});

export type ManagerAssetsMaintenanceOrderFormData = z.infer<typeof managerAssetsMaintenanceOrderSchema>;

