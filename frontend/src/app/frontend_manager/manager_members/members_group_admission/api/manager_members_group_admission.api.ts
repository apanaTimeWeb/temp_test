import { apiFetch, type ApiResponse } from '@/lib/api';
import {
  ManagerStudentDetailResponseSchema,
  ManagerMembersGroupAdmissionListResponseSchema,
} from '@/app/frontend_manager/manager_members/members_group_admission/schemas/ManagerMembersGroupAdmissionSchema';
import { MANAGER_MEMBERS_GROUP_ADMISSION_API } from '@/app/frontend_manager/manager_members/members_group_admission/config/manager_members_group_admission.url_config';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionTypes';

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

export async function fetchManagerGroupAdmission(): Promise<ManagerStudent[]> {
  const response = await apiFetch<unknown>(MANAGER_MEMBERS_GROUP_ADMISSION_API.LIST);
  const data = unwrapManagerApiResponse(response, 'Unable to load student records.');
  return ManagerMembersGroupAdmissionListResponseSchema.parse(data);
}

export async function fetchManagerStudentById(id: string): Promise<ManagerStudent> {
  const response = await apiFetch<unknown>(MANAGER_MEMBERS_GROUP_ADMISSION_API.DETAIL(id));
  const data = unwrapManagerApiResponse(response, 'Unable to load the selected student.');
  return ManagerStudentDetailResponseSchema.parse(data);
}

export async function createManagerStudent(_payload: unknown): Promise<never> {
  // No request or response schema is asserted: the authoritative admission API contract was not supplied.
  throw new Error('BLOCKED BY SUPPLIED SCOPE: student admission API contract is unavailable.');
}
