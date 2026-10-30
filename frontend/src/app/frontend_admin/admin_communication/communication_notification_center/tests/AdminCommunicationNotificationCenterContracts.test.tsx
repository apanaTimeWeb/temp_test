import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/app/frontend_admin/admin_communication/communication_notification_center/locales/admin_communication_notification_center_en.json';
import ErrorBoundary from '@/app/frontend_admin/admin_communication/communication_notification_center/error';
import Loading from '@/app/frontend_admin/admin_communication/communication_notification_center/loading';
import { getAdminCommunicationNoticeStatus } from '@/app/frontend_admin/admin_communication/communication_notification_center/utils/AdminCommunicationNotificationCenterUtils';
import { ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_notification_center/mocks/AdminCommunicationNotificationCenterFixtures';
import { countUnreadAdminCommunicationNotifications, filterAdminCommunicationNotifications, markAdminCommunicationNotificationsRead } from '@/app/frontend_admin/admin_communication/communication_notification_center/utils/AdminCommunicationNotificationCenterUtils';
import { isAdminCommunicationPhoneNumberValid } from '@/app/frontend_admin/admin_communication/communication_notification_center/utils/AdminCommunicationNotificationCenterWhatsappPhoneUtils';
import { AdminCommunicationNotificationCenterHarness } from '@/app/frontend_admin/admin_communication/communication_notification_center/tests/harness/AdminCommunicationNotificationCenterHarness';
import { AdminCommunicationNotificationCenterScenarios } from '@/app/frontend_admin/admin_communication/communication_notification_center/tests/harness/bootstrap';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mswTestServer } from '@/app/frontend_admin/test/mswServer';
import { fetchAdminCommunicationComplaints, fetchAdminCommunicationNotices } from '@/app/frontend_admin/admin_communication/communication_notification_center/api/admin_communication_notification_center_api';
import { ADMIN_COMMUNICATION_MSW_HANDLERS } from '@/app/frontend_admin/admin_communication/communication_notification_center/mocks/AdminCommunicationNotificationCenterMSWHandlers';
import { AdminCommunicationComplaintApiSchema, AdminCommunicationNoticeApiSchema } from '@/app/frontend_admin/admin_communication/communication_notification_center/schemas/AdminCommunicationNotificationCenterApiSchema';
import { AdminCommunicationComplaintSchema, AdminCommunicationNoticeSchema } from '@/app/frontend_admin/admin_communication/communication_notification_center/schemas/AdminCommunicationNotificationCenterSchema';
import { ADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES as ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES } from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.url_config';


// Consolidated from AdminCommunicationNotificationCenterApiSchema.test.ts; test cases retained in the V35 feature suite.
describe('AdminCommunication API date/status boundaries', () => {
  it('accepts a bounded status and parseable complaint date', () => {
    expect(AdminCommunicationComplaintApiSchema.safeParse({ id: 'c-1', subject: 'Noise', description: 'Details', status: 'open', createdAt: '2026-10-10T09:30:00Z' }).success).toBe(true);
  });

  it('rejects unparseable and oversized date values for both response resources', () => {
    expect(AdminCommunicationComplaintApiSchema.safeParse({ id: 'c-1', subject: 'Noise', description: 'Details', status: 'open', createdAt: 'not-a-date' }).success).toBe(false);
    expect(AdminCommunicationNoticeApiSchema.safeParse({ id: 'n-1', title: 'Notice', message: 'Hello', createdAt: 'bad-date', validTill: '2026-10-10' }).success).toBe(false);
    expect(AdminCommunicationNoticeApiSchema.safeParse({ id: 'n-1', title: 'Notice', message: 'Hello', createdAt: '2026-10-10', validTill: 'x'.repeat(65) }).success).toBe(false);
  });

  it('strips unsupported fields rather than treating them as part of the trusted DTO', () => {
    const parsed = AdminCommunicationNoticeApiSchema.parse({ id: 'n-1', title: 'Notice', message: 'Hello', createdAt: '2026-10-10', validTill: '2026-10-11', postedBy: 'invented' });
    expect(parsed).not.toHaveProperty('postedBy');
  });
});


