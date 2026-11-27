import AdminAccountsDailySettlementDiscrepancyModal from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementDiscrepancyModal';
import { AdminAccountsDailySettlementPage } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementPage';
import { printDailySettlementVoucher } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementTableRow';
import dailySettlementMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/locales/admin_accounts_daily_settlement_en.json';
import { ADMIN_DAILY_SETTLEMENT_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/mocks/fixtures/admin_accounts_daily_settlement.fixtures';
import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/admin/accounts',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider', () => ({
  useAdminBranch: () => ({
    selectedBranchId: 'ALL',
    selectedBranch: null,
    isAllBranches: true,
    availableBranches: [{ id: 'branch-1', name: 'Downtown Central' }],
  }),
}));

vi.mock('@/lib/runtimeFeatures', () => ({
  isFrontendDemoModeEnabled: () => true,
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

describe('AdminAccountsDailySettlement Controls & Discrepancy Resolution', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders CSV, Excel, and Print Summary buttons on settlement page', () => {
    render(
      <NextIntlClientProvider locale="en" messages={dailySettlementMessages}>
        <AdminAccountsDailySettlementPage />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole('button', { name: /CSV/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Excel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Print Summary/i })).toBeInTheDocument();
  });

  it('triggers CSV and Excel downloads on button click', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();

    render(
      <NextIntlClientProvider locale="en" messages={dailySettlementMessages}>
        <AdminAccountsDailySettlementPage />
      </NextIntlClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /CSV/i }));
    expect(clickSpy).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Excel/i }));
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it('prints daily settlement voucher with opening cash, handover and variance', () => {
    const writeMock = vi.fn();
    const closeMock = vi.fn();
    const mockWindow = { document: { open: vi.fn(), write: writeMock, close: closeMock } };
    vi.spyOn(window, 'open').mockReturnValue(mockWindow as unknown as Window);

    const sampleRecord = ADMIN_DAILY_SETTLEMENT_FIXTURES[0];
    printDailySettlementVoucher(sampleRecord);

    expect(window.open).toHaveBeenCalledWith('', '_blank', 'width=750,height=800');
    expect(writeMock).toHaveBeenCalled();
    const htmlWritten = writeMock.mock.calls[0][0];
    expect(htmlWritten).toContain('Daily Cash Closing & Handover Voucher');
    expect(htmlWritten).toContain(sampleRecord.branchName);
    expect(htmlWritten).toContain(sampleRecord.managerName);
    expect(closeMock).toHaveBeenCalled();
  });

  const mockSettlement: DailySettlementRecord = {
    id: 'SETTLE-101',
    date: '2026-11-18',
    branchId: 'BR-001',
    branchName: 'Downtown Central',
    shiftName: 'Morning Shift',
    managerId: 'MGR-01',
    managerName: 'Rahul Sharma',
    openingCash: 50000,
    cashCollected: 300000,
    upiCollected: 500000,
    expensesPaid: 20000,
    expectedClosingCash: 330000,
    actualHandoverCash: 280000,
    difference: -50000,
    status: 'PENDING_APPROVAL',
    createdAt: '2026-11-18T14:00:00Z',
  };

  it('allows admin to choose between salary deduction, carry-forward, on-spot deposit, or loss write-off', async () => {
    const onConfirm = vi.fn().mockResolvedValue(true);

    render(
      <NextIntlClientProvider locale="en" messages={dailySettlementMessages}>
        <AdminAccountsDailySettlementDiscrepancyModal
          record={mockSettlement}
          isOpen={true}
          isSubmitting={false}
          onClose={vi.fn()}
          onConfirm={onConfirm}
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText('Deduct from Salary')).toBeDefined();
    expect(screen.getByText('Carry-Forward Deficit')).toBeDefined();
    expect(screen.getByText('Immediate Deposit')).toBeDefined();
    expect(screen.getByText('Waive / Loss Absorption')).toBeDefined();

    fireEvent.click(screen.getByLabelText(/Carry-Forward Deficit/i));
    fireEvent.change(
      screen.getByPlaceholderText('Explain discrepancy details, CCTV verification notes, or manager explanation...'),
      {
        target: { value: 'Manager Rahul Sharma will cover shortage in morning handover' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: /Flag Discrepancy & Alert Manager/i }));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          settlementId: 'SETTLE-101',
          resolutionAction: 'CARRY_FORWARD',
          adminNotes: 'Manager Rahul Sharma will cover shortage in morning handover',
        }),
      );
    });
  });

  it('submits salary deduction strategy when selected', async () => {
    const onConfirm = vi.fn().mockResolvedValue(true);

    render(
      <NextIntlClientProvider locale="en" messages={dailySettlementMessages}>
        <AdminAccountsDailySettlementDiscrepancyModal
          record={mockSettlement}
          isOpen={true}
          isSubmitting={false}
          onClose={vi.fn()}
          onConfirm={onConfirm}
        />
      </NextIntlClientProvider>,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Explain discrepancy details, CCTV verification notes, or manager explanation...'),
      {
        target: { value: 'Shortage of ₹500 deducted from November salary' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: /Flag Discrepancy & Alert Manager/i }));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          settlementId: 'SETTLE-101',
          resolutionAction: 'DEDUCT_SALARY',
        }),
      );
    });
  });
});
