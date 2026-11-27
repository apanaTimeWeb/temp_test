import { ADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES as ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES } from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.url_config';
import ErrorBoundary from '@/app/frontend_admin/admin_communication/communication_notification_center/error';
import Loading from '@/app/frontend_admin/admin_communication/communication_notification_center/loading';
import messages from '@/app/frontend_admin/admin_communication/communication_notification_center/locales/admin_communication_notification_center_en.json';
import { ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_notification_center/mocks/fixtures/AdminCommunicationNotificationCenterFixtures';
import { AdminCommunicationNotificationCenterHarness } from '@/app/frontend_admin/admin_communication/communication_notification_center/tests/harness/AdminCommunicationNotificationCenterHarness';
import { AdminCommunicationNotificationCenterScenarios } from '@/app/frontend_admin/admin_communication/communication_notification_center/tests/harness/bootstrap';
import { countUnreadAdminCommunicationNotifications,filterAdminCommunicationNotifications,getAdminCommunicationNoticeStatus,markAdminCommunicationNotificationsRead } from '@/app/frontend_admin/admin_communication/communication_notification_center/utils/AdminCommunicationNotificationCenterUtils';
import { cleanup,fireEvent,render,screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { afterEach,describe,expect,it,vi } from 'vitest';


// Consolidated from AdminCommunicationNotificationCenterNotificationRoutes.test.ts; test cases retained in the V35 feature suite.
describe('AdminCommunicationNotificationCenter canonical routes', () => {
  it('targets accepted query-view IDs for first-party notifications', () => {
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.CRM_ENQUIRIES).toBe('/admin/admin_members/members_enquiries?view=enquiries');
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_RENEWALS).toBe('/admin/admin_finance/finance_payments');
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_PAYMENT_PROMISES).toBe('/admin/admin_finance/finance_payments');
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_LATE_FEES).toBe('/admin/admin_finance/finance_payments');
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.SEAT_MAINTENANCE).toBe('/admin/admin_seats_shifts_lockers/seats_management');
  });
});

// Consolidated from AdminCommunicationNotificationCenterDateUtils.test.ts; test cases retained in the V35 feature suite.
describe('getAdminCommunicationNoticeStatus', () => {
  const middayOnExpiryDate = new Date(2026, 9, 13, 12, 30, 0);

  it('keeps a date-only notice active for its entire expiry date', () => {
    expect(getAdminCommunicationNoticeStatus('2026-10-13', middayOnExpiryDate)).toBe('Active');
    expect(getAdminCommunicationNoticeStatus('2026-10-13T00:00:00.000Z', middayOnExpiryDate)).toBe('Active');
  });

  it('marks only dates before the current local calendar day as expired', () => {
    expect(getAdminCommunicationNoticeStatus('2026-10-12', middayOnExpiryDate)).toBe('Expired');
  });

  it('does not classify invalid date data as active or expired', () => {
    expect(getAdminCommunicationNoticeStatus('2026-02-30', middayOnExpiryDate)).toBe('Unknown');
    expect(getAdminCommunicationNoticeStatus('not-a-date', middayOnExpiryDate)).toBe('Unknown');
  });
});


// Consolidated from AdminCommunicationNotificationCenterUtils.test.ts; test cases retained in the V35 feature suite.
describe('AdminCommunicationNotificationCenterUtils', () => {
  it('filters by category and priority without mutating the fixture set', () => {
    const originalLength = ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES.length;
    expect(filterAdminCommunicationNotifications(ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES, 'Finance').every((item) => item.category === 'Finance')).toBe(true);
    expect(filterAdminCommunicationNotifications(ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES, 'High Only').every((item) => item.priority === 'High')).toBe(true);
    expect(filterAdminCommunicationNotifications(ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES, 'All')).toHaveLength(originalLength);
    expect(ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES).toHaveLength(originalLength);
  });

  it('counts unread notifications and marks them read immutably', () => {
    const original = ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES;
    const read = markAdminCommunicationNotificationsRead(original);
    expect(countUnreadAdminCommunicationNotifications(original)).toBe(5);
    expect(countUnreadAdminCommunicationNotifications(read)).toBe(0);
    expect(original.some((item) => !item.read)).toBe(true);
    expect(read).not.toBe(original);
  });
});


// Consolidated from AdminCommunicationNotificationCenterRouteFeedbackLocalization.test.tsx; test cases retained in the V35 feature suite.
vi.mock('@/lib/errorMonitoring', () => ({ reportAdminError: vi.fn() }));

afterEach(() => cleanup());

function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('admin_communication route feedback localization', () => {
  it('renders localized error-boundary feedback and a working retry control', () => {
    const reset = vi.fn();
    renderWithMessages(<ErrorBoundary error={new Error('test error')} reset={reset} />);
    expect(screen.getByRole('heading', { name: 'Something went wrong.' })).toBeTruthy();
    expect(screen.getByText('We could not complete this view. You can retry the current module.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('exposes the localized loading accessible name and screen-reader text', () => {
    renderWithMessages(<Loading />);
    expect(screen.getByRole('status', { name: 'Loading communication tools' })).toBeTruthy();
    expect(screen.getByText('Loading communication content')).toBeTruthy();
  });
});


// Consolidated from AdminCommunicationNotificationCenterHarness.test.tsx; test cases retained in the V35 feature suite.
describe('notification-center deterministic scenario harness', () => {
  it.each(AdminCommunicationNotificationCenterScenarios)('renders visible scenario behavior for %s', (scenario) => {
    render(<AdminCommunicationNotificationCenterHarness scenario={scenario}>Active notification content</AdminCommunicationNotificationCenterHarness>);
    const harness = screen.getByTestId('admin_communication_notification_center-harness');
    const labels = { ACTIVE: 'active', EMPTY: 'empty', SERVER_500: 'server-error', TIMEOUT: 'timeout', UNAUTHORIZED: 'unauthorized' } as const;
    expect(harness.getAttribute('data-scenario')).toBe(labels[scenario]);
    if (scenario === 'ACTIVE') expect(screen.getByText('Active notification content')).toBeTruthy();
    if (scenario === 'EMPTY') expect(screen.getByRole('status').textContent).toContain('No notifications');
    if (scenario === 'UNAUTHORIZED') expect(screen.getByRole('alert').textContent).toContain('Access unavailable');
    if (scenario === 'SERVER_500' || scenario === 'TIMEOUT') {
      fireEvent.click(screen.getByRole('button', { name: 'Retry fixture' }));
      expect(screen.getByText('Active notification content')).toBeTruthy();
    }
  });
});
