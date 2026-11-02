import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useQueryHook from '@/app/frontend_admin/admin_communication/communication_complaints/hooks/useAdminCommunicationComplaintsQuery';
import { ADMIN_COMMUNICATION_COMPLAINT_STATUS, getAdminCommunicationComplaintStatus } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';

import adminNavigationEn from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_en.json';
import adminNavigationHi from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_hi.json';
const { fetchAdminCommunicationComplaintsMock } = vi.hoisted(() => ({ fetchAdminCommunicationComplaintsMock: vi.fn() }));
vi.mock('@/app/frontend_admin/admin_communication/communication_complaints/api/admin_communication_complaints_api', () => ({ fetchAdminCommunicationComplaints: fetchAdminCommunicationComplaintsMock }));

function createWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return { client, wrapper };
}

afterEach(() => { fetchAdminCommunicationComplaintsMock.mockReset(); });

describe('useAdminCommunicationComplaintsQuery', () => {
  it('loads list data through the module API adapter', async () => {
    fetchAdminCommunicationComplaintsMock.mockResolvedValue([]);
    const { client, wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useQueryHook(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
    expect(fetchAdminCommunicationComplaintsMock).toHaveBeenCalledTimes(1);
    unmount(); client.clear();
  });
});

describe('getAdminCommunicationComplaintStatus', () => {
  it('maps fixture-style status casing to a known UI status', () => {
    expect(getAdminCommunicationComplaintStatus('Open')).toBe(ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN);
    expect(getAdminCommunicationComplaintStatus('RESOLVED')).toBe(ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED);
  });
  it('normalizes supported In Progress spelling variations', () => {
    expect(getAdminCommunicationComplaintStatus('In Progress')).toBe(ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS);
    expect(getAdminCommunicationComplaintStatus('in-progress')).toBe(ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS);
    expect(getAdminCommunicationComplaintStatus('IN_PROGRESS')).toBe(ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS);
  });
  it('does not silently reinterpret unknown backend status values', () => {
    expect(getAdminCommunicationComplaintStatus('awaiting_manager')).toBe('Unknown');
    expect(getAdminCommunicationComplaintStatus('')).toBe('Unknown');
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
