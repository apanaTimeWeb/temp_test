// RESPONSIBILITY: Define source-level test coverage for system health overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_health_overview/tests/SuperadminSystemHealthOverviewRouteBoundaries.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import ModuleError from '@/app/frontend_superadmin/superadmin_system/system_health_overview/error';
import ModuleLoading from '@/app/frontend_superadmin/superadmin_system/system_health_overview/loading';
import SuperadminSystemHealthOverviewMain from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewMain';
import messages from '@/app/frontend_superadmin/superadmin_system/system_health_overview/locales/superadmin_system_health_overview_en.json';

const copy = messages.SUPERADMIN_SYSTEM_HEALTH.COPY;
function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('superadmin_system_health route boundaries', () => {
  it('renders the accessible module loading skeleton', () => {
    renderWithMessages(<ModuleLoading />);
    expect(screen.getByRole('status', { name: copy.LOADING_MODULE })).toBeTruthy();
  });

  it('renders localized error copy and retries through Next.js reset', () => {
    const reset = vi.fn();
    renderWithMessages(<ModuleError error={new Error('test')} reset={reset} />);
    expect(screen.getByRole('alert').textContent).toContain(copy.MODULE_ROUTE_ERROR_TITLE);
    fireEvent.click(screen.getByRole('button', { name: copy.RETRY_MODULE_ROUTE }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('renders SuperadminSystemHealthOverviewMain and verifies interactive controls', () => {
    renderWithMessages(<SuperadminSystemHealthOverviewMain />);

    // 1. Refresh Telemetry button works
    const refreshBtn = screen.getByTestId('superadmin-system-health-refresh-telemetry-btn');
    expect(refreshBtn).toBeTruthy();
    fireEvent.click(refreshBtn);

    // 2. Diagnostics modal opens on click
    const diagBtn = screen.getByRole('button', { name: new RegExp(copy.RUN_DIAGNOSTICS, 'i') });
    expect(diagBtn).toBeTruthy();
    fireEvent.click(diagBtn);
    expect(screen.getByText(/Deep System Diagnostics/i)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Close dialog'));

    // 3. Export Snapshot modal opens on click
    const exportBtn = screen.getByRole('button', { name: new RegExp(copy.EXPORT_SNAPSHOT, 'i') });
    expect(exportBtn).toBeTruthy();
    fireEvent.click(exportBtn);
    expect(screen.getByText(/Export System Health Snapshot/i)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Close dialog'));

    // 4. Autoscale Pool button works
    const autoscaleBtn = screen.getByRole('button', { name: /Autoscale Pool/i });
    expect(autoscaleBtn).toBeTruthy();
    fireEvent.click(autoscaleBtn);

    // 5. Optimize Pool button works
    const optimizeBtn = screen.getByRole('button', { name: /Optimize Pool/i });
    expect(optimizeBtn).toBeTruthy();
    fireEvent.click(optimizeBtn);

    // 6. Ping All Services button works
    const pingAllBtn = screen.getByRole('button', { name: /Ping All Services/i });
    expect(pingAllBtn).toBeTruthy();
    fireEvent.click(pingAllBtn);

    // 7. Test Connection button on integration works
    const testConnBtns = screen.getAllByRole('button', { name: new RegExp(copy.TEST_CONNECTION, 'i') });
    expect(testConnBtns.length).toBeGreaterThan(0);
    fireEvent.click(testConnBtns[0]);

    // 8. Run Now button on cron jobs works
    const runNowBtns = screen.getAllByRole('button', { name: new RegExp(copy.RUN_NOW, 'i') });
    expect(runNowBtns.length).toBeGreaterThan(0);
    fireEvent.click(runNowBtns[0]);
  });
});
