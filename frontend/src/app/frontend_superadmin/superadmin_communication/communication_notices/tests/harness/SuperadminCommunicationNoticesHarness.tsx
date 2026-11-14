// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { useState, type ReactNode } from 'react';
import { COMMUNICATION_NOTICES_MOCK_SERVER } from './bootstrap';
import { SUPERADMIN_COMMUNICATION_NOTICES_EMPTY_DATA_MSW_HANDLERS, SUPERADMIN_COMMUNICATION_NOTICES_SERVER_500_MSW_HANDLERS, SUPERADMIN_COMMUNICATION_NOTICES_NETWORK_TIMEOUT_MSW_HANDLERS, SUPERADMIN_COMMUNICATION_NOTICES_UNAUTHORIZED_401_MSW_HANDLERS, SUPERADMIN_COMMUNICATION_NOTICES_FORBIDDEN_403_MSW_HANDLERS } from '../../mocks/handlers/SuperadminCommunicationNoticesScenarioMockHandlers';
import { SUPERADMIN_CANONICAL_MOCK_SCENARIOS, type SuperadminMockScenarioKey } from '../../mocks/scenarios/superadmin_communication_notices.scenarios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';

/** Minimal isolated provider harness. Next.js navigation hooks require a host router/mock when used. */
export default function SuperadminCommunicationNoticesHarness({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<SuperadminMockScenarioKey>('ACTIVE_RECORDS');
  const activeScenario = SUPERADMIN_CANONICAL_MOCK_SCENARIOS.find((item) => item.key === scenario) ?? SUPERADMIN_CANONICAL_MOCK_SCENARIOS[0];
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }));
  return (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="en" messages={{}} onError={() => undefined}>
        <>
          <div data-testid="superadmin_communication_notices-mock-scenario-selector-panel" data-active-scenario={scenario}>
            <label>
              Mock scenario
              <select aria-label="Mock scenario" data-testid="superadmin_communication_notices-mock-scenario-selector" value={scenario} onChange={(event) => {
                const nextScenario = event.target.value as SuperadminMockScenarioKey;
                switch (nextScenario) {
                  case 'ACTIVE_RECORDS': COMMUNICATION_NOTICES_MOCK_SERVER.resetHandlers(); break;
                  case 'EMPTY_DATA': COMMUNICATION_NOTICES_MOCK_SERVER.resetHandlers(...SUPERADMIN_COMMUNICATION_NOTICES_EMPTY_DATA_MSW_HANDLERS); break;
                  case 'SERVER_500_ERROR': COMMUNICATION_NOTICES_MOCK_SERVER.resetHandlers(...SUPERADMIN_COMMUNICATION_NOTICES_SERVER_500_MSW_HANDLERS); break;
                  case 'NETWORK_TIMEOUT': COMMUNICATION_NOTICES_MOCK_SERVER.resetHandlers(...SUPERADMIN_COMMUNICATION_NOTICES_NETWORK_TIMEOUT_MSW_HANDLERS); break;
                  case 'UNAUTHORIZED_401': COMMUNICATION_NOTICES_MOCK_SERVER.resetHandlers(...SUPERADMIN_COMMUNICATION_NOTICES_UNAUTHORIZED_401_MSW_HANDLERS); break;
                  case 'FORBIDDEN_403': COMMUNICATION_NOTICES_MOCK_SERVER.resetHandlers(...SUPERADMIN_COMMUNICATION_NOTICES_FORBIDDEN_403_MSW_HANDLERS); break;
                }
                void client.invalidateQueries();
                setScenario(nextScenario);
              }}>
                {SUPERADMIN_CANONICAL_MOCK_SCENARIOS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <p aria-live="polite" data-testid="superadmin_communication_notices-mock-scenario-status">{activeScenario.note}</p>
          </div>
          <div data-testid="superadmin_communication_notices-mock-scenario-content" data-mock-scenario={scenario}>{children}</div>
        </>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
