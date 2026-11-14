// RESPONSIBILITY: Define source-level test coverage for settings profile overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_overview/tests/SuperadminProfileOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/locales/superadmin_profile_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/locales/superadmin_profile_overview_hi.json';

const namespace = 'SUPERADMIN_PROFILE';
const copyKeys = ['TABLE_COLUMN_DATE_TIME', 'TABLE_COLUMN_IP_ADDRESS', 'TABLE_COLUMN_LOCATION', 'TABLE_COLUMN_BROWSER', 'TABLE_COLUMN_STATUS'] as const;

const schemaValidationKeys = [
  "CHOOSE_A_NEW_PASSWORD_DIFFERENT_FROM_THE_CURRENT_PASSWORD",
  "CONFIRM_YOUR_NEW_PASSWORD",
  "CURRENT_PASSWORD_IS_REQUIRED",
  "ENTER_A_VALID_EMAIL_ADDRESS",
  "ENTER_A_VALID_PHONE_NUMBER",
  "ENTER_A_VALID_TEXT_VALUE",
  "FIRST_NAME_IS_REQUIRED",
  "FIRST_NAME_MUST_BE_80_CHARACTERS_OR_FEWER",
  "INCLUDE_AT_LEAST_ONE_SYMBOL",
  "INCLUDE_AT_LEAST_ONE_UPPERCASE_LETTER",
  "LAST_NAME_IS_REQUIRED",
  "LAST_NAME_MUST_BE_80_CHARACTERS_OR_FEWER",
  "PASSWORDS_DO_NOT_MATCH",
  "PASSWORD_MUST_BE_128_CHARACTERS_OR_FEWER",
  "PHONE_NUMBER_IS_TOO_LONG",
  "PROVIDE_VALID_FORM_DATA",
  "USE_AT_LEAST_12_CHARACTERS",
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
  it('keeps English and Hindi catalog key trees identical', () => {
    expect(leafPaths(english)).toEqual(leafPaths(hindi));
  });

  it('provides localized login-history grid headers in both languages', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    for (const key of copyKeys) {
      expect(enCopy[key], `Missing English copy key: ${key}`).toBeTruthy();
      expect(hiCopy[key], `Missing Hindi copy key: ${key}`).toBeTruthy();
      expect(hiCopy[key], `Hindi copy key is untranslated: ${key}`).not.toBe(enCopy[key]);
    }
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


it('covers every literal COPY key referenced by profile source', () => {
  const candidates = [path.resolve(process.cwd(), 'frontend_superadmin/superadmin_settings/settings_profile_overview')]; const moduleRoot = candidates.find(existsSync); expect(moduleRoot).toBeTruthy();
  const files: string[] = []; const visit = (dir: string) => { for (const entry of readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) visit(full); else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.includes('.test.')) files.push(full); } }; visit(moduleRoot!);
  const keys = new Set(files.flatMap(file => [...readFileSync(file, 'utf8').matchAll(/COPY\.([A-Z0-9_]+)/g)].map(match => match[1])));
  const en = (getNamespace(english).COPY ?? {}) as Record<string,string>; const hi = (getNamespace(hindi).COPY ?? {}) as Record<string,string>; for (const key of keys) { expect(en[key], `Missing English COPY.${key}`).toBeTruthy(); expect(hi[key], `Missing Hindi COPY.${key}`).toBeTruthy(); }
});
