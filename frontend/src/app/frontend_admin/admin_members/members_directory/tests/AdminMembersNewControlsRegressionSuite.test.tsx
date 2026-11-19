import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import AdminMembersDirectoryBulkImportModal from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryBulkImportModal';
import AdminMembersEnquiriesImportModal from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesImportModal';
import AdminMembersCouponsFlyerModal from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsFlyerModal';
import AdminMembersDirectoryDataToolsView from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDataToolsView';
import { AdminMembersDirectoryMemberDetailCard } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberDetailCard';
import { ADMIN_MEMBERS_FIXTURES } from '@/app/frontend_admin/admin_members/members_directory/mocks/AdminMembersDirectoryFixtures';
import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';

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

describe('Admin Members - Newly Added Controls Regression Suite', () => {
  describe('Bulk Import Students Modal (Directory)', () => {
    it('renders modal when open and offers download sample CSV template', () => {
      const onClose = vi.fn();
      const onImport = vi.fn();

      render(
        <AdminMembersDirectoryBulkImportModal
          isOpen={true}
          onClose={onClose}
          onImport={onImport}
          defaultBranch="Downtown Central"
        />
      );

      expect(screen.getByText('Bulk Import Students (CSV / Excel)')).toBeTruthy();
      expect(screen.getByRole('button', { name: /Download Sample CSV/i })).toBeTruthy();
      expect(screen.getByText(/Click to browse or drag & drop CSV file/i)).toBeTruthy();

      fireEvent.click(screen.getByTitle('Close modal'));
      expect(onClose).toHaveBeenCalled();
    });

    it('returns null when isOpen is false', () => {
      const { container } = render(
        <AdminMembersDirectoryBulkImportModal
          isOpen={false}
          onClose={vi.fn()}
          onImport={vi.fn()}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Import Leads Modal (Enquiries CRM)', () => {
    it('renders modal when open and offers lead template download', () => {
      const onClose = vi.fn();
      const onImport = vi.fn();

      render(
        <AdminMembersEnquiriesImportModal
          isOpen={true}
          onClose={onClose}
          onImport={onImport}
          defaultBranch="Westside Branch"
        />
      );

      expect(screen.getByText('Import Leads & Enquiries (CSV)')).toBeTruthy();
      expect(screen.getByRole('button', { name: /Download Leads CSV Template/i })).toBeTruthy();
      expect(screen.getByText(/Click or drag & drop Leads CSV file here/i)).toBeTruthy();

      fireEvent.click(screen.getByTitle('Close modal'));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Coupon Flyers & Vouchers Modal (Coupons)', () => {
    it('renders flyer cards for active promotional coupons with print trigger', () => {
      const onClose = vi.fn();

      render(
        <AdminMembersCouponsFlyerModal
          isOpen={true}
          onClose={onClose}
          coupons={mockCoupons}
        />
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

  describe('Document Download Control (Documents Tab)', () => {
    it('provides active download buttons for member documents', () => {
      render(
        <NextIntlClientProvider locale="en" messages={{ ADMIN_MEMBERS: { DOCUMENTS_TITLE: 'Member Documents', DOCUMENTS_SEARCH_LABEL: 'Search Documents', DOCUMENTS_SEARCH_PLACEHOLDER: 'Search by student...', DOCUMENTS_NO_MATCHES: 'No documents match', DOCUMENTS_SAMPLE_NOTICE: 'Demo documents', UNKNOWN_DATE: 'Unknown' } }}>
          <AdminMembersDirectoryDataToolsView mode="documents" members={ADMIN_MEMBERS_FIXTURES} />
        </NextIntlClientProvider>
      );

      const downloadButtons = screen.getAllByRole('button', { name: /Download/i });
      expect(downloadButtons.length).toBeGreaterThan(0);
      expect((downloadButtons[0] as HTMLButtonElement).disabled).toBe(false);
    });
  });

  describe('Fee Waiver & Special Concession Governance', () => {
    it('allows Admin to grant special fee waiver and displays concession credit in payment ledger', () => {
      const sampleMember = ADMIN_MEMBERS_FIXTURES[0];
      render(
        <NextIntlClientProvider locale="en" messages={{ ADMIN_MEMBERS: { STATUS_ACTIVE: 'Active', UNKNOWN_DATE: 'Unknown' } }}>
          <AdminMembersDirectoryMemberDetailCard
            member={sampleMember}
            detailTab="paymentHistory"
            isDemoMode={true}
          />
        </NextIntlClientProvider>
      );

      // Verify the Admin Exclusive Callout is displayed
      expect(screen.getByText(/Admin Exclusive Authority: Fee Concessions & Waivers/i)).toBeTruthy();

      // Open Waiver modal
      const grantBtn = screen.getByRole('button', { name: /Grant Fee Waiver \/ Discount/i });
      fireEvent.click(grantBtn);

      // Verify modal is open
      expect(screen.getByText(/Admin Sanction: Grant Special Fee Waiver/i)).toBeTruthy();
      expect(screen.getByText(/Signing Authority:/i)).toBeTruthy();

      // Authorize waiver
      const authorizeBtn = screen.getByRole('button', { name: /Authorize & Credit Memo/i });
      fireEvent.click(authorizeBtn);

      // Verify the Concession Order slip modal appears
      expect(screen.getByText('Official Concession Order')).toBeTruthy();
      expect(screen.getByText(/Sanctioned under Executive Admin Power/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /Print Order Letter/i })).toBeTruthy();
    });
  });
});
