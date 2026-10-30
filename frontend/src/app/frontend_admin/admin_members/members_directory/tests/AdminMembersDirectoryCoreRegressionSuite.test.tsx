import { fireEvent as suite0_fireEvent, render as suite0_render, screen as suite0_screen } from "@testing-library/react";
import { describe as suite0_describe, expect as suite0_expect, it as suite0_it } from "vitest";
import { vi as suite0_vi } from "vitest";
import { formatAdminMembersDate as suite0_formatAdminMembersDate } from "@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils";
import { buildAdminMembersDemoCsv as suite0_buildAdminMembersDemoCsv } from "@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils";
import type { AdminMembersMember as Suite0_AdminMembersMember } from "@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema";
import { waitFor as suite0_waitFor } from "@testing-library/react";
import { NextIntlClientProvider as Suite0_NextIntlClientProvider } from "next-intl";
import type { ComponentProps as Suite0_ComponentProps } from "react";
import Suite0_AdminMembersMemberTable from "@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberTable";
import suite0_adminMembersEn from "@/app/frontend_admin/admin_members/members_directory/locales/admin_members_directory_en.json";
import suite0_adminMembersHi from "@/app/frontend_admin/admin_members/members_directory/locales/admin_members_directory_hi.json";
import { ADMIN_MEMBERS_MSW_HANDLERS as Suite0_ADMIN_MEMBERS_MSW_HANDLERS } from "@/app/frontend_admin/admin_members/members_directory/mocks/AdminMembersDirectoryFixtures";
import { ADMIN_MEMBERS_URLS as Suite0_ADMIN_MEMBERS_URLS, ADMIN_MEMBERS_DIRECTORY_CANONICAL_ROUTE as Suite0_ADMIN_MEMBERS_DIRECTORY_CANONICAL_ROUTE, MODULE_URLS as Suite0_MODULE_URLS, ADMIN_MEMBERS_API_LIST as Suite0_ADMIN_MEMBERS_API_LIST } from "@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config";
import { mswTestServer as suite0_mswTestServer } from "@/app/frontend_admin/test/mswServer";
import { ADMIN_MEMBERS_DIRECTORY_NAVIGATION as Suite0_ADMIN_MEMBERS_DIRECTORY_NAVIGATION, ADMIN_MEMBERS_DETAIL_NAVIGATION as Suite0_ADMIN_MEMBERS_DETAIL_NAVIGATION, ADMIN_MEMBERS_DIRECTORY_SUPPORTED_VIEWS as Suite0_ADMIN_MEMBERS_DIRECTORY_SUPPORTED_VIEWS, resolveAdminMembersDirectoryView as suite0_resolveAdminMembersDirectoryView } from "@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config";
import Suite0_AdminMembersDirectorySecondaryViews from "@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectorySecondaryViews";
import { ADMIN_ROUTES as Suite0_ADMIN_ROUTES } from "@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes";
import Suite0_AdminMembersDirectoryMemberForm from "@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberForm";
import suite0_useAdminMembersDirectoryMain from "@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryMain";
import { AdminMembersCreateSchema as Suite0_AdminMembersCreateSchema } from "@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema";
import { fireEvent as suite1_fireEvent, render as suite1_render, screen as suite1_screen } from "@testing-library/react";
import { describe as suite1_describe, expect as suite1_expect, it as suite1_it } from "vitest";
import { vi as suite1_vi } from "vitest";
import type { AdminMembersMember as Suite1_AdminMembersMember } from "@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema";
import { NextIntlClientProvider as Suite1_NextIntlClientProvider } from "next-intl";
import suite1_adminMembersEn from "@/app/frontend_admin/admin_members/members_directory/locales/admin_members_directory_en.json";
import suite1_adminMembersHi from "@/app/frontend_admin/admin_members/members_directory/locales/admin_members_directory_hi.json";
import suite1_useAdminMembersDirectoryMain from "@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryMain";
import { cleanup as suite1_cleanup } from "@testing-library/react";
import type { ReactNode as Suite1_ReactNode } from "react";
import { afterEach as suite1_afterEach } from "vitest";
import Suite1_AdminMembersDirectoryView from "@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryView";
import { AdminMembersDirectoryDataToolsView as Suite1_AdminMembersDirectoryDataToolsView } from "@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryView";
import * as Suite2_HarnessVitest from "vitest";
import * as Suite2_HarnessTestingLibrary from "@testing-library/react";
import { AdminMembersDirectoryHarness as Suite2_HarnessScenarioComponent } from "@/app/frontend_admin/admin_members/members_directory/tests/harness/AdminMembersDirectoryHarness";
import { AdminMembersDirectoryScenarios as Suite2_HarnessScenarioList } from "@/app/frontend_admin/admin_members/members_directory/tests/harness/bootstrap";
import { fireEvent as suite2_fireEvent, render as suite2_render, screen as suite2_screen } from "@testing-library/react";
import { describe as suite2_describe, expect as suite2_expect, it as suite2_it } from "vitest";
import { ADMIN_MEMBERS_STATUS_VALUES as Suite2_ADMIN_MEMBERS_STATUS_VALUES } from "@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config";
import { ADMIN_MEMBERS_FIXTURES as Suite2_ADMIN_MEMBERS_FIXTURES } from "@/app/frontend_admin/admin_members/members_directory/mocks/AdminMembersDirectoryFixtures";
import { ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS as Suite2_ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS } from "@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config";
import { act as suite3_act, renderHook as suite3_renderHook } from "@testing-library/react";
import { afterEach as suite3_afterEach, describe as suite3_describe, expect as suite3_expect, it as suite3_it, vi as suite3_vi } from "vitest";
import suite3_useUnsavedChangesGuard from "@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryUnsavedChangesGuard";

