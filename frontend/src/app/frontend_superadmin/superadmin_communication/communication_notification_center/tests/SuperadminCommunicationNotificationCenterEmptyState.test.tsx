// RESPONSIBILITY: Define source-level test coverage for communication notification center using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_notification_center/tests/SuperadminCommunicationNotificationCenterEmptyState.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuperadminCommunicationNotificationCenterEmptyState } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterEmptyState';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

/** Component regression test for accessible, localized empty collection behavior. */
describe('SuperadminCommunicationNotificationCenterEmptyState', () => {
  it('renders a named status region with the feature-local empty message', () => {
    render(<SuperadminCommunicationNotificationCenterEmptyState />);
    expect(screen.getByRole('status').getAttribute('data-testid')).toBe( 'superadmin-communication-communication-notification-center-empty-state');
    expect(screen.getByText('COPY.ALL_CAUGHT_UP_NO_PENDING_NOTIFICATIONS')).toBeTruthy();
  });
});
