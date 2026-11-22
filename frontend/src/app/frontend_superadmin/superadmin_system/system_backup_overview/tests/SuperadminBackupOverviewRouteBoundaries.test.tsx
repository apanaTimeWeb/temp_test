// RESPONSIBILITY: Define source-level test coverage for system backup overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_overview/tests/SuperadminBackupOverviewRouteBoundaries.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import ModuleError from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/error';
import ModuleLoading from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/loading';
import messages from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/locales/superadmin_backup_overview_en.json';

const copy = messages.SUPERADMIN_BACKUP.COPY;
function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('superadmin_backup route boundaries', () => {
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
