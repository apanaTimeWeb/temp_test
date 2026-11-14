// RESPONSIBILITY: Define source-level test coverage for users member referrals using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_member_referrals/tests/SuperadminUsersOverviewMemberReferralsPreviewDisclosure.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pageClient = readFileSync(new URL('../components/SuperadminUsersOverviewMemberReferralsPageClient.tsx', import.meta.url), 'utf8');
const englishCatalog = JSON.parse(readFileSync(new URL('../locales/superadmin_users_overview_member_referrals_en.json', import.meta.url), 'utf8')) as Record<string, unknown>;

describe('users_member_referrals preview disclosure contract', () => {
  it('visibly discloses preview-only data and does not invent a backend call', () => {
    expect(pageClient).toContain('PREVIEW_ONLY_DISCLOSURE');
    expect(pageClient).not.toMatch(/\bfetch\s*\(/);
    expect(pageClient).not.toContain('axios.');
    const serialized = JSON.stringify(englishCatalog);
    expect(serialized).toContain('PREVIEW_ONLY_DISCLOSURE');
  });
  it('exposes the referred-student disclosure state and stable controlled region', () => {
    expect(pageClient).toContain('aria-expanded={expanded === r.id}');
    expect(pageClient).toContain('aria-controls={`superadmin-referrals-students-${String(r.id)}`}');
    expect(pageClient).toContain('role="region"');
    expect(pageClient).toContain('aria-labelledby={`superadmin-referrals-trigger-${String(r.id)}`}');
    expect(pageClient).toContain('hidden={expanded !== r.id}');
  });
});
