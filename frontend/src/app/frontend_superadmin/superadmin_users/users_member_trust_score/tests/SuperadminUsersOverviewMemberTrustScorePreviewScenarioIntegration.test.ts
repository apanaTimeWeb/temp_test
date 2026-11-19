// RESPONSIBILITY: Define source-level test coverage for users member trust score using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_member_trust_score/tests/SuperadminUsersOverviewMemberTrustScorePreviewScenarioIntegration.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const pageClient = readFileSync(resolve(here, '../components/SuperadminUsersOverviewMemberTrustScorePageClient.tsx'), 'utf8');
const fixtureSource = readFileSync(resolve(here, '../mocks/fixtures/SuperadminUsersOverviewMemberTrustScoreMockFixtures.ts'), 'utf8');
const scenarioContext = readFileSync(resolve(here, '../state/SuperadminUsersMemberTrustScorePreviewScenario.tsx'), 'utf8');

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
