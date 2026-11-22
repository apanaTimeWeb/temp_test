// RESPONSIBILITY: Define source-level test coverage for system backup overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_overview/tests/SuperadminBackupOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/locales/superadmin_backup_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/locales/superadmin_backup_overview_hi.json';

const sourceModules = import.meta.glob('../**/*.{ts,tsx}', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const namespace = 'SUPERADMIN_BACKUP';
const schemaValidationKeys = [
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

  it('does not claim schema validation coverage when this module has no schema implementation', () => { expect(schemaValidationKeys).toHaveLength(0); });

  it('contains every literal COPY and VALIDATION key referenced by module source', () => {
    const enNamespace = getNamespace(english); const hiNamespace = getNamespace(hindi); const missing: string[] = [];
    const pattern = /\b(?:t|tCopy|tValidation)\s*\(\s*['\"`]((?:COPY|VALIDATION)\.[A-Z0-9_]+)['\"`]/g;
    for (const [file, source] of Object.entries(sourceModules)) { let match: RegExpExecArray | null; while ((match = pattern.exec(source)) !== null) { const [group, key] = match[1].split('.', 2); const enGroup = enNamespace[group] as Record<string, unknown> | undefined; const hiGroup = hiNamespace[group] as Record<string, unknown> | undefined; if (!enGroup?.[key]) missing.push(`${file}: English ${match[1]}`); if (!hiGroup?.[key]) missing.push(`${file}: Hindi ${match[1]}`); } }
    expect(missing).toEqual([]);
  });
});
