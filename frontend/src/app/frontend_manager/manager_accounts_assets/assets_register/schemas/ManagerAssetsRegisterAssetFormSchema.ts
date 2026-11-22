import { z } from 'zod';

export const managerAssetsRegisterAssetFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Asset name must be at least 2 characters.'),
  category: z.enum(['Appliance', 'Electronics', 'Furniture', 'Security'], {
    errorMap: () => ({ message: 'Please select a valid category.' }),
  }),
  purchaseValue: z.preprocess(
    (val) => {
      if (val === '' || val === undefined || val === null) return 0;
      const num = Number(val);
      return isNaN(num) ? -1 : num;
    },
    z
      .number({ invalid_type_error: 'Purchase cost must be a valid number.' })
      .positive('Purchase cost must be greater than zero.')
  ),
  location: z
    .string()
    .trim()
    .min(1, 'Installation location is required.')
    .default('Main Branch Hall'),
  purchaseDate: z
    .string()
    .trim()
    .min(1, 'Purchase date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Purchase date must be in YYYY-MM-DD format.'),
  status: z.enum(['active', 'maintenance', 'disposed']).default('active'),
});

export type ManagerAssetsRegisterAssetFormData = z.infer<typeof managerAssetsRegisterAssetFormSchema>;

