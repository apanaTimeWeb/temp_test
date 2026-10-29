import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import { describe, expect, it } from 'vitest';
import { managerCrmAddEnquirySchema, managerCrmFollowUpDraftSchema } from '@/app/frontend_manager/manager_members/members_enquiries/schemas/ManagerMembersEnquiriesSchema';

describe('CRM local draft schemas', () => {
  it('accepts a valid enquiry draft without implying a durable create operation', () => {
    expect(managerCrmAddEnquirySchema.safeParse({ name: 'Asha Sharma', phone: '9876543210', preferredShift: 'Morning', source: 'Walk-in', handledBy: 'Demo Staff', notes: '' }).success).toBe(true);
  });
  it('rejects invalid enquiry identity fields', () => {
    expect(managerCrmAddEnquirySchema.safeParse({ name: 'A', phone: '123', preferredShift: '', source: '', handledBy: '', notes: '' }).success).toBe(false);
  });
  it('validates follow-up drafts while the write remains unavailable', () => {
    expect(managerCrmFollowUpDraftSchema.safeParse({ date: '2026-10-20', remark: 'Call the prospective student' }).success).toBe(true);
    expect(managerCrmFollowUpDraftSchema.safeParse({ date: '', remark: 'ok' }).success).toBe(false);
  });
});

describe('CRM admission conversion route privacy', () => {
  it('does not serialize names or phone numbers into the destination URL', () => {
    const destination = MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADMISSION_CONVERSION();
    expect(destination).toBe('/frontend_manager/manager_members/members_directory?view=new');
    expect(destination).not.toContain('phone');
    expect(destination).not.toContain('name=');
  });
});

describe('CRM enquiry name validation', () => {
  it('rejects whitespace-only names after trimming', () => {
    expect(managerCrmAddEnquirySchema.safeParse({ name: '   ', phone: '9876543210', preferredShift: 'Morning', source: 'Website', handledBy: 'Demo Staff', notes: '' }).success).toBe(false);
  });
});
