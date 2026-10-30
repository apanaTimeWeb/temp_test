import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/app/frontend_admin/admin_accounts_assets/assets_register/locales/admin_assets_register_en.json';
import ErrorBoundary from '@/app/frontend_admin/admin_accounts_assets/assets_register/error';
import AdminAccountingLoading from '@/app/frontend_admin/admin_accounts_assets/assets_register/loading';
import { AdminAssetsRegisterDeleteConfirmationDialog } from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterPage';
import AdminAssetsRegisterSummarySection from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterSummarySection';
import AdminAssetsRegisterFilterSection from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterFilterSection';
import { ADMIN_ASSETS_REGISTER_ASSET_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/assets_register/mocks/scenarios/admin_assets_register.scenarios';
import { AdminAssetsRegisterHarness } from '@/app/frontend_admin/admin_accounts_assets/assets_register/tests/harness/AdminAssetsRegisterHarness';
import { AdminAssetsRegisterScenarios } from '@/app/frontend_admin/admin_accounts_assets/assets_register/tests/harness/bootstrap';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { mswTestServer } from '@/app/frontend_admin/test/mswServer';
import { fetchAdminAssetsRegisterRecords } from '@/app/frontend_admin/admin_accounts_assets/assets_register/api/admin_assets_register_api';
import { ADMIN_ASSETS_REGISTER_MSW_HANDLERS } from '@/app/frontend_admin/admin_accounts_assets/assets_register/mocks/scenarios/admin_assets_register.scenarios';
import { ADMIN_ASSETS_REGISTER_API } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import { createAdminAssetsRegisterFormSchema } from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterFormSchemas';
import englishMessages from '@/app/frontend_admin/admin_accounts_assets/assets_register/locales/admin_assets_register_en.json';
import hindiMessages from '@/app/frontend_admin/admin_accounts_assets/assets_register/locales/admin_assets_register_hi.json';
import { adminAccountingMinorToMajor, buildAdminAssetsRegisterCsv, formatAdminAccountingCurrency, toAdminAccountingMinorUnits } from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterCurrencyAndCsv';


// Consolidated from AdminAssetsRegisterApi.test.ts; the assertions are retained in the V35 test suite.
describe('asset-register generic accounting transport boundary', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('accepts an empty list under the shared API envelope without inventing records', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
    mswTestServer.use(...ADMIN_ASSETS_REGISTER_MSW_HANDLERS);
    await expect(fetchAdminAssetsRegisterRecords()).resolves.toEqual([]);
  });

  it('rejects a response shape that contradicts the current frontend schema', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
    mswTestServer.use(http.get(ADMIN_ASSETS_REGISTER_API.list, () => HttpResponse.json({
      success: true,
      message: 'Malformed test response.',
      data: { records: [] },
      requestId: 'test-assets-register-malformed',
    })));
    await expect(fetchAdminAssetsRegisterRecords()).rejects.toThrow();
  });
});


// Consolidated from AdminAssetsRegisterAssetSchema.test.ts; the assertions are retained in the V35 test suite.
const english = englishMessages.ADMIN_ACCOUNTING.ASSETS;
const hindi = hindiMessages.ADMIN_ACCOUNTING.ASSETS;
const validDraft = { name: 'Air Conditioner', category: 'Appliance', purchaseDate: '2024-02-29', purchaseValue: 25000.25, location: 'Ground Floor' };

describe('AdminAssetsRegisterFormSchema localization and invariants', () => {
  it('returns English field-specific feedback for missing required fields', () => {
    const result = createAdminAssetsRegisterFormSchema((key) => english[key]).safeParse({ name: '', category: '', purchaseDate: '', purchaseValue: 0, location: '' });
    expect(result.success).toBe(false);
    if (result.success) throw new Error('Expected asset draft validation to fail.');
    expect(result.error.issues.map((issue) => issue.message)).toContain(english.VALIDATION_NAME_REQUIRED);
    expect(result.error.issues.map((issue) => issue.message)).toContain(english.VALIDATION_VALUE_POSITIVE);
  });

  it('uses the supplied locale messages and accepts a valid asset draft', () => {
    const schema = createAdminAssetsRegisterFormSchema((key) => hindi[key]);
    const invalid = schema.safeParse({ ...validDraft, name: '' });
    expect(invalid.success).toBe(false);
    if (!invalid.success) expect(invalid.error.issues[0]?.message).toBe(hindi.VALIDATION_NAME_REQUIRED);
    expect(schema.safeParse(validDraft).success).toBe(true);
  });

  it('rejects impossible calendar dates and fractions smaller than one paise', () => {
    const schema = createAdminAssetsRegisterFormSchema((key) => english[key]);
    expect(schema.safeParse({ ...validDraft, purchaseDate: '2026-02-30' }).success).toBe(false);
    expect(schema.safeParse({ ...validDraft, purchaseValue: 12.345 }).success).toBe(false);
  });
});


// Consolidated from AdminAssetsRegisterFormatCurrency.test.ts; the assertions are retained in the V35 test suite.
describe('admin accounting currency formatting', () => {
  it('converts minor units using the selected currency precision', () => {
    expect(adminAccountingMinorToMajor(1234, 'JPY', 'en-US')).toBe(1234);
    expect(adminAccountingMinorToMajor(1234, 'BHD', 'en-US')).toBe(1.234);
    expect(toAdminAccountingMinorUnits(1.234, 'BHD', 'en-US')).toBe(1234);
    expect(formatAdminAccountingCurrency(1234, 'en-US', 'JPY')).toContain('1,234');
  });
});


