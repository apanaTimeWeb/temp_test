// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_onboarding_setup/tests/SuperadminLibrariesOnboardingSetupLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/locales/superadmin_libraries_onboarding_setup_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/locales/superadmin_libraries_onboarding_setup_hi.json';

const namespace = 'SUPERADMIN_SETUP_WIZARD';
const schemaValidationKeys = [
  "AT_LEAST_1_SEAT_REQUIRED",
  "AT_LEAST_ONE_PLAN_REQUIRED",
  "AT_LEAST_ONE_SHIFT_IS_REQUIRED",
  "CITY_IS_REQUIRED",
  "END_TIME_REQUIRED",
  "ENTER_A_VALID_NUMBER",
  "ENTER_A_VALID_TEXT_VALUE",
  "FULL_ADDRESS_IS_REQUIRED",
  "LIBRARY_NAME_IS_REQUIRED",
  "MAX_3_CHARACTERS",
  "MINIMUM_1_DAY",
  "PLAN_NAME_REQUIRED",
  "PREFIX_REQUIRED",
  "PRICE_CANNOT_BE_NEGATIVE",
  "PROVIDE_A_VALID_LIST",
  "PROVIDE_VALID_FORM_DATA",
  "SEAT_COUNT_MUST_BE_9999_OR_FEWER",
  "SHIFT_NAME_IS_REQUIRED",
  "START_TIME_REQUIRED",
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

  it('provides localized skip-setup consequence copy in both languages', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    for (const key of ['SKIP_CONSEQUENCE_NO_SEATS_OR_SHIFTS', 'SKIP_CONSEQUENCE_FEE_PLAN_REQUIRED', 'SKIP_CONSEQUENCE_DASHBOARD_REMAINS_AVAILABLE']) {
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

  it('translates every COPY catalog entry except approved identifiers', () => {
    const englishCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hindiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    const approvedPreservedTerms = new Set<string>(['TEXT_22AAAAA0000A1Z5']);

    for (const [key, englishValue] of Object.entries(englishCopy)) {
      expect(hindiCopy[key], `Missing Hindi copy key: ${key}`).toBeTruthy();
      if (!approvedPreservedTerms.has(key)) {
        expect(hindiCopy[key], `COPY key is still English: ${key}`).not.toBe(englishValue);
      }
    }
  });
});
