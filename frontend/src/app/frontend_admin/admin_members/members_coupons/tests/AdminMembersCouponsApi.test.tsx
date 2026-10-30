import { fireEvent, render, screen } from '@testing-library/react';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import AdminCouponsOverviewSection from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsOverviewSection';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/app/frontend_admin/lib/api';
import { fetchAdminCoupons, AdminCouponsApiContractMissingError, resolveAdminCouponsStatus } from '@/app/frontend_admin/admin_members/members_coupons/api/admin_members_coupons_api';
import { ADMIN_COUPONS_API_LIST } from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.url_config';
import { ADMIN_COUPONS_MSW_HANDLERS } from '@/app/frontend_admin/admin_members/members_coupons/mocks/scenarios/admin_members_coupons.scenarios';
import { AdminCouponsApiRecordSchema } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';

vi.mock('@/app/frontend_admin/lib/api', () => ({ apiFetch: vi.fn() }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/admin/admin_members/members_coupons',
  useSearchParams: () => new URLSearchParams(),
}));

const EMPTY_COLUMNS: readonly DataGridColumn<AdminCouponsCoupon>[] = [];

afterEach(() => vi.clearAllMocks());

describe('fetchAdminCoupons API contract boundary', () => {
  it('fails closed before transport when the backend endpoint/DTO contract is missing', async () => {
    await expect(fetchAdminCoupons()).rejects.toBeInstanceOf(AdminCouponsApiContractMissingError);
    expect(ADMIN_COUPONS_API_LIST).toBeNull();
    expect(ADMIN_COUPONS_MSW_HANDLERS).toHaveLength(0);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('maps only known coupon lifecycle states and keeps unknown values fail-closed', () => {
    expect(resolveAdminCouponsStatus('active', undefined)).toBe('Active');
    expect(resolveAdminCouponsStatus('EXHAUSTED', true)).toBe('Exhausted');
    expect(resolveAdminCouponsStatus('expired', true)).toBe('Expired');
    expect(resolveAdminCouponsStatus(undefined, undefined)).toBe('Unknown');
    expect(resolveAdminCouponsStatus('future-state', undefined)).toBe('Unknown');
    expect(resolveAdminCouponsStatus('future-state', true)).toBe('Unknown');
    expect(resolveAdminCouponsStatus('future-state', false)).toBe('Unknown');
    expect(resolveAdminCouponsStatus(undefined, true)).toBe('Unknown');
    expect(resolveAdminCouponsStatus(undefined, false)).toBe('Unknown');
  });
});

describe('coupon API discount/date validation', () => {
  const base = { id: 'c1', code: 'TEST', discountType: 'percentage', discountValue: 100 };
  it('rejects percentages above 100 and malformed expiry dates', () => {
    expect(AdminCouponsApiRecordSchema.safeParse({ ...base, discountValue: 100 }).success).toBe(true);
    expect(AdminCouponsApiRecordSchema.safeParse({ ...base, discountValue: 100.01 }).success).toBe(false);
    expect(AdminCouponsApiRecordSchema.safeParse({ ...base, discountValue: 0 }).success).toBe(false);
    expect(AdminCouponsApiRecordSchema.safeParse({ ...base, discountValue: -1 }).success).toBe(false);
    expect(AdminCouponsApiRecordSchema.safeParse({ ...base, validUntil: '2026-02-30' }).success).toBe(false);
    expect(AdminCouponsApiRecordSchema.safeParse({ ...base, validUntil: '2024-02-29' }).success).toBe(true);
  });
});


describe('AdminCouponsOverviewSection result states', () => {
  it('shows an error with a working retry action instead of an empty state', () => {
    const onRetry = vi.fn();
    render(<AdminCouponsOverviewSection isDemoMode={false} onCreateCoupon={vi.fn()} onValidateDraft={vi.fn()} coupons={[]} columns={EMPTY_COLUMNS} isError isPending={false} onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('LOAD_ERROR')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'RETRY' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows the module empty state only after loading finishes without an error', () => {
    render(<AdminCouponsOverviewSection isDemoMode={false} onCreateCoupon={vi.fn()} onValidateDraft={vi.fn()} coupons={[]} columns={EMPTY_COLUMNS} isError={false} isPending={false} onRetry={vi.fn()} />);

    expect(screen.getByText('EMPTY_TITLE')).toBeTruthy();
    expect(screen.getByText('EMPTY_DESCRIPTION')).toBeTruthy();
  });
});
