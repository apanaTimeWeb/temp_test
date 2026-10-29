import { describe, expect, it } from 'vitest';
import { managerCommunicationNotificationDraftSchema } from '@/app/frontend_manager/manager_communication/communication_notices/schemas/ManagerCommunicationNoticesNotificationDraftSchema';

const validDraft = { recipient: 'LIB-001', type: 'Manual member notification', channel: 'Email', message: 'Sample draft' };

describe('managerCommunicationNotificationDraftSchema', () => {
  it('accepts a local draft without sending a message', () => {
    expect(managerCommunicationNotificationDraftSchema.safeParse(validDraft).success).toBe(true);
  });
  it('rejects missing message content and unknown channels', () => {
    expect(managerCommunicationNotificationDraftSchema.safeParse({ ...validDraft, message: ' ' }).success).toBe(false);
    expect(managerCommunicationNotificationDraftSchema.safeParse({ ...validDraft, channel: 'Pager' }).success).toBe(false);
  });
});
