// RESPONSIBILITY: Define source-level test coverage for settings overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_overview/tests/SuperadminSettingsOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import featureMap from '../superadmin_settings_overview_features.md?raw';
import english from '@/app/frontend_superadmin/superadmin_settings/settings_overview/locales/superadmin_settings_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_settings/settings_overview/locales/superadmin_settings_overview_hi.json';
import { SUPERADMIN_SETTINGS_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/constants/SuperadminSettingsOverviewConstants';

const sourceModules = import.meta.glob('../**/*.{ts,tsx}', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const namespace = 'SUPERADMIN_SETTINGS';
const schemaValidationKeys = [
  "CHOOSE_A_VALID_BOOLEAN_VALUE",
  "ENTER_A_VALID_SUPPORT_EMAIL",
  "ENTER_A_VALID_TEXT_VALUE",
  "MAINTENANCE_MESSAGE_IS_REQUIRED",
  "MAINTENANCE_MESSAGE_MUST_BE_500_CHARACTERS_OR_FEWER",
  "PLATFORM_NAME_IS_REQUIRED",
  "PLATFORM_NAME_MUST_BE_80_CHARACTERS_OR_FEWER",
  "PROVIDE_VALID_FORM_DATA",
  "SELECT_A_VALID_OPTION",
  "SUPPORT_EMAIL_MUST_BE_254_CHARACTERS_OR_FEWER",
] as const;

type JsonRecord = Record<string, unknown>;

function getNamespace(catalog: unknown): JsonRecord {
  const root = catalog as JsonRecord;
  const value = root[namespace];
  return value && typeof value === 'object' ? value as JsonRecord : {};
}

function leafPaths(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix];
  return Object.keys(value as JsonRecord).sort().flatMap((key) => {
    const nextPath = prefix ? `${prefix}.${key}` : key;
    return leafPaths((value as JsonRecord)[key], nextPath);
  });
}

describe(`${namespace} locale catalogs`, () => {
  it('lists every archived module test in the feature map', () => {
    const testFiles = Object.keys(import.meta.glob('../**/*.test.{ts,tsx}')).map((file) => file.replace(/^\.\.\//, ''));
    for (const file of testFiles) expect(featureMap, `Feature map omits ${file}`).toContain(file);
  });

  it('provides translated labels for every settings tab', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    for (const tab of SUPERADMIN_SETTINGS_TABS) {
      const key = tab.labelKey.replace(/^COPY\./, '');
      expect(enCopy[key], `Missing English settings tab label ${key}`).toBeTruthy();
      expect(hiCopy[key], `Missing Hindi settings tab label ${key}`).toBeTruthy();
      expect(hiCopy[key], `Hindi settings tab label is untranslated ${key}`).not.toBe(enCopy[key]);
    }
  });

  it('uses Hindi words for maintenance online/offline labels', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    expect(hiCopy.MAINTENANCE_OFFLINE).toBe('ऑफ़लाइन');
    expect(hiCopy.MAINTENANCE_ONLINE).toBe('ऑनलाइन');
    expect(hiCopy.MAINTENANCE_OFFLINE).not.toBe(enCopy.MAINTENANCE_OFFLINE);
    expect(hiCopy.MAINTENANCE_ONLINE).not.toBe(enCopy.MAINTENANCE_ONLINE);
  });


  it('contains every literal COPY and VALIDATION key referenced by module source in both catalogs', () => {
    const enNamespace = getNamespace(english); const hiNamespace = getNamespace(hindi); const missing: string[] = [];
    const pattern = /\b(?:t|tCopy|tValidation)\s*\(\s*['"`]((?:COPY|VALIDATION)\.[A-Z0-9_]+)['"`]/g;
    for (const [file, source] of Object.entries(sourceModules)) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) {
        const [group, key] = match[1].split('.', 2);
        const enGroup = enNamespace[group] as Record<string, unknown> | undefined;
        const hiGroup = hiNamespace[group] as Record<string, unknown> | undefined;
        if (!enGroup?.[key]) missing.push(`${file}: English ${match[1]}`);
        if (!hiGroup?.[key]) missing.push(`${file}: Hindi ${match[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });


  it('keeps English and Hindi catalog key trees identical', () => {
    expect(leafPaths(english)).toEqual(leafPaths(hindi));
  });

  it('provides every schema validation key in both languages', () => {
    const enValidation = (getNamespace(english).VALIDATION ?? {}) as Record<string, string>;
    const hiValidation = (getNamespace(hindi).VALIDATION ?? {}) as Record<string, string>;

    for (const key of schemaValidationKeys) {
      expect(enValidation[key], `Missing English validation key: ${key}`).toBeTruthy();
      expect(hiValidation[key], `Missing Hindi validation key: ${key}`).toBeTruthy();
      expect(hiValidation[key], `Hindi validation key is untranslated: ${key}`).not.toBe(enValidation[key]);
    }
  });
});
