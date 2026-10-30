import { z } from 'zod';

export const AdminSystemAutoScaleSchema = z.object({
  seatThreshold: z.number().int().min(50).max(99),
  lockerThreshold: z.number().int().min(50).max(99),
  alertEnabled: z.boolean(),
});
export type AdminSystemAutoScaleFormValues = z.infer<typeof AdminSystemAutoScaleSchema>;
