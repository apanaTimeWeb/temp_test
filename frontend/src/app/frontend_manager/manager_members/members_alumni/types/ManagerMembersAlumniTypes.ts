import type { z } from 'zod';
import type { ManagerStudentSchema } from '@/app/frontend_manager/manager_members/members_alumni/schemas/ManagerMembersAlumniSchema';

export type ManagerStudent = z.infer<typeof ManagerStudentSchema>;
export type ManagerStudentFetchState = 'loading' | 'success' | 'error';
