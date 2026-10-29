import type { z } from 'zod';
import type { ManagerStudentSchema } from '@/app/frontend_manager/manager_members/members_id_card_generator/schemas/ManagerMembersIdCardGeneratorSchema';

export type ManagerStudent = z.infer<typeof ManagerStudentSchema>;
export type ManagerStudentFetchState = 'loading' | 'success' | 'error';
