import Suite0_AdminProfilePage from "@/app/frontend_admin/admin_settings/settings_profile/page";
import Suite0_AdminProfilePasswordForm from "@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfilePasswordForm";
import { ADMIN_SETTINGS_PROFILE_API as Suite0_ADMIN_SETTINGS_PROFILE_API } from "@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.url_config";
import suite0_adminProfileEn from "@/app/frontend_admin/admin_settings/settings_profile/locales/admin_settings_profile_en.json";
import suite0_adminProfileHi from "@/app/frontend_admin/admin_settings/settings_profile/locales/admin_settings_profile_hi.json";
import adminShellEn from '@/app/frontend_admin/application_infrastructure/application_infrastructure_locales/admin_shell_en.json';
import adminShellHi from '@/app/frontend_admin/application_infrastructure/application_infrastructure_locales/admin_shell_hi.json';
import { vi } from 'vitest';

vi.mock('@/app/frontend_admin/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: () => true }));
import { ADMIN_PROFILE_DEMO_ACCOUNT as Suite0_ADMIN_PROFILE_DEMO_ACCOUNT, ADMIN_PROFILE_DEMO_SESSIONS as Suite0_ADMIN_PROFILE_DEMO_SESSIONS, ADMIN_PROFILE_DEMO_LOGIN_HISTORY as Suite0_ADMIN_PROFILE_DEMO_LOGIN_HISTORY, ADMIN_PROFILE_MSW_HANDLERS as Suite0_ADMIN_PROFILE_MSW_HANDLERS } from "@/app/frontend_admin/admin_settings/settings_profile/mocks/AdminSettingsProfileFixtures";
import { AdminProfileEditSchema as Suite0_AdminProfileEditSchema, AdminProfilePasswordSchema as Suite0_AdminProfilePasswordSchema } from "@/app/frontend_admin/admin_settings/settings_profile/schemas/AdminSettingsProfileSchema";
import { AdminSettingsProfileHarness as Suite0_HarnessScenarioComponent } from "@/app/frontend_admin/admin_settings/settings_profile/tests/harness/AdminSettingsProfileHarness";
import { AdminSettingsProfileScenarios as Suite0_HarnessScenarioList, AdminSettingsProfileScenarioLabel as Suite0_AdminSettingsProfileScenarioLabel } from "@/app/frontend_admin/admin_settings/settings_profile/tests/harness/bootstrap";
import { getAdminProfileValidationMessageKey as suite0_getAdminProfileValidationMessageKey } from "@/app/frontend_admin/admin_settings/settings_profile/schemas/AdminSettingsProfileSchema";
import * as Suite0_HarnessTestingLibrary from "@testing-library/react";
import { fireEvent as suite0_fireEvent, render as suite0_render, screen as suite0_screen } from "@testing-library/react";
import { NextIntlClientProvider as Suite0_NextIntlClientProvider } from "next-intl";
import * as Suite0_HarnessVitest from "vitest";
import { describe as suite0_describe, expect as suite0_expect, it as suite0_it } from "vitest";
import { act as suite1_act, fireEvent as suite1_fireEvent, renderHook as suite1_renderHook } from "@testing-library/react";
import { afterEach as suite1_afterEach, describe as suite1_describe, expect as suite1_expect, it as suite1_it, vi as suite1_vi } from "vitest";
import suite1_useAdminSettingsProfileUnsavedChangesGuard from "@/app/frontend_admin/admin_settings/settings_profile/hooks/useAdminSettingsProfileUnsavedChangesGuard";

describe("Consolidated from AdminSettingsProfileNonMockRegressionSuite.test.tsx", () => {

















suite0_describe("Consolidated: AdminSettingsProfileHarness", () => {
    suite0_it('renders children when scenario is active', () => {
        suite0_render(<Suite0_HarnessScenarioComponent scenario="ACTIVE_RECORDS"><span>Harness Content</span></Suite0_HarnessScenarioComponent>);
        suite0_expect(suite0_screen.getByText('Harness Content')).toBeTruthy();
    });
});

suite0_describe("Consolidated: AdminSettingsProfileRegressionSuite", () => {
    suite0_describe('Original suite: AdminSettingsProfileFixtures.test.ts', () => {
        suite0_describe('AdminProfileFixtures', () => {
            suite0_it('uses a clearly synthetic account and reserved example email domain', () => {
                suite0_expect(Suite0_ADMIN_PROFILE_DEMO_ACCOUNT.email.endsWith('.example')).toBe(true);
                suite0_expect(Suite0_ADMIN_PROFILE_DEMO_ACCOUNT.nameKey).toBe('DEMO_ACCOUNT_NAME');
                suite0_expect(Suite0_ADMIN_PROFILE_DEMO_ACCOUNT.bio).toBe('DEMO_ACCOUNT_BIO');
            });
            suite0_it('keeps sample session and login-history IDs unique and IPs within documentation ranges', () => {
                suite0_expect(new Set(Suite0_ADMIN_PROFILE_DEMO_SESSIONS.map((item) => item.id)).size).toBe(Suite0_ADMIN_PROFILE_DEMO_SESSIONS.length);
                suite0_expect(new Set(Suite0_ADMIN_PROFILE_DEMO_LOGIN_HISTORY.map((item) => item.id)).size).toBe(Suite0_ADMIN_PROFILE_DEMO_LOGIN_HISTORY.length);
                suite0_expect([...Suite0_ADMIN_PROFILE_DEMO_SESSIONS, ...Suite0_ADMIN_PROFILE_DEMO_LOGIN_HISTORY].every((item) => item.ip.startsWith('192.0.2.'))).toBe(true);
                suite0_expect(Suite0_ADMIN_PROFILE_DEMO_SESSIONS.filter((item) => item.current)).toHaveLength(1);
            });
        });
    });
    suite0_describe('Original suite: AdminSettingsProfileMSWContractBoundary.test.ts', () => {
        suite0_describe('Profile API contract boundary', () => {
            suite0_it('keeps profile API operations unavailable until the host contract is supplied', () => {
                suite0_expect(Suite0_ADMIN_SETTINGS_PROFILE_API.CONTRACT_MISSING).toBeNull();
                suite0_expect(Suite0_ADMIN_PROFILE_MSW_HANDLERS).toHaveLength(0);
            });
        });
    });
    suite0_describe('Original suite: AdminSettingsProfileResponsivePanels.test.tsx', () => {
        const enMessages = { ...suite0_adminProfileEn, ...adminShellEn };
        const hiMessages = { ...suite0_adminProfileHi, ...adminShellHi };
        function renderProfile(locale: 'en' | 'hi' = 'en') {
            return suite0_render(<Suite0_NextIntlClientProvider locale={locale} messages={locale === 'en' ? enMessages : hiMessages}><Suite0_AdminProfilePage /></Suite0_NextIntlClientProvider>);
        }
        suite0_describe('Admin Profile responsive and truthful security panels', () => {
            suite0_it('renders all history fields in mobile cards and preserves a desktop semantic table', () => {
                const { container } = renderProfile();
                suite0_fireEvent.click(suite0_screen.getByTestId('admin_profile-AdminProfilePage-navigation-history'));
                suite0_expect(container.querySelector('.md\\:hidden')?.querySelectorAll('article').length).toBeGreaterThan(0);
                suite0_expect(suite0_screen.getByRole('table')).toBeTruthy();
                suite0_expect(suite0_screen.getByText(/Illustrative sample records/)).toBeTruthy();
            });
            suite0_it('renders the session view with sample devices while keeping revoke actions disabled without an API contract', () => {
                renderProfile();
                suite0_fireEvent.click(suite0_screen.getByTestId('admin_profile-AdminProfilePage-navigation-sessions'));
                suite0_expect(suite0_screen.getByRole('heading', { name: /Windows PC/ })).toBeTruthy();
                suite0_expect(suite0_screen.getByText(/Current session/)).toBeTruthy();
                const revokeButtons = suite0_screen.getAllByRole('button', { name: /Revoke session/ });
                suite0_expect(revokeButtons.length).toBeGreaterThan(0);
                suite0_expect(revokeButtons.every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
            });
            suite0_it('labels security preferences as illustrative rather than verified live state in both locales', () => {
                const { rerender } = renderProfile('en');
                suite0_fireEvent.click(suite0_screen.getByTestId('admin_profile-AdminProfilePage-navigation-security'));
                suite0_expect(suite0_screen.getByText('Illustrative only — not verified live status')).toBeTruthy();
                rerender(<Suite0_NextIntlClientProvider locale="hi" messages={hiMessages}><Suite0_AdminProfilePage /></Suite0_NextIntlClientProvider>);
                suite0_fireEvent.click(suite0_screen.getByTestId('admin_profile-AdminProfilePage-navigation-security'));
                suite0_expect(suite0_screen.getByText('केवल उदाहरण — वास्तविक स्थिति सत्यापित नहीं है')).toBeTruthy();
            });
        });
    });
    suite0_describe('Original suite: AdminSettingsProfileSchema.test.ts', () => {
        suite0_describe('AdminProfile form schemas', () => {
            suite0_it('rejects invalid profile email and oversized values', () => {
                suite0_expect(Suite0_AdminProfileEditSchema.safeParse({ fullName: 'Lee', phone: '123', email: 'not-an-email', bio: '' }).success).toBe(false);
                suite0_expect(Suite0_AdminProfileEditSchema.safeParse({ fullName: 'Lee Admin', phone: '123', email: 'admin@example.com', bio: 'x'.repeat(501) }).success).toBe(false);
            });
            suite0_it('accepts formatted phone numbers with 8–15 digits and rejects arbitrary text', () => {
                const base = { fullName: 'Lee Admin', email: 'admin@example.com', bio: '' };
                suite0_expect(Suite0_AdminProfileEditSchema.safeParse({ ...base, phone: '+91 (98765) 43210' }).success).toBe(true);
                suite0_expect(Suite0_AdminProfileEditSchema.safeParse({ ...base, phone: 'call me maybe' }).success).toBe(false);
                suite0_expect(Suite0_AdminProfileEditSchema.safeParse({ ...base, phone: '1234567' }).success).toBe(false);
            });
            suite0_it('requires matching password confirmation', () => {
                const base = { currentPassword: 'old', newPassword: 'new', confirmPassword: 'other' };
                suite0_expect(Suite0_AdminProfilePasswordSchema.safeParse(base).success).toBe(false);
                suite0_expect(Suite0_AdminProfilePasswordSchema.safeParse({ ...base, confirmPassword: 'new' }).success).toBe(true);
            });
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
Suite0_HarnessVitest.describe('admin_profile_main local scenario harness', () => {
  Suite0_HarnessVitest.it.each(Suite0_HarnessScenarioList)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    Suite0_HarnessTestingLibrary.render(<Suite0_HarnessScenarioComponent scenario={scenario}>Feature content</Suite0_HarnessScenarioComponent>);
    Suite0_HarnessVitest.expect(Suite0_HarnessTestingLibrary.screen.getByTestId('admin_settings_profile-harness').getAttribute('data-scenario')).toBe(
      Suite0_AdminSettingsProfileScenarioLabel(scenario),
    );
    Suite0_HarnessVitest.expect(Suite0_HarnessTestingLibrary.screen.getByText('Feature content')).toBeTruthy();
  });
});

// Additional co-located regression assertions migrated from the no-mock utility test.
suite0_describe('getAdminProfileValidationMessageKey', () => {
  suite0_it('maps edit-profile schema issues to locale keys', () => {
    suite0_expect(suite0_getAdminProfileValidationMessageKey('fullName', 'too_small')).toBe('ERROR_NAME_TOO_SHORT');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('fullName', 'too_big')).toBe('ERROR_NAME_TOO_LONG');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('phone', 'too_small')).toBe('ERROR_PHONE_REQUIRED');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('phone', 'too_big')).toBe('ERROR_PHONE_TOO_LONG');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('phone', 'custom')).toBe('ERROR_PHONE_INVALID');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('email', 'invalid_format')).toBe('ERROR_EMAIL_INVALID');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('bio', 'too_big')).toBe('ERROR_BIO_TOO_LONG');
  });

  suite0_it('distinguishes required password fields from confirmation mismatch', () => {
    suite0_expect(suite0_getAdminProfileValidationMessageKey('currentPassword', 'too_small')).toBe('ERROR_CURRENT_PASSWORD_REQUIRED');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('newPassword', 'too_small')).toBe('ERROR_NEW_PASSWORD_REQUIRED');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('confirmPassword', 'too_small')).toBe('ERROR_CONFIRM_PASSWORD_REQUIRED');
    suite0_expect(suite0_getAdminProfileValidationMessageKey('confirmPassword', 'custom')).toBe('ERROR_PASSWORD_MISMATCH');
  });
});


