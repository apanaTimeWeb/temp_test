import { AdminSystemAuditLogsScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_system/system_audit_logs/tests/harness/bootstrap';
import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { AdminSystemAuditLogsHarness } from '@/app/frontend_admin/admin_system/system_audit_logs/tests/harness/AdminSystemAuditLogsHarness';


import { afterEach, vi } from 'vitest';

import { mswTestServer } from '@/app/frontend_admin/test/mswServer';

import { fetchAdminAuditLogs } from '@/app/frontend_admin/admin_system/system_audit_logs/api/admin_system_audit_logs_api';

import { ADMIN_AUDIT_LOGS_MSW_HANDLERS } from '@/app/frontend_admin/admin_system/system_audit_logs/mocks/scenarios/admin_system_audit_logs.scenarios';

import { filterAdminAuditLogsRecords } from '@/app/frontend_admin/admin_system/system_audit_logs/utils/AdminSystemAuditLogsViewUtils';

import type { AdminAuditLogsRecord } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';

import { formatAdminAuditLogsTimestamp } from '@/app/frontend_admin/admin_system/system_audit_logs/utils/AdminSystemAuditLogsViewUtils';

import { AdminAuditLogsApiRecordSchema } from '@/app/frontend_admin/admin_system/system_audit_logs/schemas/AdminSystemAuditLogsSchema';

describe("Consolidated: AdminSystemAuditLogsHarness", () => {
    it('renders children when scenario is active', () => {
        render(<AdminSystemAuditLogsHarness scenario="ACTIVE"><span>Harness Content</span></AdminSystemAuditLogsHarness>);
        expect(screen.getByText('Harness Content')).toBeTruthy();
    });
});

describe("Consolidated: AdminSystemAuditLogsRegressionSuite", () => {
    describe('Original suite: AdminSystemAuditLogsApi.test.ts', () => {
        describe('fetchAdminAuditLogs API contract', () => {
            afterEach(() => vi.unstubAllEnvs());
            it('loads and maps records through apiFetch and the module response schema', async () => {
                vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
                mswTestServer.use(...ADMIN_AUDIT_LOGS_MSW_HANDLERS);
                const records = await fetchAdminAuditLogs();
                expect(records).toHaveLength(1);
                expect(records[0]).toMatchObject({ id: 'AUD-DEMO-001', module: 'Members', severity: 'info' });
            });
        });
    });
    describe('Original suite: AdminSystemAuditLogsFilterUtils.test.ts', () => {
        const RECORDS: AdminAuditLogsRecord[] = [
            { id: '1', action: 'Updated role', module: 'Members', performedBy: 'Asha', role: 'Admin', details: 'Role updated', severity: 'warning', timestamp: '2026-10-10T10:00:00Z', ip: '127.0.0.1' },
            { id: '2', action: 'Deleted record', module: 'Accounting', performedBy: 'Ravi', role: 'Admin', details: 'Record deleted', severity: 'danger', timestamp: '2026-10-10T11:00:00Z', ip: '127.0.0.2' },
        ];
        describe('filterAdminAuditLogsRecords', () => {
            it('filters by severity and keeps source records immutable', () => {
                const filtered = filterAdminAuditLogsRecords(RECORDS, 'danger', '');
                expect(filtered.map((row) => row.id)).toEqual(['2']);
                expect(RECORDS).toHaveLength(2);
            });
            it('allows unknown-severity records to be isolated', () => {
                const unknownRecord: AdminAuditLogsRecord = { ...RECORDS[0]!, id: '3', severity: 'unknown' };
                expect(filterAdminAuditLogsRecords([...RECORDS, unknownRecord], 'unknown', '').map((row) => row.id)).toEqual(['3']);
            });
            it('searches action, actor and module case-insensitively', () => {
                expect(filterAdminAuditLogsRecords(RECORDS, 'all', 'ASHA').map((row) => row.id)).toEqual(['1']);
                expect(filterAdminAuditLogsRecords(RECORDS, 'all', 'accounting').map((row) => row.id)).toEqual(['2']);
            });
            it('searches details, role and IP without changing record identity', () => {
                expect(filterAdminAuditLogsRecords(RECORDS, 'all', 'record deleted').map((row) => row.id)).toEqual(['2']);
                expect(filterAdminAuditLogsRecords(RECORDS, 'all', 'admin').map((row) => row.id)).toEqual(['1', '2']);
                expect(filterAdminAuditLogsRecords(RECORDS, 'all', '127.0.0.2').map((row) => row.id)).toEqual(['2']);
            });
            it('returns no rows for an unmatched query instead of silently showing all records', () => {
                expect(filterAdminAuditLogsRecords(RECORDS, 'all', 'nonexistent event')).toEqual([]);
            });
            it('treats an empty query as no search restriction', () => {
                expect(filterAdminAuditLogsRecords(RECORDS, 'all', '   ')).toHaveLength(2);
            });
        });
    });
    describe('Original suite: AdminSystemAuditLogsFormatDate.test.ts', () => {
        describe('formatAdminAuditLogsTimestamp', () => {
            it('localizes valid instants and keeps invalid values unavailable', () => {
                expect(formatAdminAuditLogsTimestamp('2026-10-20T10:00:00Z', 'en')).not.toBe('2026-10-20T10:00:00Z');
                expect(formatAdminAuditLogsTimestamp('invalid', 'en')).toBe('—');
                expect(formatAdminAuditLogsTimestamp('—', 'hi')).toBe('—');
            });
        });
    });
    describe('Original suite: AdminSystemAuditLogsSchema.test.ts', () => {
        const valid = { id: 'audit-1', action: 'Updated record', timestamp: '2026-10-20T10:00:00Z' };
        describe('AdminAuditLogsApiRecordSchema', () => {
            it('requires stable nonblank identity/action and leaves invalid timestamps to the display fallback', () => {
                expect(AdminAuditLogsApiRecordSchema.safeParse(valid).success).toBe(true);
                expect(AdminAuditLogsApiRecordSchema.safeParse({ ...valid, id: ' ' }).success).toBe(false);
                expect(AdminAuditLogsApiRecordSchema.safeParse({ ...valid, action: '  ' }).success).toBe(false);
                expect(AdminAuditLogsApiRecordSchema.safeParse({ ...valid, timestamp: 'invalid' }).success).toBe(true); // Mapper/formatter surface invalid timestamps as unavailable.
            });
        });
    });
});
