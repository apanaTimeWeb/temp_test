// RESPONSIBILITY: Define source-level test coverage for system health overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_health_overview/tests/SuperadminSystemHealthOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import featureMap from '../superadmin_system_health_overview_features.md?raw';
import english from '@/app/frontend_superadmin/superadmin_system/system_health_overview/locales/superadmin_system_health_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_system/system_health_overview/locales/superadmin_system_health_overview_hi.json';
import {
  SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS,
  SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE,
  SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE,
  SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS,
  SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS,
} from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';

const sourceModules = import.meta.glob('../**/*.{ts,tsx}', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const namespace = 'SUPERADMIN_SYSTEM_HEALTH';
const schemaValidationKeys = [] as const;

const copyKeys = [
  'COPY.SYSTEM_HEALTH_TELEMETRY',
  'COPY.SAMPLE_TELEMETRY_NOT_CONNECTED',
  'COPY.SAMPLE_CURRENT_RPS',
  'COPY.NOT_CONNECTED',
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

describe('SUPERADMIN_SYSTEM_HEALTH locale catalogs', () => {
  it('lists every archived module test in the feature map', () => {
    const testFiles = Object.keys(import.meta.glob('../**/*.test.{ts,tsx}')).map((file) => file.replace(/^\.\.\//, ''));
    for (const file of testFiles) expect(featureMap, `Feature map omits ${file}`).toContain(file);
  });

  it('contains every literal COPY and VALIDATION key referenced by module source in both catalogs', () => {
    const enNamespace = getNamespace(english); const hiNamespace = getNamespace(hindi); const missing: string[] = [];
    const pattern = /\b(?:t|tCopy|tValidation)\s*\(\s*['"`]((?:COPY|VALIDATION)\.[A-Z0-9_]+)['"`]/g;
    for (const [file, source] of Object.entries(sourceModules)) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) {
        const [group, key] = match[1].split('.', 2);
        const enGroup = enNamespace[group] as Record<string, unknown> | undefined;
        const hiGroup = hiNamespace[group] as Record<string, unknown> | undefined;
        if (!enGroup?.[key]) missing.push(`${file}: English ${match[1]}`);
        if (!hiGroup?.[key]) missing.push(`${file}: Hindi ${match[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });


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


  it('covers every dynamic fixture label and status key in both catalogs', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    const keys = new Set<string>();
    for (const row of SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE) keys.add(row.nameKey.replace(/^COPY\./, ''));
    for (const row of SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE) { keys.add(row.nameKey.replace(/^COPY\./, '')); keys.add(row.metricKey.replace(/^COPY\./, '')); }
    for (const row of SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS) { keys.add(row.labelKey.replace(/^COPY\./, '')); keys.add(row.trendKey.replace(/^COPY\./, '')); }
    for (const row of SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS) { keys.add(row.nameKey.replace(/^COPY\./, '')); keys.add(row.statusKey.replace(/^COPY\./, '')); }
    for (const row of SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS) { keys.add(row.nameKey.replace(/^COPY\./, '')); keys.add(row.statusKey.replace(/^COPY\./, '')); keys.add(row.scheduleKey.replace(/^COPY\./, '')); keys.add(row.lastRunKey.replace(/^COPY\./, '')); }
    for (const key of keys) {
      expect(enCopy[key], `Missing English fixture copy ${key}`).toBeTruthy();
      expect(hiCopy[key], `Missing Hindi fixture copy ${key}`).toBeTruthy();
    }
  });

  it('uses translated labels for every status key in the sample fixtures', () => {
    const enCopy = (getNamespace(english).COPY ?? {}) as Record<string, string>;
    const hiCopy = (getNamespace(hindi).COPY ?? {}) as Record<string, string>;
    for (const key of ['NOT_CONNECTED', 'NOT_VERIFIED']) {
      expect(enCopy[key], `Missing English status label ${key}`).toBeTruthy();
      expect(hiCopy[key], `Missing Hindi status label ${key}`).toBeTruthy();
      expect(hiCopy[key], `Hindi status label is untranslated ${key}`).not.toBe(enCopy[key]);
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
});
