import { ADMIN_SETTINGS_SECURITY_API } from '@/app/frontend_admin/admin_settings/settings_security/config/admin_settings_security.url_config';
import { ADMIN_SECURITY_MSW_HANDLERS, ADMIN_SECURITY_EVENT_FIXTURES, ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES, ADMIN_SECURITY_FAILED_LOGIN_FIXTURES, ADMIN_SECURITY_DEVICE_SESSION_FIXTURES, ADMIN_SECURITY_BLOCKED_ACCOUNT_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_security/mocks/scenarios/admin_settings_security.scenarios';
import { AdminSettingsSecurityHarness as HarnessScenarioComponent } from '@/app/frontend_admin/admin_settings/settings_security/tests/harness/AdminSettingsSecurityHarness';
import { AdminSettingsSecurityScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_settings/settings_security/tests/harness/bootstrap';
import { filterAdminSecurityEvents } from '@/app/frontend_admin/admin_settings/settings_security/utils/AdminSettingsSecurityEventUtils';
import * as HarnessTestingLibrary from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import * as HarnessVitest from 'vitest';
import { describe, expect, it } from 'vitest';

describe("Consolidated: AdminSettingsSecurityFixtures", () => {
    describe('AdminSecurityFixtures', () => {
        it('uses documentation IPs and reserved invalid example domains for synthetic identities', () => {
            const allIps = [
                ...ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES.map((item) => item.ip),
                ...ADMIN_SECURITY_FAILED_LOGIN_FIXTURES.map((item) => item.ip),
                ...ADMIN_SECURITY_DEVICE_SESSION_FIXTURES.map((item) => item.ip),
            ];
            expect(allIps.every((ip) => ip.startsWith('192.0.2.'))).toBe(true);
            expect(ADMIN_SECURITY_FAILED_LOGIN_FIXTURES.every((item) => item.account.endsWith('.example.invalid') || item.account === 'unknown-demo-account')).toBe(true);
            expect(ADMIN_SECURITY_BLOCKED_ACCOUNT_FIXTURES.every((item) => item.email.endsWith('.example.invalid'))).toBe(true);
        });
        it('keeps each session/account/device record identifiable and has exactly one current session', () => {
            expect(new Set(ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES.map((item) => item.id)).size).toBe(ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES.length);
            expect(ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES.filter((item) => item.current)).toHaveLength(1);
            expect(new Set(ADMIN_SECURITY_BLOCKED_ACCOUNT_FIXTURES.map((item) => item.id)).size).toBe(ADMIN_SECURITY_BLOCKED_ACCOUNT_FIXTURES.length);
            expect(new Set(ADMIN_SECURITY_DEVICE_SESSION_FIXTURES.map((item) => item.id)).size).toBe(ADMIN_SECURITY_DEVICE_SESSION_FIXTURES.length);
        });
    });
});

describe("Consolidated: AdminSettingsSecurityHarness", () => {
});

describe("Consolidated: AdminSettingsSecurityMSWContractBoundary", () => {
    describe('Security API contract boundary', () => {
        it('keeps security API operations unavailable until the host contract is supplied', () => {
            expect(ADMIN_SETTINGS_SECURITY_API.CONTRACT_MISSING).toBeNull();
            expect(ADMIN_SECURITY_MSW_HANDLERS).toHaveLength(0);
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
HarnessVitest.describe('admin_security_main local scenario harness', () => {
  HarnessVitest.it.each(HarnessScenarioList)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    HarnessTestingLibrary.render(<HarnessScenarioComponent scenario={scenario}>Feature content</HarnessScenarioComponent>);
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByTestId('admin_settings_security-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByText('Feature content')).toBeTruthy();
  });
});

// Additional co-located regression assertions migrated from the no-mock utility test.
describe('filterAdminSecurityEvents', () => {
  it('returns all events for the all filter and copies the array', () => {
    const result = filterAdminSecurityEvents(ADMIN_SECURITY_EVENT_FIXTURES, 'all');
    expect(result).toEqual(ADMIN_SECURITY_EVENT_FIXTURES);
    expect(result).not.toBe(ADMIN_SECURITY_EVENT_FIXTURES);
  });

  it('filters typed categories independent of translated labels', () => {
    expect(filterAdminSecurityEvents(ADMIN_SECURITY_EVENT_FIXTURES, 'password').map((event) => event.id)).toEqual(['event-demo-1']);
    expect(filterAdminSecurityEvents(ADMIN_SECURITY_EVENT_FIXTURES, 'account').map((event) => event.id)).toEqual(['event-demo-2']);
    expect(filterAdminSecurityEvents(ADMIN_SECURITY_EVENT_FIXTURES, '2fa').map((event) => event.id)).toEqual(['event-demo-3']);
    expect(filterAdminSecurityEvents(ADMIN_SECURITY_EVENT_FIXTURES, 'session').map((event) => event.id)).toEqual(['event-demo-4']);
  });
});
