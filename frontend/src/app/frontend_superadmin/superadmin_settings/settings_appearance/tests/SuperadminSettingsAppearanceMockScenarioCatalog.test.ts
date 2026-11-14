// RESPONSIBILITY: Define source-level coverage for the Appearance preview scenario catalog and its preview-only UI contract.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SETTINGS_APPEARANCE_CANONICAL_SCENARIOS } from '../mocks/scenarios/SuperadminSettingsAppearanceMockScenarios';

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

describe('settings_appearance canonical mock scenario catalog', () => {
  it('declares the required eight scenario states without inventing backend contracts', () => {
    expect(SUPERADMIN_SETTINGS_APPEARANCE_CANONICAL_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      'ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED', 'LOADING', 'MUTATION_FAILURE', 'UNAVAILABLE_MUTATION',
    ]);
    expect(Object.fromEntries(SUPERADMIN_SETTINGS_APPEARANCE_CANONICAL_SCENARIOS.map((scenario) => [scenario.id, scenario.executableWithoutBackendContract]))).toEqual({
      ACTIVE: true, EMPTY: true, SERVER_500: false, TIMEOUT: false, UNAUTHORIZED: false, LOADING: true, MUTATION_FAILURE: false, UNAVAILABLE_MUTATION: true,
    });
  });

  it('keeps the visible Appearance selectors aligned with the local preview schema and defaults', () => {
    const page = read('../components/SuperadminSettingsAppearancePageClient.tsx');
    const schema = read('../schemas/SuperadminSettingsAppearanceSchema.ts');
    const types = read('../types/SuperadminSettingsAppearanceTypes.ts');
    const defaults = read('../mocks/fixtures/SuperadminSettingsAppearancePreviewDefaults.ts');
    for (const field of ['previewDensity', 'previewAccent']) {
      expect(page).toContain(field);
      expect(schema).toContain(field);
      expect(types).toContain(field);
      expect(defaults).toContain(field);
    }
    expect(page).toContain('settings-appearance-density-select');
    expect(page).toContain('settings-appearance-accent-select');
    expect(page).toContain('SUPERADMIN_SETTINGS_APPEARANCE_PREVIEW_SCHEMA.safeParse');
    expect(page).toContain('superadmin-settings-appearance-preview-only-disclosure');
  });

  it('does not expose an inert global Save form or claim durable persistence', () => {
    const page = read('../components/SuperadminSettingsAppearancePageClient.tsx');
    expect(page).not.toContain('useForm');
    expect(page).not.toContain('handleSubmit');
    expect(page).not.toContain('<form');
    expect(page).not.toContain('SAVE_CHANGES');
    expect(page).not.toContain('toast.message');
    expect(page).toContain('no host settings are read or saved');
  });
});
