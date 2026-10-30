'use client';

import { useState, type ReactNode } from 'react';

import { type AdminCommunicationNotificationCenterScenario } from '@/app/frontend_admin/admin_communication/communication_notification_center/tests/harness/bootstrap';
import type { AdminCommunicationNotificationCenterHarnessProps } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';


function scenarioLabel(scenario: AdminCommunicationNotificationCenterScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}

/** Test-only state harness. Retry transitions simulated failures to ACTIVE; it does not assert a live API contract. */
export function AdminCommunicationNotificationCenterHarness({ children, scenario = 'ACTIVE' }: AdminCommunicationNotificationCenterHarnessProps) {
  const [recovered, setRecovered] = useState(false);
  if (scenario === 'ACTIVE' || recovered) return <div data-testid="admin_communication_notification_center-harness" data-scenario="active">{children}</div>;
  if (scenario === 'EMPTY') return <section data-testid="admin_communication_notification_center-harness" data-scenario="empty" role="status"><h2>No notifications</h2><p>The current fixture contains no notification records.</p></section>;
  if (scenario === 'UNAUTHORIZED') return <section data-testid="admin_communication_notification_center-harness" data-scenario="unauthorized" role="alert"><h2>Access unavailable</h2><p>This permission-denied state is simulated for testing.</p></section>;
  const timedOut = scenario === 'TIMEOUT';
  return <section data-testid="admin_communication_notification_center-harness" data-scenario={scenarioLabel(scenario)} role="alert"><h2>{timedOut ? 'Request timed out' : 'Notifications unavailable'}</h2><p>{timedOut ? 'This is a simulated timeout state, not a live API result.' : 'This is a simulated server-failure state.'}</p><button type="button" className="min-h-11" onClick={() => setRecovered(true)}>Retry fixture</button></section>;
}


export type { AdminCommunicationNotificationCenterHarnessProps };
