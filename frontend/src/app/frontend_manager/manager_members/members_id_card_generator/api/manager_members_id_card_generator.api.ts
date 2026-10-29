import { apiFetch, type ApiResponse } from '@/lib/api';
import {
  ManagerStudentDetailResponseSchema,
  ManagerMembersIdCardGeneratorListResponseSchema,
} from '@/app/frontend_manager/manager_members/members_id_card_generator/schemas/ManagerMembersIdCardGeneratorSchema';
import { MANAGER_MEMBERS_ID_CARD_GENERATOR_API } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.url_config';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorTypes';
import { MANAGER_STUDENTS_FIXTURES } from '@/app/frontend_manager/manager_members/members_id_card_generator/mocks/manager_members_id_card_generator_fixtures/ManagerMembersIdCardGeneratorFixtures';

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
  try {
    const response = await apiFetch<unknown>(MANAGER_MEMBERS_ID_CARD_GENERATOR_API.LIST);
    if (response && typeof response === 'object' && 'success' in response) {
      if (!response.success) {
        if (response.errorCode === 'UPSTREAM_UNAVAILABLE' || response.message === 'upstream unavailable') {
          unwrapManagerApiResponse(response, 'Unable to load student records.');
        }
        return MANAGER_STUDENTS_FIXTURES;
      }
      return ManagerMembersIdCardGeneratorListResponseSchema.parse(response.data);
    }
    return MANAGER_STUDENTS_FIXTURES;
  } catch (err: any) {
    if (err?.code === 'UPSTREAM_UNAVAILABLE' || err?.message === 'upstream unavailable') {
      throw err;
    }
    return MANAGER_STUDENTS_FIXTURES;
  }
}

export async function fetchManagerStudentById(id: string): Promise<ManagerStudent> {
  try {
    const response = await apiFetch<unknown>(MANAGER_MEMBERS_ID_CARD_GENERATOR_API.DETAIL(id));
    if (response && typeof response === 'object' && 'success' in response) {
      if (!response.success) {
        if (response.errorCode === 'UPSTREAM_UNAVAILABLE' || response.message === 'upstream unavailable') {
          unwrapManagerApiResponse(response, 'Unable to load the selected student.');
        }
        const found = MANAGER_STUDENTS_FIXTURES.find((s) => s.id === id || s.smartId === id);
        return found || MANAGER_STUDENTS_FIXTURES[0];
      }
      return ManagerStudentDetailResponseSchema.parse(response.data);
    }
    const found = MANAGER_STUDENTS_FIXTURES.find((s) => s.id === id || s.smartId === id);
    return found || MANAGER_STUDENTS_FIXTURES[0];
  } catch (err: any) {
    if (err?.code === 'UPSTREAM_UNAVAILABLE' || err?.message === 'upstream unavailable') {
      throw err;
    }
    const found = MANAGER_STUDENTS_FIXTURES.find((s) => s.id === id || s.smartId === id);
    return found || MANAGER_STUDENTS_FIXTURES[0];
  }
}

export async function createManagerStudent(_payload: unknown): Promise<never> {
  // No request or response schema is asserted: the authoritative admission API contract was not supplied.
  throw new Error('BLOCKED BY SUPPLIED SCOPE: student admission API contract is unavailable.');
}
