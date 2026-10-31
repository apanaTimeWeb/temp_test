import { z } from 'zod';

export const ManagerMembersNewAdmissionAdmissionSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  phone: z.string().trim().min(10, 'Valid phone number required'),
  email: z.string().trim().email('Valid email required').optional().or(z.literal('')),
  gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  college: z.string().optional(),
  preparationFor: z.string().optional(),
  avatar: z.string().optional(),
  floor: z.string().optional(),
  shift: z.string().min(1, 'Select a shift'),
  seat: z.string().min(1, 'Select a seat'),
  locker: z.string().optional(),
  plan: z.string().min(1, 'Select a plan'),
  couponCode: z.string().optional(),
  manualDiscount: z.string().optional(),
  amountPaid: z.string().trim().min(1, 'Amount paid is required'),
  paymentMode: z.string().min(1, 'Payment mode is required'),
  remarks: z.string().optional(),
  referredBy: z.string().optional(),
});

export type ManagerMembersNewAdmissionAdmissionFormValues = z.infer<typeof ManagerMembersNewAdmissionAdmissionSchema>;
