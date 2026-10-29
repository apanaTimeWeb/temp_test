# manager_notices mock boundary

`ManagerCommunicationNoticesMockFixtures.ts` contains schema-aligned read fixtures for the existing notice and complaint GET contracts; `ManagerCommunicationNoticesHandlers.ts` provides read-only MSW handlers for those two endpoints. `ManagerCommunicationNoticesOperationalSampleFixtures.ts` contains sample-only notification history, WhatsApp logs, and template drafts for preview screens.

No notification delivery, notice/complaint write, template persistence, or WhatsApp send handler is provided because those mutation contracts are not verified in the supplied role archive.
