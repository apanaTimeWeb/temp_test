'use client';


import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
import { managerSeatsShiftsLockersHandlers } from '../../mocks/manager_lockers_management_handlers/ManagerLockersManagementHandlers';
import { MANAGER_LOCKERS_MANAGEMENT_API } from '../../config/manager_lockers_management.url_config';
import enMessages from '../../locales/manager_lockers_management_domain_en.json';
import hiMessages from '../../locales/manager_lockers_management_domain_hi.json';

type ManagerLockersManagementHarnessProps = { children: ReactNode; locale?: string; theme?: 'light' | 'dark'; sessionMode?: 'host-default' | 'authenticated' | 'unauthenticated'; scenario?: 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';};

/** Minimal isolated provider boundary for feature tests. Host-specific auth and tenant providers are intentionally not fabricated. */
/** Theme/scenario are harness metadata; real auth/session providers remain host-only. */
export function ManagerLockersManagementHarness({ children, locale = 'en' , theme = 'light', sessionMode = 'host-default', scenario = 'ACTIVE'}: ManagerLockersManagementHarnessProps) {
  const [activeScenario, setActiveScenario] = useState(scenario);
  const currentScenario = activeScenario;
  const localizedMessages = locale === 'hi' ? hiMessages : enMessages;
  const hostOnlyScenario = currentScenario === 'SERVER_500' || currentScenario === 'TIMEOUT' || currentScenario === 'UNAUTHORIZED';

  useEffect(() => {
    const emptyHandlers = [
      http.get(MANAGER_LOCKERS_MANAGEMENT_API.SEAT_MATRIX, () => HttpResponse.json({ success: true, message: 'Seats, shifts and lockers data loaded.', data: [], requestId: 'msw-manager-lockers-management-empty' })),
      http.get(MANAGER_LOCKERS_MANAGEMENT_API.LOCKERS, () => HttpResponse.json({ success: true, message: 'Seats, shifts and lockers data loaded.', data: [], requestId: 'msw-manager-lockers-management-empty' })),
      http.get(MANAGER_LOCKERS_MANAGEMENT_API.ALLOCATIONS, () => HttpResponse.json({ success: true, message: 'Seats, shifts and lockers data loaded.', data: [], requestId: 'msw-manager-lockers-management-empty' })),
      http.get(MANAGER_LOCKERS_MANAGEMENT_API.HISTORY, () => HttpResponse.json({ success: true, message: 'Seats, shifts and lockers data loaded.', data: [], requestId: 'msw-manager-lockers-management-empty' })),
    ];
    const activeHandlers = hostOnlyScenario ? managerSeatsShiftsLockersHandlers : currentScenario === 'EMPTY' ? [...emptyHandlers, ...managerSeatsShiftsLockersHandlers] : managerSeatsShiftsLockersHandlers;
    const worker = setupWorker(...activeHandlers);
    void worker.start({ onUnhandledRequest: 'bypass' });
    return () => { worker.stop(); };
  }, [currentScenario, hostOnlyScenario]);

  useEffect(() => { if (scenario === 'ACTIVE' || scenario === 'EMPTY') setActiveScenario(scenario); }, [scenario]);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false }, mutations: { retry: false } },
  }));

  return (
    <div data-manager-harness="true" data-theme={theme} data-session-mode={sessionMode} data-scenario={currentScenario}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label htmlFor="manager-lockers-harness-scenario">Scenario</label>
        <select id="manager-lockers-harness-scenario" value={currentScenario} onChange={(event) => { const next = event.target.value as NonNullable<ManagerLockersManagementHarnessProps['scenario']>; if (next === 'ACTIVE' || next === 'EMPTY') setActiveScenario(next); }} disabled={hostOnlyScenario} aria-describedby="manager-lockers-harness-scenario-help">
          <option value="ACTIVE">ACTIVE — populated module fixtures</option>
          <option value="EMPTY">EMPTY — empty read fixtures</option>
          <option value="SERVER_500" disabled>SERVER_500 — host contract required</option>
          <option value="TIMEOUT" disabled>TIMEOUT — host contract required</option>
          <option value="UNAUTHORIZED" disabled>UNAUTHORIZED — host auth contract required</option>
        </select>
        <p id="manager-lockers-harness-scenario-help" role="status">{hostOnlyScenario ? 'This scenario requires an approved host error/auth contract.' : currentScenario === 'EMPTY' ? 'The active read handlers return empty result sets.' : 'The active read handlers use the supplied module fixtures.'}</p>
      </div>
      <NextIntlClientProvider locale={locale} messages={localizedMessages}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
    </div>
  );
}
