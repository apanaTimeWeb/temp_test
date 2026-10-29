/**
 * Module-local MSW lifecycle for the seats_history standalone harness.
 * The __harness__ probe is test-only and is not a backend or feature API route.
 */
import { delay, http, HttpResponse, type RequestHandler } from 'msw';
import { setupWorker } from 'msw/browser';
import { MANAGER_SEATS_HISTORY_SCENARIOS as MODULE_SCENARIOS, type SeatsHistoryScenario as HarnessScenario } from '../../mocks/scenarios/manager_seats_history.scenarios';
import { managerSeatsShiftsLockersHandlers as MODULE_HANDLERS_SOURCE } from '../../mocks/manager_seats_history_handlers/ManagerSeatsHistoryHandlers';
// This list contains only module-owned, source-backed business handlers; no API routes are inferred here.
const MODULE_HANDLERS: RequestHandler[] = [...MODULE_HANDLERS_SOURCE];

export type ManagerSeatsHistoryHarnessScenario = HarnessScenario;
export const HARNESS_SCENARIO_OPTIONS = Object.keys(MODULE_SCENARIOS) as HarnessScenario[];
export const MANAGER_SEATS_HISTORY_SCENARIO_PROBE_URL = '/__harness__/seats_history/scenario';

function createScenarioProbeHandler(scenario: HarnessScenario): RequestHandler {
  return http.get(MANAGER_SEATS_HISTORY_SCENARIO_PROBE_URL, async () => {
    switch (scenario) {
      case 'ACTIVE':
        return HttpResponse.json({ success: true, requestId: 'harness-seats_history-active', data: { scenario, mode: 'active' } });
      case 'EMPTY':
        return HttpResponse.json({ success: true, requestId: 'harness-seats_history-empty', data: [], message: 'Harness-only empty scenario.' });
      case 'SERVER_500':
        return HttpResponse.json({ success: false, requestId: 'harness-seats_history-server-500', errorCode: 'HARNESS_SERVER_500', statusCode: 500, message: 'Harness-only server error scenario.', data: null }, { status: 500 });
      case 'TIMEOUT':
        await delay(15_000);
        return HttpResponse.json({ success: false, requestId: 'harness-seats_history-timeout', errorCode: 'HARNESS_TIMEOUT', statusCode: 504, message: 'Harness-only timeout scenario.', data: null }, { status: 504 });
      case 'UNAUTHORIZED':
        return HttpResponse.json({ success: false, requestId: 'harness-seats_history-unauthorized', errorCode: 'HARNESS_UNAUTHORIZED', statusCode: 401, message: 'Harness-only unauthorized scenario.', data: null }, { status: 401 });
      default:
        return HttpResponse.json({ success: false, requestId: 'harness-seats_history-unknown', errorCode: 'HARNESS_SCENARIO_UNKNOWN', statusCode: 500, message: 'Unknown harness-only scenario.', data: null }, { status: 500 });
    }
  });
}

function handlersForScenario(scenario: HarnessScenario): RequestHandler[] {
  // The scenario changes the actual MSW response on the isolated harness probe.
  // Business handlers are preserved exactly; missing external contracts remain unmocked.
  return [...MODULE_HANDLERS, createScenarioProbeHandler(scenario)];
}

const worker = setupWorker(...MODULE_HANDLERS);
let workerStarted = false;
let workerStartPromise: Promise<void> | null = null;
let stopRequested = false;

export function setManagerSeatsHistoryScenario(scenario: HarnessScenario): void {
  worker.resetHandlers(...handlersForScenario(scenario));
}

export async function startManagerSeatsHistoryWorker(scenario: HarnessScenario): Promise<void> {
  stopRequested = false;
  setManagerSeatsHistoryScenario(scenario);
  if (workerStarted) return;
  if (!workerStartPromise) {
    let startOperation: Promise<void>;
    startOperation = worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
      workerStarted = true;
    }).finally(() => {
      if (workerStartPromise === startOperation) workerStartPromise = null;
      if (stopRequested && workerStarted) {
        worker.stop();
        workerStarted = false;
        worker.resetHandlers(...MODULE_HANDLERS);
        stopRequested = false;
      }
    });
    workerStartPromise = startOperation;
  }
  await workerStartPromise;
}

export function stopManagerSeatsHistoryWorker(): void {
  stopRequested = true;
  if (workerStartPromise) return;
  if (workerStarted) worker.stop();
  workerStarted = false;
  stopRequested = false;
  worker.resetHandlers(...MODULE_HANDLERS);
}
