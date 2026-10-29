import { z } from 'zod';
import { MANAGER_STUDENT_STATUSES } from '@/app/frontend_manager/manager_members/members_id_card_generator/constants/ManagerMembersIdCardGeneratorConstants';

export const ManagerStudentSchema = z.object({
  id: z.string().min(1),
  smartId: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(7),
  shift: z.string().min(1),
  seat: z.string().min(1),
  status: z.enum(MANAGER_STUDENT_STATUSES),
  plan: z.string().min(1),
  dueMinor: z.number().int().nonnegative(),
  currency: z.string().regex(/^[A-Z]{3}$/).refine((code) => { try { new Intl.NumberFormat('en', { style: 'currency', currency: code }); return true; } catch { return false; } }, 'invalid_currency_code'),
  joined: z.string().min(1),
  branch: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const ManagerMembersIdCardGeneratorListResponseSchema = z.array(ManagerStudentSchema);
export const ManagerStudentDetailResponseSchema = ManagerStudentSchema;

