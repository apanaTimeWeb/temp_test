// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_onboarding_setup/tests/SuperadminLibrariesOnboardingSetupRouteBoundaries.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMIN_SETUP_WIZARD_STEPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/constants/SuperadminLibrariesOnboardingSetupConstants';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import ModuleError from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/error';
import ModuleLoading from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/loading';
import messages from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/locales/superadmin_libraries_onboarding_setup_en.json';

const copy = messages.SUPERADMIN_SETUP_WIZARD.COPY;
function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('superadmin_setup_wizard route boundaries', () => {
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
  it('step headings use the localized titleKey contract', () => {
    expect(SUPERADMIN_SETUP_WIZARD_STEPS).toHaveLength(5);
    for (const step of SUPERADMIN_SETUP_WIZARD_STEPS) { expect(step.titleKey).toMatch(/^COPY\.STEP_[1-5]_TITLE$/); expect(step.descKey).toMatch(/^COPY\.STEP_[1-5]_DESC$/); }
  });
});
