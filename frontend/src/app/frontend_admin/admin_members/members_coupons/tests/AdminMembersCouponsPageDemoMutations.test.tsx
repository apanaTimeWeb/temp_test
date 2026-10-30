import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminCouponsPage from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsPage';
import { AdminCouponsDialog as AdminCouponsCreateDialog } from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsPage';
import englishMessages from '@/app/frontend_admin/admin_members/members_coupons/locales/admin_members_coupons_en.json';
import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';

const { toastInfoMock, toastSuccessMock } = vi.hoisted(() => ({ toastInfoMock: vi.fn(), toastSuccessMock: vi.fn() }));
vi.mock('sonner', () => {
  const toast = { info: toastInfoMock, success: toastSuccessMock, error: vi.fn() };
  return {
    default: toast,
    toast,
    Toaster: () => null,
  };
});

vi.mock('@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsOverviewSection', () => ({
  default: ({ coupons, columns, onCreateCoupon, onValidateDraft, isDemoMode }: { coupons: AdminCouponsCoupon[]; columns: readonly DataGridColumn<AdminCouponsCoupon>[]; onCreateCoupon?: () => void; onValidateDraft?: () => void; isDemoMode?: boolean }) => {
    const actionColumn = columns.find((column) => column.headerName === 'ACTIONS');
    return (
      <section aria-label="Coupon list">
        <button type="button" disabled={!isDemoMode} onClick={onCreateCoupon}>Create Coupon</button>
        <button type="button" onClick={onValidateDraft}>Validate Draft</button>
        <ul>
          {coupons.map((coupon) => (
            <li key={coupon.id}>
              <span>{coupon.code}</span>
              {actionColumn?.cellRenderer?.({ value: undefined, data: coupon } as DataGridCellParams<AdminCouponsCoupon>)}
            </li>
          ))}
        </ul>
        {coupons.length === 0 ? <p>No coupons found</p> : null}
      </section>
    );
  },
}));

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const view = render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={englishMessages}>
        <AdminCouponsPage />
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
  return { ...view, queryClient };
}

function renderDialog(onOpenChange = vi.fn(), isDemoMode = false, intent: 'draft' | 'create' = 'draft', onCreateDemoCoupon = vi.fn()) {
  return render(
    <NextIntlClientProvider locale="en" messages={englishMessages}>
      <AdminCouponsCreateDialog open isDemoMode={isDemoMode} intent={intent} onOpenChange={onOpenChange} onCreateDemoCoupon={onCreateDemoCoupon} />
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  toastInfoMock.mockClear();
  toastSuccessMock.mockClear();
});

describe('AdminCouponsPage demo mutations', () => {
  it('creates a coupon and shows it in the same list after form submission', async () => {
    const { unmount, queryClient } = renderPage();
    try {
      await screen.findByText('DEMO10');
      fireEvent.click(screen.getByRole('button', { name: 'Create Coupon' }));
      const dialog = await screen.findByRole('dialog');
      fireEvent.change(within(dialog).getByLabelText('Coupon Code'), { target: { value: ' save20 ' } });
      fireEvent.change(within(dialog).getByLabelText('Discount Value'), { target: { value: '20' } });
      fireEvent.change(within(dialog).getByLabelText('Maximum Uses'), { target: { value: '12' } });
      fireEvent.change(within(dialog).getByLabelText('Expiry Date'), { target: { value: '2027-12-31' } });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Create Demo Coupon' }));

      expect(await screen.findByText('SAVE20')).toBeTruthy();
      expect(screen.getByText('DEMO10')).toBeTruthy();
      expect(toastSuccessMock).toHaveBeenCalledWith('Demo coupon SAVE20 created in memory.');
    } finally {
      unmount();
      queryClient.clear();
    }
  });

  it('removes the selected demo coupon from the list after confirmation action', async () => {
    const { unmount, queryClient } = renderPage();
    try {
      await screen.findByText('DEMO10');
      fireEvent.click(screen.getByRole('button', { name: 'Remove demo coupon DEMO10' }));
      const confirmDialog = await screen.findByRole('dialog');
      expect(screen.getByText('DEMO10')).toBeTruthy();
      fireEvent.click(within(confirmDialog).getByRole('button', { name: 'Remove Demo Coupon' }));
      await waitFor(() => expect(screen.queryByText('DEMO10')).toBeNull());
      expect(toastSuccessMock).toHaveBeenCalledWith('Demo coupon DEMO10 removed from memory.');
    } finally {
      unmount();
      queryClient.clear();
    }
  });

  it('keeps the demo coupon when the delete confirmation is cancelled', async () => {
    const { unmount, queryClient } = renderPage();
    try {
      await screen.findByText('DEMO10');
      fireEvent.click(screen.getByRole('button', { name: 'Remove demo coupon DEMO10' }));
      const confirmDialog = await screen.findByRole('dialog');
      fireEvent.click(within(confirmDialog).getByRole('button', { name: 'Cancel' }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(screen.getByText('DEMO10')).toBeTruthy();
      expect(toastSuccessMock).not.toHaveBeenCalledWith('Demo coupon DEMO10 removed from memory.');
    } finally {
      unmount();
      queryClient.clear();
    }
  });

  it('keeps create/delete blocked outside explicit demo mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'false');
    const { unmount, queryClient } = renderPage();
    try {
      const createButton = screen.getByRole('button', { name: 'Create Coupon' });
      expect((createButton as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(screen.getByRole('button', { name: 'Validate Draft' }));
      const dialog = await screen.findByRole('dialog');
      expect(within(dialog).getByRole('button', { name: 'Validate Draft' })).toBeTruthy();
    } finally {
      unmount();
      queryClient.clear();
    }
  });
});

describe('AdminCouponsCreateDialog validation and non-persistence', () => {
  it('shows accessible validation errors and does not treat invalid draft as saved', async () => {
    toastInfoMock.mockClear();
    renderDialog();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Validate Draft' }));

    expect(await screen.findByText('Coupon code is required.')).toBeTruthy();
    expect(screen.getByText('Discount must be greater than zero.')).toBeTruthy();
    expect(screen.getByText('Maximum uses must be a positive whole number.')).toBeTruthy();
    expect(screen.getByText('Expiry date is required.')).toBeTruthy();
    expect(toastInfoMock).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
  });

  it('validates a correct draft but reports that no coupon was persisted', async () => {
    toastInfoMock.mockClear();
    renderDialog();
    fireEvent.change(screen.getByLabelText('Coupon Code'), { target: { value: ' SAVE10 ' } });
    fireEvent.change(screen.getByLabelText('Discount Value'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Maximum Uses'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Expiry Date'), { target: { value: '2027-01-01' } });
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Validate Draft' }));

    await waitFor(() => expect(toastInfoMock).toHaveBeenCalledWith('Draft validation passed. No coupon was created or saved.'));
  });

  it('submits validated values to the demo mutation owner in create intent', async () => {
    const onCreateDemoCoupon = vi.fn();
    const onOpenChange = vi.fn();
    renderDialog(onOpenChange, true, 'create', onCreateDemoCoupon);
    fireEvent.change(screen.getByLabelText('Coupon Code'), { target: { value: 'SAVE20' } });
    fireEvent.change(screen.getByLabelText('Discount Value'), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText('Maximum Uses'), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText('Expiry Date'), { target: { value: '2027-12-31' } });
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Create Demo Coupon' }));

    await waitFor(() => expect(onCreateDemoCoupon).toHaveBeenCalledWith({
      code: 'SAVE20', discount: 20, type: 'Flat', maxUses: 12, expiry: '2027-12-31',
    }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
