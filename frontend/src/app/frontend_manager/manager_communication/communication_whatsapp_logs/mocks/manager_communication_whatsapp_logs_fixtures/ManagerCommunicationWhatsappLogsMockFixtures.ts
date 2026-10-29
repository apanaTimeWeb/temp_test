export const MANAGER_COMMUNICATION_MOCK_NOTICE_RESPONSE = [
  { id: 'notice-001', title: 'Holiday Closure', message: 'Library closed on the scheduled holiday.', createdAt: '2026-10-01T08:00:00.000Z', validTill: '2026-10-31T18:00:00.000Z' },
  { id: 'notice-002', title: 'Quiet Hours', message: 'Quiet study hours run from 6 PM to 10 PM.', createdAt: '2026-10-02T09:00:00.000Z', validTill: '2026-11-15T18:00:00.000Z' },
] as const;

export const MANAGER_COMMUNICATION_MOCK_COMPLAINT_RESPONSE = [
  { id: 'complaint-001', subject: 'AC not cooling', description: 'The AC in Zone A is not cooling properly.', createdAt: '2026-10-03T10:00:00.000Z', status: 'open' },
  { id: 'complaint-002', subject: 'WiFi very slow', description: 'Internet speed is extremely slow during evening hours.', createdAt: '2026-10-04T11:00:00.000Z', status: 'in_progress' },
  { id: 'complaint-003', subject: 'Locker door broken', description: 'Locker door hinge is broken.', createdAt: '2026-10-05T12:00:00.000Z', status: 'resolved' },
] as const;
