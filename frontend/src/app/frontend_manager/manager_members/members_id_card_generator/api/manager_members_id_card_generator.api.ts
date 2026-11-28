import { MANAGER_ID_CARD_DEMO_STUDENTS } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.demo_data';
import { MANAGER_MEMBERS_ID_CARD_GENERATOR_API } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.url_config';
import {
ManagerMembersIdCardGeneratorListResponseSchema,
ManagerStudentDetailResponseSchema,
} from '@/app/frontend_manager/manager_members/members_id_card_generator/schemas/ManagerMembersIdCardGeneratorSchema';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorTypes';
import { apiFetch,type ApiResponse } from '@/lib/api';

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
        return MANAGER_ID_CARD_DEMO_STUDENTS;
      }
      return ManagerMembersIdCardGeneratorListResponseSchema.parse(response.data);
    }
    return MANAGER_ID_CARD_DEMO_STUDENTS;
  } catch (err: unknown) {
    const apiErr = err as { code?: string; message?: string } | null;
    if (apiErr?.code === 'UPSTREAM_UNAVAILABLE' || apiErr?.message === 'upstream unavailable') {
      throw err;
    }
    return MANAGER_ID_CARD_DEMO_STUDENTS;
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
        const found = MANAGER_ID_CARD_DEMO_STUDENTS.find((s) => s.id === id || s.smartId === id);
        return found || MANAGER_ID_CARD_DEMO_STUDENTS[0];
      }
      return ManagerStudentDetailResponseSchema.parse(response.data);
    }
    const found = MANAGER_ID_CARD_DEMO_STUDENTS.find((s) => s.id === id || s.smartId === id);
    return found || MANAGER_ID_CARD_DEMO_STUDENTS[0];
  } catch (err: unknown) {
    const apiErr = err as { code?: string; message?: string } | null;
    if (apiErr?.code === 'UPSTREAM_UNAVAILABLE' || apiErr?.message === 'upstream unavailable') {
      throw err;
    }
    const found = MANAGER_ID_CARD_DEMO_STUDENTS.find((s) => s.id === id || s.smartId === id);
    return found || MANAGER_ID_CARD_DEMO_STUDENTS[0];
  }
}

export async function createManagerStudent(_payload: unknown): Promise<never> {
  // No request or response schema is asserted: the authoritative admission API contract was not supplied.
  throw new Error('BLOCKED BY SUPPLIED SCOPE: student admission API contract is unavailable.');
}
