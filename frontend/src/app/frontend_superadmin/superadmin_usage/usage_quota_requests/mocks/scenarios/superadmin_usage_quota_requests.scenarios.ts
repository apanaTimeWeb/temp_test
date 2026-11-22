// mocks/scenarios/superadmin_usage_quota_requests.scenarios.ts
export const SUPERADMIN_USAGE_QUOTA_REQUESTS_SCENARIOS = {
  DEFAULT: {
    description: 'Standard scenario with pending 4th branch expansion requests',
    envelope: { success: true, message: 'Loaded successfully', requestId: 'req-qr-001' },
  },
  EMPTY: {
    description: 'No pending or historical quota requests',
    envelope: { success: true, message: 'No quota requests found', requestId: 'req-qr-empty' },
  },
} as const;
