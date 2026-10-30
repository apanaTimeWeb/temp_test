import * as HarnessVitest from 'vitest';
import * as HarnessTestingLibrary from '@testing-library/react';
import { AdminMembersStudentsHarness as HarnessScenarioComponent } from '@/app/frontend_admin/admin_members/members_students/tests/harness/AdminMembersStudentsHarness';
import { AdminMembersStudentsScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_members/members_students/tests/harness/bootstrap';

import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { AdminMembersStudentsHarness } from '@/app/frontend_admin/admin_members/members_students/tests/harness/AdminMembersStudentsHarness';


import { afterEach, vi } from 'vitest';

import { fetchAdminStudents, AdminStudentsApiContractMissingError } from '@/app/frontend_admin/admin_members/members_students/api/admin_members_students_api';

import { AdminStudentsApiRecordSchema, AdminStudentsApiResponseSchema } from '@/app/frontend_admin/admin_members/members_students/schemas/AdminMembersStudentsApiSchema';

import { ADMIN_STUDENTS_API_FIXTURE } from '@/app/frontend_admin/admin_members/members_students/mocks/scenarios/admin_members_students.scenarios';

import { ADMIN_STUDENTS_MSW_HANDLERS } from '@/app/frontend_admin/admin_members/members_students/mocks/scenarios/admin_members_students.scenarios';

import { ADMIN_STUDENTS_ROOT, ADMIN_STUDENTS_DETAIL, ADMIN_STUDENTS_API_LIST, ADMIN_STUDENTS_UI_URLS, MODULE_URLS as STUDENTS_MODULE_URLS } from '@/app/frontend_admin/admin_members/members_students/config/admin_members_students.url_config';

import { ADMIN_MEMBERS_STUDENTS_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_students/api/admin_members_students.query_keys';

import type { AdminStudentsStudent } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';

import { serializeAdminStudentsCsv } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsCsvUtils';

import { getAdminStudentsExpiryDatePresentation } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsFormatUtils';

import { formatAdminStudentsMoney } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsFormatUtils';

import { getAdminStudentsKpiSummary } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsListUtils';

import { matchesAdminStudentsSearch } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsListUtils';

import type { ReactNode } from 'react';

import { cleanup, fireEvent } from '@testing-library/react';

import { NextIntlClientProvider } from 'next-intl';

import messages from '@/app/frontend_admin/admin_members/members_students/locales/admin_members_students_en.json';

import useAdminMembersStudentsMain from '@/app/frontend_admin/admin_members/members_students/hooks/useAdminMembersStudentsMain';

import { ADMIN_STUDENTS_STATUSES } from '@/app/frontend_admin/admin_members/members_students/config/admin_members_students.url_config';


import AdminMembersStudentsView from '@/app/frontend_admin/admin_members/members_students/components/AdminMembersStudentsView';


describe("Consolidated: AdminMembersStudentsHarness", () => {
});

describe("Consolidated: AdminMembersStudentsRegressionSuite", () => {
    describe('Original suite: AdminMembersStudentsApi.test.ts', () => {
        afterEach(() => {
            vi.restoreAllMocks();
            vi.unstubAllEnvs();
        });
        describe('Students data-source and API contract boundary', () => {
            it('validates typed minor-unit amounts only when non-negative safe integers and explicit currency are supplied', () => {
                expect(AdminStudentsApiRecordSchema.safeParse({ id: 'x', totalPaidMinor: 0, dueFeeMinor: 1200, currencyCode: 'INR' }).success).toBe(true);
                expect(AdminStudentsApiRecordSchema.safeParse({ id: 'x', totalPaidMinor: -1, currencyCode: 'INR' }).success).toBe(false);
                expect(AdminStudentsApiRecordSchema.safeParse({ id: 'x', totalPaidMinor: Number.MAX_SAFE_INTEGER + 1, currencyCode: 'INR' }).success).toBe(false);
                expect(AdminStudentsApiRecordSchema.safeParse({ id: 'x', totalPaidMinor: 100 }).success).toBe(false);
            });
            it('validates synthetic demo records without pretending they came from the backend', () => {
                const parsed = AdminStudentsApiResponseSchema.parse(ADMIN_STUDENTS_API_FIXTURE);
                expect(parsed.length).toBeGreaterThan(0);
                expect(parsed.every((student) => String(student.id).startsWith('100'))).toBe(true);
            });
            it('fails closed before transport when the authoritative Students API endpoint is absent', async () => {
                const fetchSpy = vi.spyOn(globalThis, 'fetch');
                await expect(fetchAdminStudents()).rejects.toBeInstanceOf(AdminStudentsApiContractMissingError);
                await expect(fetchAdminStudents()).rejects.toMatchObject({ code: 'STUDENTS_API_CONTRACT_MISSING' });
                expect(fetchSpy).not.toHaveBeenCalled();
            });
            it('does not register an MSW handler on the UI page URL to mask the missing API contract', () => {
                expect(ADMIN_STUDENTS_MSW_HANDLERS).toHaveLength(0);
            });
        });
    });
    describe('Original suite: AdminMembersStudentsCompatibilityBoundary.test.ts', () => {
        describe('Members Students routing and contract boundary', () => {
            it('uses its canonical direct route and an in-module detail query', () => {
                expect(ADMIN_STUDENTS_ROOT).toBe('/admin/admin_members/members_students');
                expect(ADMIN_STUDENTS_DETAIL('student/42')).toBe('/admin/admin_members/members_students?view=detail&id=student%2F42');
                expect(ADMIN_STUDENTS_UI_URLS.ROOT).toBe(ADMIN_STUDENTS_ROOT);
                expect(STUDENTS_MODULE_URLS.ROOT).toBe(ADMIN_STUDENTS_ROOT);
            });
            it('keeps a missing live API contract separate from the UI route', () => {
                expect(ADMIN_STUDENTS_API_LIST).toBeNull();
                expect(ADMIN_STUDENTS_API_LIST).not.toBe(ADMIN_STUDENTS_ROOT);
            });
            it('uses a canonical cache namespace and separates demo data from live data', () => {
                const demoListKey = ADMIN_MEMBERS_STUDENTS_QUERY_KEYS.list({ mode: 'demo' });
                const liveListKey = ADMIN_MEMBERS_STUDENTS_QUERY_KEYS.list({ mode: 'live' });
                expect(demoListKey[0]).toBe('admin_members_students');
                expect(demoListKey).not.toEqual(liveListKey);
            });
        });
    });
    describe('Original suite: AdminMembersStudentsCsvUtils.test.ts', () => {
        describe('admin students CSV export', () => {
            it('escapes values and exports only typed minor-unit money with explicit currency', () => {
                const student: AdminStudentsStudent = {
                    id: 'stu-1', name: 'Sharma, "Aarav"', phone: '+91 9876543210', shift: 'Morning', seat: 'A-01',
                    plan: 'Basic', joinDate: '2026-01-01', expiryDate: '2026-06-30', status: 'Active', branch: 'Main',
                    feeStatus: 'Due', locker: '—', consecutiveAbsent: 2, totalPaid: '₹1,200.00', dueFee: '₹300.00', totalPaidMinor: 120000, dueFeeMinor: 30000, currencyCode: 'INR',
                };
                expect(serializeAdminStudentsCsv([student])).toContain('"Sharma, ""Aarav"""');
                expect(serializeAdminStudentsCsv([student])).toContain('120000');
                expect(serializeAdminStudentsCsv([student])).toContain('30000');
                expect(serializeAdminStudentsCsv([student])).toContain('INR');
                expect(serializeAdminStudentsCsv([student])).not.toContain('₹1,200.00');
                expect(serializeAdminStudentsCsv([{ ...student, name: '=HYPERLINK(\"https://example.invalid\")' }])).toContain("'=HYPERLINK");
            });
        });
    });
    describe('Original suite: AdminMembersStudentsExpiryDateUtils.test.ts', () => {
        describe('getAdminStudentsExpiryDatePresentation', () => {
            const now = new Date(2026, 9, 13, 12, 0, 0);
            it('parses the ISO date-only format used by API fixtures', () => {
                expect(getAdminStudentsExpiryDatePresentation('2026-10-12', now).state).toBe('expired');
                expect(getAdminStudentsExpiryDatePresentation('2026-10-14', now).state).toBe('current');
            });
            it('parses the legacy date format used by local fixtures', () => {
                expect(getAdminStudentsExpiryDatePresentation('12 Oct 2026', now).state).toBe('expired');
                expect(getAdminStudentsExpiryDatePresentation('14 Oct 2026', now).state).toBe('current');
            });
            it('keeps the expiry date current through the end of that calendar day and localizes display labels', () => {
                const afternoon = new Date(2026, 9, 13, 16, 45, 0);
                expect(getAdminStudentsExpiryDatePresentation('2026-10-13', afternoon).state).toBe('current');
                expect(getAdminStudentsExpiryDatePresentation('2026-10-13', afternoon, 'hi').label).not.toBe('2026-10-13');
                expect(getAdminStudentsExpiryDatePresentation('2026-10-12', afternoon).state).toBe('expired');
            });
            it('renders missing, invalid and undocumented formats as unknown', () => {
                expect(getAdminStudentsExpiryDatePresentation(undefined, now)).toMatchObject({ label: '—', state: 'unknown', className: 'text-text-secondary' });
                expect(getAdminStudentsExpiryDatePresentation('', now).state).toBe('unknown');
                expect(getAdminStudentsExpiryDatePresentation('2026-02-30', now).state).toBe('unknown');
                expect(getAdminStudentsExpiryDatePresentation('Oct 12, 2026', now).state).toBe('unknown');
            });
        });
    });
    describe('Original suite: AdminMembersStudentsFormatMoney.test.ts', () => {
        describe('formatAdminStudentsMoney', () => {
            it('formats explicit minor-unit amounts with their supplied currency', () => {
                expect(formatAdminStudentsMoney(1200000, 'INR', 'en')).toContain('12,000');
                expect(formatAdminStudentsMoney(0, 'INR', 'hi')).toContain('0');
            });
            it('uses the currency-specific minor-unit scale instead of assuming two digits', () => {
                const jpy = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'JPY' }).format(1234);
                const kwd = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'KWD' }).format(1.234);
                expect(formatAdminStudentsMoney(1234, 'JPY')).toBe(jpy);
                expect(formatAdminStudentsMoney(1234, 'KWD')).toBe(kwd);
            });
            it('rejects invalid values and does not infer a currency', () => {
                expect(formatAdminStudentsMoney(-1, 'INR')).toBe('—');
                expect(formatAdminStudentsMoney(Number.MAX_SAFE_INTEGER + 1, 'INR')).toBe('—');
                expect(formatAdminStudentsMoney(100, '')).toBe('—');
            });
        });
    });
    describe('Original suite: AdminMembersStudentsKpiUtils.test.ts', () => {
        const students: AdminStudentsStudent[] = [
            { id: 's-1', name: 'Asha', phone: '9000000001', shift: 'Morning', seat: 'A1', plan: 'Premium', joinDate: '2026-01-01', expiryDate: '2027-01-01', status: 'Active', branch: 'North', feeStatus: 'Paid' },
            { id: 's-2', name: 'Bala', phone: '9000000002', shift: 'Evening', seat: 'B1', plan: 'Basic', joinDate: '2026-02-01', expiryDate: '2027-02-01', status: 'Suspended', branch: 'North', feeStatus: 'Due' },
            { id: 's-3', name: 'Charu', phone: '9000000003', shift: 'Morning', seat: 'C1', plan: 'Elite', joinDate: '2026-03-01', expiryDate: '2027-03-01', status: 'Blocked', branch: 'South', feeStatus: 'Due' },
        ];
        describe('getAdminStudentsKpiSummary', () => {
            it('scopes summary counts to the selected branch but not to table filters', () => {
                expect(getAdminStudentsKpiSummary(students, 'North')).toEqual({
                    total: 2,
                    feeDue: 1,
                    byStatus: { Active: 1, Suspended: 1, Blocked: 0, Unknown: 0 },
                });
            });
            it('counts Unknown statuses so the status buckets reconcile to the total', () => {
                const withUnknown: AdminStudentsStudent[] = [...students, { id: 's-4', name: 'Dev', phone: '9000000004', shift: 'Morning', seat: 'D1', plan: 'Basic', joinDate: '2026-04-01', expiryDate: '2027-04-01', status: 'Unknown', branch: 'North' }];
                expect(getAdminStudentsKpiSummary(withUnknown, 'All Branches').byStatus.Unknown).toBe(1);
                expect(Object.values(getAdminStudentsKpiSummary(withUnknown, 'All Branches').byStatus).reduce((sum, count) => sum + count, 0)).toBe(4);
            });
            it('includes all branches when All Branches is selected', () => {
                expect(getAdminStudentsKpiSummary(students, 'All Branches')).toEqual({
                    total: 3,
                    feeDue: 2,
                    byStatus: { Active: 1, Suspended: 1, Blocked: 1, Unknown: 0 },
                });
            });
        });
    });
    describe('Original suite: AdminMembersStudentsSearchUtils.test.ts', () => {
        const student = { id: 'STU-021', name: 'Demo Student', phone: '+91 90000 00021' };
        describe('matchesAdminStudentsSearch', () => {
            it('matches formatted phone data using digit-only or international queries', () => {
                expect(matchesAdminStudentsSearch(student, '9000000021')).toBe(true);
                expect(matchesAdminStudentsSearch(student, '+919000000021')).toBe(true);
                expect(matchesAdminStudentsSearch(student, '000002')).toBe(true);
            });
            it('keeps name and ID matching and does not treat mixed text as a phone query', () => {
                expect(matchesAdminStudentsSearch(student, 'demo')).toBe(true);
                expect(matchesAdminStudentsSearch(student, 'STU-021')).toBe(true);
                expect(matchesAdminStudentsSearch(student, 'demo 900')).toBe(false);
            });
        });
    });
});

