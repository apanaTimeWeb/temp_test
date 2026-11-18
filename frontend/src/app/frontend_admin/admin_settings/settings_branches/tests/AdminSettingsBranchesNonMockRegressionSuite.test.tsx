// Consolidated from useAdminSettingsBranchesUnsavedChangesGuard.test.ts; preserves the module-owned guard hook and its navigation assertions.
import * as HarnessVitest from 'vitest';
import * as HarnessTestingLibrary from '@testing-library/react';
import { AdminSettingsBranchesHarness as HarnessScenarioComponent, AdminSettingsBranchesHarness } from '@/app/frontend_admin/admin_settings/settings_branches/tests/harness/AdminSettingsBranchesHarness';
import { AdminSettingsBranchesScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_settings/settings_branches/tests/harness/bootstrap';
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';
import { describe, expect, it, afterEach, vi, describe as __mergedDescribe } from 'vitest';


import { mswTestServer } from '@/app/frontend_admin/test/mswServer';
import { AdminBranchesApiRecordSchema, createAdminBranchesCreateFormSchema } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import { fetchAdminBranches } from '@/app/frontend_admin/admin_settings/settings_branches/api/admin_settings_branches_api';
import { ADMIN_BRANCHES_MSW_HANDLERS } from '@/app/frontend_admin/admin_settings/settings_branches/mocks/scenarios/admin_settings_branches.scenarios';

import AdminBranchesListViews from '@/app/frontend_admin/admin_settings/settings_branches/components/AdminSettingsBranchesListViews';
import type { AdminBranchesBranch } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import { ADMIN_BRANCHES_STATUS_OPTIONS } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';

import { useAdminBranchesStore } from '@/app/frontend_admin/admin_settings/settings_branches/state/useAdminSettingsBranchesStore';


import { NextIntlClientProvider } from 'next-intl';
import englishMessages from '@/app/frontend_admin/admin_settings/settings_branches/locales/admin_settings_branches_en.json';
import useAdminSettingsBranchesUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesUnsavedChangesGuard.ts';


describe("Consolidated: AdminSettingsBranchesHarness", () => {
    it('renders children when scenario is active', () => {
        render(<HarnessScenarioComponent scenario="ACTIVE"><span>Harness Content</span></HarnessScenarioComponent>);
        expect(screen.getByText('Harness Content')).toBeTruthy();
    });
});

describe("Consolidated: AdminSettingsBranchesRegressionSuite", () => {
    describe('Original suite: AdminSettingsBranchesApi.test.ts', () => {
        describe('fetchAdminBranches API contract', () => {
            afterEach(() => vi.unstubAllEnvs());
            it('validates the response and normalizes resource identity to a string', async () => {
                vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
                mswTestServer.use(...ADMIN_BRANCHES_MSW_HANDLERS);
                const branches = await fetchAdminBranches();
                expect(branches[0]).toMatchObject({ id: 'BR-DEMO-001', code: 'DEMO-CEN', status: 'Active' });
            });
        });
        describe('AdminBranchesApiRecordSchema required display values', () => {
            const valid = { id: 'b1', name: 'Branch', code: 'B1', address: 'Road', phone: '12345678', email: 'branch@example.invalid', manager: 'Manager', status: 'Active' };
            it('rejects blank or whitespace-only required display fields', () => {
                for (const field of ['name', 'code', 'address', 'phone', 'email', 'manager'] as const) {
                    expect(AdminBranchesApiRecordSchema.safeParse({ ...valid, [field]: '   ' }).success).toBe(false);
                }
            });
        });
    });
    describe('Original suite: AdminSettingsBranchesBranchTable.test.tsx', () => {
        const renderWithIntl = (ui: React.ReactElement) => render(
            <NextIntlClientProvider locale="en" messages={englishMessages}>
                {ui}
            </NextIntlClientProvider>
        );
        const branches: AdminBranchesBranch[] = [
            { id: 'branch-1', name: 'Downtown', code: 'DT-01', address: 'Unknown address', phone: '', email: '', manager: 'A Manager', status: 'Active' },
        ];
        describe('AdminBranchesBranchTable', () => {
            const makeListModel = (items: readonly AdminBranchesBranch[], activeTab: 'active' | 'all' = 'active') => ({
                activeTab, setActiveTab: vi.fn(), branches: items, setViewingBranch: vi.fn(),
            }) as unknown as Parameters<typeof AdminBranchesListViews>[0]['model'];
            it('renders the active branch list with action controls removed', () => {
                const model = makeListModel(branches);
                renderWithIntl(<AdminBranchesListViews model={model}/>);
                expect(screen.getAllByText('Downtown').length).toBeGreaterThan(0);
                expect(screen.getAllByText('DT-01').length).toBeGreaterThan(0);
                expect(screen.queryByRole('button', { name: /Open actions for Downtown/i })).toBeNull();
                expect(screen.queryByRole('button', { name: /View branch details/i })).toBeNull();
            });
            it('renders branch details as plain display without action menu', () => {
                renderWithIntl(<AdminBranchesListViews model={makeListModel(branches)}/>);
                expect(screen.queryByRole('menu')).toBeNull();
                expect(screen.queryByRole('menuitem')).toBeNull();
            });
            it('paginates active branches', () => {
                const manyBranches: AdminBranchesBranch[] = Array.from({ length: 30 }, (_, index) => ({
                    id: `branch-${index + 1}`,
                    name: `Branch ${index + 1}`,
                    code: `BR-${String(index + 1).padStart(2, '0')}`,
                    address: 'Unspecified',
                    phone: '',
                    email: '',
                    manager: 'Unknown manager',
                    status: 'Active' as AdminBranchesBranch['status'],
                }));
                const model = makeListModel(manyBranches);
                renderWithIntl(<AdminBranchesListViews model={model}/>);
                const nextBtn = screen.getByRole('button', { name: 'Next' });
                fireEvent.click(nextBtn);
                expect(screen.getByText('Showing 26–30 of 30')).toBeTruthy();
            });
        });
    });
    describe('Original suite: AdminSettingsBranchesConstants.test.ts', () => {
        describe('AdminBranchesConstants', () => {
            it('exposes the single canonical set of branch status values', () => {
                expect(ADMIN_BRANCHES_STATUS_OPTIONS).toEqual(['Active', 'Suspended', 'Archived']);
                expect(new Set(ADMIN_BRANCHES_STATUS_OPTIONS).size).toBe(ADMIN_BRANCHES_STATUS_OPTIONS.length);
            });
        });
    });
    describe('Original suite: AdminSettingsBranchesSchema.test.ts', () => {
        const messages = {
            nameRequired: 'name-required', nameTooShort: 'name-short', nameTooLong: 'name-long',
            codeRequired: 'code-required', codeInvalid: 'code-invalid', codeTooLong: 'code-long',
            addressRequired: 'address-required', addressTooLong: 'address-long', phoneInvalid: 'phone-invalid', phoneTooLong: 'phone-long',
            emailInvalid: 'email-invalid', emailTooLong: 'email-long',
        };
        describe('admin branches create form schema', () => {
            it('requires valid contact and branch data using localized messages', () => {
                const schema = createAdminBranchesCreateFormSchema(messages);
                const result = schema.safeParse({ name: 'A', code: 'bad code', address: '', phone: '12', email: 'bad' });
                expect(result.success).toBe(false);
                if (!result.success)
                    expect(result.error.issues.map((issue) => issue.message)).toEqual(expect.arrayContaining(['name-short', 'code-invalid', 'address-required', 'phone-invalid', 'email-invalid']));
            });
            it('rejects alphabetic-only and implausibly short or long phone values', () => {
                const schema = createAdminBranchesCreateFormSchema(messages);
                const base = { name: 'West Branch', code: 'WEST-01', address: '1 West Road', email: 'west@example.invalid' };
                for (const phone of ['abcdefgh', '1234567', '1234567890123456', '++--()']) {
                    expect(schema.safeParse({ ...base, phone }).success).toBe(false);
                }
            });
            it('accepts a valid branch contract', () => {
                const schema = createAdminBranchesCreateFormSchema(messages);
                expect(schema.safeParse({ name: 'West Branch', code: 'WEST-01', address: '1 West Road', phone: '+91 9876543210', email: 'west@example.invalid' }).success).toBe(true);
            });
        });
    });
    describe('Original suite: useAdminSettingsBranchesStore.test.ts', () => {
        afterEach(() => {
            useAdminBranchesStore.getState().reset();
        });
        describe('useAdminBranchesStore', () => {
            it('stores only a selected branch identity and resets selection to the list view', () => {
                useAdminBranchesStore.getState().setViewingBranchId('branch-42');
                useAdminBranchesStore.getState().setDetailTab('members');
                expect(useAdminBranchesStore.getState().viewingBranchId).toBe('branch-42');
                expect(useAdminBranchesStore.getState().detailTab).toBe('members');
                useAdminBranchesStore.getState().reset();
                expect(useAdminBranchesStore.getState().viewingBranchId).toBeNull();
                expect(useAdminBranchesStore.getState().detailTab).toBe('overview');
            });
            it('does not place branch API records in the UI store', () => {
                expect(Object.keys(useAdminBranchesStore.getState()).sort()).toEqual([
                    'detailTab',
                    'reset',
                    'setDetailTab',
                    'setViewingBranchId',
                    'viewingBranchId',
                ]);
            });
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
HarnessVitest.describe('admin_branches_main local scenario harness', () => {
  HarnessVitest.it.each(HarnessScenarioList)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    HarnessTestingLibrary.render(<HarnessScenarioComponent scenario={scenario}>Feature content</HarnessScenarioComponent>);
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByTestId('admin_settings_branches-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByText('Feature content')).toBeTruthy();
  });
});

__mergedDescribe("Original suite: useAdminSettingsBranchesUnsavedChangesGuard.test.ts", () => {
let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

describe('useAdminSettingsBranchesUnsavedChangesGuard', () => {
  it('intercepts same-origin navigation while dirty and allows clean navigation', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ dirty }) => useAdminSettingsBranchesUnsavedChangesGuard(dirty, callback), { initialProps: { dirty: true } });
    anchor = document.createElement('a'); anchor.href = '/admin/next'; document.body.appendChild(anchor);
    act(() => anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
    expect(callback).toHaveBeenCalledWith('/admin/next');
    callback.mockClear(); rerender({ dirty: false });
    const clean = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => anchor?.dispatchEvent(clean));
    expect(clean.defaultPrevented).toBe(false); expect(callback).not.toHaveBeenCalled();
  });
});
});
