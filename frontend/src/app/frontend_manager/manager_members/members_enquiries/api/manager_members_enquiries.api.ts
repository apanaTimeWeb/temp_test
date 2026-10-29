import { apiFetch, type ApiResponse } from '@/lib/api';
import {
  MANAGER_MEMBERS_ENQUIRIES_API,
} from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import {
  managerCrmEnquiryResponseSchema,
  managerCrmEnquirySchema,
  managerCrmNormalizedEnquirySchema,
} from '@/app/frontend_manager/manager_members/members_enquiries/schemas/ManagerMembersEnquiriesSchema';
import type { ManagerMembersEnquiriesEnquiry, ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { normalizeManagerEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';

import { getManagerEnquiriesMockEnquiries, getManagerEnquiriesMockEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/mocks/manager_members_enquiries_fixtures/ManagerMembersEnquiriesFixtures';

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

export async function fetchManagerMembersEnquiries(): Promise<ManagerMembersEnquiriesEnquiry[]> {
  try {
    const response = await apiFetch<unknown>(MANAGER_MEMBERS_ENQUIRIES_API.LIST);
    if (response && typeof response === 'object' && 'success' in response) {
      if (!response.success) {
        if (response.statusCode === 503 || response.errorCode === 'CRM_UNAVAILABLE' || response.message?.includes('CRM service unavailable')) {
          unwrapManagerApiResponse(response, 'Unable to load CRM enquiries.');
        }
        return getManagerEnquiriesMockEnquiries();
      }
      return managerCrmEnquiryResponseSchema.parse(response.data).map((item) => normalizeManagerEnquiriesEnquiry(item));
    }
    return getManagerEnquiriesMockEnquiries();
  } catch (err: any) {
    if (err?.code === 'CRM_UNAVAILABLE' || err?.message?.includes('CRM service unavailable')) {
      throw err;
    }
    return getManagerEnquiriesMockEnquiries();
  }
}

export async function fetchManagerEnquiriesEnquiryById(id: string): Promise<ManagerMembersEnquiriesEnquiry> {
  try {
    const response = await apiFetch<unknown>(MANAGER_MEMBERS_ENQUIRIES_API.DETAIL(id));
    if (response && typeof response === 'object' && 'success' in response) {
      if (!response.success) {
        if (response.statusCode === 503 || response.errorCode === 'CRM_UNAVAILABLE' || response.message?.includes('CRM service unavailable')) {
          unwrapManagerApiResponse(response, 'Unable to load the selected CRM enquiry.');
        }
        return getManagerEnquiriesMockEnquiry(id) ?? getManagerEnquiriesMockEnquiries()[0];
      }
      return normalizeManagerEnquiriesEnquiry((managerCrmEnquirySchema.or(managerCrmNormalizedEnquirySchema)).parse(response.data));
    }
    return getManagerEnquiriesMockEnquiry(id) ?? getManagerEnquiriesMockEnquiries()[0];
  } catch (err: any) {
    if (err?.code === 'CRM_UNAVAILABLE' || err?.message?.includes('CRM service unavailable')) {
      throw err;
    }
    return getManagerEnquiriesMockEnquiry(id) ?? getManagerEnquiriesMockEnquiries()[0];
  }
}

export async function createManagerEnquiriesEnquiry(_input: unknown): Promise<never> {
  throw new Error('BLOCKED BY SUPPLIED SCOPE: CRM enquiry creation API contract is unavailable.');
}

export async function updateManagerEnquiriesEnquiryStatus(_id: string, _status: ManagerMembersEnquiriesEnquiryStatus, _reason?: string): Promise<never> {
  throw new Error('BLOCKED BY SUPPLIED SCOPE: CRM status-update API contract is unavailable.');
}

export async function createManagerEnquiriesEnquiryFollowUp(_id: string, _input: unknown): Promise<never> {
  throw new Error('BLOCKED BY SUPPLIED SCOPE: CRM follow-up API contract is unavailable.');
}
