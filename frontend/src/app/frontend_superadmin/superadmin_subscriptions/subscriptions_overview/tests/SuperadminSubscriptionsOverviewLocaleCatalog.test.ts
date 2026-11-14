// RESPONSIBILITY: Define source-level test coverage for subscriptions overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_overview/tests/SuperadminSubscriptionsOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/locales/superadmin_subscriptions_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/locales/superadmin_subscriptions_overview_hi.json';

const namespace = 'SUPERADMIN_SUBSCRIPTIONS';
const schemaValidationKeys = [
  "AT_LEAST_ONE_BRANCH_IS_REQUIRED",
  "AT_LEAST_ONE_MEMBER_IS_REQUIRED",
  "BRANCH_LIMIT_EXCEEDS_THE_PREVIEW_LIMIT",
  "BRANCH_LIMIT_MUST_BE_A_WHOLE_NUMBER",
  "ENTER_A_VALID_NUMBER",
  "ENTER_A_VALID_PRICE",
  "ENTER_A_VALID_TEXT_VALUE",
  "MEMBER_LIMIT_EXCEEDS_THE_PREVIEW_LIMIT",
  "MEMBER_LIMIT_MUST_BE_A_WHOLE_NUMBER",
  "PLAN_NAME_IS_REQUIRED",
  "PLAN_NAME_MUST_BE_60_CHARACTERS_OR_FEWER",
  "PRICE_EXCEEDS_THE_ALLOWED_PREVIEW_LIMIT",
  "PRICE_MUST_BE_GREATER_THAN_ZERO",
  "PROVIDE_VALID_FORM_DATA",
  "STORAGE_LIMIT_IS_REQUIRED",
  "STORAGE_LIMIT_MUST_BE_40_CHARACTERS_OR_FEWER",
] as const;

const copyKeys = [
  'COPY.TABLE_COLUMN_ACTIONS',
  'COPY.TABLE_COLUMN_STATUS',
  'COPY.TABLE_COLUMN_CYCLE_MRR',
  'COPY.TABLE_COLUMN_PLAN',
  'COPY.TABLE_COLUMN_TENANT',
  'COPY.SAAS_SUBSCRIPTIONS',
  'COPY.CREATE_PLAN',
  'COPY.MOST_POPULAR',
  'COPY.PRICE_MO',
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
  it('covers source-referenced COPY keys in both locale catalogs', () => {
    const moduleRoot = join(process.cwd(), 'frontend_superadmin', 'superadmin_subscriptions', 'subscriptions_overview');
    const collect = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? collect(join(directory, entry.name)) : /\.(tsx?|jsx?)$/.test(entry.name) ? [readFileSync(join(directory, entry.name), 'utf8')] : []);
    const source = collect(moduleRoot).join('\n');
    const keys = [...source.matchAll(/(?:t|tCopy)\(\s*['"]COPY\.([A-Z0-9_]+)['"]/g)].map((match) => match[1]);
    expect(keys.length).toBeGreaterThan(0);
    for (const key of new Set(keys)) { expect((getNamespace(english).COPY as Record<string, string>)).toHaveProperty(key); expect((getNamespace(hindi).COPY as Record<string, string>)).toHaveProperty(key); }
  });
  it('documents this leaf English/Hindi locale catalog paths', () => {
    const moduleRoot = join(process.cwd(), 'frontend_superadmin', 'superadmin_subscriptions', 'subscriptions_overview');
    const featureMap = readFileSync(join(moduleRoot, 'superadmin_subscriptions_overview_features.md'), 'utf8');
    expect(featureMap).toContain('superadmin_subscriptions_overview_en.json');
    expect(featureMap).toContain('superadmin_subscriptions_overview_hi.json');
  });
});
