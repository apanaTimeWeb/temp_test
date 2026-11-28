import AdminMembersCouponsFlyerModal from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsFlyerModal';
import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockCoupons: AdminCouponsCoupon[] = [
  {
    id: 'test-c-1',
    code: 'WELCOME50',
    discount: 50,
    type: 'Percent',
    expiry: '2026-12-31',
    maxUses: 100,
    usedCount: 12,
    branchApplicability: 'Downtown Central',
    status: 'Active',
  },
  {
    id: 'test-c-2',
    code: 'FLAT500',
    discount: 500,
    type: 'Flat',
    expiry: '2026-11-30',
    maxUses: 50,
    usedCount: 5,
    branchApplicability: 'All Branches',
    status: 'Active',
  },
];

describe('Coupon Flyers & Vouchers Modal (Coupons)', () => {
  it('renders flyer cards for active promotional coupons with print trigger', () => {
    const onClose = vi.fn();

    render(
      <AdminMembersCouponsFlyerModal
        isOpen={true}
        onClose={onClose}
        coupons={mockCoupons}
      />,
    );

    expect(screen.getByText('Promotional Coupon Flyers & Handout Cards')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Print Flyers Sheet/i })).toBeTruthy();
    expect(screen.getByText('WELCOME50')).toBeTruthy();
    expect(screen.getByText('FLAT500')).toBeTruthy();
    expect(screen.getByText('50% OFF')).toBeTruthy();
    expect(screen.getByText('₹500 FLAT')).toBeTruthy();

    fireEvent.click(screen.getByTitle('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });
});
