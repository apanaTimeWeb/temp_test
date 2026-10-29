/** Module-local test-only probe for the supplied navigation scenario intent registry. */
import { http, HttpResponse, type RequestHandler } from 'msw';
import { setupWorker } from 'msw/browser';
import { MANAGER_NAVIGATION_NAVIGATION_SCENARIOS, MANAGER_NAVIGATION_NAVIGATION_SCENARIO_CONTRACT_STATUS, type ManagerNavigationNavigationScenario } from '../../mocks/scenarios/manager_navigation_navigation.scenarios';
export const MANAGER_NAVIGATION_NAVIGATION_SCENARIO_PROBE_URL = '/__harness__/navigation/scenario';
type ScenarioId = ManagerNavigationNavigationScenario['id'];
function handlerFor(id: ScenarioId): RequestHandler { return http.get(MANAGER_NAVIGATION_NAVIGATION_SCENARIO_PROBE_URL, () => { const scenario = MANAGER_NAVIGATION_NAVIGATION_SCENARIOS.find(item => item.id === id); return HttpResponse.json({ scenario: id, purpose: scenario?.purpose ?? 'Unknown scenario intent', requiresAuthoritativeContract: scenario?.requiresAuthoritativeContract ?? true, contractStatus: MANAGER_NAVIGATION_NAVIGATION_SCENARIO_CONTRACT_STATUS }); }); }
const worker = setupWorker(); let started = false; let pending: Promise<void> | null = null; let stopRequested = false;
export async function startManagerNavigationNavigationWorker(id: ScenarioId): Promise<void> { stopRequested = false; worker.resetHandlers(handlerFor(id)); if (started) return; if (!pending) { let operation: Promise<void>; operation = worker.start({ onUnhandledRequest: 'bypass' }).then(() => { started = true; }).finally(() => { if (pending === operation) pending = null; if (stopRequested && started) { worker.stop(); started = false; worker.resetHandlers(); stopRequested = false; } }); pending = operation; } await pending; }
export function stopManagerNavigationNavigationWorker(): void { stopRequested = true; if (pending) return; if (started) worker.stop(); started = false; stopRequested = false; worker.resetHandlers(); }
