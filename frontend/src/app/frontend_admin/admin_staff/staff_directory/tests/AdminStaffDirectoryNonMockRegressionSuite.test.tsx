import * as suite0_suite0_HarnessVitest from "vitest";
import * as suite0_suite0_HarnessTestingLibrary from "@testing-library/react";
import { AdminStaffDirectoryHarness as suite0_suite0_HarnessScenarioComponent } from "@/app/frontend_admin/admin_staff/staff_directory/tests/harness/AdminStaffDirectoryHarness";
import { AdminStaffDirectoryScenarios as suite0_suite0_HarnessScenarioList } from "@/app/frontend_admin/admin_staff/staff_directory/tests/harness/bootstrap";
import { render as suite0_suite0_render, screen as suite0_suite0_screen } from "@testing-library/react";
import { describe as suite0_suite0_describe, expect as suite0_suite0_expect, it as suite0_suite0_it } from "vitest";
import { AdminStaffDirectoryHarness as suite0_suite0_AdminStaffDirectoryHarness } from "@/app/frontend_admin/admin_staff/staff_directory/tests/harness/AdminStaffDirectoryHarness";
import { afterEach as suite0_suite0_afterEach, vi as suite0_suite0_vi } from "vitest";
import { mswTestServer as suite0_suite0_mswTestServer } from "@/test/mswServer";
import { fetchAdminStaffDirectory as suite0_suite0_fetchAdminStaffDirectory } from "@/app/frontend_admin/admin_staff/staff_directory/api/admin_staff_directory.api";
import { AdminStaffDirectoryApiRecordSchema as suite0_suite0_AdminStaffDirectoryApiRecordSchema, AdminStaffDirectoryCreateManagerSchema as suite0_suite0_AdminStaffDirectoryCreateManagerSchema, createAdminStaffDirectoryCreateManagerSchema as suite0_suite0_createAdminStaffDirectoryCreateManagerSchema } from "@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema";
import { ADMIN_STAFF_DIRECTORY_MSW_HANDLERS as suite0_suite0_ADMIN_STAFF_DIRECTORY_MSW_HANDLERS } from "@/app/frontend_admin/admin_staff/staff_directory/tests/harness/bootstrap";
import { readFileSync as suite0_suite0_readFileSync } from "node:fs";
import { fileURLToPath as suite0_suite0_fileURLToPath } from "node:url";
import suite0_suite0_path from "node:path";
import { ADMIN_STAFF_DIRECTORY_FIXTURE_DATA as suite0_suite0_ADMIN_STAFF_DIRECTORY_FIXTURE_DATA } from "@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios";
import { createAdminStaffDirectoryDemoManager as suite0_suite0_createAdminStaffDirectoryDemoManager } from "@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectory";
import type { AdminStaffDirectoryCreateManagerFormValues as suite0_suite0_AdminStaffDirectoryCreateManagerFormValues } from "@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema";
import { getAdminStaffDirectoryLastActiveLabel as suite0_suite0_getAdminStaffDirectoryLastActiveLabel } from "@/app/frontend_admin/admin_staff/staff_directory/utils/AdminStaffDirectoryDisplayUtils";
import { fireEvent as suite0_suite0_fireEvent } from "@testing-library/react";
import type { ReactNode as suite0_suite0_ReactNode } from "react";
import { NextIntlClientProvider as suite0_suite0_NextIntlClientProvider } from "next-intl";
import suite0_suite0_staffMessages from "@/app/frontend_admin/admin_staff/staff_directory/locales/admin_staff_directory_en.json";
import { AdminStaffDirectoryManagerTable as suite0_suite0_AdminStaffDirectoryManagerTable } from "@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryViewSIDEBARNAVIGATIONSection";
import type { AdminStaffDirectoryManager as suite0_suite0_AdminStaffDirectoryManager } from "@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema";
import { maskAdminStaffDirectoryEmail as suite0_suite0_maskAdminStaffDirectoryEmail, maskAdminStaffDirectoryPhone as suite0_suite0_maskAdminStaffDirectoryPhone } from "@/app/frontend_admin/admin_staff/staff_directory/utils/AdminStaffDirectoryDisplayUtils";
import * as suite0_suite1_HarnessVitest from "vitest";
import * as suite0_suite1_HarnessTestingLibrary from "@testing-library/react";
import { AdminStaffDirectoryHarness as suite0_suite1_HarnessScenarioComponent } from "@/app/frontend_admin/admin_staff/staff_directory/tests/harness/AdminStaffDirectoryHarness";
import { AdminStaffDirectoryScenarios as suite0_suite1_HarnessScenarioList } from "@/app/frontend_admin/admin_staff/staff_directory/tests/harness/bootstrap";
import { act as suite0_suite1_act, render as suite0_suite1_render, renderHook as suite0_suite1_renderHook, screen as suite0_suite1_screen } from "@testing-library/react";
import { describe as suite0_suite1_describe, expect as suite0_suite1_expect, it as suite0_suite1_it } from "vitest";
import { AdminStaffDirectoryHarness as suite0_suite1_AdminStaffDirectoryHarness } from "@/app/frontend_admin/admin_staff/staff_directory/tests/harness/AdminStaffDirectoryHarness";
import { afterEach as suite0_suite1_afterEach, vi as suite0_suite1_vi } from "vitest";
import { mswTestServer as suite0_suite1_mswTestServer } from "@/test/mswServer";
import { fetchAdminStaffDirectory as suite0_suite1_fetchAdminStaffDirectory } from "@/app/frontend_admin/admin_staff/staff_directory/api/admin_staff_directory.api";
import { AdminStaffDirectoryApiRecordSchema as suite0_suite1_AdminStaffDirectoryApiRecordSchema, AdminStaffDirectoryCreateManagerSchema as suite0_suite1_AdminStaffDirectoryCreateManagerSchema, createAdminStaffDirectoryCreateManagerSchema as suite0_suite1_createAdminStaffDirectoryCreateManagerSchema } from "@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema";
import { ADMIN_STAFF_DIRECTORY_MSW_HANDLERS as suite0_suite1_ADMIN_STAFF_DIRECTORY_MSW_HANDLERS } from "@/app/frontend_admin/admin_staff/staff_directory/tests/harness/bootstrap";
import { readFileSync as suite0_suite1_readFileSync } from "node:fs";
import { fileURLToPath as suite0_suite1_fileURLToPath } from "node:url";
import suite0_suite1_path from "node:path";
import { ADMIN_STAFF_DIRECTORY_FIXTURE_DATA as suite0_suite1_ADMIN_STAFF_DIRECTORY_FIXTURE_DATA } from "@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios";
import { createAdminStaffDirectoryDemoManager as suite0_suite1_createAdminStaffDirectoryDemoManager } from "@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectory";
import type { AdminStaffDirectoryCreateManagerFormValues as suite0_suite1_AdminStaffDirectoryCreateManagerFormValues } from "@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema";
import { getAdminStaffDirectoryLastActiveLabel as suite0_suite1_getAdminStaffDirectoryLastActiveLabel } from "@/app/frontend_admin/admin_staff/staff_directory/utils/AdminStaffDirectoryDisplayUtils";
import { fireEvent as suite0_suite1_fireEvent } from "@testing-library/react";
import type { ReactNode as suite0_suite1_ReactNode } from "react";
import { NextIntlClientProvider as suite0_suite1_NextIntlClientProvider } from "next-intl";
import suite0_suite1_staffMessages from "@/app/frontend_admin/admin_staff/staff_directory/locales/admin_staff_directory_en.json";
import { AdminStaffDirectoryManagerTable as suite0_suite1_AdminStaffDirectoryManagerTable } from "@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryViewSIDEBARNAVIGATIONSection";
import type { AdminStaffDirectoryManager as suite0_suite1_AdminStaffDirectoryManager } from "@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema";
import { maskAdminStaffDirectoryEmail as suite0_suite1_maskAdminStaffDirectoryEmail, maskAdminStaffDirectoryPhone as suite0_suite1_maskAdminStaffDirectoryPhone } from "@/app/frontend_admin/admin_staff/staff_directory/utils/AdminStaffDirectoryDisplayUtils";
import suite0_suite1_AdminStaffDirectoryCreateManagerForm from "@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryCreateManagerForm";
import suite0_suite1_useAdminStaffDirectoryUnsavedChangesGuard from "@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectoryUnsavedChangesGuard";
import { act as suite0_suite2_act, renderHook as suite0_suite2_renderHook } from "@testing-library/react";
import { afterEach as suite0_suite2_afterEach, describe as suite0_suite2_describe, expect as suite0_suite2_expect, it as suite0_suite2_it, vi as suite0_suite2_vi } from "vitest";
import suite0_suite2_useAdminStaffDirectoryUnsavedChangesGuard from "@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectoryUnsavedChangesGuard.ts";
import { render as suite1_render, screen as suite1_screen } from "@testing-library/react";
import { describe as suite1_describe, expect as suite1_expect, it as suite1_it } from "vitest";
import { NextIntlClientProvider as suite1_NextIntlClientProvider } from "next-intl";
import suite1_staffMessages from "@/app/frontend_admin/admin_staff/staff_directory/locales/admin_staff_directory_en.json";
import suite1_AdminStaffDirectoryCreateManagerForm from "@/app/frontend_admin/admin_staff/staff_directory/components/AdminStaffDirectoryCreateManagerForm";

