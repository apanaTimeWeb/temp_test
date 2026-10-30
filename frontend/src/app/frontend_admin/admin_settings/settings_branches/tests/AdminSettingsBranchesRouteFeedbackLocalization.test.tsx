import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import messages from '@/app/frontend_admin/admin_settings/settings_branches/locales/admin_settings_branches_en.json';
import ErrorBoundary from '@/app/frontend_admin/admin_settings/settings_branches/error';
import Loading from '@/app/frontend_admin/admin_settings/settings_branches/loading';

vi.mock('@/lib/errorMonitoring', () => ({ reportAdminError: vi.fn() }));

afterEach(() => cleanup());

function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('admin_branches route feedback localization', () => {
  it('renders localized error-boundary feedback and a working retry control', () => {
    const reset = vi.fn();
    renderWithMessages(<ErrorBoundary error={new Error('test error')} reset={reset} />);
    expect(screen.getByRole('heading', { name: 'Something went wrong.' })).toBeTruthy();
    expect(screen.getByText('We could not complete this view. You can retry the current module.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('exposes the localized loading accessible name and screen-reader text', () => {
    renderWithMessages(<Loading />);
    expect(screen.getByRole('status', { name: 'Loading branches' })).toBeTruthy();
    expect(screen.getByText('Loading branch content')).toBeTruthy();
  });
});
