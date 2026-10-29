import type { RequestHandler } from 'msw';

/**
 * No documents endpoints are mocked in this role slice.
 * The source contract contains no authoritative endpoint/request/response contract for this feature.
 * Keep the registry empty until the host product contract is supplied; do not invent routes or fake persistence.
 */
export const MANAGER_DOCUMENTS_HANDLERS: readonly RequestHandler[] = [];
