// Consolidated from useAdminSettingsSupportUnsavedChangesGuard.test.ts; preserves the module-owned guard hook and its navigation assertions.
import { ADMIN_SUPPORT_URLS } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.url_config';
import { ADMIN_SUPPORT_MSW_HANDLERS, ADMIN_SUPPORT_DEMO_TICKETS, ADMIN_SUPPORT_FAQ_FIXTURES, ADMIN_SUPPORT_SYSTEM_STATUS_FIXTURES, ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES, ADMIN_SUPPORT_DOCUMENTATION_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_support/mocks/scenarios/admin_settings_support.scenarios';
import { AdminSupportTicketSchema } from '@/app/frontend_admin/admin_settings/settings_support/schemas/AdminSettingsSupportTicketSchema';
import { AdminSettingsSupportHarness as HarnessScenarioComponent } from '@/app/frontend_admin/admin_settings/settings_support/tests/harness/AdminSettingsSupportHarness';
import { AdminSettingsSupportScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_settings/settings_support/tests/harness/bootstrap';
import { getAdminSupportValidationMessageKey } from '@/app/frontend_admin/admin_settings/settings_support/utils/AdminSettingsSupportValidationUtils';
import { mswTestServer } from '@/app/frontend_admin/test/mswServer';
import * as HarnessTestingLibrary from '@testing-library/react';
import { render, screen, act, renderHook } from '@testing-library/react';
import * as HarnessVitest from 'vitest';
import { describe, expect, it, afterEach, vi, describe as __mergedDescribe } from 'vitest';


import useAdminSettingsSupportUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_support/hooks/useAdminSettingsSupportUnsavedChangesGuard.ts';


describe("Consolidated: AdminSettingsSupportFixtures", () => {
    describe('AdminSupportFixtures', () => {
        it('keeps sample support items identifiable and uses only known ticket status values', () => {
            expect(new Set(ADMIN_SUPPORT_DEMO_TICKETS.map((ticket) => ticket.id)).size).toBe(ADMIN_SUPPORT_DEMO_TICKETS.length);
            expect(ADMIN_SUPPORT_DEMO_TICKETS.every((ticket) => ['open', 'resolved'].includes(ticket.status))).toBe(true);
            expect(ADMIN_SUPPORT_DEMO_TICKETS.every((ticket) => ticket.subjectKey && ticket.categoryKey && ticket.dateKey)).toBe(true);
        });
        it('never presents a fixed calendar date as a current maintenance or announcement schedule', () => {
            expect(ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES.every((item) => item.dateKey === 'ANNOUNCEMENT_SAMPLE_DATE' || item.dateKey === 'ANNOUNCEMENT_ILLUSTRATIVE_DATE')).toBe(true);
        });
        it('keeps all sample panels backed by explicit module-owned fixtures', () => {
            expect(ADMIN_SUPPORT_FAQ_FIXTURES).toHaveLength(4);
            expect(ADMIN_SUPPORT_SYSTEM_STATUS_FIXTURES).toHaveLength(4);
            expect(ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES).toHaveLength(3);
            expect(ADMIN_SUPPORT_DOCUMENTATION_FIXTURES).toHaveLength(3);
        });
    });
});

describe("Consolidated: AdminSettingsSupportHarness", () => {
});

describe("Consolidated: AdminSettingsSupportMSWContractBoundary", () => {
    describe('Support API contract boundary', () => {
        it('fails closed with an explicit 501 instead of inventing a successful DTO', async () => {
            mswTestServer.use(...ADMIN_SUPPORT_MSW_HANDLERS);
            const response = await fetch(new URL(ADMIN_SUPPORT_URLS.LIST, 'http://localhost'));
            expect(response.status).toBe(501);
            await expect(response.json()).resolves.toMatchObject({
                code: 'API_CONTRACT_UNAVAILABLE',
            });
        });
    });
});

describe("Consolidated: AdminSettingsSupportTicketSchema", () => {
    describe('AdminSupportTicketSchema', () => {
        it('accepts a well-formed ticket preview', () => {
            expect(AdminSupportTicketSchema.safeParse({
                category: 'bug', priority: 'medium', subject: 'Report export fails', description: 'The export preview shows an error when opened.',
            }).success).toBe(true);
        });
        it('rejects empty subject and description fields', () => {
            const result = AdminSupportTicketSchema.safeParse({ category: 'bug', priority: 'medium', subject: ' ', description: '' });
            expect(result.success).toBe(false);
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
HarnessVitest.describe('admin_support_main local scenario harness', () => {
  HarnessVitest.it.each(HarnessScenarioList)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    HarnessTestingLibrary.render(<HarnessScenarioComponent scenario={scenario}>Feature content</HarnessScenarioComponent>);
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByTestId('admin_settings_support-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByText('Feature content')).toBeTruthy();
  });
});

// Additional co-located regression assertions migrated from the no-mock utility test.
describe('getAdminSupportValidationMessageKey', () => {
  it('maps empty and oversized text fields to distinct localized errors', () => {
    expect(getAdminSupportValidationMessageKey('subject', 'too_small')).toBe('ERROR_SUBJECT_REQUIRED');
    expect(getAdminSupportValidationMessageKey('subject', 'too_big')).toBe('ERROR_SUBJECT_TOO_LONG');
    expect(getAdminSupportValidationMessageKey('description', 'too_small')).toBe('ERROR_DESCRIPTION_REQUIRED');
    expect(getAdminSupportValidationMessageKey('description', 'too_big')).toBe('ERROR_DESCRIPTION_TOO_LONG');
  });

  it('uses field-specific required errors for enum fields', () => {
    expect(getAdminSupportValidationMessageKey('category', 'invalid_enum_value')).toBe('ERROR_CATEGORY_REQUIRED');
    expect(getAdminSupportValidationMessageKey('priority', 'invalid_type')).toBe('ERROR_PRIORITY_REQUIRED');
  });
});

__mergedDescribe("Original suite: useAdminSettingsSupportUnsavedChangesGuard.test.ts", () => {
let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

describe('useAdminSettingsSupportUnsavedChangesGuard', () => {
  it('intercepts same-origin navigation while dirty and allows clean navigation', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ dirty }) => useAdminSettingsSupportUnsavedChangesGuard(dirty, callback), { initialProps: { dirty: true } });
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
