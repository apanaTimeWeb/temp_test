// RESPONSIBILITY: Manage local preview filter and notification-read state for the Superadmin notification-center screen; no server persistence is implied.
// FLOW: Notification-center page -> module-owned state hook -> local sample fixture and filter/read state -> preview rendering.
import { useState } from 'react';
import { SUPERADMIN_COMMUNICATION_SAMPLE_NOTIFICATIONS } from '../mocks/fixtures/SuperadminCommunicationNotificationCenterNotificationMockFixtures';
import type { SuperadminCommunicationNotification, SuperadminCommunicationNotificationFilter as Category } from '../types/SuperadminCommunicationNotificationCenterNotificationTypes';

/**
 * Returns filter, URL-hydration, and local notification sample state. The notification list is illustrative and local-only.
 * @returns Module-local UI state and stable React state setters.
 */
export function useSuperadminCommunicationNotificationCenterState() {
  const [cat, setCat] = useState<Category>('All');
  const [urlStateReady, setUrlStateReady] = useState(false);
  const [notifs, setNotifs] = useState<SuperadminCommunicationNotification[]>(SUPERADMIN_COMMUNICATION_SAMPLE_NOTIFICATIONS);
  return { cat, setCat, urlStateReady, setUrlStateReady, notifs, setNotifs };
}
