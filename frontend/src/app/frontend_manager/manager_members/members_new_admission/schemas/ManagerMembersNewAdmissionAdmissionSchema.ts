import { z } from 'zod';

export const ManagerMembersNewAdmissionAdmissionSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit mobile number starting with 6-9'),
  email: z.string().trim().email('Valid email required').optional().or(z.literal('')),
  gender: z.string().min(1, 'Please select a gender'),
  dob: z.string().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z
    .string()
    .trim()
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: 'Parent phone must be a valid 10-digit mobile number',
    })
    .optional()
    .or(z.literal('')),
  college: z.string().optional(),
  preparationFor: z.string().optional(),
  avatar: z.string().optional(),
  photoUrl: z.string().optional(),
  branch: z.string().optional(),
  bloodGroup: z.string().optional(),
  medicalIssues: z.string().optional(),
  disability: z.string().optional(),
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
  documents: z.array(z.object({
    id: z.string(),
    type: z.string(),
    number: z.string().optional(),
    fileName: z.string(),
    status: z.enum(['Verified', 'Pending', 'Rejected']).default('Verified'),
    uploadDate: z.string(),
  })).optional(),
});

export type ManagerMembersNewAdmissionAdmissionFormValues = z.infer<typeof ManagerMembersNewAdmissionAdmissionSchema>;