describe('asset-register CSV export', () => {
  it('exports actual asset fields in INR and neutralizes spreadsheet formula strings', () => {
    const csv = buildAdminAssetsRegisterCsv([{
      id: 7, name: '=HYPERLINK("bad")', category: 'Appliance', purchaseDate: '2026-10-01',
      purchaseValue: 123456, currentValue: 100000, location: 'Ground Floor', status: 'active',
    }], 'en-IN');
    expect(csv).toContain('"Asset Name"');
    expect(csv).toContain('"Purchase Value (INR)"');
    expect(csv).toContain("'=HYPERLINK(\"\"bad\"\")");
    expect(csv).toContain('"₹1,234.56"');
    expect(csv).toContain('"₹1,000.00"');
    expect(csv).not.toContain('Seat No');
  });
});

// Consolidated from AdminAssetsRegisterDeleteConfirmationDialog.test.tsx; the assertions are retained in the V35 test suite.
describe('AdminAssetsRegisterDeleteConfirmationDialog', () => {
  it('requires an explicit confirmation before calling the destructive action', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <AdminAssetsRegisterDeleteConfirmationDialog
        open
        title="Delete asset?"
        description="This removes the demo asset from transient state only."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Delete asset?' })).toBeTruthy();
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls the destructive action only after the user confirms', () => {
    const onConfirm = vi.fn();
    render(
      <AdminAssetsRegisterDeleteConfirmationDialog
        open
        title="Delete asset?"
        description="This removes the demo asset from transient state only."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});


// Consolidated from AdminAssetsRegisterRouteFeedbackLocalization.test.tsx; the assertions are retained in the V35 test suite.
vi.mock('@/lib/errorMonitoring', () => ({ reportAdminError: vi.fn() }));

afterEach(() => cleanup());

function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('admin_accounting route feedback localization', () => {
  it('renders localized error-boundary feedback and a working retry control', () => {
    const reset = vi.fn();
    renderWithMessages(<ErrorBoundary error={new Error('test error')} reset={reset} />);
    expect(screen.getByRole('heading', { name: 'Something went wrong.' })).toBeTruthy();
    expect(screen.getByText('We could not complete this view. You can retry the current module.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('exposes the localized loading accessible name and screen-reader text', () => {
    renderWithMessages(<AdminAccountingLoading />);
    expect(screen.getByRole('status', { name: 'Loading asset register' })).toBeTruthy();
  });
});


// Consolidated from AdminAssetsRegisterSections.test.tsx; the assertions are retained in the V35 test suite.
afterEach(() => cleanup());

describe('AdminAccountingAssets section components', () => {
  it('renders summary counts from the supplied asset rows', () => {
    render(<AdminAssetsRegisterSummarySection assets={ADMIN_ASSETS_REGISTER_ASSET_FIXTURES} totalValueLabel="₹1,000.00" labels={{ totalAssets: 'Total assets', currentValue: 'Current value', underMaintenance: 'Under maintenance', disposed: 'Disposed' }} />);
    expect(screen.getByText(String(ADMIN_ASSETS_REGISTER_ASSET_FIXTURES.length))).toBeTruthy();
    expect(screen.getByText('₹1,000.00')).toBeTruthy();
  });

  it('emits the canonical category value selected by the user', () => {
    const onCategoryChange = vi.fn();
    render(<AdminAssetsRegisterFilterSection label="Filter by category" allLabel="All categories" categories={['Furniture', 'Electronics']} categoryFilter="all" onCategoryChange={onCategoryChange} getCategoryLabel={(category) => category} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by category' }), { target: { value: 'Electronics' } });
    expect(onCategoryChange).toHaveBeenCalledWith('Electronics');
  });
});


// Consolidated from AdminAssetsRegisterHarness.test.tsx; the assertions are retained in the V35 test suite.
describe('asset-register mock scenarios', () => {
  it.each(AdminAssetsRegisterScenarios)('renders visible behavior for %s', (scenario) => {
    render(<AdminAssetsRegisterHarness scenario={scenario}><p>Active assets content</p></AdminAssetsRegisterHarness>);
    const harness = screen.getByTestId('admin_assets_register-harness');
    const labels = { ACTIVE: 'active', EMPTY: 'empty', SERVER_500: 'server-error', TIMEOUT: 'timeout', UNAUTHORIZED: 'unauthorized' } as const;
    expect(harness.getAttribute('data-scenario')).toBe(labels[scenario]);
    if (scenario === 'ACTIVE') expect(screen.getByText('Active assets content')).toBeTruthy();
    if (scenario === 'EMPTY') expect(screen.getByRole('status').textContent).toContain('No assets');
    if (scenario === 'UNAUTHORIZED') expect(screen.getByRole('alert').textContent).toContain('Access unavailable');
    if (scenario === 'SERVER_500' || scenario === 'TIMEOUT') {
      fireEvent.click(screen.getByRole('button', { name: 'Retry fixture' }));
      expect(screen.getByText('Active assets content')).toBeTruthy();
    }
  });
});
