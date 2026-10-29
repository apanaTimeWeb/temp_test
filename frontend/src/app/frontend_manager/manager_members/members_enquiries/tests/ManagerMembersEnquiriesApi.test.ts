import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/lib/api';
import { fetchManagerMembersEnquiries, fetchManagerEnquiriesEnquiryById, createManagerEnquiriesEnquiryFollowUp, createManagerEnquiriesEnquiry, updateManagerEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.api';
import { managerCrmEnquiryResponseSchema, managerCrmNormalizedEnquirySchema } from '@/app/frontend_manager/manager_members/members_enquiries/schemas/ManagerMembersEnquiriesSchema';
import { MANAGER_MEMBERS_ENQUIRIES_API } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import { getManagerEnquiriesMockEnquiries, getManagerEnquiriesMockEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/mocks/manager_members_enquiries_fixtures/ManagerMembersEnquiriesFixtures';

vi.mock('@/lib/api', () => ({ apiFetch: vi.fn() }));
const managerCrmApiFetchMock = vi.mocked(apiFetch);

describe('CRM mock read contract', () => {
  it('keeps the mock list response compatible with the read API parser', () => {
    expect(managerCrmEnquiryResponseSchema.safeParse(getManagerEnquiriesMockEnquiries()).success).toBe(true);
  });

  it('keeps the mock detail response compatible with the normalized response schema', () => {
    const enquiryId = getManagerEnquiriesMockEnquiries()[0]?.id;
    expect(enquiryId).toBeDefined();
    if (!enquiryId) return;
    expect(managerCrmNormalizedEnquirySchema.safeParse(getManagerEnquiriesMockEnquiry(enquiryId)).success).toBe(true);
  });
});

describe('CRM read API success paths', () => {
  beforeEach(() => vi.resetAllMocks());
  it('fetches and normalizes the list response', async () => {
    managerCrmApiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: getManagerEnquiriesMockEnquiries(), requestId: 'test-list' });
    const result = await fetchManagerMembersEnquiries();
    expect(result.length).toBeGreaterThan(0);
    expect(managerCrmApiFetchMock).toHaveBeenCalledWith(MANAGER_MEMBERS_ENQUIRIES_API.LIST);
    expect(result[0].name).toBe(getManagerEnquiriesMockEnquiries()[0].name);
  });
  it('fetches and normalizes a detail response for the selected resource ID', async () => {
    const source = getManagerEnquiriesMockEnquiries()[0];
    managerCrmApiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: getManagerEnquiriesMockEnquiry(source.id), requestId: 'test-detail' });
    const result = await fetchManagerEnquiriesEnquiryById(source.id);
    expect(result.id).toBe(source.id);
    expect(managerCrmApiFetchMock).toHaveBeenCalledWith(MANAGER_MEMBERS_ENQUIRIES_API.DETAIL(source.id));
  });
});

describe('CRM mutation contract guard', () => {
  beforeEach(() => vi.resetAllMocks());

  it('blocks enquiry creation without issuing a request', async () => {
    await expect(createManagerEnquiriesEnquiry({ name: 'Test Student', phone: '9876543210' })).rejects.toThrow(/BLOCKED BY SUPPLIED SCOPE/);
    expect(managerCrmApiFetchMock).not.toHaveBeenCalled();
  });

  it('blocks status updates without issuing a request', async () => {
    await expect(updateManagerEnquiriesEnquiryStatus('enq-test-1', 'Visited')).rejects.toThrow(/BLOCKED BY SUPPLIED SCOPE/);
    expect(managerCrmApiFetchMock).not.toHaveBeenCalled();
  });

  it('blocks follow-ups without issuing a request', async () => {
    await expect(createManagerEnquiriesEnquiryFollowUp('enq-test-1', { date: '2026-10-13', remark: 'Call back' })).rejects.toThrow(/BLOCKED BY SUPPLIED SCOPE/);
    expect(managerCrmApiFetchMock).not.toHaveBeenCalled();
  });
});

describe('CRM API response envelope failures', () => {
  beforeEach(() => vi.resetAllMocks());

  it('propagates list failure metadata rather than parsing null data', async () => {
    managerCrmApiFetchMock.mockResolvedValueOnce({ success: false, message: 'CRM service unavailable', data: null, errorCode: 'CRM_UNAVAILABLE', statusCode: 503, requestId: 'test-failure' });
    await expect(fetchManagerMembersEnquiries()).rejects.toThrow('CRM service unavailable');
  });
});
