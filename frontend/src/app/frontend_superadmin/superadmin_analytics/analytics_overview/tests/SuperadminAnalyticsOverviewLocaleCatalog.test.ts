// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminAnalyticsOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/locales/superadmin_analytics_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/locales/superadmin_analytics_overview_hi.json';

const namespace = 'SUPERADMIN_REPORTS';
// No schema implementation is present in the supplied Reports module slice.

const gridHeaderCopyKeys = [
  'COPY.LIBRARY_ID',
  'COPY.STATUS',
  'COPY.TABLE_COLUMN_ACTION',
  'COPY.TABLE_COLUMN_CURRENT_PLAN',
  'COPY.TABLE_COLUMN_LIBRARY_NAME',
  'COPY.TABLE_COLUMN_MRR',
  'COPY.TABLE_COLUMN_STUDENTS',
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


it('covers every literal COPY key referenced by report source', () => {
  const candidates = [path.resolve(process.cwd(), 'app/frontend_superadmin/superadmin_analytics'), path.resolve(process.cwd(), 'frontend_superadmin/superadmin_analytics')]; const moduleRoot = candidates.find(existsSync); expect(moduleRoot).toBeTruthy();
  const files: string[] = []; const visit = (dir: string) => { for (const entry of readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) visit(full); else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.includes('.test.')) files.push(full); } }; visit(moduleRoot!);
  const keys = new Set(files.flatMap(file => [...readFileSync(file, 'utf8').matchAll(/COPY\.([A-Z0-9_]+)/g)].map(match => match[1])));
  const en = (getNamespace(english).COPY ?? {}) as Record<string,string>; const hi = (getNamespace(hindi).COPY ?? {}) as Record<string,string>; for (const key of keys) { expect(en[key], `Missing English COPY.${key}`).toBeTruthy(); expect(hi[key], `Missing Hindi COPY.${key}`).toBeTruthy(); }
});
