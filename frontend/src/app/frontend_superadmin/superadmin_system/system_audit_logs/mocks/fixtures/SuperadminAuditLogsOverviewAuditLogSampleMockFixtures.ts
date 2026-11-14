// RESPONSIBILITY: Define local sample fixtures for system audit logs; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_system/system_audit_logs/mocks/fixtures/SuperadminAuditLogsOverviewAuditLogSampleMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAuditLogSampleEntry } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewTypes';

/** Synthetic examples only; never treat these records as an authoritative audit trail. */
export const SUPERADMIN_AUDIT_LOG_SAMPLE_FIXTURES: SuperadminAuditLogSampleEntry[] = [
  { id: 'SAMPLE-LOG-001', time: 'Sample timestamp', user: 'Sample Super Admin', entity: 'Subscription', target: 'Demo Library A', action: 'Created', ip: '192.0.2.42', detail: 'Synthetic example only: sample subscription record. Not a real audit event or financial transaction.' },
  { id: 'SAMPLE-LOG-002', time: 'Sample timestamp', user: 'Sample System', entity: 'Payment', target: 'SAMPLE-REC-001', action: 'Fee_Collected', ip: '198.51.100.5', detail: 'Synthetic example only: fee collection is not connected to a payment API. No payment was recorded.' },
  { id: 'SAMPLE-LOG-003', time: 'Sample timestamp', user: 'Sample Staff A', entity: 'Branch', target: 'Demo Branch A', action: 'Updated', ip: '203.0.113.1', detail: 'Synthetic example only: illustrative branch update. Not a real person or audit record.' },
  { id: 'SAMPLE-LOG-004', time: 'Sample timestamp', user: 'Sample Super Admin', entity: 'Support Ticket', target: 'SAMPLE-TKT-001', action: 'Deleted', ip: '192.0.2.42', detail: 'Synthetic example only: illustrative support ticket change. No ticket was deleted.' },
  { id: 'SAMPLE-LOG-005', time: 'Sample timestamp', user: 'Sample Super Admin', entity: 'Plan', target: 'Demo Plan A', action: 'Created', ip: '198.51.100.5', detail: 'Synthetic example only: illustrative plan. Pricing and plan changes are not connected to a backend.' },
  { id: 'SAMPLE-LOG-006', time: 'Sample timestamp', user: 'Sample System', entity: 'Backup', target: 'Demo backup entry', action: 'Created', ip: '203.0.113.1', detail: 'Synthetic example only: demo backup history. No backup has been performed and no real audit record exists.' },
  { id: 'SAMPLE-LOG-007', time: 'Sample timestamp', user: 'Sample Super Admin', entity: 'Library', target: 'Demo Library B', action: 'Updated', ip: '192.0.2.42', detail: 'Synthetic example only: illustrative library status update. No real library data was changed.' },
];
