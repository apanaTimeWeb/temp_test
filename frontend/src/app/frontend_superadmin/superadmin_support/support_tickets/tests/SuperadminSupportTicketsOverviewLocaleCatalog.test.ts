// RESPONSIBILITY: Define source-level test coverage for support tickets using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_tickets/tests/SuperadminSupportTicketsOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_support/support_tickets/locales/superadmin_support_tickets_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_support/support_tickets/locales/superadmin_support_tickets_hi.json';

const namespace = 'SUPERADMIN_SUPPORT_TICKETS';
const schemaValidationKeys = [] as const;

const copyKeys = [
  'COPY.TABLE_COLUMN_AGE',
  'COPY.TABLE_COLUMN_PRIORITY',
  'COPY.TABLE_COLUMN_STATUS',
  'COPY.TABLE_COLUMN_ASSIGNEE',
  'COPY.TABLE_COLUMN_TENANT',
  'COPY.TABLE_COLUMN_SUBJECT_ID',
  'COPY.SAMPLE_OPEN_TICKETS',
  'COPY.SAAS_SUPPORT_HELPDESK',
  'COPY.PUBLIC_REPLY',
  'COPY.RESOLVED',
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
    const path = prefix ? `${prefix}.${key}` : key;
    return leafPaths((value as JsonRecord)[key], path);
  });
}

describe('SUPERADMIN_SUPPORT_TICKETS locale catalogs', () => {
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
    const moduleRoot = join(process.cwd(), 'frontend_superadmin', 'superadmin_support');
    const collect = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? collect(join(directory, entry.name)) : /\.(tsx?|jsx?)$/.test(entry.name) ? [readFileSync(join(directory, entry.name), 'utf8')] : []);
    const source = collect(moduleRoot).join('\n');
    const keys = [...source.matchAll(/(?:t|tCopy)\(\s*['"]COPY\.([A-Z0-9_]+)['"]/g)].map((match) => match[1]);
    expect(keys.length).toBeGreaterThan(0);
    for (const key of new Set(keys)) { expect((getNamespace(english).COPY as Record<string, string>)).toHaveProperty(key); expect((getNamespace(hindi).COPY as Record<string, string>)).toHaveProperty(key); }
  });
});
