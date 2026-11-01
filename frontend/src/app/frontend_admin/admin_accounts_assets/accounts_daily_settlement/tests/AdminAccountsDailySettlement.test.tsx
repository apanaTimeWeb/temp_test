// tests/AdminAccountsDailySettlement.test.tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  DailySettlementRecordSchema,
  DailySettlementKpiSummarySchema,
  ApproveSettlementFormSchema,
  FlagDiscrepancyFormSchema,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/schemas/AdminAccountsDailySettlementSchemas';
import {
  formatPaiseToRupees,
  formatSettlementDate,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import { AdminAccountsDailySettlementHarness } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/tests/harness/AdminAccountsDailySettlementHarness';
import { AdminAccountsDailySettlementScenarios } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/tests/harness/bootstrap';
import englishMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/locales/admin_accounts_daily_settlement_en.json';
import hindiMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/locales/admin_accounts_daily_settlement_hi.json';
import {
  ADMIN_DAILY_SETTLEMENT_FIXTURES,
  ADMIN_DAILY_SETTLEMENT_KPI_FIXTURES,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/mocks/fixtures/admin_accounts_daily_settlement.fixtures';

describe('Admin Accounts Daily Settlement Schemas & Utilities', () => {
  it('validates mock fixture records successfully against DailySettlementRecordSchema', () => {
    for (const record of ADMIN_DAILY_SETTLEMENT_FIXTURES) {
      const result = DailySettlementRecordSchema.safeParse(record);
      expect(result.success).toBe(true);
    }
  });

  it('validates KPI summary successfully against DailySettlementKpiSummarySchema', () => {
    const result = DailySettlementKpiSummarySchema.safeParse(ADMIN_DAILY_SETTLEMENT_KPI_FIXTURES);
    expect(result.success).toBe(true);
  });

  it('rejects settlement record with negative opening cash or invalid status', () => {
    const invalidRecord = {
      ...ADMIN_DAILY_SETTLEMENT_FIXTURES[0],
      openingCash: -500,
      status: 'INVALID_STATUS',
    };
    const result = DailySettlementRecordSchema.safeParse(invalidRecord);
    expect(result.success).toBe(false);
  });

  it('validates approve settlement form schema', () => {
    const valid = { verifiedCashAmount: 1030000, adminNotes: 'Verified at counter' };
    expect(ApproveSettlementFormSchema.safeParse(valid).success).toBe(true);

    const invalid = { verifiedCashAmount: -100 };
    expect(ApproveSettlementFormSchema.safeParse(invalid).success).toBe(false);
  });

  it('validates flag discrepancy form schema requiring at least 5 chars in notes', () => {
    const valid = { discrepancyReason: 'CASH_SHORTAGE', adminNotes: 'Drawer was ₹1,000 short' };
    expect(FlagDiscrepancyFormSchema.safeParse(valid).success).toBe(true);

    const tooShort = { discrepancyReason: 'CASH_SHORTAGE', adminNotes: '123' };
    expect(FlagDiscrepancyFormSchema.safeParse(tooShort).success).toBe(false);
  });

  it('formats paise to Indian Rupees with two decimal places', () => {
    expect(formatPaiseToRupees(1030000)).toBe('₹10,300.00');
    expect(formatPaiseToRupees(0)).toBe('₹0.00');
    expect(formatPaiseToRupees(-100000)).toBe('-₹1,000.00');
  });

  it('formats dates consistently', () => {
    const formatted = formatSettlementDate('2026-11-01');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Nov');
  });
});

describe('Admin Accounts Daily Settlement Localization Parity', () => {
  it('maintains 100% key parity between English and Hindi locale files', () => {
    const enKeys = Object.keys(englishMessages.ADMIN_ACCOUNTS_DAILY_SETTLEMENT);
    const hiKeys = Object.keys(hindiMessages.ADMIN_ACCOUNTS_DAILY_SETTLEMENT);
    expect(hiKeys.sort()).toEqual(enKeys.sort());

    const enKpiKeys = Object.keys(englishMessages.ADMIN_ACCOUNTS_DAILY_SETTLEMENT.KPIS);
    const hiKpiKeys = Object.keys(hindiMessages.ADMIN_ACCOUNTS_DAILY_SETTLEMENT.KPIS);
    expect(hiKpiKeys.sort()).toEqual(enKpiKeys.sort());

    const enTableKeys = Object.keys(englishMessages.ADMIN_ACCOUNTS_DAILY_SETTLEMENT.TABLE);
    const hiTableKeys = Object.keys(hindiMessages.ADMIN_ACCOUNTS_DAILY_SETTLEMENT.TABLE);
    expect(hiTableKeys.sort()).toEqual(enTableKeys.sort());
  });
});

describe('Admin Accounts Daily Settlement Test Harness Scenarios', () => {
  it('renders ACTIVE scenario with data-scenario active', () => {
    render(
      <AdminAccountsDailySettlementHarness scenario="ACTIVE">
        <div data-testid="child-content">Active Content</div>
      </AdminAccountsDailySettlementHarness>
    );
    expect(screen.getByTestId('admin_accounts_daily_settlement-harness')).toHaveAttribute('data-scenario', 'active');
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders EMPTY scenario with role status', () => {
    render(<AdminAccountsDailySettlementHarness scenario="EMPTY" />);
    const container = screen.getByTestId('admin_accounts_daily_settlement-harness');
    expect(container).toHaveAttribute('data-scenario', 'empty');
    expect(container).toHaveAttribute('role', 'status');
  });

  it('renders UNAUTHORIZED scenario with role alert', () => {
    render(<AdminAccountsDailySettlementHarness scenario="UNAUTHORIZED" />);
    const container = screen.getByTestId('admin_accounts_daily_settlement-harness');
    expect(container).toHaveAttribute('data-scenario', 'unauthorized');
    expect(container).toHaveAttribute('role', 'alert');
  });

  it('renders TIMEOUT scenario with role alert', () => {
    render(<AdminAccountsDailySettlementHarness scenario="TIMEOUT" />);
    const container = screen.getByTestId('admin_accounts_daily_settlement-harness');
    expect(container).toHaveAttribute('data-scenario', 'timeout');
    expect(container).toHaveAttribute('role', 'alert');
  });

  it('renders SERVER_500 scenario with role alert', () => {
    render(<AdminAccountsDailySettlementHarness scenario="SERVER_500" />);
    const container = screen.getByTestId('admin_accounts_daily_settlement-harness');
    expect(container).toHaveAttribute('data-scenario', 'server-error');
    expect(container).toHaveAttribute('role', 'alert');
  });
});

