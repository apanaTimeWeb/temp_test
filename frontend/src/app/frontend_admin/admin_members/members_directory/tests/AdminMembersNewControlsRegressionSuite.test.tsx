import AdminMembersDirectoryBulkImportModal from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryBulkImportModal';
import AdminMembersDirectoryDataToolsView from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDataToolsView';
import { AdminMembersDirectoryMemberDetailCard } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberDetailCard';
import { ADMIN_MEMBERS_FIXTURES } from '@/app/frontend_admin/admin_members/members_directory/mocks/fixtures/AdminMembersDirectoryFixtures';
import adminMembersMessages from '@/app/frontend_admin/admin_members/members_directory/locales/admin_members_directory_en.json';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

describe('Admin Members Directory - Newly Added Controls Regression Suite', () => {
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
        />,
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
        />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Document Download Control (Documents Tab)', () => {
    it('provides active download buttons for member documents', () => {
      render(
        <NextIntlClientProvider
          locale="en"
          messages={{
            ADMIN_MEMBERS: {
              DOCUMENTS_TITLE: 'Member Documents',
              DOCUMENTS_SEARCH_LABEL: 'Search Documents',
              DOCUMENTS_SEARCH_PLACEHOLDER: 'Search by student...',
              DOCUMENTS_NO_MATCHES: 'No documents match',
              DOCUMENTS_SAMPLE_NOTICE: 'Demo documents',
              UNKNOWN_DATE: 'Unknown',
            },
          }}
        >
          <AdminMembersDirectoryDataToolsView mode="documents" members={ADMIN_MEMBERS_FIXTURES} />
        </NextIntlClientProvider>,
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
        <NextIntlClientProvider locale="en" messages={adminMembersMessages}>
          <AdminMembersDirectoryMemberDetailCard
            member={sampleMember}
            detailTab="paymentHistory"
            isDemoMode={true}
          />
        </NextIntlClientProvider>,
      );

      expect(screen.getByText(/Admin Exclusive Authority: Fee Concessions & Waivers/i)).toBeTruthy();

      const grantBtn = screen.getByRole('button', { name: /Grant Fee Waiver \/ Discount/i });
      fireEvent.click(grantBtn);

      expect(screen.getByText(/Admin Sanction: Grant Special Fee Waiver/i)).toBeTruthy();
      expect(screen.getByText(/Signing Authority:/i)).toBeTruthy();

      const authorizeBtn = screen.getByRole('button', { name: /Authorize & Credit Memo/i });
      fireEvent.click(authorizeBtn);

      expect(screen.getByText('Official Concession Order')).toBeTruthy();
      expect(screen.getByText(/Sanctioned under Executive Admin Power/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /Print Order Letter/i })).toBeTruthy();
    });
  });
});
