// RESPONSIBILITY: Define source-level test coverage for users member trust score using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_member_trust_score/tests/SuperadminUsersOverviewMemberTrustScorePreviewScenarioIntegration.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pageClient = readFileSync(new URL('../components/SuperadminUsersOverviewMemberTrustScorePageClient.tsx', import.meta.url), 'utf8');
const fixtureSource = readFileSync(new URL('../mocks/fixtures/SuperadminUsersOverviewMemberTrustScoreMockFixtures.ts', import.meta.url), 'utf8');
const scenarioContext = readFileSync(new URL('../state/SuperadminUsersMemberTrustScorePreviewScenario.tsx', import.meta.url), 'utf8');

describe('SuperadminUsersOverviewMemberTrustScore preview-scenario wiring', () => {
  it('uses a leaf-owned fixture and the selected scenario rather than a guessed API', () => {
    expect(pageClient).toContain('data-preview-scenario={scenario}');
    expect(pageClient).toContain("scenario === 'EMPTY_DATA'");
    expect(pageClient).toContain('PREVIEW_ONLY_DISCLOSURE');
    expect(pageClient).not.toMatch(/\bfetch\s*\(/);
    expect(pageClient).not.toContain('axios.');
    expect(fixtureSource).toContain('export const SUPERADMIN_');
    expect(scenarioContext).toContain('createContext<SuperadminMockScenarioKey>');
  });
});
