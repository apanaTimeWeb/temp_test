// RESPONSIBILITY: Define local sample fixtures for security user sessions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> local illustrative rows -> read-only semantic table.
import type { SuperadminSessionData } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsTypes';

export const SUPERADMIN_USERS_INITIAL_SESSIONS: SuperadminSessionData[] = [
  { id: 's1', user: 'Sample User A', device: 'MacBook Pro - Chrome', ip: '192.0.2.10', location: 'Example Region A', lastActive: 'JUST_NOW', status: 'Active' },
  { id: 's2', user: 'Sample User A', device: 'iPhone 14 Pro - Safari', ip: '192.0.2.11', location: 'Example Region A', lastActive: 'TWO_HOURS_AGO', status: 'Active' },
  { id: 's3', user: 'Sample User B', device: 'Windows 11 - Edge', ip: '198.51.100.12', location: 'Example Region B', lastActive: 'TEN_MINUTES_AGO', status: 'Active' },
  { id: 's4', user: 'Sample User C', device: 'Unknown Device', ip: '203.0.113.13', location: 'Example Region C', lastActive: 'ONE_MONTH_AGO', status: 'Revoked' },
];
