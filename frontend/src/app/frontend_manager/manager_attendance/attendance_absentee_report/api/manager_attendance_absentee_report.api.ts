/**
 * Engagement API operations intentionally remain unavailable.
 * The supplied manager archive contains no authoritative engagement endpoint,
 * request/response schema, permission contract, or persistence semantics.
 * Do not add attendance, notification, calendar, or scan writes until those
 * host contracts are supplied and verified.
 */
export const MANAGER_ENGAGEMENT_API_CONTRACT_STATUS = 'EXTERNAL_PRODUCT_DECISION_BLOCKED' as const;