describe("Consolidated from AdminStaffDirectoryNonMockRegressionSuite.test.tsx", () => {


























































describe("Consolidated from AdminStaffDirectoryNonMockRegressionSuite.test.tsx", () => {


















































suite0_suite0_describe("Consolidated: AdminStaffDirectoryHarness", () => {
});

suite0_suite0_describe("Consolidated: AdminStaffDirectoryRegressionSuite", () => {
    suite0_suite0_describe('Original suite: AdminStaffDirectoryApi.test.ts', () => {
        suite0_suite0_describe('fetchAdminStaffDirectory API contract', () => {
            suite0_suite0_it('rejects blank required identity and branch fields', () => {
                const base = { id: 'm1', name: 'Manager', username: 'manager', email: 'manager@example.test', phone: '9000000000', branch: 'North', status: 'Active', lastActive: 'Never' };
                suite0_suite0_expect(suite0_suite0_AdminStaffDirectoryApiRecordSchema.safeParse(base).success).toBe(true);
                suite0_suite0_expect(suite0_suite0_AdminStaffDirectoryApiRecordSchema.safeParse({ ...base, name: '   ' }).success).toBe(false);
                suite0_suite0_expect(suite0_suite0_AdminStaffDirectoryApiRecordSchema.safeParse({ ...base, branch: '  ' }).success).toBe(false);
            });
            suite0_suite0_afterEach(() => suite0_suite0_vi.unstubAllEnvs());
            suite0_suite0_it('validates the transport schema and normalizes the staff identity', async () => {
                suite0_suite0_vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
                suite0_suite0_mswTestServer.use(...suite0_suite0_ADMIN_STAFF_DIRECTORY_MSW_HANDLERS);
                const staff = await suite0_suite0_fetchAdminStaffDirectory();
                suite0_suite0_expect(staff[0]).toMatchObject({ id: 'STAFF-DEMO-001', username: 'demo.manager', status: 'Active' });
            });
        });
    });
    suite0_suite0_describe('Original suite: AdminStaffDirectoryContract.test.ts', () => {
        const here = suite0_suite0_path.dirname(suite0_suite0_fileURLToPath(import.meta.url));
        suite0_suite0_describe('staff directory boundary', () => { suite0_suite0_it('does not claim client-side authorization', () => { const source = suite0_suite0_readFileSync(suite0_suite0_path.join(here, '../page'), 'utf8'); suite0_suite0_expect(source).toContain('STAFF_DIRECTORY_NOTICE'); suite0_suite0_expect(source).toContain('/admin/admin_staff/staff_roles_permissions'); }); });
    });
    suite0_suite0_describe('Original suite: AdminStaffDirectoryCreateManagerSchema.test.ts', () => {
        suite0_suite0_describe('AdminStaffDirectoryCreateManagerSchema', () => {
            suite0_suite0_it('accepts a complete demo preview payload with an assigned branch', () => {
                const result = suite0_suite0_AdminStaffDirectoryCreateManagerSchema.safeParse({
                    fullName: 'Aarav Sharma',
                    username: 'aarav.sharma',
                    email: 'aarav@example.invalid',
                    phone: '+91 9876543210',
                    passwordSetup: 'auto',
                    branchId: 'b1',
                    initialStatus: 'Active',
                });
                suite0_suite0_expect(result.success).toBe(true);
            });
            suite0_suite0_it('rejects alphabetic-only phones and unknown branch identities', () => {
                const base = { fullName: 'Aarav Sharma', username: 'aarav.sharma', email: 'aarav@example.invalid', phone: 'abcdefgh', passwordSetup: 'auto' as const, branchId: 'b1', initialStatus: 'Active' as const };
                suite0_suite0_expect(suite0_suite0_AdminStaffDirectoryCreateManagerSchema.safeParse(base).success).toBe(false);
                suite0_suite0_expect(suite0_suite0_AdminStaffDirectoryCreateManagerSchema.safeParse({ ...base, phone: '+91 9876543210', branchId: 'unknown' }).success).toBe(false);
                suite0_suite0_expect(suite0_suite0_AdminStaffDirectoryCreateManagerSchema.safeParse({ ...base, phone: '+91 9876543210' }).success).toBe(true);
            });
            suite0_suite0_it('uses supplied locale messages for field validation', () => {
                const schema = suite0_suite0_createAdminStaffDirectoryCreateManagerSchema({
                    nameRequired: 'HI_NAME_REQUIRED', nameTooLong: 'HI_NAME_LONG', usernameTooShort: 'HI_USERNAME_SHORT', usernameTooLong: 'HI_USERNAME_LONG',
                    emailInvalid: 'HI_EMAIL_INVALID', phoneInvalid: 'HI_PHONE_INVALID', phoneTooLong: 'HI_PHONE_LONG', branchRequired: 'HI_BRANCH_REQUIRED',
                });
                const result = schema.safeParse({ fullName: '', username: 'ok', email: 'bad', phone: '1', passwordSetup: 'auto', branchId: '', initialStatus: 'Active' });
                suite0_suite0_expect(result.success).toBe(false);
                if (!result.success) {
                    const issues = result.error.issues.map((issue) => issue.message);
                    suite0_suite0_expect(issues).toContain('HI_NAME_REQUIRED');
                    suite0_suite0_expect(issues).toContain('HI_EMAIL_INVALID');
                    suite0_suite0_expect(issues).toContain('HI_BRANCH_REQUIRED');
                }
            });
            suite0_suite0_it('rejects a missing branch assignment rather than passing an empty branch', () => {
                const result = suite0_suite0_AdminStaffDirectoryCreateManagerSchema.safeParse({
                    fullName: 'Aarav Sharma',
                    username: 'aarav.sharma',
                    email: 'aarav@example.invalid',
                    phone: '+91 9876543210',
                    passwordSetup: 'auto',
                    branchId: '',
                    initialStatus: 'Active',
                });
                suite0_suite0_expect(result.success).toBe(false);
                if (!result.success)
                    suite0_suite0_expect(result.error.flatten().fieldErrors.branchId).toBeDefined();
            });
        });
    });
    suite0_suite0_describe('Original suite: AdminStaffDirectoryDemoStateUtils.test.ts', () => {
        const values: suite0_suite0_AdminStaffDirectoryCreateManagerFormValues = { fullName: 'Demo Manager', username: 'demo.manager', email: 'demo.manager@example.invalid', phone: '+91 9876543210', passwordSetup: 'auto', branchId: 'b1', initialStatus: 'Active' };
        suite0_suite0_describe('admin staff users demo state', () => {
            suite0_suite0_it('creates user-entered managers and rejects duplicate usernames or emails', () => {
                const result = suite0_suite0_createAdminStaffDirectoryDemoManager(suite0_suite0_ADMIN_STAFF_DIRECTORY_FIXTURE_DATA, values, 'Downtown Central', 'MGR-DEMO-1');
                suite0_suite0_expect(result.duplicate).toBe(false);
                if (!result.duplicate)
                    suite0_suite0_expect(result.manager).toMatchObject({ id: 'MGR-DEMO-1', name: 'Demo Manager', status: 'Active', branch: 'Downtown Central' });
                const duplicate = suite0_suite0_createAdminStaffDirectoryDemoManager(suite0_suite0_ADMIN_STAFF_DIRECTORY_FIXTURE_DATA, { ...values, username: 'VIKRAM.S' }, 'Downtown Central', 'MGR-DEMO-2');
                suite0_suite0_expect(duplicate).toEqual({ manager: null, duplicate: true });
            });
        });
    });
    suite0_suite0_describe('Original suite: AdminStaffDirectoryFormatLastActive.test.ts', () => {
        suite0_suite0_describe('getAdminStaffDirectoryLastActiveLabel', () => {
            suite0_suite0_it('maps known legacy values through the locale catalog and does not leak unknown English text', () => {
                const translate = (key: string) => `translated:${key}`;
                suite0_suite0_expect(suite0_suite0_getAdminStaffDirectoryLastActiveLabel('2 mins ago', translate)).toBe('translated:LAST_ACTIVE_TWO_MINUTES');
                suite0_suite0_expect(suite0_suite0_getAdminStaffDirectoryLastActiveLabel('unexpected server prose', translate)).toBe('translated:LAST_ACTIVE_UNKNOWN');
            });
        });
    });
    suite0_suite0_describe('Original suite: AdminStaffDirectoryManagerTable.test.tsx', () => {
        const managers: suite0_suite0_AdminStaffDirectoryManager[] = [
            { id: 'MGR-001', name: 'Demo Manager One', username: 'demo.one', email: 'manager1@example.test', phone: '+910000000001', branch: 'Demo Branch', status: 'Active', lastActive: 'Today' },
            { id: 'MGR-002', name: 'Demo Manager Two', username: 'demo.two', email: 'manager2@example.test', phone: '+910000000002', branch: 'Demo Branch', status: 'Suspended', lastActive: 'Yesterday' },
        ];
        function renderTable(ui: suite0_suite0_ReactNode) {
            return suite0_suite0_render(<suite0_suite0_NextIntlClientProvider locale="en" messages={suite0_suite0_staffMessages}><>{ui}</></suite0_suite0_NextIntlClientProvider>);
        }
        suite0_suite0_describe('AdminStaffDirectoryManagerTable', () => {
            suite0_suite0_it('calls the selection callback for the chosen manager', () => {
                const onSelectManager = suite0_suite0_vi.fn();
                renderTable(<suite0_suite0_AdminStaffDirectoryManagerTable managers={managers} onSelectManager={onSelectManager}/>);
                suite0_suite0_fireEvent.click(suite0_suite0_screen.getAllByRole('button', { name: 'Demo Manager One' })[0]!);
                suite0_suite0_expect(onSelectManager).toHaveBeenCalledWith(managers[0]);
            });
            suite0_suite0_it('masks email and phone in the manager collection view', () => {
                renderTable(<suite0_suite0_AdminStaffDirectoryManagerTable managers={managers} onSelectManager={suite0_suite0_vi.fn()}/>);
                suite0_suite0_expect(suite0_suite0_screen.getAllByText('m*****1@example.test').length).toBeGreaterThan(0);
                suite0_suite0_expect(suite0_suite0_screen.getAllByText('00****0001').length).toBeGreaterThan(0);
                suite0_suite0_expect(suite0_suite0_screen.queryByText('manager1@example.test')).toBeNull();
                suite0_suite0_expect(suite0_suite0_screen.queryByText('+910000000001')).toBeNull();
            });
            suite0_suite0_it('renders mobile card content alongside the semantic desktop table', () => {
                renderTable(<suite0_suite0_AdminStaffDirectoryManagerTable managers={managers} onSelectManager={suite0_suite0_vi.fn()}/>);
                suite0_suite0_expect(suite0_suite0_screen.getAllByRole('article').length).toBe(2);
                suite0_suite0_expect(suite0_suite0_screen.getAllByText('Last active').length).toBeGreaterThan(0);
            });
            suite0_suite0_it('applies the status filter', () => {
                renderTable(<suite0_suite0_AdminStaffDirectoryManagerTable managers={managers} filterStatus="Suspended" onSelectManager={suite0_suite0_vi.fn()}/>);
                suite0_suite0_expect(suite0_suite0_screen.getAllByText('Demo Manager Two').length).toBeGreaterThan(0);
                suite0_suite0_expect(suite0_suite0_screen.queryByText('Demo Manager One')).toBeNull();
            });
            suite0_suite0_it('clamps the current page when the filtered result set becomes smaller', () => {
                const manyManagers: suite0_suite0_AdminStaffDirectoryManager[] = Array.from({ length: 21 }, (_, index) => ({
                    ...managers[index % managers.length]!,
                    id: `MGR-${index + 1}`,
                    name: `Demo Manager ${index + 1}`,
                    status: index === 20 ? 'Suspended' : 'Active',
                }));
                const { rerender } = renderTable(<suite0_suite0_AdminStaffDirectoryManagerTable managers={manyManagers} onSelectManager={suite0_suite0_vi.fn()}/>);
                suite0_suite0_fireEvent.click(suite0_suite0_screen.getByRole('button', { name: 'Next' }));
                suite0_suite0_fireEvent.click(suite0_suite0_screen.getByRole('button', { name: 'Next' }));
                rerender(<suite0_suite0_NextIntlClientProvider locale="en" messages={suite0_suite0_staffMessages}><suite0_suite0_AdminStaffDirectoryManagerTable managers={manyManagers} filterStatus="Suspended" onSelectManager={suite0_suite0_vi.fn()}/></suite0_suite0_NextIntlClientProvider>);
                suite0_suite0_expect(suite0_suite0_screen.getAllByText('Demo Manager 21').length).toBeGreaterThan(0);
            });
        });
    });
    suite0_suite0_describe('Original suite: AdminStaffDirectoryMaskSensitiveData.test.ts', () => {
        suite0_suite0_describe('AdminStaffDirectoryMaskSensitiveData', () => {
            suite0_suite0_it('masks email local parts while preserving the domain', () => {
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryEmail('manager@example.test')).toBe('m*****r@example.test');
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryEmail('a@example.test')).toBe('*@example.test');
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryEmail('ab@example.test')).toBe('a*@example.test');
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryEmail('')).toBe('—');
            });
            suite0_suite0_it('normalizes international phone numbers to the last ten digits before masking', () => {
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryPhone('+91 98765 43210')).toBe('98****3210');
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryPhone('1234')).toBe('****');
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryPhone('12345')).toBe('*****');
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryPhone('123456')).toBe('******');
                suite0_suite0_expect(suite0_suite0_maskAdminStaffDirectoryPhone('')).toBe('—');
            });
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
suite0_suite0_HarnessVitest.describe('admin_staff_directory local scenario harness', () => {
  suite0_suite0_HarnessVitest.it.each(suite0_suite0_HarnessScenarioList)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    suite0_suite0_HarnessTestingLibrary.render(<suite0_suite0_HarnessScenarioComponent scenario={scenario}>Feature content</suite0_suite0_HarnessScenarioComponent>);
    suite0_suite0_HarnessVitest.expect(suite0_suite0_HarnessTestingLibrary.screen.getByTestId('admin_staff_directory-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    suite0_suite0_HarnessVitest.expect(suite0_suite0_HarnessTestingLibrary.screen.getByText('Feature content')).toBeTruthy();
  });
});

});


