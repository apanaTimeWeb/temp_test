// RESPONSIBILITY: Define source-level test coverage for libraries library waitlist automation using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_library_waitlist_automation/tests/SuperadminLibrariesOverviewLibraryWaitlistAutomationPreviewDisclosure.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pageClient = readFileSync(new URL('../components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx', import.meta.url), 'utf8');
const englishCatalog = JSON.parse(readFileSync(new URL('../locales/superadmin_libraries_overview_library_waitlist_automation_en.json', import.meta.url), 'utf8')) as Record<string, unknown>;
const hindiCatalog = JSON.parse(readFileSync(new URL('../locales/superadmin_libraries_overview_library_waitlist_automation_hi.json', import.meta.url), 'utf8')) as Record<string, unknown>;

describe('libraries_library_waitlist_automation preview disclosure contract', () => {
  it('visibly discloses preview-only data and does not invent a backend call', () => {
    expect(pageClient).toContain('PREVIEW_ONLY_DISCLOSURE');
    expect(pageClient).not.toMatch(/\bfetch\s*\(/);
    expect(pageClient).not.toContain('axios.');
    const serialized = JSON.stringify(englishCatalog);
    expect(serialized).toContain('PREVIEW_ONLY_DISCLOSURE');
  });

  it('keeps client-side validation local and the save action disabled without an API contract', () => {
    const page = readFileSync(new URL('../components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx', import.meta.url), 'utf8');
    expect(page).toContain('waitlist-settings-preview-form');
    expect(page).toContain('waitlist-validate-preview-btn');
    expect(page).toContain("id=\"save-waitlist-config-btn\" variant=\"primary\" disabled");
    expect(page).toContain("onSubmit={handleSubmit(() => setPreviewValidated(true), () => setPreviewValidated(false))}");
    expect(page).toContain("onChange: () => setPreviewValidated(false)");
    expect(page).toContain("COPY.MESSAGE_TEMPLATE_REQUIRED");
    expect(page).toContain("aria-describedby={errors.template ? 'waitlist-template-hint waitlist-template-error' : 'waitlist-template-hint'}");
  });

  it('keeps English and Hindi catalog keys aligned and translates the new local-validation copy', () => {
    const flatten = (value: unknown, prefix = ''): string[] => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix];
      return Object.keys(value as Record<string, unknown>).sort().flatMap((key) => flatten((value as Record<string, unknown>)[key], prefix ? `${prefix}.${key}` : key));
    };
    expect(flatten(englishCatalog)).toEqual(flatten(hindiCatalog));
    const englishCopy = (englishCatalog as any).SUPERADMIN_SYSTEM.COPY;
    const hindiCopy = (hindiCatalog as any).SUPERADMIN_SYSTEM.COPY;
    for (const key of ['DEFAULT_WAITLIST_TEMPLATE', 'NOTIFICATION_DELAY_REQUIRED', 'NOTIFICATION_DELAY_INTEGER', 'NOTIFICATION_DELAY_NON_NEGATIVE', 'VALIDATE_PREVIEW', 'WAITLIST_SETTINGS_VALIDATED_LOCALLY', 'MESSAGE_TEMPLATE_REQUIRED']) {
      expect(hindiCopy[key]).toBeTruthy();
      expect(hindiCopy[key]).not.toBe(englishCopy[key]);
    }
  });
});
