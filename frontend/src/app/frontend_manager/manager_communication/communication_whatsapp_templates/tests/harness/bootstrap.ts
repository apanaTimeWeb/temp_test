/**
 * Module-local MSW lifecycle for the communication_whatsapp_templates standalone harness.
 * The __harness__ probe is test-only and is not a backend or feature API route.
 */
import { delay, http, HttpResponse, type RequestHandler } from 'msw';
import { setupWorker } from 'msw/browser';
import { MANAGER_COMMUNICATION_WHATSAPP_TEMPLATES_SCENARIOS as MODULE_SCENARIOS, type CommunicationWhatsappTemplatesScenario as HarnessScenario } from '../../mocks/scenarios/manager_communication_whatsapp_templates.scenarios';
// No module-owned handler array was supplied for this module. Keep business API mocking empty rather than inventing an endpoint.
const MODULE_HANDLERS: RequestHandler[] = [];

export type ManagerCommunicationWhatsappTemplatesHarnessScenario = HarnessScenario;
export const HARNESS_SCENARIO_OPTIONS = Object.keys(MODULE_SCENARIOS) as HarnessScenario[];
export const MANAGER_COMMUNICATION_WHATSAPP_TEMPLATES_SCENARIO_PROBE_URL = '/__harness__/communication_whatsapp_templates/scenario';

function createScenarioProbeHandler(scenario: HarnessScenario): RequestHandler {
  return http.get(MANAGER_COMMUNICATION_WHATSAPP_TEMPLATES_SCENARIO_PROBE_URL, async () => {
    switch (scenario) {
      case 'ACTIVE':
        return HttpResponse.json({ success: true, requestId: 'harness-communication_whatsapp_templates-active', data: { scenario, mode: 'active' } });
      case 'EMPTY':
        return HttpResponse.json({ success: true, requestId: 'harness-communication_whatsapp_templates-empty', data: [], message: 'Harness-only empty scenario.' });
      case 'SERVER_500':
        return HttpResponse.json({ success: false, requestId: 'harness-communication_whatsapp_templates-server-500', errorCode: 'HARNESS_SERVER_500', statusCode: 500, message: 'Harness-only server error scenario.', data: null }, { status: 500 });
      case 'TIMEOUT':
        await delay(15_000);
        return HttpResponse.json({ success: false, requestId: 'harness-communication_whatsapp_templates-timeout', errorCode: 'HARNESS_TIMEOUT', statusCode: 504, message: 'Harness-only timeout scenario.', data: null }, { status: 504 });
      case 'UNAUTHORIZED':
        return HttpResponse.json({ success: false, requestId: 'harness-communication_whatsapp_templates-unauthorized', errorCode: 'HARNESS_UNAUTHORIZED', statusCode: 401, message: 'Harness-only unauthorized scenario.', data: null }, { status: 401 });
      default:
        return HttpResponse.json({ success: false, requestId: 'harness-communication_whatsapp_templates-unknown', errorCode: 'HARNESS_SCENARIO_UNKNOWN', statusCode: 500, message: 'Unknown harness-only scenario.', data: null }, { status: 500 });
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

export function setManagerCommunicationWhatsappTemplatesScenario(scenario: HarnessScenario): void {
  worker.resetHandlers(...handlersForScenario(scenario));
}

export async function startManagerCommunicationWhatsappTemplatesWorker(scenario: HarnessScenario): Promise<void> {
  stopRequested = false;
  setManagerCommunicationWhatsappTemplatesScenario(scenario);
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

export function stopManagerCommunicationWhatsappTemplatesWorker(): void {
  stopRequested = true;
  if (workerStartPromise) return;
  if (workerStarted) worker.stop();
  workerStarted = false;
  stopRequested = false;
  worker.resetHandlers(...MODULE_HANDLERS);
}
