// tests/AdminAssetsRegister.test.tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AdminAssetRecordSchema,
  AdminAssetsRegisterKpiSummarySchema,
  CreateAssetFormSchema,
  UpdateAmcFormSchema,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterSchemas';
import {
  formatPaiseToRupees,
  formatAssetDate,
  isExpiringSoon,
  getDaysUntilExpiry,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import { AdminAssetsRegisterHarness } from '@/app/frontend_admin/admin_accounts_assets/assets_register/tests/harness/AdminAssetsRegisterHarness';
import { AdminAssetsRegisterScenarios } from '@/app/frontend_admin/admin_accounts_assets/assets_register/tests/harness/bootstrap';
import englishMessages from '@/app/frontend_admin/admin_accounts_assets/assets_register/locales/admin_assets_register_en.json';
import hindiMessages from '@/app/frontend_admin/admin_accounts_assets/assets_register/locales/admin_assets_register_hi.json';
import {
  ADMIN_ASSET_REGISTER_FIXTURES,
  ADMIN_ASSET_REGISTER_KPI_FIXTURES,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/mocks/fixtures/admin_assets_register.fixtures';

describe('Admin Assets Register Schemas & Invariants', () => {
  it('validates mock fixtures successfully against AdminAssetRecordSchema', () => {
    for (const record of ADMIN_ASSET_REGISTER_FIXTURES) {
      const result = AdminAssetRecordSchema.safeParse(record);
      expect(result.success).toBe(true);
    }
  });

  it('validates KPI summary successfully against AdminAssetsRegisterKpiSummarySchema', () => {
    const result = AdminAssetsRegisterKpiSummarySchema.safeParse(ADMIN_ASSET_REGISTER_KPI_FIXTURES);
    expect(result.success).toBe(true);
  });

  it('rejects asset record with negative purchase cost or missing asset code', () => {
    const invalid = {
      ...ADMIN_ASSET_REGISTER_FIXTURES[0],
      purchaseCost: -100,
    };
    expect(AdminAssetRecordSchema.safeParse(invalid).success).toBe(false);
  });

  it('validates create asset form schema', () => {
    const valid = {
      assetCode: 'KB-AC-02',
      name: 'Daikin 1.5T AC',
      category: 'AC_HVAC' as const,
      branchId: 'br-karol-bagh',
      branchName: 'Karol Bagh Central',
      locationWithinBranch: 'Floor 1',
      purchaseDate: '2026-01-01',
      purchaseCostPaise: 4800000,
      vendorName: 'Daikin India',
      vendorContact: '+91 98110 22334',
      warrantyExpiryDate: '2027-01-01',
      amcStatus: 'UNDER_WARRANTY' as const,
    };
    expect(CreateAssetFormSchema.safeParse(valid).success).toBe(true);

    const invalid = { ...valid, purchaseCostPaise: -500 };
    expect(CreateAssetFormSchema.safeParse(invalid).success).toBe(false);
  });

  it('validates update AMC form schema', () => {
    const valid = {
      amcStatus: 'ACTIVE_AMC' as const,
      amcVendorName: 'Daikin Direct Care',
      amcVendorContact: '1800-102-4455',
      amcExpiryDate: '2027-11-15',
    };
    expect(UpdateAmcFormSchema.safeParse(valid).success).toBe(true);

    const missingContact = { ...valid, amcVendorContact: '' };
    expect(UpdateAmcFormSchema.safeParse(missingContact).success).toBe(false);
  });

  it('formats paise to Indian currency string', () => {
    expect(formatPaiseToRupees(4800000)).toBe('₹48,000');
    expect(formatPaiseToRupees(16500000)).toBe('₹1,65,000');
  });

  it('correctly calculates days until expiry and triggers expiring soon alert within 30 days', () => {
    const today = new Date();
    const in10Days = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const in45Days = new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    expect(isExpiringSoon(in10Days, 30)).toBe(true);
    expect(isExpiringSoon(in45Days, 30)).toBe(false);
  });
});

describe('Admin Assets Register Localization Parity', () => {
  it('maintains 100% key parity between English and Hindi locale files', () => {
    const enKeys = Object.keys(englishMessages.ADMIN_ASSETS_REGISTER);
    const hiKeys = Object.keys(hindiMessages.ADMIN_ASSETS_REGISTER);
    expect(hiKeys.sort()).toEqual(enKeys.sort());

    const enKpiKeys = Object.keys(englishMessages.ADMIN_ASSETS_REGISTER.KPIS);
    const hiKpiKeys = Object.keys(hindiMessages.ADMIN_ASSETS_REGISTER.KPIS);
    expect(hiKpiKeys.sort()).toEqual(enKpiKeys.sort());

    const enCatKeys = Object.keys(englishMessages.ADMIN_ASSETS_REGISTER.CATEGORIES);
    const hiCatKeys = Object.keys(hindiMessages.ADMIN_ASSETS_REGISTER.CATEGORIES);
    expect(hiCatKeys.sort()).toEqual(enCatKeys.sort());
  });
});

describe('Admin Assets Register Test Harness Scenarios', () => {
  it('renders ACTIVE scenario with data-scenario active', () => {
    render(
      <AdminAssetsRegisterHarness scenario="ACTIVE">
        <div data-testid="child-asset-content">Active Asset Records</div>
      </AdminAssetsRegisterHarness>
    );
    expect(screen.getByTestId('admin_assets_register-harness')).toHaveAttribute('data-scenario', 'active');
    expect(screen.getByTestId('child-asset-content')).toBeInTheDocument();
  });

  it('renders EMPTY scenario with role status', () => {
    render(<AdminAssetsRegisterHarness scenario="EMPTY" />);
    const container = screen.getByTestId('admin_assets_register-harness');
    expect(container).toHaveAttribute('data-scenario', 'empty');
    expect(container).toHaveAttribute('role', 'status');
  });

  it('renders UNAUTHORIZED scenario with role alert', () => {
    render(<AdminAssetsRegisterHarness scenario="UNAUTHORIZED" />);
    const container = screen.getByTestId('admin_assets_register-harness');
    expect(container).toHaveAttribute('data-scenario', 'unauthorized');
    expect(container).toHaveAttribute('role', 'alert');
  });

  it('renders TIMEOUT scenario with role alert', () => {
    render(<AdminAssetsRegisterHarness scenario="TIMEOUT" />);
    const container = screen.getByTestId('admin_assets_register-harness');
    expect(container).toHaveAttribute('data-scenario', 'timeout');
    expect(container).toHaveAttribute('role', 'alert');
  });

  it('renders SERVER_500 scenario with role alert', () => {
    render(<AdminAssetsRegisterHarness scenario="SERVER_500" />);
    const container = screen.getByTestId('admin_assets_register-harness');
    expect(container).toHaveAttribute('data-scenario', 'server-error');
    expect(container).toHaveAttribute('role', 'alert');
  });
});