suite0_describe('Profile locale namespace integrity', () => {
  suite0_it('keeps route-boundary, invalid-phone, password-accessibility, and unsaved-change keys inside ADMIN_PROFILE in both locales', () => {
    const requiredKeys = [
      'ROUTE_LOADING', 'ROUTE_ERROR_TITLE', 'ROUTE_ERROR_DESCRIPTION', 'ROUTE_TRY_AGAIN',
      'ERROR_PHONE_REQUIRED', 'ERROR_PHONE_TOO_LONG', 'ERROR_PHONE_INVALID',
      'ARIA_SHOW_CURRENT_PASSWORD', 'ARIA_HIDE_CURRENT_PASSWORD',
      'UNSAVED_CHANGES_TITLE', 'UNSAVED_CHANGES_DESCRIPTION', 'UNSAVED_CHANGES_STAY', 'UNSAVED_CHANGES_LEAVE',
    ];
    for (const messages of [suite0_adminProfileEn, suite0_adminProfileHi]) {
      suite0_expect(messages).toHaveProperty('ADMIN_PROFILE');
      for (const key of requiredKeys) suite0_expect(messages.ADMIN_PROFILE).toHaveProperty(key);
    }
  });
});

suite0_describe('AdminProfilePasswordForm password visibility', () => {
  suite0_it('toggles each password field independently and uses localized accessible labels', () => {
    suite0_render(<Suite0_NextIntlClientProvider locale="en" messages={suite0_adminProfileEn}><Suite0_AdminProfilePasswordForm onDirtyChange={() => undefined} /></Suite0_NextIntlClientProvider>);
    const current = suite0_screen.getByLabelText('Current password') as HTMLInputElement;
    const next = suite0_screen.getByLabelText('New password') as HTMLInputElement;
    const confirm = suite0_screen.getByLabelText('Confirm new password') as HTMLInputElement;

    suite0_expect(current.type).toBe('password');
    suite0_expect(next.type).toBe('password');
    suite0_expect(confirm.type).toBe('password');

    suite0_fireEvent.click(suite0_screen.getByRole('button', { name: 'Show current password' }));
    suite0_expect(current.type).toBe('text');
    suite0_expect(next.type).toBe('password');
    suite0_expect(confirm.type).toBe('password');

    suite0_fireEvent.click(suite0_screen.getByRole('button', { name: 'Hide current password' }));
    suite0_fireEvent.click(suite0_screen.getByRole('button', { name: 'Show new password' }));
    suite0_fireEvent.click(suite0_screen.getByRole('button', { name: 'Show password confirmation' }));
    suite0_expect(current.type).toBe('password');
    suite0_expect(next.type).toBe('text');
    suite0_expect(confirm.type).toBe('text');
  });

  suite0_it('keeps the profile password visibility control labels in English and Hindi locale files', () => {
    for (const key of ['ARIA_SHOW_CURRENT_PASSWORD', 'ARIA_HIDE_CURRENT_PASSWORD', 'ARIA_SHOW_NEW_PASSWORD', 'ARIA_HIDE_NEW_PASSWORD', 'ARIA_SHOW_CONFIRM_PASSWORD', 'ARIA_HIDE_CONFIRM_PASSWORD']) {
      suite0_expect(suite0_adminProfileEn.ADMIN_PROFILE).toHaveProperty(key);
      suite0_expect(suite0_adminProfileHi.ADMIN_PROFILE).toHaveProperty(key);
    }
  });
});

});


