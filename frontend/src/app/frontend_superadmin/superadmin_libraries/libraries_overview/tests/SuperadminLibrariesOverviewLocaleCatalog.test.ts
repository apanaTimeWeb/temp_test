// RESPONSIBILITY: Define source-level test coverage for libraries overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_overview/tests/SuperadminLibrariesOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/locales/superadmin_libraries_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/locales/superadmin_libraries_overview_hi.json';

const namespace = 'SUPERADMIN_LIBRARIES';
const schemaValidationKeys = [
  "EMAIL_MUST_BE_254_CHARACTERS_OR_FEWER",
  "ENTER_A_LIBRARY_NAME",
  "ENTER_A_LOCATION",
  "ENTER_A_VALID_EMAIL_ADDRESS",
  "ENTER_A_VALID_TEXT_VALUE",
  "ENTER_THE_OWNER_NAME",
  "GST_IDENTIFIER_MUST_BE_32_CHARACTERS_OR_FEWER",
  "LIBRARY_NAME_MUST_BE_120_CHARACTERS_OR_FEWER",
  "LOCATION_MUST_BE_120_CHARACTERS_OR_FEWER",
  "OWNER_NAME_MUST_BE_120_CHARACTERS_OR_FEWER",
  "PHONE_NUMBER_MUST_BE_32_CHARACTERS_OR_FEWER",
  "PROVIDE_VALID_FORM_DATA",
  "SELECT_A_VALID_OPTION",
] as const;

const gridHeaderCopyKeys = [
  'COPY.LIBRARY_NAME',
  'COPY.LOCATION',
  'COPY.TABLE_COLUMN_ACTIONS',
  'COPY.TABLE_COLUMN_CAPACITY_BRANCHES_USERS',
  'COPY.TABLE_COLUMN_LTV_REVENUE_SAMPLE',
  'COPY.TABLE_COLUMN_STATUS',
] as const;

const copyKeys = [
  'COPY.REGISTERED_LIBRARIES',
  'COPY.ADD_LIBRARY',
  'COPY.LIBRARY_NAME',
  'COPY.MAINTENANCE',
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
  // No schema implementation is present in this module slice; do not advertise an empty validation-key loop as coverage.


  it('provides every schema validation key in both languages', () => {
    const enValidation = (getNamespace(english).VALIDATION ?? {}) as Record<string, string>;
    const hiValidation = (getNamespace(hindi).VALIDATION ?? {}) as Record<string, string>;
    for (const key of schemaValidationKeys) {
      expect(enValidation[key], `Missing English validation key: ${key}`).toBeTruthy();
      expect(hiValidation[key], `Missing Hindi validation key: ${key}`).toBeTruthy();
      expect(hiValidation[key], `Hindi validation key is untranslated: ${key}`).not.toBe(enValidation[key]);
    }
  });

  it('provides translated UI copy keys in both languages', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;

    for (const path of copyKeys) {
      const key = path.replace(/^COPY\./, '');
      expect(enCopy[key], `Missing English copy key: ${path}`).toBeTruthy();
      expect(hiCopy[key], `Missing Hindi copy key: ${path}`).toBeTruthy();
      expect(hiCopy[key], `Hindi copy key is untranslated: ${path}`).not.toBe(enCopy[key]);
    }
  });

  it('provides every localized grid header key in both languages', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;

    for (const path of gridHeaderCopyKeys) {
      const key = path.replace(/^COPY\./, '');
      expect(enCopy[key], `Missing English grid header key: ${path}`).toBeTruthy();
      expect(hiCopy[key], `Missing Hindi grid header key: ${path}`).toBeTruthy();
    }
  });

});


it('covers every literal COPY key referenced by module source', () => {
  const candidates = [path.resolve(process.cwd(), 'app/frontend_superadmin/superadmin_libraries'), path.resolve(process.cwd(), 'frontend_superadmin/superadmin_libraries')];
  const moduleRoot = candidates.find(existsSync);
  expect(moduleRoot, 'Could not resolve the Libraries module source root').toBeTruthy();
  const sourceFiles: string[] = [];
  const visit = (dir: string) => { for (const entry of readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) visit(full); else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.test.tsx')) sourceFiles.push(full); } };
  visit(moduleRoot!);
  const keys = new Set(sourceFiles.flatMap(file => [...readFileSync(file, 'utf8').matchAll(/COPY\.([A-Z0-9_]+)/g)].map(match => match[1])));
  const en = (getNamespace(english).COPY ?? {}) as Record<string, string>; const hi = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
  for (const key of keys) { expect(en[key], `Missing English COPY.${key}`).toBeTruthy(); expect(hi[key], `Missing Hindi COPY.${key}`).toBeTruthy(); }
});