describe("Consolidated from AdminStaffDirectoryRegressionSuite.test.tsx", () => {




















































suite0_suite1_describe("Consolidated: AdminStaffDirectoryHarness", () => {
});

suite0_suite1_describe("Consolidated: AdminStaffDirectoryRegressionSuite", () => {
    suite0_suite1_describe('Original suite: AdminStaffDirectoryApi.test.ts', () => {
        suite0_suite1_describe('fetchAdminStaffDirectory API contract', () => {
            suite0_suite1_it('rejects blank required identity and branch fields', () => {
                const base = { id: 'm1', name: 'Manager', username: 'manager', email: 'manager@example.test', phone: '9000000000', branch: 'North', status: 'Active', lastActive: 'Never' };
                suite0_suite1_expect(suite0_suite1_AdminStaffDirectoryApiRecordSchema.safeParse(base).success).toBe(true);
                suite0_suite1_expect(suite0_suite1_AdminStaffDirectoryApiRecordSchema.safeParse({ ...base, name: '   ' }).success).toBe(false);
                suite0_suite1_expect(suite0_suite1_AdminStaffDirectoryApiRecordSchema.safeParse({ ...base, branch: '  ' }).success).toBe(false);
            });
            suite0_suite1_afterEach(() => suite0_suite1_vi.unstubAllEnvs());
            suite0_suite1_it('validates the transport schema and normalizes the staff identity', async () => {
                suite0_suite1_vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
                suite0_suite1_mswTestServer.use(...suite0_suite1_ADMIN_STAFF_DIRECTORY_MSW_HANDLERS);
                const staff = await suite0_suite1_fetchAdminStaffDirectory();
                suite0_suite1_expect(staff[0]).toMatchObject({ id: 'STAFF-DEMO-001', username: 'demo.manager', status: 'Active' });
            });
        });
    });
    suite0_suite1_describe('Original suite: AdminStaffDirectoryContract.test.ts', () => {
        const here = suite0_suite1_path.dirname(suite0_suite1_fileURLToPath(import.meta.url));
        suite0_suite1_describe('staff directory boundary', () => { suite0_suite1_it('does not claim client-side authorization', () => { const source = suite0_suite1_readFileSync(suite0_suite1_path.join(here, '../page'), 'utf8'); suite0_suite1_expect(source).toContain('STAFF_DIRECTORY_NOTICE'); suite0_suite1_expect(source).toContain('/admin/admin_staff/staff_roles_permissions'); }); });
    });
    suite0_suite1_describe('Original suite: AdminStaffDirectoryCreateManagerSchema.test.ts', () => {
        suite0_suite1_describe('AdminStaffDirectoryCreateManagerSchema', () => {
            suite0_suite1_it('accepts a complete demo preview payload with an assigned branch', () => {
                const result = suite0_suite1_AdminStaffDirectoryCreateManagerSchema.safeParse({
                    fullName: 'Aarav Sharma',
                    username: 'aarav.sharma',
                    email: 'aarav@example.invalid',
                    phone: '+91 9876543210',
                    passwordSetup: 'auto',
                    branchId: 'b1',
                    initialStatus: 'Active',
                });
                suite0_suite1_expect(result.success).toBe(true);
            });
            suite0_suite1_it('rejects alphabetic-only phones and unknown branch identities', () => {
                const base = { fullName: 'Aarav Sharma', username: 'aarav.sharma', email: 'aarav@example.invalid', phone: 'abcdefgh', passwordSetup: 'auto' as const, branchId: 'b1', initialStatus: 'Active' as const };
                suite0_suite1_expect(suite0_suite1_AdminStaffDirectoryCreateManagerSchema.safeParse(base).success).toBe(false);
                suite0_suite1_expect(suite0_suite1_AdminStaffDirectoryCreateManagerSchema.safeParse({ ...base, phone: '+91 9876543210', branchId: 'unknown' }).success).toBe(false);
                suite0_suite1_expect(suite0_suite1_AdminStaffDirectoryCreateManagerSchema.safeParse({ ...base, phone: '+91 9876543210' }).success).toBe(true);
            });
            suite0_suite1_it('uses supplied locale messages for field validation', () => {
                const schema = suite0_suite1_createAdminStaffDirectoryCreateManagerSchema({
                    nameRequired: 'HI_NAME_REQUIRED', nameTooLong: 'HI_NAME_LONG', usernameTooShort: 'HI_USERNAME_SHORT', usernameTooLong: 'HI_USERNAME_LONG',
                    emailInvalid: 'HI_EMAIL_INVALID', phoneInvalid: 'HI_PHONE_INVALID', phoneTooLong: 'HI_PHONE_LONG', branchRequired: 'HI_BRANCH_REQUIRED',
                });
                const result = schema.safeParse({ fullName: '', username: 'ok', email: 'bad', phone: '1', passwordSetup: 'auto', branchId: '', initialStatus: 'Active' });
                suite0_suite1_expect(result.success).toBe(false);
                if (!result.success) {
                    const issues = result.error.issues.map((issue) => issue.message);
                    suite0_suite1_expect(issues).toContain('HI_NAME_REQUIRED');
                    suite0_suite1_expect(issues).toContain('HI_EMAIL_INVALID');
                    suite0_suite1_expect(issues).toContain('HI_BRANCH_REQUIRED');
                }
            });
            suite0_suite1_it('rejects a missing branch assignment rather than passing an empty branch', () => {
                const result = suite0_suite1_AdminStaffDirectoryCreateManagerSchema.safeParse({
                    fullName: 'Aarav Sharma',
                    username: 'aarav.sharma',
                    email: 'aarav@example.invalid',
                    phone: '+91 9876543210',
                    passwordSetup: 'auto',
                    branchId: '',
                    initialStatus: 'Active',
                });
                suite0_suite1_expect(result.success).toBe(false);
                if (!result.success)
                    suite0_suite1_expect(result.error.flatten().fieldErrors.branchId).toBeDefined();
            });
        });
    });
    suite0_suite1_describe('Original suite: AdminStaffDirectoryDemoStateUtils.test.ts', () => {
        const values: suite0_suite1_AdminStaffDirectoryCreateManagerFormValues = { fullName: 'Demo Manager', username: 'demo.manager', email: 'demo.manager@example.invalid', phone: '+91 9876543210', passwordSetup: 'auto', branchId: 'b1', initialStatus: 'Active' };
        suite0_suite1_describe('admin staff users demo state', () => {
            suite0_suite1_it('creates user-entered managers and rejects duplicate usernames or emails', () => {
                const result = suite0_suite1_createAdminStaffDirectoryDemoManager(suite0_suite1_ADMIN_STAFF_DIRECTORY_FIXTURE_DATA, values, 'Downtown Central', 'MGR-DEMO-1');
                suite0_suite1_expect(result.duplicate).toBe(false);
                if (!result.duplicate)
                    suite0_suite1_expect(result.manager).toMatchObject({ id: 'MGR-DEMO-1', name: 'Demo Manager', status: 'Active', branch: 'Downtown Central' });
                const duplicate = suite0_suite1_createAdminStaffDirectoryDemoManager(suite0_suite1_ADMIN_STAFF_DIRECTORY_FIXTURE_DATA, { ...values, username: 'VIKRAM.S' }, 'Downtown Central', 'MGR-DEMO-2');
                suite0_suite1_expect(duplicate).toEqual({ manager: null, duplicate: true });
            });
        });
    });
    suite0_suite1_describe('Original suite: AdminStaffDirectoryFormatLastActive.test.ts', () => {
        suite0_suite1_describe('getAdminStaffDirectoryLastActiveLabel', () => {
            suite0_suite1_it('maps known legacy values through the locale catalog and does not leak unknown English text', () => {
                const translate = (key: string) => `translated:${key}`;
                suite0_suite1_expect(suite0_suite1_getAdminStaffDirectoryLastActiveLabel('2 mins ago', translate)).toBe('translated:LAST_ACTIVE_TWO_MINUTES');
                suite0_suite1_expect(suite0_suite1_getAdminStaffDirectoryLastActiveLabel('unexpected server prose', translate)).toBe('translated:LAST_ACTIVE_UNKNOWN');
            });
        });
    });
    suite0_suite1_describe('Original suite: AdminStaffDirectoryManagerTable.test.tsx', () => {
        const managers: suite0_suite1_AdminStaffDirectoryManager[] = [
            { id: 'MGR-001', name: 'Demo Manager One', username: 'demo.one', email: 'manager1@example.test', phone: '+910000000001', branch: 'Demo Branch', status: 'Active', lastActive: 'Today' },
            { id: 'MGR-002', name: 'Demo Manager Two', username: 'demo.two', email: 'manager2@example.test', phone: '+910000000002', branch: 'Demo Branch', status: 'Suspended', lastActive: 'Yesterday' },
        ];
        function renderTable(ui: suite0_suite1_ReactNode) {
            return suite0_suite1_render(<suite0_suite1_NextIntlClientProvider locale="en" messages={suite0_suite1_staffMessages}><>{ui}</></suite0_suite1_NextIntlClientProvider>);
        }
        suite0_suite1_describe('AdminStaffDirectoryManagerTable', () => {
            suite0_suite1_it('calls the selection callback for the chosen manager', () => {
                const onSelectManager = suite0_suite1_vi.fn();
                renderTable(<suite0_suite1_AdminStaffDirectoryManagerTable managers={managers} onSelectManager={onSelectManager}/>);
                suite0_suite1_fireEvent.click(suite0_suite1_screen.getAllByRole('button', { name: 'Demo Manager One' })[0]!);
                suite0_suite1_expect(onSelectManager).toHaveBeenCalledWith(managers[0]);
            });
            suite0_suite1_it('masks email and phone in the manager collection view', () => {
                renderTable(<suite0_suite1_AdminStaffDirectoryManagerTable managers={managers} onSelectManager={suite0_suite1_vi.fn()}/>);
                suite0_suite1_expect(suite0_suite1_screen.getAllByText('m*****1@example.test').length).toBeGreaterThan(0);
                suite0_suite1_expect(suite0_suite1_screen.getAllByText('00****0001').length).toBeGreaterThan(0);
                suite0_suite1_expect(suite0_suite1_screen.queryByText('manager1@example.test')).toBeNull();
                suite0_suite1_expect(suite0_suite1_screen.queryByText('+910000000001')).toBeNull();
            });
            suite0_suite1_it('renders mobile card content alongside the semantic desktop table', () => {
                renderTable(<suite0_suite1_AdminStaffDirectoryManagerTable managers={managers} onSelectManager={suite0_suite1_vi.fn()}/>);
                suite0_suite1_expect(suite0_suite1_screen.getAllByRole('article').length).toBe(2);
                suite0_suite1_expect(suite0_suite1_screen.getAllByText('Last active').length).toBeGreaterThan(0);
            });
            suite0_suite1_it('applies the status filter', () => {
                renderTable(<suite0_suite1_AdminStaffDirectoryManagerTable managers={managers} filterStatus="Suspended" onSelectManager={suite0_suite1_vi.fn()}/>);
                suite0_suite1_expect(suite0_suite1_screen.getAllByText('Demo Manager Two').length).toBeGreaterThan(0);
                suite0_suite1_expect(suite0_suite1_screen.queryByText('Demo Manager One')).toBeNull();
            });
            suite0_suite1_it('clamps the current page when the filtered result set becomes smaller', () => {
                const manyManagers: suite0_suite1_AdminStaffDirectoryManager[] = Array.from({ length: 21 }, (_, index) => ({
                    ...managers[index % managers.length]!,
                    id: `MGR-${index + 1}`,
                    name: `Demo Manager ${index + 1}`,
                    status: index === 20 ? 'Suspended' : 'Active',
                }));
                const { rerender } = renderTable(<suite0_suite1_AdminStaffDirectoryManagerTable managers={manyManagers} onSelectManager={suite0_suite1_vi.fn()}/>);
                suite0_suite1_fireEvent.click(suite0_suite1_screen.getByRole('button', { name: 'Next' }));
                suite0_suite1_fireEvent.click(suite0_suite1_screen.getByRole('button', { name: 'Next' }));
                rerender(<suite0_suite1_NextIntlClientProvider locale="en" messages={suite0_suite1_staffMessages}><suite0_suite1_AdminStaffDirectoryManagerTable managers={manyManagers} filterStatus="Suspended" onSelectManager={suite0_suite1_vi.fn()}/></suite0_suite1_NextIntlClientProvider>);
                suite0_suite1_expect(suite0_suite1_screen.getAllByText('Demo Manager 21').length).toBeGreaterThan(0);
            });
        });
    });
    suite0_suite1_describe('Original suite: AdminStaffDirectoryMaskSensitiveData.test.ts', () => {
        suite0_suite1_describe('AdminStaffDirectoryMaskSensitiveData', () => {
            suite0_suite1_it('masks email local parts while preserving the domain', () => {
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryEmail('manager@example.test')).toBe('m*****r@example.test');
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryEmail('a@example.test')).toBe('*@example.test');
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryEmail('ab@example.test')).toBe('a*@example.test');
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryEmail('')).toBe('—');
            });
            suite0_suite1_it('normalizes international phone numbers to the last ten digits before masking', () => {
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryPhone('+91 98765 43210')).toBe('98****3210');
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryPhone('1234')).toBe('****');
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryPhone('12345')).toBe('*****');
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryPhone('123456')).toBe('******');
                suite0_suite1_expect(suite0_suite1_maskAdminStaffDirectoryPhone('')).toBe('—');
            });
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
suite0_suite1_HarnessVitest.describe('admin_staff_directory local scenario harness', () => {
  suite0_suite1_HarnessVitest.it.each(suite0_suite1_HarnessScenarioList)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    suite0_suite1_HarnessTestingLibrary.render(<suite0_suite1_HarnessScenarioComponent scenario={scenario}>Feature content</suite0_suite1_HarnessScenarioComponent>);
    suite0_suite1_HarnessVitest.expect(suite0_suite1_HarnessTestingLibrary.screen.getByTestId('admin_staff_directory-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    suite0_suite1_HarnessVitest.expect(suite0_suite1_HarnessTestingLibrary.screen.getByText('Feature content')).toBeTruthy();
  });
});