describe('strict calendar date validation', () => {
  it('rejects rollover dates and accepts valid leap days', () => {
    expect(AdminCommunicationComplaintApiSchema.safeParse({ id: 1, subject: 'x', description: 'x', status: 'open', createdAt: '2026-02-30' }).success).toBe(false);
    expect(AdminCommunicationComplaintApiSchema.safeParse({ id: 1, subject: 'x', description: 'x', status: 'open', createdAt: '2024-02-29' }).success).toBe(true);
    expect(AdminCommunicationNoticeApiSchema.safeParse({ id: 1, title: 'x', message: 'x', createdAt: '2026-02-30T12:00:00Z', validTill: '2026-04-31' }).success).toBe(false);
    expect(AdminCommunicationNoticeApiSchema.safeParse({ id: 1, title: 'x', message: 'x', createdAt: '2026-02-28T12:00:00Z', validTill: '2026-04-30' }).success).toBe(true);
  });
});


// Consolidated from AdminCommunicationNotificationCenterSchema.test.ts; test cases retained in the V35 feature suite.
describe('AdminCommunication form schemas', () => {
  it('requires a nonblank complaint title and description', () => {
    expect(AdminCommunicationComplaintSchema.safeParse({ student: '', anonymous: false, title: ' ', description: 'Issue details' }).success).toBe(false);
    expect(AdminCommunicationComplaintSchema.safeParse({ student: '', anonymous: false, title: 'Broken equipment', description: 'The treadmill is not working.' }).success).toBe(true);
  });

  it('requires notice content and an ISO-formatted date', () => {
    expect(AdminCommunicationNoticeSchema.safeParse({ title: '', message: 'Message', validTill: '2026-12-31' }).success).toBe(false);
    expect(AdminCommunicationNoticeSchema.safeParse({ title: 'Holiday', message: 'The gym closes early.', validTill: '31/12/2026' }).success).toBe(false);
    expect(AdminCommunicationNoticeSchema.safeParse({ title: 'Holiday', message: 'The gym closes early.', validTill: '2026-12-31' }).success).toBe(true);
    expect(AdminCommunicationNoticeSchema.safeParse({ title: 'Holiday', message: 'The gym closes early.', validTill: '2026-02-30' }).success).toBe(false);
  });
});


// Consolidated from AdminCommunicationNotificationCenterMSWApi.test.ts; test cases retained in the V35 feature suite.
describe('Admin Communication API contracts', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('loads complaint and notice data through the real API adapter and response schemas', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
    mswTestServer.use(...ADMIN_COMMUNICATION_MSW_HANDLERS);
    const [complaints, notices] = await Promise.all([fetchAdminCommunicationComplaints(), fetchAdminCommunicationNotices()]);
    expect(complaints[0]).toMatchObject({ id: 'CMP-DEMO-001', status: 'Open' });
    expect(notices[0]).toMatchObject({ id: 'NOTICE-DEMO-001', title: 'Demo notice' });
  });
});


// Consolidated from AdminCommunicationNotificationCenterNotificationRoutes.test.ts; test cases retained in the V35 feature suite.
describe('AdminCommunicationNotificationCenter canonical routes', () => {
  it('targets accepted query-view IDs for first-party notifications', () => {
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.CRM_ENQUIRIES).toBe('/admin/admin_members/members_enquiries?view=enquiries');
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_RENEWALS).toBe('/admin/admin_finance/finance_renewals');
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_PAYMENT_PROMISES).toBe('/admin/admin_finance/finance_payment_promises');
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_LATE_FEES).toBe('/admin/admin_finance/finance_late_fees');
    expect(ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.SEAT_MAINTENANCE).toBe('/admin/admin_seats_shifts_lockers/seats_maintenance');
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


// Consolidated from AdminCommunicationNotificationCenterWhatsappPhoneUtils.test.ts; test cases retained in the V35 feature suite.
describe('isAdminCommunicationPhoneNumberValid', () => {
  it('accepts common international phone formatting with 7–15 digits', () => {
    expect(isAdminCommunicationPhoneNumberValid('+91 90000-00000')).toBe(true);
    expect(isAdminCommunicationPhoneNumberValid('(212) 555-0100')).toBe(true);
  });
  it('rejects empty, too-short, too-long, or non-phone characters', () => {
    expect(isAdminCommunicationPhoneNumberValid('  ')).toBe(false);
    expect(isAdminCommunicationPhoneNumberValid('12345')).toBe(false);
    expect(isAdminCommunicationPhoneNumberValid('+1234567890123456')).toBe(false);
    expect(isAdminCommunicationPhoneNumberValid('123 ABC 789')).toBe(false);
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
