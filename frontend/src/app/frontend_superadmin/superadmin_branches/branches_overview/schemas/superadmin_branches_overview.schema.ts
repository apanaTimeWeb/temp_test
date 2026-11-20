// RESPONSIBILITY: Zod validation schemas for Superadmin Branch Management forms and actions.
import { z } from 'zod';

export const SuperadminBranchCreateSchema = z.object({
  name: z.string().min(3, 'Branch name must be at least 3 characters').max(100, 'Branch name cannot exceed 100 characters'),
  code: z.string().min(2, 'Branch code must be at least 2 characters').max(12, 'Branch code cannot exceed 12 characters').regex(/^[A-Z0-9_-]+$/, 'Code must contain uppercase letters, numbers, or dashes'),
  libraryId: z.string().min(1, 'Please select a parent library account'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Valid street address is required'),
  capacity: z.number().int().min(10, 'Minimum capacity is 10 seats').max(5000, 'Maximum capacity is 5000 seats'),
  shifts: z.number().int().min(1, 'At least 1 daily shift is required').max(6, 'Maximum 6 daily shifts allowed'),
  managerName: z.string().min(2, 'Branch manager name is required'),
  managerPhone: z.string().min(10, 'Valid 10-digit mobile number is required'),
  managerEmail: z.string().email('Valid email address is required'),
  openingDate: z.string().min(1, 'Opening date is required'),
  workingHours: z.string().min(1, 'Working hours are required'),
  weeklyHolidays: z.string().optional(),
  status: z.enum(['active', 'suspended', 'deactivated', 'closed']).default('active'),
  allowedModules: z.array(z.string()).default(['catalog', 'circulation', 'seats', 'fees']),
});

export type SuperadminBranchCreateFormValues = z.infer<typeof SuperadminBranchCreateSchema>;

export const SuperadminBranchTransferManagerSchema = z.object({
  branchId: z.string().min(1, 'Branch ID is required'),
  newManagerName: z.string().min(2, 'New manager name is required'),
  newManagerEmail: z.string().email('Valid email is required'),
  newManagerPhone: z.string().min(10, 'Valid phone number is required'),
  reason: z.string().min(5, 'Mandatory audit justification is required (min 5 characters)'),
});

export type SuperadminBranchTransferManagerFormValues = z.infer<typeof SuperadminBranchTransferManagerSchema>;

export const SuperadminBranchCloseSafetySchema = z.object({
  branchId: z.string().min(1, 'Branch ID is required'),
  outstandingBooks: z.number().max(0, 'All books must be returned or written off before closing'),
  memberDues: z.number().max(0, 'All member dues must be settled (₹0) before closing'),
  closureNotes: z.string().min(5, 'Mandatory closure reason and archival justification required'),
});

export type SuperadminBranchCloseSafetyFormValues = z.infer<typeof SuperadminBranchCloseSafetySchema>;
