// RESPONSIBILITY: Define source-level test coverage for security overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_overview/tests/SuperadminSecurityOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_security/security_overview/locales/superadmin_security_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_security/security_overview/locales/superadmin_security_overview_hi.json';

const namespace = 'SUPERADMIN_SECURITY';
const schemaValidationKeys = [
  "AT_LEAST_ONE_FAILED_ATTEMPT",
  "CHOOSE_A_VALID_BOOLEAN_VALUE",
  "ENTER_A_VALID_NUMBER",
  "ENTER_A_WHOLE_NUMBER",
  "FAILED_ATTEMPTS_CANNOT_EXCEED_20",
  "LOCK_DURATION_CANNOT_EXCEED_1440_MINUTES",
  "LOCK_DURATION_MUST_BE_AT_LEAST_ONE_MINUTE",
  "PASSWORD_EXPIRY_CANNOT_EXCEED_365_DAYS",
  "PASSWORD_EXPIRY_MUST_BE_AT_LEAST_ONE_DAY",
  "PASSWORD_LENGTH_MUST_BE_128_CHARACTERS_OR_FEWER",
  "PASSWORD_LENGTH_MUST_BE_AT_LEAST_8_CHARACTERS",
  "PROVIDE_VALID_FORM_DATA",
  "SESSION_TIMEOUT_CANNOT_EXCEED_10080_MINUTES",
  "SESSION_TIMEOUT_MUST_BE_AT_LEAST_ONE_MINUTE",
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

  it('provides every schema validation key in both languages', () => {
    const enValidation = (getNamespace(english).VALIDATION ?? {}) as Record<string, string>;
    const hiValidation = (getNamespace(hindi).VALIDATION ?? {}) as Record<string, string>;

    for (const key of schemaValidationKeys) {
      expect(enValidation[key], `Missing English validation key: ${key}`).toBeTruthy();
      expect(hiValidation[key], `Missing Hindi validation key: ${key}`).toBeTruthy();
      expect(hiValidation[key], `Hindi validation key is untranslated: ${key}`).not.toBe(enValidation[key]);
    }
  });
  it('covers source-referenced COPY keys in both locale catalogs', () => {
    const moduleRoot = join(process.cwd(), 'frontend_superadmin', 'superadmin_security', 'security_overview');
    const collect = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? collect(join(directory, entry.name)) : /\.(tsx?|jsx?)$/.test(entry.name) ? [readFileSync(join(directory, entry.name), 'utf8')] : []);
    const source = collect(moduleRoot).join('\n');
    const keys = [...source.matchAll(/(?:t|tCopy)\(\s*['"]COPY\.([A-Z0-9_]+)['"]/g)].map((match) => match[1]);
    expect(keys.length).toBeGreaterThan(0);
    for (const key of new Set(keys)) { expect((getNamespace(english).COPY as Record<string, string>)).toHaveProperty(key); expect((getNamespace(hindi).COPY as Record<string, string>)).toHaveProperty(key); }
  });
});
