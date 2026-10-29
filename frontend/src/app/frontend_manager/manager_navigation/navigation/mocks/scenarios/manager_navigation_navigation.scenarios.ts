import type { ManagerNavigationNavigationScenarioId } from '@/app/frontend_manager/manager_navigation/navigation/types/ManagerNavigationNavigationComponentTypes';
export type { ManagerNavigationNavigationScenarioId };
/**
 * Scenario registry for manager_navigation_navigation.
 * These are test intents, not fabricated API payloads. Add concrete fixture overrides only when the
 * authoritative endpoint and response contract is supplied. Keep this registry mutable for per-test overrides.
 */

export type ManagerNavigationNavigationScenario = {
  id: ManagerNavigationNavigationScenarioId;
  purpose: string;
  requiresAuthoritativeContract: boolean;
};

export const MANAGER_NAVIGATION_NAVIGATION_SCENARIOS: ManagerNavigationNavigationScenario[] = [
  { id: 'default', purpose: 'Exercise the feature using only its currently supplied local contract and fixtures.', requiresAuthoritativeContract: true },
  { id: 'empty', purpose: 'Verify the documented empty state without fabricating API records.', requiresAuthoritativeContract: true },
  { id: 'loading', purpose: 'Verify the navigation loading state while host route context is resolving.', requiresAuthoritativeContract: true },
  { id: 'error', purpose: 'Verify the documented recoverable error state.', requiresAuthoritativeContract: true },
  { id: 'recovery', purpose: 'Verify recovery after a recoverable navigation context failure.', requiresAuthoritativeContract: true },
  { id: 'repeated_action', purpose: 'Verify repeated menu activation does not duplicate navigation or dialogs.', requiresAuthoritativeContract: true },
  { id: 'timeout', purpose: 'Verify timeout/retry handling when the host API contract is available.', requiresAuthoritativeContract: true },
  { id: 'unauthorized', purpose: 'Verify authorization handling using the host-auth contract.', requiresAuthoritativeContract: true },
];

export const MANAGER_NAVIGATION_NAVIGATION_SCENARIO_CONTRACT_STATUS = 'BLOCKED_BY_SUPPLIED_CONTRACT' as const;
