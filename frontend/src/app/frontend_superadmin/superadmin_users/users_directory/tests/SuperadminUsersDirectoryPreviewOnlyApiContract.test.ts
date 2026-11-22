// RESPONSIBILITY: Define source-level test coverage for users directory using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_directory/tests/SuperadminUsersDirectoryPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SUPERADMIN_USERS_DIRECTORY_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_users_directory.api';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pageClient = readFileSync(resolve(__dirname, '../components/SuperadminUsersDirectoryPageClient.tsx'), 'utf8');

describe('superadmin_users/users_directory preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
  it('masks email values before local preview CSV serialization', () => {
    expect(pageClient).toContain("column === 'email' ? maskSensitiveData");
    expect(pageClient).toContain('DATA CLASSIFICATION: SAMPLE PREVIEW');
    expect(pageClient).toContain('URL.createObjectURL');
    expect(pageClient).not.toMatch(/\bfetch\s*\(/);
    expect(pageClient).not.toContain('axios.');
  });
});
