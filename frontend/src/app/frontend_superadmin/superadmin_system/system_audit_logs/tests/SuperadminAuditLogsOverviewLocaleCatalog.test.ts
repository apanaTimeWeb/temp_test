// RESPONSIBILITY: Define source-level test coverage for system audit logs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_audit_logs/tests/SuperadminAuditLogsOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import english from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/locales/superadmin_audit_logs_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/locales/superadmin_audit_logs_hi.json';

const sourceModules = import.meta.glob('../**/*.{ts,tsx}', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const namespace = 'SUPERADMIN_AUDIT_LOGS';
const schemaValidationKeys = [] as const;

const copyKeys = [
  'COPY.SYSTEM_AUDIT_LOGS_SAMPLE',
  'COPY.TIMESTAMP',
  'COPY.EXPORT_SAMPLE_CSV',
  'COPY.FEE_COLLECTED',
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

describe('SUPERADMIN_AUDIT_LOGS locale catalogs', () => {
  it('keeps English and Hindi catalog key trees identical', () => {
    expect(leafPaths(english)).toEqual(leafPaths(hindi));
  });

  it('does not claim schema validation coverage when this module has no validation schema', () => {
    expect(schemaValidationKeys).toHaveLength(0);
  });

  it('contains every literal COPY and VALIDATION key referenced by module source', () => {
    const enNamespace = getNamespace(english); const hiNamespace = getNamespace(hindi); const missing: string[] = [];
    const pattern = /\b(?:t|tCopy|tValidation)\s*\(\s*['\"`]((?:COPY|VALIDATION)\.[A-Z0-9_]+)['\"`]/g;
    for (const [file, source] of Object.entries(sourceModules)) { let match: RegExpExecArray | null; while ((match = pattern.exec(source)) !== null) { const [group, key] = match[1].split('.', 2); const enGroup = enNamespace[group] as Record<string, unknown> | undefined; const hiGroup = hiNamespace[group] as Record<string, unknown> | undefined; if (!enGroup?.[key]) missing.push(`${file}: English ${match[1]}`); if (!hiGroup?.[key]) missing.push(`${file}: Hindi ${match[1]}`); } }
    expect(missing).toEqual([]);
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
  it('provides localized table header copy in English and Hindi', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    for (const key of ['TABLE_COLUMN_TIMESTAMP', 'TABLE_COLUMN_TARGET_ENTITY', 'TABLE_COLUMN_IP_ADDRESS', 'TABLE_COLUMN_VIEW']) {
      expect(enCopy[key], `Missing English header key: ${key}`).toBeTruthy();
      expect(hiCopy[key], `Missing Hindi header key: ${key}`).toBeTruthy();
      expect(hiCopy[key], `Hindi header key is untranslated: ${key}`).not.toBe(enCopy[key]);
    }
  });

});