describe("Consolidated from AdminMembersDirectoryCoreRegressionSuite.test.tsx", () => {






















suite0_describe("Consolidated: AdminMembersDirectoryRegressionSuite", () => {
    suite0_describe('Original suite: AdminMembersDirectoryDateUtils.test.ts', () => {
        suite0_describe('formatAdminMembersDate', () => {
            suite0_it('formats ISO date-only values using the selected locale and UTC', () => {
                suite0_expect(suite0_formatAdminMembersDate('2026-01-15', 'en', 'Unknown date')).toContain('2026');
                suite0_expect(suite0_formatAdminMembersDate('2026-01-15', 'hi', 'अज्ञात तिथि')).not.toBe('2026-01-15');
            });
            suite0_it('returns the supplied fallback for blank, malformed and impossible dates', () => {
                suite0_expect(suite0_formatAdminMembersDate('', 'en', 'Unknown date')).toBe('Unknown date');
                suite0_expect(suite0_formatAdminMembersDate('15 Jan 2026', 'en', 'Unknown date')).toBe('Unknown date');
                suite0_expect(suite0_formatAdminMembersDate('2026-02-30', 'en', 'Unknown date')).toBe('Unknown date');
            });
        });
    });
    suite0_describe('Original suite: AdminMembersDirectoryExportUtils.test.ts', () => {
        const member: Suite0_AdminMembersMember = {
            id: 'mem-1', name: '=HYPERLINK("x")', email: 'person@example.com', phone: '9000000000',
            plan: 'Monthly', status: 'Active', expiryDate: '2026-12-31',
        };
        suite0_describe('Admin Members CSV export', () => {
            suite0_it('neutralizes spreadsheet formulas while retaining CSV quoting and line endings', () => {
                const csv = suite0_buildAdminMembersDemoCsv([member]);
                suite0_expect(csv).toContain("\"mem-1\",\"'=HYPERLINK(\"\"x\"\")\"");
                suite0_expect(csv.split('\r\n')).toHaveLength(2);
            });
        });
    });
    suite0_describe('Original suite: AdminMembersDirectoryMemberTable.test.tsx', () => {
        const members: Suite0_AdminMembersMember[] = [
            { id: 'MEM-001', name: 'Demo Member One', email: 'member1@example.test', phone: '+910000000001', plan: 'Demo Monthly', status: 'Active', expiryDate: '2026-12-31' },
            { id: 'MEM-002', name: 'Demo Member Two', email: 'member2@example.test', phone: '+910000000002', plan: 'Demo Quarterly', status: 'Expired', expiryDate: '2026-06-30' },
        ];
        function renderTable(locale: 'en' | 'hi', props: Partial<Suite0_ComponentProps<typeof Suite0_AdminMembersMemberTable>> = {}) {
            const messages = locale === 'en' ? suite0_adminMembersEn : suite0_adminMembersHi;
            return suite0_render(<Suite0_NextIntlClientProvider locale={locale} messages={messages}>
        <Suite0_AdminMembersMemberTable members={members} onSelectMember={suite0_vi.fn()} onAction={suite0_vi.fn()} {...props}/>
      </Suite0_NextIntlClientProvider>);
        }
        suite0_describe('AdminMembersMemberTable', () => {
            suite0_it('renders supplied data and opens the selected member', () => {
                const onSelectMember = suite0_vi.fn();
                renderTable('en', { onSelectMember });
                suite0_fireEvent.click(suite0_screen.getAllByRole('button', { name: 'Demo Member One' })[0]);
                suite0_expect(onSelectMember).toHaveBeenCalledWith(members[0]);
                suite0_expect(suite0_screen.getAllByText('member2@example.test')).toHaveLength(2);
            });
            suite0_it('exposes the mobile member cards as a named list with list items', () => {
                renderTable('en');
                const mobileList = suite0_screen.getByRole('list', { name: 'Member' });
                suite0_expect(mobileList.querySelectorAll('[role="listitem"]')).toHaveLength(2);
            });
            suite0_it('filters by status and renders an explicit localized empty result', () => {
                renderTable('en', { filterStatus: 'Suspended' });
                suite0_expect(suite0_screen.getByRole('status').textContent).toContain('No member records');
            });
            suite0_it('keeps the remaining rows visible when a filter narrows results from a later page', () => {
                const manyMembers: Suite0_AdminMembersMember[] = Array.from({ length: 12 }, (_, index) => ({
                    id: `MEM-${String(index + 1).padStart(3, '0')}`,
                    name: `Member ${index + 1}`,
                    email: `member${index + 1}@example.test`,
                    phone: `+9100000000${String(index + 1).padStart(2, '0')}`,
                    plan: 'Demo Monthly',
                    status: index === 0 ? ('Active' as const) : ('Expired' as const),
                    expiryDate: '2026-12-31',
                }));
                const view = suite0_render(<Suite0_NextIntlClientProvider locale="en" messages={suite0_adminMembersEn}>
          <Suite0_AdminMembersMemberTable members={manyMembers} onSelectMember={suite0_vi.fn()} onAction={suite0_vi.fn()}/>
        </Suite0_NextIntlClientProvider>);
                suite0_fireEvent.click(suite0_screen.getByRole('button', { name: 'Next' }));
                suite0_expect(suite0_screen.getAllByRole('button', { name: 'Member 12' })[0]).toBeTruthy();
                view.rerender(<Suite0_NextIntlClientProvider locale="en" messages={suite0_adminMembersEn}>
          <Suite0_AdminMembersMemberTable members={manyMembers} filterStatus="Active" onSelectMember={suite0_vi.fn()} onAction={suite0_vi.fn()}/>
        </Suite0_NextIntlClientProvider>);
                suite0_expect(suite0_screen.getAllByRole('button', { name: 'Member 1' })[0]).toBeTruthy();
            });
            suite0_it('localizes table headings and member status in Hindi without changing filter values', () => {
                renderTable('hi');
                suite0_expect(suite0_screen.getAllByText('संपर्क').length).toBeGreaterThan(0);
                suite0_expect(suite0_screen.getAllByText('समाप्त').length).toBeGreaterThan(0);
                suite0_expect(suite0_screen.getAllByText('सक्रिय').length).toBeGreaterThan(0);
            });
        });
        suite0_describe('member action disclosure keyboard behavior', () => {
            suite0_it('uses ordinary disclosure buttons rather than claiming incomplete ARIA menu semantics and closes on Escape', () => {
                renderTable('en');
                const trigger = suite0_screen.getAllByRole('button', { name: 'Open actions for Demo Member One' })[0]!;
                suite0_fireEvent.click(trigger);
                suite0_expect(suite0_screen.queryByRole('menu')).toBeNull();
                suite0_expect(suite0_screen.getAllByRole('button', { name: 'View member details' }).length).toBeGreaterThan(0);
                const disclosure = trigger.getAttribute('aria-controls');
                suite0_expect(disclosure).toBeTruthy();
                const panel = document.getElementById(disclosure!);
                suite0_expect(panel).toBeTruthy();
                suite0_fireEvent.keyDown(panel!, { key: 'Escape' });
                suite0_expect(document.getElementById(disclosure!)).toBeNull();
            });
        });
    });
    suite0_describe('Original suite: AdminMembersDirectoryMembersMSWContractBoundary.test.ts', () => {
        suite0_describe('Members API contract boundary', () => {
            suite0_it('fails closed with an explicit 501 instead of inventing a successful DTO', async () => {
                suite0_mswTestServer.use(...Suite0_ADMIN_MEMBERS_MSW_HANDLERS);
                const response = await fetch(new URL(Suite0_ADMIN_MEMBERS_URLS.LIST, 'http://localhost'));
                suite0_expect(response.status).toBe(501);
                await suite0_expect(response.json()).resolves.toMatchObject({
                    code: 'API_CONTRACT_UNAVAILABLE',
                });
            });
        });
    });
    suite0_describe('Original suite: AdminMembersDirectoryNavigationBoundary.test.ts', () => {
        suite0_describe('Members Library navigation boundary', () => {
            suite0_it('does not expose gym-specific plan/renewal screens in the active member navigation', () => {
                suite0_expect(Suite0_ADMIN_MEMBERS_DIRECTORY_NAVIGATION.map((item) => item.id)).not.toContain('plans');
                suite0_expect(Suite0_ADMIN_MEMBERS_DIRECTORY_SUPPORTED_VIEWS).toContain('plans');
                suite0_expect(Suite0_ADMIN_MEMBERS_DIRECTORY_SUPPORTED_VIEWS).toContain('renewal');
                suite0_expect(Suite0_ADMIN_MEMBERS_DIRECTORY_SUPPORTED_VIEWS).toHaveLength(13);
                suite0_expect(suite0_resolveAdminMembersDirectoryView('plans')).toBe('plans');
                suite0_expect(suite0_resolveAdminMembersDirectoryView('renewal')).toBe('renewal');
                suite0_expect(suite0_resolveAdminMembersDirectoryView('unknown')).toBe('all');
                suite0_expect(Suite0_ADMIN_MEMBERS_DIRECTORY_NAVIGATION.map((item) => item.id)).not.toContain('renewal');
                suite0_expect(Suite0_ADMIN_MEMBERS_DETAIL_NAVIGATION.map((item) => item.id)).toContain('renewalHistory');
            });
            suite0_it('keeps the canonical UI route separate from the source-backed API route', () => {
                suite0_expect(Suite0_ADMIN_MEMBERS_DIRECTORY_CANONICAL_ROUTE).toBe('/admin/admin_members/members_directory');
                suite0_expect(Suite0_MODULE_URLS.ROOT).toBe(Suite0_ADMIN_MEMBERS_DIRECTORY_CANONICAL_ROUTE);
                suite0_expect(Suite0_ADMIN_MEMBERS_API_LIST).toBe('/api/v1/admin/members');
                suite0_expect(Suite0_MODULE_URLS.ROOT).not.toBe(Suite0_ADMIN_MEMBERS_API_LIST);
            });
        });
        suite0_it('preserves the legacy plans query as a link to the canonical membership-plans owner', () => {
            const model = { activeTab: 'plans', viewingMember: null, isDemoMode: false } as unknown as ReturnType<typeof suite0_useAdminMembersDirectoryMain>;
            suite0_render(<Suite0_NextIntlClientProvider locale="en" messages={suite0_adminMembersEn}><Suite0_AdminMembersDirectorySecondaryViews model={model} /></Suite0_NextIntlClientProvider>);
            const plansLink = suite0_screen.getByRole('link', { name: 'Open membership plan management' });
            suite0_expect(plansLink.getAttribute('href')).toBe(Suite0_ADMIN_ROUTES.MEMBERS_PLANS);
        });
    });
    suite0_describe('Original suite: AdminMembersDirectoryPersonalInfoSection.test.tsx', () => {
        function renderForm(handleAddMember = suite0_vi.fn()) {
            const model = {
                activeTab: 'add',
                viewingMember: null,
                handleAddMember,
                setActiveTab: suite0_vi.fn(),
            } as unknown as ReturnType<typeof suite0_useAdminMembersDirectoryMain>;
            suite0_render(<Suite0_NextIntlClientProvider locale="en" messages={suite0_adminMembersEn}>
        <Suite0_AdminMembersDirectoryMemberForm model={model}/>
      </Suite0_NextIntlClientProvider>);
            return { handleAddMember, model };
        }
        suite0_describe('AdminMembers member creation form', () => {
            suite0_it('shows accessible field errors when required fields are empty', async () => {
                renderForm();
                suite0_fireEvent.click(suite0_screen.getByRole('button', { name: 'Validate member details' }));
                suite0_expect(await suite0_screen.findByText('Enter at least 2 characters for the member name.')).toBeTruthy();
                suite0_expect(suite0_screen.getByLabelText('Full name').getAttribute('aria-invalid')).toBe('true');
            });
            suite0_it('passes only schema-validated values to the blocked-persistence handler', async () => {
                const handleAddMember = suite0_vi.fn();
                renderForm(handleAddMember);
                suite0_fireEvent.change(suite0_screen.getByLabelText('Full name'), { target: { value: 'Demo Member' } });
                suite0_fireEvent.change(suite0_screen.getByLabelText('Email'), { target: { value: 'member@example.test' } });
                suite0_fireEvent.change(suite0_screen.getByLabelText('Phone'), { target: { value: '+91 98765 43210' } });
                suite0_fireEvent.change(suite0_screen.getByLabelText('Membership plan'), { target: { value: 'Monthly' } });
                suite0_fireEvent.click(suite0_screen.getByRole('button', { name: 'Validate member details' }));
                await suite0_waitFor(() => suite0_expect(handleAddMember).toHaveBeenCalledWith({
                    name: 'Demo Member',
                    email: 'member@example.test',
                    phone: '+91 98765 43210',
                    plan: 'Monthly',
                }));
            });
        });
    });
    suite0_describe('Original suite: AdminMembersDirectorySchema.test.ts', () => {
        const validInput = {
            name: 'Demo Member',
            email: 'member@example.test',
            phone: '+91 98765 43210',
            plan: 'Monthly',
        };
        suite0_describe('AdminMembersCreateSchema', () => {
            suite0_it('accepts valid member form values and trims strings', () => {
                suite0_expect(Suite0_AdminMembersCreateSchema.parse({ ...validInput, name: '  Demo Member  ' }).name).toBe('Demo Member');
            });
            suite0_it('rejects an invalid email', () => {
                suite0_expect(Suite0_AdminMembersCreateSchema.safeParse({ ...validInput, email: 'not-an-email' }).success).toBe(false);
            });
            suite0_it('rejects missing required fields and oversized values', () => {
                suite0_expect(Suite0_AdminMembersCreateSchema.safeParse({ ...validInput, plan: ' ' }).success).toBe(false);
                suite0_expect(Suite0_AdminMembersCreateSchema.safeParse({ ...validInput, name: 'x'.repeat(121) }).success).toBe(false);
            });
        });
    });
});

});