describe("Consolidated: AdminMembersStudentsViewSections", () => {
    afterEach(() => cleanup());
    const withMessages = (children: ReactNode) => <NextIntlClientProvider locale="en" messages={messages}>{children}</NextIntlClientProvider>;
    const makeViewModel = (overrides: Record<string, unknown> = {}) => ({
        search: '', setSearch: vi.fn(), statusFilter: 'All', setStatusFilter: vi.fn(),
        students: [], selectedStudent: null, setSelectedStudent: vi.fn(), selectedBranch: 'All Branches',
        filtered: [], colDefs: [], statuses: [...ADMIN_STUDENTS_STATUSES], isLoading: false,
        errorMessage: null, retryLoadStudents: vi.fn(), ...overrides,
    }) as unknown as ReturnType<typeof useAdminMembersStudentsMain>;
    it('renders the composed module header and retains action controls', () => {
        render(withMessages(<AdminMembersStudentsView model={makeViewModel()}/>));
        expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
        expect(screen.getByRole('button', { name: /CSV/i }).hasAttribute('disabled')).toBe(true);
    });
    it('forwards search and canonical status selections through the composed view', () => {
        const setSearch = vi.fn();
        const setStatusFilter = vi.fn();
        render(withMessages(<AdminMembersStudentsView model={makeViewModel({ setSearch, setStatusFilter })}/>));
        fireEvent.change(screen.getByRole('textbox', { name: /search/i }), { target: { value: 'STU-001' } });
        fireEvent.click(screen.getByRole('button', { name: /Active/i }));
        expect(setSearch).toHaveBeenCalledWith('STU-001');
        expect(setStatusFilter).toHaveBeenCalledWith('Active');
    });
    it('renders KPI labels from the supplied student collection', () => {
        render(withMessages(<AdminMembersStudentsView model={makeViewModel()}/>));
        expect(screen.getByText(messages.ADMIN_STUDENTS.KPI_TOTAL)).toBeTruthy();
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
HarnessVitest.describe('members_students local scenario harness', () => {
  HarnessVitest.it.each(HarnessScenarioList)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    HarnessTestingLibrary.render(<HarnessScenarioComponent scenario={scenario}>Feature content</HarnessScenarioComponent>);
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByTestId('admin_members_students-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByText('Feature content')).toBeTruthy();
  });
});
