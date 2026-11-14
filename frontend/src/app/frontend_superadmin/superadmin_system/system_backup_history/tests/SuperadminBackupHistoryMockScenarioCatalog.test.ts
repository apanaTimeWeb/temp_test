// RESPONSIBILITY: Define source-level test coverage for system backup history using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_history/tests/SuperadminBackupHistoryMockScenarioCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BACKUP_HISTORY_CANONICAL_SCENARIOS } from '../mocks/scenarios/SuperadminBackupHistoryMockScenarios';

describe('backup_history canonical mock scenario catalog', () => {
  it('declares the required eight scenario states without inventing backend contracts', () => {
    expect(SUPERADMIN_BACKUP_HISTORY_CANONICAL_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      'ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED', 'LOADING', 'MUTATION_FAILURE', 'UNAVAILABLE_MUTATION',
    ]);
    expect(Object.fromEntries(SUPERADMIN_BACKUP_HISTORY_CANONICAL_SCENARIOS.map((scenario) => [scenario.id, scenario.executableWithoutBackendContract]))).toEqual({
  "ACTIVE": true,
  "EMPTY": true,
  "SERVER_500": false,
  "TIMEOUT": false,
  "UNAUTHORIZED": false,
  "LOADING": true,
  "MUTATION_FAILURE": false,
  "UNAVAILABLE_MUTATION": true
});
  });
});

// RBG source-coverage assertions: generated from the selected leaf source during the frozen batch.

describe('RBG source-coverage assertions', () => {
  it('keeps declared rendered field identifiers present in the owning PageClient source', () => {
    const pageSource = readFileSync(new URL('../components/SuperadminBackupHistoryPageClient.tsx', import.meta.url), 'utf8');
    const renderedFields = ["SuperadminBackupHistoryCreatePanel", "SuperadminBackupHistoryHistoryPanel", "SuperadminBackupHistoryRestorePanel", "SuperadminBackupHistorySchedulePanel", "COPY.DISASTER_RECOVERY_BACKUPS", "COPY.SAMPLE_BACKUP_METADATA_ONLY_REAL_BACKUP_CREATION_DOWNLOAD_RESTORE_AND_SCHEDULING_ARE_UNAVAILABLE_BECAUSE_NO_APPROVED_BACKEND_CONTRACTS_ARE_SUPPLIED"];
    expect(renderedFields.length).toBeGreaterThan(0);
    for (const field of renderedFields) expect(pageSource).toContain(field);
  });
});
