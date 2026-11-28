import AdminMembersEnquiriesImportModal from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesImportModal';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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
      />,
    );

    expect(screen.getByText('Import Leads & Enquiries (CSV)')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Download Leads CSV Template/i })).toBeTruthy();
    expect(screen.getByText(/Click or drag & drop Leads CSV file here/i)).toBeTruthy();

    fireEvent.click(screen.getByTitle('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });
});