describe("Consolidated from AdminSettingsProfileUnsavedChangesGuard.test.tsx", () => {




let testAnchor: HTMLAnchorElement | null = null;
suite1_afterEach(() => {
  testAnchor?.remove();
  testAnchor = null;
});

function addNavigationAnchor(): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.href = '/admin/admin_settings/settings_profile?view=security';
  anchor.textContent = 'Navigate away';
  document.body.appendChild(anchor);
  testAnchor = anchor;
  return anchor;
}

suite1_describe('useAdminSettingsProfileUnsavedChangesGuard', () => {
  suite1_it('blocks same-origin anchor navigation while a profile draft is dirty', () => {
    const onBlockedNavigation = suite1_vi.fn();
    suite1_renderHook(() => suite1_useAdminSettingsProfileUnsavedChangesGuard(true, onBlockedNavigation));
    suite1_fireEvent.click(addNavigationAnchor());
    suite1_expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/admin_settings/settings_profile?view=security');
  });

  suite1_it('allows same-origin anchor navigation when no draft is dirty', () => {
    const onBlockedNavigation = suite1_vi.fn();
    suite1_renderHook(() => suite1_useAdminSettingsProfileUnsavedChangesGuard(false, onBlockedNavigation));
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    suite1_act(() => { addNavigationAnchor().dispatchEvent(event); });
    suite1_expect(event.defaultPrevented).toBe(false);
    suite1_expect(onBlockedNavigation).not.toHaveBeenCalled();
  });

  suite1_it('registers the browser-exit guard only while dirty', () => {
    const onBlockedNavigation = suite1_vi.fn();
    const { rerender } = suite1_renderHook(({ isDirty }) => suite1_useAdminSettingsProfileUnsavedChangesGuard(isDirty, onBlockedNavigation), { initialProps: { isDirty: false } });
    const cleanEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(cleanEvent);
    suite1_expect(cleanEvent.defaultPrevented).toBe(false);

    rerender({ isDirty: true });
    const dirtyEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(dirtyEvent);
    suite1_expect(dirtyEvent.defaultPrevented).toBe(true);
  });
});

});