// Regression assertions retained from AdminStaffDirectoryCreateManagerForm.test.tsx.
suite0_suite1_describe('AdminStaffDirectoryCreateManagerForm regression', () => {
  suite0_suite1_it('renders a required branch assignment with a non-selectable placeholder option', () => {
    suite0_suite1_render(<suite0_suite1_NextIntlClientProvider locale="en" messages={suite0_suite1_staffMessages}><suite0_suite1_AdminStaffDirectoryCreateManagerForm onCreate={suite0_suite1_vi.fn(() => 'created')} canCreate={true} /></suite0_suite1_NextIntlClientProvider>);
    const branchSelect = suite0_suite1_screen.getByRole('combobox', { name: suite0_suite1_staffMessages.ADMIN_STAFF_DIRECTORY.BRANCH_ASSIGNMENT }) as HTMLSelectElement;
    suite0_suite1_expect(branchSelect.required).toBe(true);
    suite0_suite1_expect(Array.from(branchSelect.options).map((option) => option.value)).toEqual(['', 'b1', 'b2']);
    suite0_suite1_expect(branchSelect.value).toBe('');
  });
});

// Regression assertions retained from useAdminStaffDirectoryUnsavedChangesGuard.test.ts.
suite0_suite1_describe('useAdminStaffDirectoryUnsavedChangesGuard regression', () => {
  suite0_suite1_afterEach(() => { document.querySelectorAll('a[data-staff-directory-test-anchor="true"]').forEach((anchor) => anchor.remove()); });
  suite0_suite1_it('intercepts same-origin navigation while dirty and allows clean navigation', () => {
    const callback = suite0_suite1_vi.fn();
    const { rerender } = suite0_suite1_renderHook(({ dirty }) => suite0_suite1_useAdminStaffDirectoryUnsavedChangesGuard(dirty, callback), { initialProps: { dirty: true } });
    const anchor = document.createElement('a');
    anchor.dataset.staffDirectoryTestAnchor = 'true';
    anchor.href = '/admin/next';
    document.body.appendChild(anchor);
    suite0_suite1_act(() => anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
    suite0_suite1_expect(callback).toHaveBeenCalledWith('/admin/next');
    callback.mockClear();
    rerender({ dirty: false });
    const clean = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    suite0_suite1_act(() => anchor.dispatchEvent(clean));
    suite0_suite1_expect(clean.defaultPrevented).toBe(false);
    suite0_suite1_expect(callback).not.toHaveBeenCalled();
  });
});

});


