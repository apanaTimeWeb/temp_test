import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import messages from '@/app/frontend_admin/admin_members/members_coupons/locales/admin_members_coupons_en.json';
import ErrorBoundary from '@/app/frontend_admin/admin_members/members_coupons/error';
import AdminCouponsLoading from '@/app/frontend_admin/admin_members/members_coupons/loading';

vi.mock('@/lib/errorMonitoring', () => ({ reportAdminError: vi.fn() }));

afterEach(() => cleanup());

function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('admin_coupons route feedback localization', () => {
  it('renders localized error-boundary feedback and a working retry control', () => {
    const reset = vi.fn();
    renderWithMessages(<ErrorBoundary error={new Error('test error')} reset={reset} />);
    expect(screen.getByRole('heading', { name: 'Something went wrong.' })).toBeTruthy();
    expect(screen.getByText('We could not complete this view. You can retry the current module.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('exposes the localized loading accessible name and screen-reader text', () => {
    renderWithMessages(<AdminCouponsLoading />);
    expect(screen.getByRole('status', { name: 'Loading coupons' })).toBeTruthy();
    expect(screen.getByText('Loading coupons…')).toBeTruthy();
  });
});
