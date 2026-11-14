// FLOW: API Keys route -> local sample fixtures -> masked, read-only key preview.
/** Responsibility: supply redacted API Keys examples only; no secret issuance or persistence is implied. */
export const SUPERADMIN_SECURITY_API_KEYS = [
  { id: 'key_1', name: 'Example biometric sync service', prefix: 'SAMPLE_KEY_REDACTED_01', lastUsed: 'SAMPLE_TIME_2_MINUTES_AGO', status: 'STATUS_SAMPLE' },
  { id: 'key_2', name: 'Example SMS gateway webhook', prefix: 'SAMPLE_KEY_REDACTED_02', lastUsed: 'SAMPLE_TIME_5_DAYS_AGO', status: 'STATUS_SAMPLE' },
] as const;
