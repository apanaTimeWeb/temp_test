// RESPONSIBILITY: Define source-level test coverage for users overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_overview/tests/SuperadminUsersOverviewLocaleCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import featureMap from '../superadmin_users_overview_features.md?raw';
import english from '@/app/frontend_superadmin/superadmin_users/users_overview/locales/superadmin_users_overview_en.json';
import hindi from '@/app/frontend_superadmin/superadmin_users/users_overview/locales/superadmin_users_overview_hi.json';

const sourceModules = import.meta.glob('../**/*.{ts,tsx}', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const namespace = 'SUPERADMIN_USERS';
const schemaValidationKeys = [
  "CHOOSE_A_VALID_BOOLEAN_VALUE",
  "EMAIL_MUST_BE_254_CHARACTERS_OR_FEWER",
  "ENTER_AN_ASSIGNED_TENANT_OR_BRANCH",
  "ENTER_A_VALID_EMAIL_ADDRESS",
  "ENTER_A_VALID_TEXT_VALUE",
  "ENTER_THE_USER_S_FULL_NAME",
  "NAME_MUST_BE_120_CHARACTERS_OR_FEWER",
  "PROVIDE_VALID_FORM_DATA",
  "SELECT_A_VALID_OPTION",
  "TENANT_OR_BRANCH_MUST_BE_120_CHARACTERS_OR_FEWER",
  "USERNAME_MUST_BE_64_CHARACTERS_OR_FEWER",
  "USERNAME_MUST_CONTAIN_AT_LEAST_3_CHARACTERS",
  "USE_LETTERS_NUMBERS_DOTS_UNDERSCORES_OR_HYPHENS_ONLY",
] as const;

const gridHeaderCopyKeys = [
  'COPY.TABLE_COLUMN_2FA',
  'COPY.TABLE_COLUMN_ACTION',
  'COPY.TABLE_COLUMN_ACTIONS',
  'COPY.TABLE_COLUMN_BRANCH_TENANT',
  'COPY.TABLE_COLUMN_DEVICE_BROWSER',
  'COPY.TABLE_COLUMN_EMAIL',
  'COPY.TABLE_COLUMN_IP_ADDRESS',
  'COPY.TABLE_COLUMN_LAST_ACTIVE',
  'COPY.TABLE_COLUMN_LAST_LOGIN',
  'COPY.TABLE_COLUMN_LOCATION',
  'COPY.TABLE_COLUMN_NAME',
  'COPY.TABLE_COLUMN_ROLE',
  'COPY.TABLE_COLUMN_STATUS',
  'COPY.TABLE_COLUMN_USER',
] as const;

const copyKeys = [
  'COPY.ADD_USER',
  'COPY.USERS_ACCESS_CONTROL',
  'COPY.ROLE_BASED_ACCESS_CONTROL_RBAC_MATRIX',
  'COPY.ENFORCE_2FA',
  'COPY.TAB_ALL_USERS',
  'COPY.TAB_ROLES_PERMISSIONS',
  'COPY.TAB_USER_SESSIONS',
  'COPY.STATUS_ACTIVE',
  'COPY.STATUS_SUSPENDED',
  'COPY.TWO_FACTOR_ENABLED',
  'COPY.TWO_FACTOR_DISABLED',
  'COPY.ACTION_SUSPEND',
  'COPY.ACTION_ACTIVATE',
  'COPY.STATUS_REVOKED',
  'COPY.ROLE_SUPERADMIN_SYSTEM',
  'COPY.ROLE_ADMIN_TENANT_OWNER',
  'COPY.ROLE_MANAGER_STAFF',
  'COPY.NEVER',
  'COPY.MODULE_DASHBOARD_ANALYTICS',
  'COPY.MODULE_LIBRARY_MANAGEMENT',
  'COPY.MODULE_SEAT_SHIFT_ALLOCATIONS',
  'COPY.MODULE_BILLING_SUBSCRIPTIONS',
  'COPY.MODULE_USER_ACCESS_CONTROL',
  'COPY.MODULE_STUDENT_CRM',
] as const;

type JsonRecord = Record<string, unknown>;

function getNamespace(catalog: unknown, selectedNamespace = namespace): JsonRecord {
  const root = catalog as JsonRecord;
  const value = root[selectedNamespace];
  return value && typeof value === 'object' ? value as JsonRecord : {};
}

function getSourceNamespace(source: string): string {
  const explicitNamespaces = [...source.matchAll(/(?:useTranslations|getTranslations)\s*\(\s*['"`]([A-Z][A-Z0-9_]*)['"`]/g)];
  return explicitNamespaces.at(-1)?.[1] ?? namespace;
}

function leafPaths(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix];
  return Object.keys(value as JsonRecord).sort().flatMap((key) => {
    const nextPath = prefix ? `${prefix}.${key}` : key;
    return leafPaths((value as JsonRecord)[key], nextPath);
  });
}

describe(`${namespace} locale catalogs`, () => {
  it('lists every archived module test in the feature map', () => {
    const testFiles = Object.keys(import.meta.glob('../**/*.test.{ts,tsx}')).map((file) => file.replace(/^\.\.\//, ''));
    for (const file of testFiles) expect(featureMap, `Feature map omits ${file}`).toContain(file);
  });

  it('contains every literal COPY and VALIDATION key referenced by module source in both catalogs', () => {
    const missing: string[] = [];
    const pattern = /\b(?:t|tCopy|tValidation)\s*\(\s*['"`]((?:COPY|VALIDATION)\.[A-Z0-9_]+)['"`]/g;
    for (const [file, source] of Object.entries(sourceModules)) {
      const sourceNamespace = getSourceNamespace(source);
      const sourceEnglishNamespace = getNamespace(english, sourceNamespace);
      const sourceHindiNamespace = getNamespace(hindi, sourceNamespace);
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) {
        const [group, key] = match[1].split('.', 2);
        const enGroup = sourceEnglishNamespace[group] as Record<string, unknown> | undefined;
        const hiGroup = sourceHindiNamespace[group] as Record<string, unknown> | undefined;
        if (!enGroup?.[key]) missing.push(`${file}: ${sourceNamespace} English ${match[1]}`);
        if (!hiGroup?.[key]) missing.push(`${file}: ${sourceNamespace} Hindi ${match[1]}`);
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
