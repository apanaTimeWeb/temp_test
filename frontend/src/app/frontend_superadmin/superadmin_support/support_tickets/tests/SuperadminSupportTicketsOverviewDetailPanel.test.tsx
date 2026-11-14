/* @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SuperadminSupportTicketsOverviewDetailPanel from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewDetailPanel';
import { SUPERADMIN_SUPPORT_TICKETS_FIXTURES } from '@/app/frontend_superadmin/superadmin_support/support_tickets/mocks/fixtures/SuperadminSupportTicketsOverviewMockFixtures';

const mocks = vi.hoisted(() => ({ confirm: vi.fn() }));
vi.mock('@/app/frontend_superadmin/superadmin_support/support_tickets/hooks/useSuperadminSupportTicketsOverviewConfirm', () => ({
  useSuperadminSupportTicketsOverviewConfirm: () => mocks.confirm,
}));

const messages = { SUPERADMIN_SUPPORT_TICKETS: { COPY: {
  UNSAVED_CHANGES_WARNING: 'Unsaved changes', TABLE_ARIA_LABEL: 'Tickets', ASSIGNEE: 'Assignee', PRIORITY: 'Priority', SUPPORT_AGENT: 'Support agent', S: 'S',
  WE_ARE_LOOKING_INTO_THIS_ISSUE_RIGHT_NOW_COULD_YOU_PLEASE_CONFIRM_IF_THIS_HAPPENS_ON_MOBILE_APP_AS_WELL: 'We are looking into this issue. Does it happen on mobile too?', CLOSE_TICKET_DETAILS: 'Close details',
  STATUS_OPEN: 'Open', STATUS_IN_PROGRESS: 'In progress', STATUS_RESOLVED: 'Resolved', SLA_BREACH: 'SLA breach',
  OPENED: 'Opened', AGO: 'ago', CATEGORY_BILLING: 'Billing', CATEGORY_BUG: 'Bug', CATEGORY_ACCOUNT: 'Account', CATEGORY_GENERAL: 'General', CATEGORY_SUPPORT: 'Support',
  ASSIGNEE_UNASSIGNED: 'Unassigned', ASSIGNEE_SAMPLE_AGENT_A: 'Agent A', ASSIGNEE_SAMPLE_AGENT_B: 'Agent B', PRIORITY_HIGH: 'High', PRIORITY_MEDIUM: 'Medium', PRIORITY_LOW: 'Low', UPDATE_STATUS: 'Update status',
  TICKET_ASSIGNEE_LOCAL_PREVIEW_ONLY: 'Assignee preview', TICKET_STATUS_LOCAL_PREVIEW_ONLY: 'Status preview', OPEN: 'Open', IN_PROGRESS: 'In progress', RESOLVED: 'Resolved',
  APPLY_LOCAL_PREVIEW_CHANGES: 'Apply preview changes', LOCAL_PREVIEW_APPLIED_MESSAGE: 'Preview applied', PUBLIC_REPLY: 'Public reply', INTERNAL_NOTE_HIDDEN: 'Internal note',
  INTERNAL_NOTE_TEXT: 'Internal note', PUBLIC_REPLY_TEXT: 'Public reply', TYPE_PRIVATE_NOTE_PLACEHOLDER: 'Private note', TYPE_REPLY_TO_TENANT_PLACEHOLDER: 'Reply',
  ATTACH_FILE_UNAVAILABLE: 'Attachment unavailable', UNAVAILABLE_ATTACHMENT_UPLOAD_IS_NOT_IMPLEMENTED_IN_THE_SUPPLIED_HOST_API_CONTRACT: 'Unavailable', ADD_NOTE: 'Add note', SEND_REPLY: 'Send reply',
  REPLY_UNAVAILABLE_MESSAGE: 'Reply unavailable', SAMPLE_ATTACHMENT_ERROR_SCREENSHOT_PNG_DOWNLOAD_UNAVAILABLE: 'Sample attachment unavailable',
} } };

function renderPanel() {
  const ticket = SUPERADMIN_SUPPORT_TICKETS_FIXTURES[0];
  if (!ticket) throw new Error('Expected a support ticket fixture');
  return render(<NextIntlClientProvider locale="en" messages={messages}>
    <SuperadminSupportTicketsOverviewDetailPanel tkt={ticket} onClose={vi.fn()} onSave={vi.fn()} />
  </NextIntlClientProvider>);
}

describe('support ticket detail panel focus and responsive contract', () => {
  beforeEach(() => { mocks.confirm.mockReset().mockResolvedValue(false); });

  it('keeps the focus listener stable while editing and exposes the responsive modal structure', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    renderPanel();
    const initialKeydownAdds = addSpy.mock.calls.filter(([type]) => type === 'keydown').length;
    fireEvent.change(screen.getByLabelText('Assignee preview'), { target: { value: 'Sample Agent A' } });
    const afterEditKeydownAdds = addSpy.mock.calls.filter(([type]) => type === 'keydown').length;
    expect(afterEditKeydownAdds).toBe(initialKeydownAdds);
    expect(removeSpy.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(0);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('style')).toContain('max-height');
    expect(dialog.querySelector('[class*="grid-cols-1"][class*="sm:grid-cols-2"][class*="lg:grid-cols-3"]')).toBeTruthy();
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
