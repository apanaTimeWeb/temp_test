import { z } from 'zod';

/** Validation contract for the five-field demo maintenance log form. */
export const AdminSeatsMaintenanceFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.').refine((value) => { const [year, month, day] = value.split('-').map(Number); const date = new Date(Date.UTC(year!, month! - 1, day!)); return date.getUTCFullYear() === year && date.getUTCMonth() === month! - 1 && date.getUTCDate() === day; }, 'Enter a real calendar date.'),
  remark: z.string().trim().min(1, 'Remark is required.'),
  doneBy: z.string().trim().max(120, 'Technician name is too long.'),
  newStatus: z.enum(['Working', 'Maintenance', 'Broken']),
  cost: z.string().trim().refine((value) => value === '' || (/^\d+(?:\.\d{1,2})?$/.test(value) && Number.isSafeInteger(Math.round(Number(value) * 100)) && Number(value) >= 0), 'Enter a valid non-negative amount with up to two decimal places.'),
});

export type AdminSeatsMaintenanceFormValues = z.infer<typeof AdminSeatsMaintenanceFormSchema>;
