// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/SuperadminBillingOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_billing/billing_overview/locales/superadmin_billing_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_billing/billing_overview/locales/superadmin_billing_overview_hi.json';

const sourceModules = import.meta.glob('../**/*.{ts,tsx}', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const namespace = 'SUPERADMIN_BILLING';
const schemaValidationKeys = [
  "CHOOSE_AN_EXPIRY_DATE",
  "DISCOUNT_VALUE_IS_TOO_LONG",
  "ENTER_A_DISCOUNT_SUCH_AS_20_OR_999_FLAT",
  "ENTER_A_VALID_CALENDAR_DATE",
  "ENTER_A_VALID_NUMBER",
  "ENTER_A_VALID_TEXT_VALUE",
  "MAXIMUM_USES_MUST_BE_A_WHOLE_NUMBER",
  "MAXIMUM_USES_MUST_BE_GREATER_THAN_ZERO",
  "PROVIDE_VALID_FORM_DATA",
  "USE_AT_LEAST_3_CHARACTERS",
  "USE_AT_MOST_32_CHARACTERS",
  "USE_UPPERCASE_LETTERS_NUMBERS_UNDERSCORES_OR_HYPHENS",
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

  it('keeps the documented catalog leaf inventory in sync', () => {
    expect(leafPaths(english)).toHaveLength(82);
    expect(leafPaths(hindi)).toHaveLength(82);
  });

  it('contains every literal COPY and VALIDATION key referenced by module source', () => {
    const enNamespace = getNamespace(english); const hiNamespace = getNamespace(hindi); const missing: string[] = [];
    const pattern = /\b(?:t|tCopy|tValidation)\s*\(\s*['\"`]((?:COPY|VALIDATION)\.[A-Z0-9_]+)['\"`]/g;
    for (const [file, source] of Object.entries(sourceModules)) { let match: RegExpExecArray | null; while ((match = pattern.exec(source)) !== null) { const [group, key] = match[1].split('.', 2); const enGroup = enNamespace[group] as Record<string, unknown> | undefined; const hiGroup = hiNamespace[group] as Record<string, unknown> | undefined; if (!enGroup?.[key]) missing.push(`${file}: English ${match[1]}`); if (!hiGroup?.[key]) missing.push(`${file}: Hindi ${match[1]}`); } }
    expect(missing).toEqual([]);
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
  it('provides localized table header copy in English and Hindi', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    for (const key of ['TABLE_COLUMN_INVOICE_ID', 'TABLE_COLUMN_TENANT_LIBRARY', 'TABLE_COLUMN_AMOUNT', 'TABLE_COLUMN_STATUS']) {
      expect(enCopy[key], `Missing English header key: ${key}`).toBeTruthy();
      expect(hiCopy[key], `Missing Hindi header key: ${key}`).toBeTruthy();
      expect(hiCopy[key], `Hindi header key is untranslated: ${key}`).not.toBe(enCopy[key]);
    }
  });

});
