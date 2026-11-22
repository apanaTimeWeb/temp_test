// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { useState, type ReactNode } from 'react';
import { SUPERADMIN_CANONICAL_MOCK_SCENARIOS, type SuperadminMockScenarioKey } from '../../mocks/scenarios/superadmin_analytics_financials.scenarios';

/** Minimal feature-local harness boundary for host-provided providers. */
export function SuperadminAnalyticsFinancialsHarness({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<SuperadminMockScenarioKey>('ACTIVE_RECORDS');
  const activeScenario = SUPERADMIN_CANONICAL_MOCK_SCENARIOS.find((item) => item.key === scenario) ?? SUPERADMIN_CANONICAL_MOCK_SCENARIOS[0]; return <div data-testid="superadmin_analytics_financials-analytics_financials-harness"><>
          <div data-testid="superadmin_analytics_financials-mock-scenario-selector-panel" data-active-scenario={scenario}>
            <label>
              Mock scenario
              <select aria-label="Mock scenario" data-testid="superadmin_analytics_financials-mock-scenario-selector" value={scenario} onChange={(event) => setScenario(event.target.value as SuperadminMockScenarioKey)}>
                {SUPERADMIN_CANONICAL_MOCK_SCENARIOS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <p aria-live="polite" data-testid="superadmin_analytics_financials-mock-scenario-status">{activeScenario.note}</p>
          </div>
          <div data-testid="superadmin_analytics_financials-mock-scenario-content" data-mock-scenario={scenario}>{children}</div>
        </></div>; }
