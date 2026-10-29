"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { ManagerFinanceTrustScoresMain } from '../../components/ManagerFinanceTrustScoresMain';
import messagesEn from '../../locales/manager_finance_trust_scores_domain_en.json';
import messagesHi from '../../locales/manager_finance_trust_scores_domain_hi.json';
import {
  startManagerFinanceTrustScoresWorker,
  stopManagerFinanceTrustScoresWorker,
  HARNESS_SCENARIO_OPTIONS,
  MANAGER_FINANCE_TRUST_SCORES_SCENARIO_PROBE_URL,
  type ManagerFinanceTrustScoresHarnessScenario,
} from './bootstrap';

type ManagerFinanceTrustScoresHarnessProps = {
  children?: ReactNode;
  locale?: string;
  theme?: 'light' | 'dark';
  sessionMode?: 'host-default' | 'authenticated' | 'unauthenticated';
  scenario?: ManagerFinanceTrustScoresHarnessScenario;
};

/**
 * Isolated provider boundary. Auth, tenant and write contracts remain host-owned.
 * The dev selector drives a module-local MSW probe and never fabricates a business API.
 */
export function ManagerFinanceTrustScoresHarness({ children, locale = 'en', theme = 'light', sessionMode = 'host-default', scenario = 'ACTIVE' }: ManagerFinanceTrustScoresHarnessProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false }, mutations: { retry: false } },
  }));
  const [activeScenario, setActiveScenario] = useState<ManagerFinanceTrustScoresHarnessScenario>(scenario);
  const [scenarioProbeStatus, setScenarioProbeStatus] = useState('Harness scenario has not been verified yet.');
  const messages = locale === 'hi' ? messagesHi : messagesEn;
  const moduleContent = children ?? <ManagerFinanceTrustScoresMain />;

  useEffect(() => { setActiveScenario(scenario); }, [scenario]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const controller = new AbortController();
    let current = true;

    void (async () => {
      try {
        await startManagerFinanceTrustScoresWorker(activeScenario);
        // Exercise the selected MSW response; the URL is reserved for this harness only.
        const response = await fetch(MANAGER_FINANCE_TRUST_SCORES_SCENARIO_PROBE_URL, { cache: 'no-store', signal: controller.signal });
        const payload = await response.json().catch(() => null) as { data?: { scenario?: string }; message?: string } | null;
        if (current) {
          const responseScenario = payload?.data && !Array.isArray(payload.data) ? payload.data.scenario : activeScenario;
          setScenarioProbeStatus(`HTTP ${response.status} · ${responseScenario ?? activeScenario} handler active`);
        }
      } catch (error) {
        if (current && !controller.signal.aborted) {
          setScenarioProbeStatus(error instanceof Error ? `Harness worker unavailable: ${error.message}` : 'Harness worker unavailable.');
        }
      }
    })();

    return () => { current = false; controller.abort(); };
  }, [activeScenario]);

  useEffect(() => () => stopManagerFinanceTrustScoresWorker(), []);

  return (
    <div data-manager-harness="true" data-theme={theme} data-session-mode={sessionMode} data-scenario={activeScenario}>
      {process.env.NODE_ENV !== 'production' && (
        <div aria-label="Standalone harness scenario controls" data-harness-controls="true">
          <label htmlFor="finance_trust_scores-scenario-select">MSW scenario</label>
          <select
            id="finance_trust_scores-scenario-select"
            aria-label="MSW scenario"
            value={activeScenario}
            onChange={(event) => setActiveScenario(event.currentTarget.value as ManagerFinanceTrustScoresHarnessScenario)}
          >
            {HARNESS_SCENARIO_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <output aria-live="polite" data-scenario-probe-status="true">{scenarioProbeStatus}</output>
        </div>
      )}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <QueryClientProvider client={queryClient}>{moduleContent}</QueryClientProvider>
      </NextIntlClientProvider>
    </div>
  );
}
