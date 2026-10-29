# manager_notification_center mock boundary

`ManagerCommunicationNotificationCenterMockFixtures.ts` contains schema-aligned read fixtures for the existing notice and complaint GET contracts; `ManagerCommunicationNotificationCenterHandlers.ts` provides read-only MSW handlers for those two endpoints. `ManagerCommunicationNotificationCenterOperationalSampleFixtures.ts` contains sample-only notification history, WhatsApp logs, and template drafts for preview screens.

No notification delivery, notice/complaint write, template persistence, or WhatsApp send handler is provided because those mutation contracts are not verified in the supplied role archive.
