// RESPONSIBILITY: Define source-level test coverage for users member trust score using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_member_trust_score/tests/SuperadminUsersOverviewMemberTrustScorePreviewDisclosure.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pageClient = readFileSync(new URL('../components/SuperadminUsersOverviewMemberTrustScorePageClient.tsx', import.meta.url), 'utf8');
const englishCatalog = JSON.parse(readFileSync(new URL('../locales/superadmin_users_overview_member_trust_score_en.json', import.meta.url), 'utf8')) as Record<string, unknown>;

describe('users_member_trust_score preview disclosure contract', () => {
  it('visibly discloses preview-only data and does not invent a backend call', () => {
    expect(pageClient).toContain('PREVIEW_ONLY_DISCLOSURE');
    expect(pageClient).not.toMatch(/\bfetch\s*\(/);
    expect(pageClient).not.toContain('axios.');
    const serialized = JSON.stringify(englishCatalog);
    expect(serialized).toContain('PREVIEW_ONLY_DISCLOSURE');
  });
});
