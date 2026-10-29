"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { ManagerSeatsHistoryMain } from '../../components/ManagerSeatsHistoryMain';
import messagesEn from '../../locales/manager_seats_history_domain_en.json';
import messagesHi from '../../locales/manager_seats_history_domain_hi.json';
import {
  startManagerSeatsHistoryWorker,
  stopManagerSeatsHistoryWorker,
  HARNESS_SCENARIO_OPTIONS,
  MANAGER_SEATS_HISTORY_SCENARIO_PROBE_URL,
  type ManagerSeatsHistoryHarnessScenario,
} from './bootstrap';

type ManagerSeatsHistoryHarnessProps = {
  children?: ReactNode;
  locale?: string;
  theme?: 'light' | 'dark';
  sessionMode?: 'host-default' | 'authenticated' | 'unauthenticated';
  scenario?: ManagerSeatsHistoryHarnessScenario;
};

/**
 * Isolated provider boundary. Auth, tenant and write contracts remain host-owned.
 * The dev selector drives a module-local MSW probe and never fabricates a business API.
 */
export function ManagerSeatsHistoryHarness({ children, locale = 'en', theme = 'light', sessionMode = 'host-default', scenario = 'ACTIVE' }: ManagerSeatsHistoryHarnessProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false }, mutations: { retry: false } },
  }));
  const [activeScenario, setActiveScenario] = useState<ManagerSeatsHistoryHarnessScenario>(scenario);
  const [scenarioProbeStatus, setScenarioProbeStatus] = useState('Harness scenario has not been verified yet.');
  const messages = locale === 'hi' ? messagesHi : messagesEn;
  const moduleContent = children ?? <ManagerSeatsHistoryMain />;

  useEffect(() => { setActiveScenario(scenario); }, [scenario]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const controller = new AbortController();
    let current = true;

    void (async () => {
      try {
        await startManagerSeatsHistoryWorker(activeScenario);
        // Exercise the selected MSW response; the URL is reserved for this harness only.
        const response = await fetch(MANAGER_SEATS_HISTORY_SCENARIO_PROBE_URL, { cache: 'no-store', signal: controller.signal });
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

  useEffect(() => () => stopManagerSeatsHistoryWorker(), []);

  return (
    <div data-manager-harness="true" data-theme={theme} data-session-mode={sessionMode} data-scenario={activeScenario}>
      {process.env.NODE_ENV !== 'production' && (
        <div aria-label="Standalone harness scenario controls" data-harness-controls="true">
          <label htmlFor="seats_history-scenario-select">MSW scenario</label>
          <select
            id="seats_history-scenario-select"
            aria-label="MSW scenario"
            value={activeScenario}
            onChange={(event) => setActiveScenario(event.currentTarget.value as ManagerSeatsHistoryHarnessScenario)}
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
