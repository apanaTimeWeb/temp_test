import { z } from 'zod';

export const ManagerMembersGroupAdmissionAdmissionSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit mobile number starting with 6-9'),
  shift: z.string().min(1, 'Select a shift'),
  seat: z.string().min(1, 'Select a seat'),
  locker: z.string().optional().or(z.literal('')),
  plan: z.string().min(1, 'Select a plan'),
  manualDiscount: z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, 'Discount must be a valid INR amount').refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, 'Discount cannot be negative'),
  amountPaid: z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, 'Amount paid must be a valid INR amount').refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'Amount paid is required'),
  paymentMode: z.string().optional().or(z.literal('')),
});

export type ManagerMembersGroupAdmissionAdmissionFormValues = z.infer<typeof ManagerMembersGroupAdmissionAdmissionSchema>;
