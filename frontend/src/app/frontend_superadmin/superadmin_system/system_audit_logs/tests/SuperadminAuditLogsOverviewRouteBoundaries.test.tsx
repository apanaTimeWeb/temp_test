// RESPONSIBILITY: Define source-level test coverage for system audit logs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_audit_logs/tests/SuperadminAuditLogsOverviewRouteBoundaries.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import ModuleError from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/error';
import ModuleLoading from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/loading';
import messages from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/locales/superadmin_audit_logs_en.json';

const copy = messages.SUPERADMIN_AUDIT_LOGS.COPY;
function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('superadmin_audit route boundaries', () => {
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
});
