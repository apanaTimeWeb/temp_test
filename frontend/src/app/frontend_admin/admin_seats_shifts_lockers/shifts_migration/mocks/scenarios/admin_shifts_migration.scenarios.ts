

/**
 * Canonical transport-level mock scenario registry for Admin Shifts Migration.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminShiftsMigrationScenarioCatalog = (activeRecords: unknown) => ({
  ACTIVE_RECORDS: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'Module-local populated fixture.',
      data: activeRecords,
      requestId: 'mock-active-records',
    },
  },
  EMPTY_DATA: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'No records returned by the empty-result scenario.',
      data: [],
      requestId: 'mock-empty-data',
    },
  },
  SERVER_500_ERROR: {
    kind: 'http-response',
    status: 500,
    envelope: {
      success: false,
      message: 'Simulated internal server error.',
      data: null,
      errorCode: 'ERR_INTERNAL_500',
      statusCode: 500,
      requestId: 'mock-server-500',
    },
  },
  NETWORK_TIMEOUT: {
    kind: 'delayed-http-response',
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Simulated request timeout.',
      data: null,
      errorCode: 'ERR_TIMEOUT',
      statusCode: 504,
      requestId: 'mock-network-timeout',
    },
  },
  UNAUTHORIZED_401: {
    kind: 'http-response',
    status: 401,
    envelope: {
      success: false,
      message: 'Simulated unauthenticated request.',
      data: null,
      errorCode: 'ERR_UNAUTHORIZED',
      statusCode: 401,
      requestId: 'mock-unauthorized-401',
    },
  },
  FORBIDDEN_403: {
    kind: 'http-response',
    status: 403,
    envelope: {
      success: false,
      message: 'Simulated authenticated request without permission.',
      data: null,
      errorCode: 'ERR_FORBIDDEN',
      statusCode: 403,
      requestId: 'mock-forbidden-403',
    },
  },
  NETWORK_ERROR: {
    kind: 'transport-error',
    transport: 'fetch-rejection',
    message: 'Simulated network failure without an HTTP response.',
  },
  INVALID_RESPONSE: {
    kind: 'malformed-success-envelope',
    status: 200,
    envelope: {
      success: true,
      message: 'Deliberately malformed response: required data and requestId are absent.',
    },
  },
} as const);

/** Explicitly illustrative migration-preview data; never used as live API responses. */
export interface AdminShiftsMigrationStudent {
  id: string; name: string; smartId: string; currentShift: string; currentSeat: string;
  validTill: string; plan: string; dailyRate: number;
}
export interface AdminShiftsMigrationShift { name: string; seats: number; rate: number }
export const ADMIN_SHIFTS_MIGRATION_DEMO_STUDENTS: readonly AdminShiftsMigrationStudent[] = [
  { id: '1', name: 'Alex Rivera', smartId: 'LIB-88429', currentShift: 'Morning', currentSeat: 'A-12', validTill: '2027-04-30', plan: 'Monthly ₹1000', dailyRate: 33 },
  { id: '2', name: 'Priya Sharma', smartId: 'LIB-00234', currentShift: 'Evening', currentSeat: 'B-05', validTill: '2027-05-15', plan: 'Monthly ₹1200', dailyRate: 40 },
  { id: '3', name: 'Rohan Mehta', smartId: 'LIB-00567', currentShift: 'Full Day', currentSeat: 'C-08', validTill: '2027-06-01', plan: 'Monthly ₹1500', dailyRate: 50 },
];
export const ADMIN_SHIFTS_MIGRATION_DEMO_SHIFTS: readonly AdminShiftsMigrationShift[] = [
  { name: 'Morning', seats: 4, rate: 33 },
  { name: 'Afternoon', seats: 8, rate: 36 },
  { name: 'Evening', seats: 2, rate: 40 },
  { name: 'Full Day', seats: 1, rate: 50 },
];
export const ADMIN_SHIFTS_MIGRATION_DEMO_SEATS: Readonly<Record<string, readonly string[]>> = {
  Morning: ['A-01', 'A-02', 'A-03', 'A-04'],
  Afternoon: ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06', 'B-07', 'B-08'],
  Evening: ['C-01', 'C-02'],
  'Full Day': ['D-01'],
};
