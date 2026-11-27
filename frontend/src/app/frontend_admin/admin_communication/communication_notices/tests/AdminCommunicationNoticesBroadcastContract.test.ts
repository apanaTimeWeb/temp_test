import { AdminCommunicationNoticeSchema } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import { describe, expect, it } from 'vitest';

describe('Admin Communication Notices Broadcast Contract', () => {
  it('validates multi-channel broadcast checkboxes in Notice schema', () => {
    const validNotice = {
      title: 'Library Closed on Sunday',
      message: 'Maintenance scheduled from 8 AM to 6 PM',
      validTill: '2026-05-01',
      targetBranch: 'Downtown',
      sendWhatsApp: true,
      sendEmail: true,
      sendSms: false,
    };

    const parsed = AdminCommunicationNoticeSchema.safeParse(validNotice);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.sendWhatsApp).toBe(true);
      expect(parsed.data.sendEmail).toBe(true);
      expect(parsed.data.sendSms).toBe(false);
    }
  });

  it('allows omitting channels for database-only notices', () => {
    const dbOnlyNotice = {
      title: 'Notice for noticeboard only',
      message: 'Silence please',
      validTill: '2026-06-01',
    };
    const parsed = AdminCommunicationNoticeSchema.safeParse(dbOnlyNotice);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.sendWhatsApp).toBeUndefined();
    }
  });
});