describe("Consolidated from AdminMembersDirectorySecondaryViewsRegressionSuite.test.tsx", () => {














suite1_describe("Consolidated: AdminMembersDirectorySecondaryViewsLocalization", () => {
    suite1_afterEach(() => {
        suite1_cleanup();
        suite1_vi.unstubAllEnvs();
        suite1_vi.restoreAllMocks();
    });
    const messages = { en: suite1_adminMembersEn, hi: suite1_adminMembersHi } as const;
    const sampleMembers: Suite1_AdminMembersMember[] = [
        { id: 'MEM-001', name: 'Demo Member One', email: 'member1@example.test', phone: '+910000000001', plan: 'Premium', status: 'Active', expiryDate: '2026-12-31' },
        { id: 'MEM-002', name: 'Demo Member Two', email: 'member2@example.test', phone: '+910000000002', plan: 'Standard', status: 'Expired', expiryDate: '2026-06-30' },
    ];
    function renderLocalized(locale: 'en' | 'hi', children: Suite1_ReactNode) {
        return suite1_render(<Suite1_NextIntlClientProvider locale={locale} messages={messages[locale]}>{children}</Suite1_NextIntlClientProvider>);
    }
    function DemoMembersScreen() {
        const model = suite1_useAdminMembersDirectoryMain();
        return <Suite1_AdminMembersDirectoryView model={model}/>;
    }
    function renderDemoScreen(locale: 'en' | 'hi' = 'en') {
        suite1_vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
        return renderLocalized(locale, <DemoMembersScreen />);
    }
    suite1_describe('Admin Members secondary views localization and demo state', () => {
        suite1_it('creates a category in session state and preserves it after navigation away and back', () => {
            renderDemoScreen('en');
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Member Categories' }));
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Add Category' }));
            suite1_fireEvent.change(suite1_screen.getByLabelText('Category name'), { target: { value: 'Session Category' } });
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Save demo category' }));
            suite1_expect(suite1_screen.getByText('Session Category')).toBeTruthy();
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'All Members' }));
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Member Categories' }));
            suite1_expect(suite1_screen.getByText('Session Category')).toBeTruthy();
        });
        suite1_it('validates duplicate categories without mutating the list', () => {
            renderDemoScreen('en');
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Member Categories' }));
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Add Category' }));
            suite1_fireEvent.change(suite1_screen.getByLabelText('Category name'), { target: { value: 'Student' } });
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Save demo category' }));
            suite1_expect(suite1_screen.getByRole('alert').textContent).toContain('already exists');
            suite1_expect(suite1_screen.getAllByText('Student')).toHaveLength(1);
        });
        suite1_it('creates a department in the active demo session while plan CRUD remains owned by the canonical plans module', () => {
            renderDemoScreen('en');
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Departments' }));
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Add Department' }));
            suite1_fireEvent.change(suite1_screen.getByLabelText('Department name'), { target: { value: 'Demo Robotics' } });
            suite1_fireEvent.change(suite1_screen.getByLabelText('Department head'), { target: { value: 'Demo Head' } });
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Save demo department' }));
            suite1_expect(suite1_screen.getByText('Demo Robotics')).toBeTruthy();
            suite1_expect(suite1_screen.getByText('Demo Head')).toBeTruthy();
        });
        suite1_it('adds validated member data to the demo list and shows the new record', async () => {
            renderDemoScreen('en');
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Add Member' }));
            suite1_expect(suite1_screen.getByText(/Demo mode: validated member details/)).toBeTruthy();
            suite1_fireEvent.change(suite1_screen.getByLabelText('Full name'), { target: { value: 'Session Member' } });
            suite1_fireEvent.change(suite1_screen.getByLabelText('Email'), { target: { value: 'session.member@example.test' } });
            suite1_fireEvent.change(suite1_screen.getByLabelText('Phone'), { target: { value: '+919876543210' } });
            suite1_fireEvent.change(suite1_screen.getByLabelText('Membership plan'), { target: { value: 'Demo Trial' } });
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Validate member details' }));
            await suite0_waitFor(() => {
                suite1_expect(suite1_screen.getAllByRole('button', { name: 'Session Member' }).length).toBeGreaterThan(0);
            });
            suite1_expect(suite1_screen.getAllByText('MEM-005').length).toBeGreaterThan(0);
            suite1_expect(suite1_screen.getAllByText('Unknown date').length).toBeGreaterThan(0);
        });
        suite1_it('updates a demo member and reflects the change in detail and list views', async () => {
            renderDemoScreen('en');
            suite1_fireEvent.click(suite1_screen.getAllByRole('button', { name: 'John Doe' })[0]);
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Edit member' }));
            suite1_fireEvent.change(suite1_screen.getByLabelText('Full name'), { target: { value: 'John Doe Updated' } });
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Save demo changes' }));
            await suite0_waitFor(() => {
                suite1_expect(suite1_screen.getByRole('heading', { name: 'Member: John Doe Updated' })).toBeTruthy();
            });
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'Back to members list' }));
            suite1_expect(suite1_screen.getAllByRole('button', { name: 'John Doe Updated' }).length).toBeGreaterThan(0);
            suite1_expect(suite1_screen.queryByRole('button', { name: 'John Doe' })).toBeNull();
        });
        suite1_it('records reminder status in demo state and disables repeated reminders', () => {
            renderDemoScreen('hi');
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'सदस्यता नवीनीकरण' }));
            suite1_fireEvent.click(suite1_screen.getAllByRole('button', { name: 'रिमाइंडर भेजें' })[0]);
            const recordedButtons = suite1_screen.getAllByRole('button', { name: 'रिमाइंडर दर्ज (डेमो)' });
            suite1_expect((recordedButtons[0] as HTMLButtonElement).disabled).toBe(true);
            suite1_expect(suite1_screen.getAllByRole('button', { name: 'रिमाइंडर भेजें' }).length).toBeGreaterThan(0);
        });
        suite1_it('keeps the unavailable import template disabled rather than presenting a fake download action', () => {
            renderDemoScreen('hi');
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'सदस्य आयात करें' }));
            suite1_expect(suite1_screen.getByRole('status').textContent).toContain('उपलब्ध नहीं');
            const downloadButton = suite1_screen.getByRole('button', { name: 'टेम्पलेट फ़ाइल डाउनलोड करें' }) as HTMLButtonElement;
            suite1_expect(downloadButton.disabled).toBe(true);
            suite1_expect(downloadButton.title).toContain('उपलब्ध नहीं');
        });
        suite1_it('renders document and export controls in Hindi', () => {
            renderLocalized('hi', <><Suite1_AdminMembersDirectoryDataToolsView mode="documents" members={sampleMembers}/><Suite1_AdminMembersDirectoryDataToolsView mode="export" members={sampleMembers}/></>);
            suite1_expect(suite1_screen.getByRole('heading', { name: 'सभी सदस्य दस्तावेज़ — नमूना मेटाडेटा' })).toBeTruthy();
            suite1_expect(suite1_screen.getByLabelText('सदस्य ID के आधार पर नमूना दस्तावेज़ खोजें')).toBeTruthy();
            suite1_expect(suite1_screen.getByRole('heading', { name: 'सदस्य डेटा निर्यात करें' })).toBeTruthy();
            suite1_expect(suite1_screen.getByRole('button', { name: 'फ़िल्टर किया गया डेमो CSV निर्यात करें' })).toBeTruthy();
        });
        suite1_it('keeps English and Hindi catalogs in lockstep and translates every navigation label', () => {
            const navKeys = [
                'NAV_ALL_MEMBERS', 'NAV_ADD_MEMBER', 'NAV_CATEGORIES', 'NAV_DEPARTMENTS', 'NAV_PLANS', 'NAV_RENEWAL',
                'NAV_ACTIVE', 'NAV_EXPIRED', 'NAV_SUSPENDED', 'NAV_BLOCKED', 'NAV_IMPORT', 'NAV_EXPORT', 'NAV_DOCUMENTS',
                'DETAIL_PROFILE', 'DETAIL_ATTENDANCE', 'DETAIL_MEMBERSHIP', 'DETAIL_RENEWAL_HISTORY', 'DETAIL_PAYMENT_HISTORY',
                'DETAIL_LOST_HISTORY', 'DETAIL_ACTIVITY_HISTORY', 'DETAIL_DOCUMENTS',
            ] as const;
            suite1_expect(Object.keys(messages.hi.ADMIN_MEMBERS).sort()).toEqual(Object.keys(messages.en.ADMIN_MEMBERS).sort());
            for (const key of navKeys)
                suite1_expect(messages.hi.ADMIN_MEMBERS[key]).not.toBe(messages.en.ADMIN_MEMBERS[key]);
        });
    });
    suite1_describe('renewal expiry locale contract', () => {
        suite1_it('renders typed relative expiry values in English and Hindi', async () => {
            const { unmount } = renderDemoScreen('en');
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: /Membership Renewal|Renewals/ }));
            suite1_expect(suite1_screen.getAllByText('2 days').length).toBeGreaterThan(0);
            suite1_expect(suite1_screen.getAllByText('1 week').length).toBeGreaterThan(0);
            unmount();
            renderDemoScreen('hi');
            suite1_fireEvent.click(suite1_screen.getByRole('button', { name: 'सदस्यता नवीनीकरण' }));
            suite1_expect(suite1_screen.getAllByText('2 दिन').length).toBeGreaterThan(0);
            suite1_expect(suite1_screen.getAllByText('1 सप्ताह').length).toBeGreaterThan(0);
        });
    });
});

});


