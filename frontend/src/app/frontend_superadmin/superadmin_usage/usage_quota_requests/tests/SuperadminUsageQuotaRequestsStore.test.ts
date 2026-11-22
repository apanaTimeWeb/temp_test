import { describe, it, expect, beforeEach } from 'vitest';
import { useSuperadminUsageQuotaRequestsStore } from '../state/useSuperadminUsageQuotaRequestsStore';
import { MOCK_QUOTA_REQUESTS_LIST } from '../mocks/fixtures/superadmin_usage_quota_requests.fixtures';

describe('useSuperadminUsageQuotaRequestsStore', () => {
  beforeEach(() => {
    useSuperadminUsageQuotaRequestsStore.getState().resetFilters();
    useSuperadminUsageQuotaRequestsStore.getState().closeApproveModal();
    useSuperadminUsageQuotaRequestsStore.getState().closeRejectModal();
  });

  it('initializes with default filter and modal states', () => {
    const state = useSuperadminUsageQuotaRequestsStore.getState();
    expect(state.search).toBe('');
    expect(state.status).toBe('ALL');
    expect(state.resourceType).toBe('ALL');
    expect(state.selectedRequest).toBeNull();
    expect(state.isApproveModalOpen).toBe(false);
    expect(state.isRejectModalOpen).toBe(false);
  });

  it('sets search and filter dropdown values', () => {
    const store = useSuperadminUsageQuotaRequestsStore.getState();
    store.setSearch('Nalanda');
    store.setStatus('PENDING');
    store.setResourceType('BRANCH');

    const updated = useSuperadminUsageQuotaRequestsStore.getState();
    expect(updated.search).toBe('Nalanda');
    expect(updated.status).toBe('PENDING');
    expect(updated.resourceType).toBe('BRANCH');
  });

  it('manages approve modal state and selected request', () => {
    const sample = MOCK_QUOTA_REQUESTS_LIST[0];
    const store = useSuperadminUsageQuotaRequestsStore.getState();

    store.openApproveModal(sample);
    expect(useSuperadminUsageQuotaRequestsStore.getState().selectedRequest?.id).toBe(sample.id);
    expect(useSuperadminUsageQuotaRequestsStore.getState().isApproveModalOpen).toBe(true);

    store.closeApproveModal();
    expect(useSuperadminUsageQuotaRequestsStore.getState().selectedRequest).toBeNull();
    expect(useSuperadminUsageQuotaRequestsStore.getState().isApproveModalOpen).toBe(false);
  });

  it('manages reject modal state and selected request', () => {
    const sample = MOCK_QUOTA_REQUESTS_LIST[1];
    const store = useSuperadminUsageQuotaRequestsStore.getState();

    store.openRejectModal(sample);
    expect(useSuperadminUsageQuotaRequestsStore.getState().selectedRequest?.id).toBe(sample.id);
    expect(useSuperadminUsageQuotaRequestsStore.getState().isRejectModalOpen).toBe(true);

    store.closeRejectModal();
    expect(useSuperadminUsageQuotaRequestsStore.getState().selectedRequest).toBeNull();
    expect(useSuperadminUsageQuotaRequestsStore.getState().isRejectModalOpen).toBe(false);
  });
});
