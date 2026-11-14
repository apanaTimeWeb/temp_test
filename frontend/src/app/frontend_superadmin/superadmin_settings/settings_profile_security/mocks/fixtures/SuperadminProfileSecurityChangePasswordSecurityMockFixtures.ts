// RESPONSIBILITY: Define local sample fixtures for settings profile security; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_profile_security/mocks/fixtures/SuperadminProfileSecurityChangePasswordSecurityMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminProfileLoginHistoryItem, SuperadminProfileSecuritySession } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes';

/** Synthetic documentation-range IPs and sample sessions; not actual account telemetry. */
export const SUPERADMIN_PROFILE_SAMPLE_SESSIONS: SuperadminProfileSecuritySession[] = [
  { id: 'sample-session-1', device: 'Sample Laptop', browser: 'Sample Browser A', ip: '192.0.2.10', lastActive: 'Sample current session', isCurrent: true, location: 'Sample Region A' },
  { id: 'sample-session-2', device: 'Sample Phone', browser: 'Sample Browser B', ip: '198.51.100.20', lastActive: '2 hours ago (sample)', isCurrent: false, location: 'Sample Region B' },
  { id: 'sample-session-3', device: 'Sample Desktop', browser: 'Sample Browser C', ip: '203.0.113.30', lastActive: 'Yesterday (sample)', isCurrent: false, location: 'Sample Region C' },
];

export const SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY: SuperadminProfileLoginHistoryItem[] = [
  { id: 1, date: '2026-10-01 10:23 AM (sample)', ip: '192.0.2.10', location: 'Sample Region A', status: 'Success', browser: 'Sample Browser A' },
  { id: 2, date: '2026-09-30 08:15 PM (sample)', ip: '198.51.100.20', location: 'Sample Region B', status: 'Success', browser: 'Sample Browser B' },
  { id: 3, date: '2026-09-28 11:40 AM (sample)', ip: '203.0.113.30', location: 'Sample Region C', status: 'Failed', browser: 'Sample Browser C' },
  { id: 4, date: '2026-09-25 09:00 AM (sample)', ip: '192.0.2.10', location: 'Sample Region A', status: 'Success', browser: 'Sample Browser A' },
];
