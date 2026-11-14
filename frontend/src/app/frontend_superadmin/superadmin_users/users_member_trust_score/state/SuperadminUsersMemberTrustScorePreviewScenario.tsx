// RESPONSIBILITY: Own local UI state for users member trust score; server data remains governed by the verified query/API contract.
// FLOW: Feature UI -> superadmin_users/users_member_trust_score/state/SuperadminUsersMemberTrustScorePreviewScenario.tsx -> local state actions -> subscribed feature components.
'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SuperadminMockScenarioKey } from '../mocks/scenarios/superadmin_users_member_trust_score.scenarios';

const SuperadminUsersMemberTrustScorePreviewScenarioContext = createContext<SuperadminMockScenarioKey>('ACTIVE_RECORDS');

export function SuperadminUsersMemberTrustScorePreviewScenarioProvider({ scenario, children }: { scenario: SuperadminMockScenarioKey; children: ReactNode }) {
  return <SuperadminUsersMemberTrustScorePreviewScenarioContext.Provider value={scenario}>{children}</SuperadminUsersMemberTrustScorePreviewScenarioContext.Provider>;
}

export function useSuperadminUsersMemberTrustScorePreviewScenario(): SuperadminMockScenarioKey {
  return useContext(SuperadminUsersMemberTrustScorePreviewScenarioContext);
}