describe("Consolidated from AdminMembersDirectoryStatusConstantsRegressionSuite.test.tsx", () => {










suite2_describe("Consolidated: AdminMembersDirectoryStatusConstants", () => {
    suite2_describe('AdminMembers status registry', () => {
        suite2_it('contains each member fixture status in the canonical set', () => {
            for (const member of Suite2_ADMIN_MEMBERS_FIXTURES) {
                suite2_expect(Suite2_ADMIN_MEMBERS_STATUS_VALUES).toContain(member.status);
            }
        });
        suite2_it('does not contain duplicate status values', () => {
            suite2_expect(new Set(Suite2_ADMIN_MEMBERS_STATUS_VALUES).size).toBe(Suite2_ADMIN_MEMBERS_STATUS_VALUES.length);
        });
        suite2_it('provides an export filter option for every canonical status', () => {
            const exportableStatuses = Suite2_ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS.map((option) => option.value).filter((value) => value !== 'all');
            suite2_expect(exportableStatuses).toEqual([...Suite2_ADMIN_MEMBERS_STATUS_VALUES]);
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
Suite2_HarnessVitest.describe('members_directory scenario harness', () => {
  Suite2_HarnessVitest.it('renders active children for the active state', () => {
    Suite2_HarnessTestingLibrary.render(<Suite2_HarnessScenarioComponent>Active feature content</Suite2_HarnessScenarioComponent>);
    Suite2_HarnessVitest.expect(Suite2_HarnessTestingLibrary.screen.getByText('Active feature content')).toBeTruthy();
  });
  Suite2_HarnessVitest.it.each(Suite2_HarnessScenarioList.filter((scenario) => scenario !== 'ACTIVE'))('renders a real visible state for %s', (scenario) => {
    Suite2_HarnessTestingLibrary.render(<Suite2_HarnessScenarioComponent scenario={scenario}>Feature content that must not masquerade as an error/empty state</Suite2_HarnessScenarioComponent>);
    Suite2_HarnessVitest.expect(Suite2_HarnessTestingLibrary.screen.queryByText('Feature content that must not masquerade as an error/empty state')).toBeNull();
    if (scenario === 'EMPTY') Suite2_HarnessVitest.expect(Suite2_HarnessTestingLibrary.screen.getByRole('status')).toBeTruthy();
    else Suite2_HarnessVitest.expect(Suite2_HarnessTestingLibrary.screen.getByRole('alert')).toBeTruthy();
    if (scenario === 'SERVER_500' || scenario === 'TIMEOUT') {
      Suite2_HarnessTestingLibrary.fireEvent.click(Suite2_HarnessTestingLibrary.screen.getByRole('button', { name: 'Retry scenario' }));
      Suite2_HarnessVitest.expect(Suite2_HarnessTestingLibrary.screen.getByText('Feature content that must not masquerade as an error/empty state')).toBeTruthy();
    }
  });
});

});


describe("Consolidated from useAdminMembersDirectoryUnsavedChangesGuard.test.ts", () => {




let anchor: HTMLAnchorElement | null = null;
suite3_afterEach(() => { anchor?.remove(); anchor = null; });

function addInternalAnchor(href = '/admin/next?from=directory'): HTMLAnchorElement {
  anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = 'Navigate away';
  document.body.appendChild(anchor);
  return anchor;
}

suite3_describe('useAdminMembersDirectoryUnsavedChangesGuard', () => {
  suite3_it('delegates same-origin navigation to the owning discard confirmation while dirty', () => {
    const onBlockedNavigation = suite3_vi.fn();
    suite3_renderHook(() => suite3_useUnsavedChangesGuard(true, false, onBlockedNavigation));
    const link = addInternalAnchor();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    suite3_act(() => { link.dispatchEvent(event); });
    suite3_expect(event.defaultPrevented).toBe(true);
    suite3_expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/next?from=directory');
  });

  suite3_it('allows clean forms and external/new-window navigation', () => {
    const onBlockedNavigation = suite3_vi.fn();
    suite3_renderHook(() => suite3_useUnsavedChangesGuard(false, false, onBlockedNavigation));
    const clean = addInternalAnchor('/admin/clean');
    const cleanEvent = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    suite3_act(() => { clean.dispatchEvent(cleanEvent); });
    suite3_expect(cleanEvent.defaultPrevented).toBe(false);
    suite3_expect(onBlockedNavigation).not.toHaveBeenCalled();
  });

  suite3_it('registers beforeunload only while dirty and not submitting', () => {
    const onBlockedNavigation = suite3_vi.fn();
    const { rerender } = suite3_renderHook(({ dirty, submitting }) => suite3_useUnsavedChangesGuard(dirty, submitting, onBlockedNavigation), { initialProps: { dirty: false, submitting: false } });
    const cleanEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(cleanEvent);
    suite3_expect(cleanEvent.defaultPrevented).toBe(false);
    rerender({ dirty: true, submitting: false });
    const dirtyEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(dirtyEvent);
    suite3_expect(dirtyEvent.defaultPrevented).toBe(true);
  });
});

});

