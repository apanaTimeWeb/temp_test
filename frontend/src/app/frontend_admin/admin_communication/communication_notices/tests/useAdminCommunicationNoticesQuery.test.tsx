import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useQueryHook from '@/app/frontend_admin/admin_communication/communication_notices/hooks/useAdminCommunicationNoticesQuery';

import adminNavigationEn from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_en.json';
import adminNavigationHi from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_hi.json';
const { fetchAdminCommunicationNoticesMock } = vi.hoisted(() => ({ fetchAdminCommunicationNoticesMock: vi.fn() }));
vi.mock('@/app/frontend_admin/admin_communication/communication_notices/api/admin_communication_notices_api', () => ({ fetchAdminCommunicationNotices: fetchAdminCommunicationNoticesMock }));

function createWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return { client, wrapper };
}

afterEach(() => {
  fetchAdminCommunicationNoticesMock.mockReset();
});

describe('useAdminCommunicationNoticesQuery', () => {
  it('loads list data through the module API adapter', async () => {
    fetchAdminCommunicationNoticesMock.mockResolvedValue([]);
    const { client, wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useQueryHook(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
    expect(fetchAdminCommunicationNoticesMock).toHaveBeenCalledTimes(1);

    unmount();
    client.clear();
  });
});

describe('route loading/error boundary localization contract', () => {
  it('uses only keys present in the shared English and Hindi ADMIN_NAVIGATION catalogs', () => {
    for (const messages of [adminNavigationEn.ADMIN_NAVIGATION, adminNavigationHi.ADMIN_NAVIGATION]) {
      expect(messages).toHaveProperty('ROUTE_ERROR_TITLE');
      expect(messages).toHaveProperty('ROUTE_ERROR_DESCRIPTION');
      expect(messages).toHaveProperty('ROUTE_ERROR_RETRY');
      expect(messages).toHaveProperty('LOADING_PAGE');
    }
  });
});
