"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import messagesEn from '../../locales/manager_navigation_navigation_domain_en.json';
import messagesHi from '../../locales/manager_navigation_navigation_domain_hi.json';
import { MANAGER_NAVIGATION_NAVIGATION_SCENARIOS, type ManagerNavigationNavigationScenario } from '../../mocks/scenarios/manager_navigation_navigation.scenarios';
import { startManagerNavigationNavigationWorker, stopManagerNavigationNavigationWorker, MANAGER_NAVIGATION_NAVIGATION_SCENARIO_PROBE_URL } from './bootstrap';

type Props = { children: ReactNode; locale?: string; theme?: 'light' | 'dark'; sessionMode?: 'host-default' | 'authenticated' | 'unauthenticated'; scenario?: ManagerNavigationNavigationScenario['id'] };
/** Navigation harness preserves the supplied contract-blocked scenario registry; it does not fabricate route/API behavior. */
export function ManagerNavigationNavigationHarness({ children, locale = 'en', theme = 'light', sessionMode = 'host-default', scenario = 'default' }: Props) {
 const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false }, mutations: { retry: false } } }));
 const [activeScenario, setActiveScenario] = useState<ManagerNavigationNavigationScenario['id']>(scenario);
 const [status, setStatus] = useState('Navigation scenario not yet probed.');
 useEffect(() => { setActiveScenario(scenario); }, [scenario]);
 useEffect(() => { if (process.env.NODE_ENV === 'production') return; const controller = new AbortController(); let current = true; void (async () => { try { await startManagerNavigationNavigationWorker(activeScenario); const response = await fetch(MANAGER_NAVIGATION_NAVIGATION_SCENARIO_PROBE_URL, { cache: 'no-store', signal: controller.signal }); const body = await response.json().catch(() => null) as { contractStatus?: string; scenario?: string } | null; if (current) setStatus(`HTTP ${response.status} · ${body?.scenario ?? activeScenario} · ${body?.contractStatus ?? 'contract status unavailable'}`); } catch (error) { if (current && !controller.signal.aborted) setStatus(error instanceof Error ? error.message : 'Navigation harness worker unavailable.'); } })(); return () => { current = false; controller.abort(); }; }, [activeScenario]);
 useEffect(() => () => stopManagerNavigationNavigationWorker(), []);
 const messages = locale === 'hi' ? messagesHi : messagesEn;
 return <div data-manager-harness="true" data-theme={theme} data-session-mode={sessionMode} data-scenario={activeScenario}>{process.env.NODE_ENV !== 'production' && <div data-harness-controls="true"><label htmlFor="navigation-scenario">Scenario intent</label><select id="navigation-scenario" value={activeScenario} onChange={e => setActiveScenario(e.currentTarget.value as ManagerNavigationNavigationScenario['id'])}>{MANAGER_NAVIGATION_NAVIGATION_SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}</select><output aria-live="polite">{status}</output></div>}<NextIntlClientProvider locale={locale} messages={messages}><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></NextIntlClientProvider></div>;
}
