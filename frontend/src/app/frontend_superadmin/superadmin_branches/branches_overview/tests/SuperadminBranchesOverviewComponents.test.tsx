import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuperadminBranchesOverviewHeader from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewHeader';
import SuperadminBranchesOverviewKpiCards from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewKpiCards';
import SuperadminBranchesOverviewFilterBar from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewFilterBar';
import SuperadminBranchesOverviewCloseSafetyModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewCloseSafetyModal';
import SuperadminBranchesOverviewDetailsModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewDetailsModal';
import SuperadminBranchesOverviewTransferManagerModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewTransferManagerModal';
import { INITIAL_BRANCHES_DATA, SUPERADMIN_AVAILABLE_LIBRARIES } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/constants/SuperadminBranchesOverviewData';

describe('SuperadminBranchesOverview UI Components', () => {
  it('renders Header with title and Create Branch button', () => {
    const onCreate = vi.fn();
    render(
      <SuperadminBranchesOverviewHeader
        onCreateBranch={onCreate}
        onExportCsv={vi.fn()}
        onExportExcel={vi.fn()}
        onPrint={vi.fn()}
      />
    );

    expect(screen.getByText(/Branch Management — Complete Control/i)).toBeInTheDocument();
    const createBtn = screen.getByRole('button', { name: /Create New Branch/i });
    expect(createBtn).toBeInTheDocument();
    fireEvent.click(createBtn);
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('renders KPI Cards with branch counts and capacity', () => {
    render(<SuperadminBranchesOverviewKpiCards branches={INITIAL_BRANCHES_DATA} />);
    expect(screen.getByText('Total Branches')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Suspended')).toBeInTheDocument();
    expect(screen.getAllByText(/Closed/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Total Seats')).toBeInTheDocument();
  });

  it('renders FilterBar with search and dropdown controls', () => {
    const setSearch = vi.fn();
    const setSelectedLibrary = vi.fn();
    const setStatus = vi.fn();
    const onReset = vi.fn();

    render(
      <SuperadminBranchesOverviewFilterBar
        search=""
        setSearch={setSearch}
        selectedLibraryId="all"
        setSelectedLibraryId={setSelectedLibrary}
        statusFilter="all"
        setStatusFilter={setStatus}
        availableLibraries={SUPERADMIN_AVAILABLE_LIBRARIES}
        onReset={onReset}
        filteredCount={6}
        totalCount={6}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search by branch name/i);
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'Apex' } });
    expect(setSearch).toHaveBeenCalledWith('Apex');
  });

  it('enforces pre-flight blockers in CloseSafetyModal when dues are outstanding', () => {
    const branchWithDues = INITIAL_BRANCHES_DATA.find((b) => b.memberDues > 0)!;
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <SuperadminBranchesOverviewCloseSafetyModal
        branch={branchWithDues}
        onClose={onClose}
        onConfirmClose={onConfirm}
      />
    );

    expect(screen.getByText(/Pre-Flight Branch Closure Check/i)).toBeInTheDocument();
    expect(screen.getByText(/Closure Blocked:/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Confirm Soft-Close & Archive/i });
    expect(submitBtn).toBeDisabled();
  });

  it('allows closure in CloseSafetyModal when branch has zero liabilities', () => {
    const branchNoDues = {
      ...INITIAL_BRANCHES_DATA[0],
      outstandingBooks: 0,
      memberDues: 0,
    };
    const onClose = vi.fn();
    const onConfirm = vi.fn().mockReturnValue({ success: true });

    render(
      <SuperadminBranchesOverviewCloseSafetyModal
        branch={branchNoDues}
        onClose={onClose}
        onConfirmClose={onConfirm}
      />
    );

    expect(screen.getByText(/Clean Pre-Flight:/i)).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: /Confirm Soft-Close & Archive/i });
    expect(submitBtn).toBeEnabled();

    const textarea = screen.getByPlaceholderText(/Lease expired/i);
    fireEvent.change(textarea, { target: { value: 'End of lease' } });
    fireEvent.click(submitBtn);

    expect(onConfirm).toHaveBeenCalledWith(branchNoDues.id, 'End of lease');
  });

  it('renders DetailsModal with physical asset vs operational split', () => {
    const branch = INITIAL_BRANCHES_DATA[0];
    const onClose = vi.fn();

    render(<SuperadminBranchesOverviewDetailsModal branch={branch} onClose={onClose} />);
    expect(screen.getByText(branch.name)).toBeInTheDocument();
    expect(screen.getByText('Seat Capacity')).toBeInTheDocument();
    expect(screen.getByText('Operating Shifts')).toBeInTheDocument();
    expect(screen.getByText(/Allowed Branch Operational Modules/i)).toBeInTheDocument();
  });

  it('renders TransferManagerModal and submits new manager with reason', () => {
    const branch = INITIAL_BRANCHES_DATA[0];
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <SuperadminBranchesOverviewTransferManagerModal
        branch={branch}
        onClose={onClose}
        onConfirmTransfer={onConfirm}
      />
    );

    expect(screen.getByText(/Transfer Branch Manager/i)).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/e.g. Ramesh Kumar/i);
    const emailInput = screen.getByPlaceholderText(/ramesh@libraryos.io/i);
    const reasonInput = screen.getByPlaceholderText(/Relocation, role rotation/i);

    fireEvent.change(nameInput, { target: { value: 'Suman Sen' } });
    fireEvent.change(emailInput, { target: { value: 'suman.sen@apexlib.in' } });
    fireEvent.change(reasonInput, { target: { value: 'Promoted to regional lead' } });

    const submitBtn = screen.getByRole('button', { name: /Confirm Transfer & Log/i });
    fireEvent.click(submitBtn);

    expect(onConfirm).toHaveBeenCalledWith(
      branch.id,
      expect.objectContaining({ name: 'Suman Sen', email: 'suman.sen@apexlib.in' }),
      'Promoted to regional lead'
    );
  });
});
