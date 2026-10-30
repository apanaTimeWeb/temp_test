import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminCouponsListQuery } from '@/app/frontend_admin/admin_members/members_coupons/hooks/useAdminMembersCouponsPageHooks';
import { ADMIN_COUPONS_API_FIXTURE } from '@/app/frontend_admin/admin_members/members_coupons/mocks/scenarios/admin_members_coupons.scenarios';

const { fetchAdminCouponsMock, mapAdminCouponsApiRecordsMock, demoModeMock } = vi.hoisted(() => ({
  fetchAdminCouponsMock: vi.fn(),
  mapAdminCouponsApiRecordsMock: vi.fn(),
  demoModeMock: vi.fn(),
}));
vi.mock('@/app/frontend_admin/admin_members/members_coupons/api/admin_members_coupons_api', () => ({
  fetchAdminCoupons: fetchAdminCouponsMock,
  mapAdminCouponsApiRecords: mapAdminCouponsApiRecordsMock,
}));
vi.mock('@/app/frontend_admin/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: demoModeMock }));

function createWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return { client, wrapper };
}

beforeEach(() => {
  fetchAdminCouponsMock.mockReset();
  mapAdminCouponsApiRecordsMock.mockReset();
  demoModeMock.mockReset();
});
afterEach(() => vi.clearAllMocks());

describe('useAdminCouponsListQuery', () => {
  it('loads live data only through the guarded module API adapter', async () => {
    demoModeMock.mockReturnValue(false);
    fetchAdminCouponsMock.mockResolvedValue([]);
    const { client, wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useAdminCouponsListQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
    expect(fetchAdminCouponsMock).toHaveBeenCalledTimes(1);
    expect(mapAdminCouponsApiRecordsMock).not.toHaveBeenCalled();
    expect(client.getQueryCache().getAll()[0]?.queryKey).toEqual(['admin_coupons', 'list', { mode: 'live' }]);
    unmount();
    client.clear();
  });

  it('uses only the validated module demo fixture in demo mode and separates the cache key', async () => {
    demoModeMock.mockReturnValue(true);
    const mappedFixture = [{ id: 'demo-coupon', code: 'DEMO', discount: 10, type: 'Percent', status: 'Active' }];
    mapAdminCouponsApiRecordsMock.mockReturnValue(mappedFixture);
    const { client, wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useAdminCouponsListQuery(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mappedFixture);
    expect(mapAdminCouponsApiRecordsMock).toHaveBeenCalledWith(ADMIN_COUPONS_API_FIXTURE);
    expect(fetchAdminCouponsMock).not.toHaveBeenCalled();
    expect(client.getQueryCache().getAll()[0]?.queryKey).toEqual(['admin_coupons', 'list', { mode: 'demo' }]);
    unmount();
    client.clear();
  });
});
