import { z } from 'zod';

export const ManagerMembersGroupAdmissionAdmissionSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  phone: z.string().trim().min(10, 'Valid phone number required'),
  shift: z.string().min(1, 'Select a shift'),
  seat: z.string().min(1, 'Select a seat'),
  locker: z.string().min(1),
  plan: z.string().min(1, 'Select a plan'),
  manualDiscount: z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, 'Discount must be a valid INR amount').refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, 'Discount cannot be negative'),
  amountPaid: z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, 'Amount paid must be a valid INR amount').refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'Amount paid is required'),
  paymentMode: z.string().min(1, 'Payment mode is unavailable until the host contract is supplied'),
});

export type ManagerMembersGroupAdmissionAdmissionFormValues = z.infer<typeof ManagerMembersGroupAdmissionAdmissionSchema>;
