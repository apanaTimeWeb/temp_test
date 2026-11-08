import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  MANAGER_MEMBERS_ENQUIRIES_ROUTES,
  MANAGER_MEMBERS_ENQUIRIES_API,
} from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import {
  managerCrmEnquirySchema,
  managerCrmNormalizedEnquirySchema,
} from '@/app/frontend_manager/manager_members/members_enquiries/schemas/ManagerMembersEnquiriesSchema';
import { normalizeManagerEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { getManagerEnquiriesMockEnquiries } from '@/app/frontend_manager/manager_members/members_enquiries/mocks/manager_members_enquiries_fixtures/ManagerMembersEnquiriesFixtures';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_enquiries'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_enquiries'),
  join(process.cwd(), 'frontend_manager/manager_members/members_enquiries'),
  process.cwd(),
].find(
  (candidate) =>
    existsSync(join(candidate, 'config/manager_members_enquiries.url_config.ts')) &&
    existsSync(join(candidate, 'components/manager_members_enquiries_views/ManagerMembersEnquiriesAddPage.tsx'))
);

const readSource = (relativePath: string) => {
  if (!moduleRoot) throw new Error('Cannot find members_enquiries root');
  return readFileSync(join(moduleRoot, relativePath), 'utf8');
};

describe('Manager Members Enquiries - Audit Regression Suite (Section E)', () => {
  it('E01 & E02: guards DOM data attributes against PII exposure in AddPage', () => {
    const addPageSource = readSource('components/manager_members_enquiries_views/ManagerMembersEnquiriesAddPage.tsx');
    expect(addPageSource).not.toContain('data-route-phone');
    expect(addPageSource).not.toContain('data-route-name');
    expect(addPageSource).not.toContain('data-route-smart-id');
  });

  it('E07: canonical routes provide NEW_ADMISSION and preserve privacy in ADMISSION_CONVERSION', () => {
    expect(MANAGER_MEMBERS_ENQUIRIES_ROUTES.NEW_ADMISSION).toBe(
      '/frontend_manager/manager_members/members_new_admission'
    );
    const conversion = MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADMISSION_CONVERSION();
    expect(conversion).not.toContain('phone');
    expect(conversion).not.toContain('name=');
  });

  it('E08: normalizeManagerEnquiriesEnquiry safely parses raw and normalized contracts', () => {
    const mock = getManagerEnquiriesMockEnquiries()[0];
    expect(mock).toBeDefined();

    const normalized = normalizeManagerEnquiriesEnquiry({
      id: 'enq-sample-999',
      name: 'Rohan Sharma',
      phone: '9876543210',
      preferredShift: 'Morning',
      status: 'New',
      source: 'Walk-in',
      handledBy: { name: 'Support Staff' },
      createdAt: '2026-10-15',
    });

    expect(normalized.id).toBe('enq-sample-999');
    expect(normalized.handledBy).toBe('Support Staff');
    expect(normalized.shift).toBe('Morning');
    expect(managerCrmNormalizedEnquirySchema.safeParse(normalized).success).toBe(true);
  });

  it('E12: submit button has visual disabled cues alongside disabled attribute and title', () => {
    const addPageSource = readSource('components/manager_members_enquiries_views/ManagerMembersEnquiriesAddPage.tsx');
    expect(addPageSource).toContain('cursor-not-allowed opacity-60');
    expect(addPageSource).toContain('crm_mutations_unavailable_host_contract');

    const followUpSource = readSource('components/manager_members_enquiries_forms/ManagerMembersEnquiriesFollowUpFormPanel.tsx');
    expect(followUpSource).toContain('cursor-not-allowed opacity-60');
  });

  it('DetailPage provides local timeline persistence via session storage', () => {
    const detailSource = readSource('components/manager_members_enquiries_views/ManagerMembersEnquiriesDetailPage.tsx');
    expect(detailSource).toContain('sessionStorage.getItem');
    expect(detailSource).toContain('sessionStorage.setItem');
  });
});

