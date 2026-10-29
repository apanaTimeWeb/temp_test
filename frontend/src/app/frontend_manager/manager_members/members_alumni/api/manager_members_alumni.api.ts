import { apiFetch, type ApiResponse } from '@/lib/api';
import {
  ManagerStudentDetailResponseSchema,
  ManagerMembersAlumniListResponseSchema,
} from '@/app/frontend_manager/manager_members/members_alumni/schemas/ManagerMembersAlumniSchema';
import { MANAGER_MEMBERS_ALUMNI_API } from '@/app/frontend_manager/manager_members/members_alumni/config/manager_members_alumni.url_config';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniTypes';

function unwrapManagerApiResponse<T>(response: ApiResponse<T>, fallbackMessage: string): T {
  if (!response.success) {
    throw Object.assign(new Error(response.message || fallbackMessage), {
      code: response.errorCode,
      status: response.statusCode,
      requestId: response.requestId,
    });
  }
  return response.data;
}

export async function fetchManagerAlumni(): Promise<ManagerStudent[]> {
  const response = await apiFetch<unknown>(MANAGER_MEMBERS_ALUMNI_API.LIST);
  const data = unwrapManagerApiResponse(response, 'Unable to load student records.');
  return ManagerMembersAlumniListResponseSchema.parse(data);
}

export async function fetchManagerStudentById(id: string): Promise<ManagerStudent> {
  const response = await apiFetch<unknown>(MANAGER_MEMBERS_ALUMNI_API.DETAIL(id));
  const data = unwrapManagerApiResponse(response, 'Unable to load the selected student.');
  return ManagerStudentDetailResponseSchema.parse(data);
}

export async function createManagerStudent(_payload: unknown): Promise<never> {
  // No request or response schema is asserted: the authoritative admission API contract was not supplied.
  throw new Error('BLOCKED BY SUPPLIED SCOPE: student admission API contract is unavailable.');
}
