import type { z } from 'zod';
import type { ManagerStudentSchema } from '@/app/frontend_manager/manager_members/members_group_admission/schemas/ManagerMembersGroupAdmissionSchema';

export type ManagerStudent = z.infer<typeof ManagerStudentSchema>;
export type ManagerStudentFetchState = 'loading' | 'success' | 'error';
