import { apiFetch, type ApiResponse } from '@/lib/api';
import {
  ManagerStudentDetailResponseSchema,
  ManagerMembersIdCardGeneratorListResponseSchema,
} from '@/app/frontend_manager/manager_members/members_id_card_generator/schemas/ManagerMembersIdCardGeneratorSchema';
import { MANAGER_MEMBERS_ID_CARD_GENERATOR_API } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.url_config';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorTypes';

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

export async function fetchManagerIdCardGenerator(): Promise<ManagerStudent[]> {
  const response = await apiFetch<unknown>(MANAGER_MEMBERS_ID_CARD_GENERATOR_API.LIST);
  const data = unwrapManagerApiResponse(response, 'Unable to load student records.');
  return ManagerMembersIdCardGeneratorListResponseSchema.parse(data);
}

export async function fetchManagerStudentById(id: string): Promise<ManagerStudent> {
  const response = await apiFetch<unknown>(MANAGER_MEMBERS_ID_CARD_GENERATOR_API.DETAIL(id));
  const data = unwrapManagerApiResponse(response, 'Unable to load the selected student.');
  return ManagerStudentDetailResponseSchema.parse(data);
}

export async function createManagerStudent(_payload: unknown): Promise<never> {
  // No request or response schema is asserted: the authoritative admission API contract was not supplied.
  throw new Error('BLOCKED BY SUPPLIED SCOPE: student admission API contract is unavailable.');
}
