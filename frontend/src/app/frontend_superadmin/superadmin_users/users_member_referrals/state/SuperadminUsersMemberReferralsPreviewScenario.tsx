// RESPONSIBILITY: Own local UI state for users member referrals; server data remains governed by the verified query/API contract.
// FLOW: Feature UI -> superadmin_users/users_member_referrals/state/SuperadminUsersMemberReferralsPreviewScenario.tsx -> local state actions -> subscribed feature components.
'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SuperadminMockScenarioKey } from '../mocks/scenarios/superadmin_users_member_referrals.scenarios';

const SuperadminUsersMemberReferralsPreviewScenarioContext = createContext<SuperadminMockScenarioKey>('ACTIVE_RECORDS');

export function SuperadminUsersMemberReferralsPreviewScenarioProvider({ scenario, children }: { scenario: SuperadminMockScenarioKey; children: ReactNode }) {
  return <SuperadminUsersMemberReferralsPreviewScenarioContext.Provider value={scenario}>{children}</SuperadminUsersMemberReferralsPreviewScenarioContext.Provider>;
}

export function useSuperadminUsersMemberReferralsPreviewScenario(): SuperadminMockScenarioKey {
  return useContext(SuperadminUsersMemberReferralsPreviewScenarioContext);
}
