import { describe, expect, it } from 'vitest';
import { managerHelpSupportTicketDraftSchema } from '@/app/frontend_manager/manager_settings/settings_help_support/schemas/ManagerSettingsHelpSupportTicketDraftSchema';

const validDraft = { category: 'billing', subject: 'Payment issue', description: 'The payment receipt is missing.', priority: 'Medium' };

describe('managerHelpSupportTicketDraftSchema', () => {
  it('accepts a complete local draft without claiming ticket creation', () => {
    expect(managerHelpSupportTicketDraftSchema.safeParse(validDraft).success).toBe(true);
  });
  it('rejects empty subject/description and unsupported enum values', () => {
    expect(managerHelpSupportTicketDraftSchema.safeParse({ ...validDraft, subject: ' ' }).success).toBe(false);
    expect(managerHelpSupportTicketDraftSchema.safeParse({ ...validDraft, description: '' }).success).toBe(false);
    expect(managerHelpSupportTicketDraftSchema.safeParse({ ...validDraft, priority: 'Urgent' }).success).toBe(false);
  });
});