describe("Consolidated from useAdminStaffDirectoryUnsavedChangesGuard.test.ts", () => {




let anchor: HTMLAnchorElement | null = null;
suite0_suite2_afterEach(() => { anchor?.remove(); anchor = null; });

suite0_suite2_describe('useAdminStaffDirectoryUnsavedChangesGuard', () => {
  suite0_suite2_it('intercepts same-origin navigation while dirty and allows clean navigation', () => {
    const callback = suite0_suite2_vi.fn();
    const { rerender } = suite0_suite2_renderHook(({ dirty }) => suite0_suite2_useAdminStaffDirectoryUnsavedChangesGuard(dirty, callback), { initialProps: { dirty: true } });
    anchor = document.createElement('a'); anchor.href = '/admin/next'; document.body.appendChild(anchor);
    suite0_suite2_act(() => anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
    suite0_suite2_expect(callback).toHaveBeenCalledWith('/admin/next');
    callback.mockClear(); rerender({ dirty: false });
    const clean = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    suite0_suite2_act(() => anchor?.dispatchEvent(clean));
    suite0_suite2_expect(clean.defaultPrevented).toBe(false); suite0_suite2_expect(callback).not.toHaveBeenCalled();
  });
});

});


});


describe("Consolidated from AdminStaffDirectoryCreateManagerForm.test.tsx", () => {







suite1_describe('AdminStaffDirectoryCreateManagerForm', () => {
  suite1_it('renders the required branch assignment control with a non-selectable placeholder value', () => {
    suite1_render(<suite1_NextIntlClientProvider locale="en" messages={suite1_staffMessages}><suite1_AdminStaffDirectoryCreateManagerForm onCreate={() => 'created'} canCreate={true} /></suite1_NextIntlClientProvider>);
    const branchSelect = suite1_screen.getByRole('combobox', { name: 'BRANCH_ASSIGNMENT' }) as HTMLSelectElement;

    suite1_expect(branchSelect.required).toBe(true);
    suite1_expect(Array.from(branchSelect.options).map((option) => option.value)).toEqual(['', 'b1', 'b2']);
    suite1_expect(branchSelect.value).toBe('');
  });
});

});

