import { http, HttpResponse } from 'msw';
import { ADMIN_SUPPORT_URLS } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.url_config';

/**
 * Canonical transport-level mock scenario registry for Admin Settings Support.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminSettingsSupportScenarioCatalog = (activeRecords: unknown) => ({
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

/** Synthetic support data shown only when explicit frontend demo mode is enabled. No item represents a live support record. */
export const ADMIN_SUPPORT_DEMO_TICKETS = [
  {
    id: 'TKT-1042',
    subjectKey: 'DEMO_TICKET_BILLING_SUBJECT',
    categoryKey: 'DEMO_TICKET_BUG_CATEGORY',
    priority: 'high',
    status: 'open',
    replies: 2,
    dateKey: 'DEMO_TICKET_DATE_TWO_HOURS',
  },
  {
    id: 'TKT-1041',
    subjectKey: 'DEMO_TICKET_EXPORT_SUBJECT',
    categoryKey: 'DEMO_TICKET_FEATURE_CATEGORY',
    priority: 'low',
    status: 'resolved',
    replies: 4,
    dateKey: 'DEMO_TICKET_DATE_ONE_DAY',
  },
] as const;

export const ADMIN_SUPPORT_FAQ_FIXTURES = [
  { questionKey: 'FAQ_ADD_STUDENT_QUESTION', answerKey: 'FAQ_ADD_STUDENT_ANSWER' },
  { questionKey: 'FAQ_BRANCH_QUESTION', answerKey: 'FAQ_BRANCH_ANSWER' },
  { questionKey: 'FAQ_FEES_QUESTION', answerKey: 'FAQ_FEES_ANSWER' },
  { questionKey: 'FAQ_SUSPEND_QUESTION', answerKey: 'FAQ_SUSPEND_ANSWER' },
] as const;

export const ADMIN_SUPPORT_SYSTEM_STATUS_FIXTURES = [
  { nameKey: 'SYSTEM_CORE_APPLICATION', uptime: '99.99%', statusKey: 'SYSTEM_OPERATIONAL', tone: 'success' },
  { nameKey: 'SYSTEM_DATABASE_API', uptime: '99.98%', statusKey: 'SYSTEM_OPERATIONAL', tone: 'success' },
  { nameKey: 'SYSTEM_SMS_GATEWAY', uptime: '98.50%', statusKey: 'SYSTEM_DEGRADED', tone: 'warning' },
  { nameKey: 'SYSTEM_EMAIL_SERVER', uptime: '99.99%', statusKey: 'SYSTEM_OPERATIONAL', tone: 'success' },
] as const;

export const ADMIN_SUPPORT_ANNOUNCEMENT_FIXTURES = [
  {
    titleKey: 'ANNOUNCEMENT_CRM_TITLE',
    dateKey: 'ANNOUNCEMENT_SAMPLE_DATE',
    contentKey: 'ANNOUNCEMENT_CRM_CONTENT',
  },
  {
    titleKey: 'ANNOUNCEMENT_MAINTENANCE_TITLE',
    dateKey: 'ANNOUNCEMENT_ILLUSTRATIVE_DATE',
    contentKey: 'ANNOUNCEMENT_MAINTENANCE_CONTENT',
  },
  {
    titleKey: 'ANNOUNCEMENT_WELCOME_TITLE',
    dateKey: 'ANNOUNCEMENT_SAMPLE_DATE',
    contentKey: 'ANNOUNCEMENT_WELCOME_CONTENT',
  },
] as const;

export const ADMIN_SUPPORT_DOCUMENTATION_FIXTURES = [
  { titleKey: 'DOC_ADMIN_MANUAL_TITLE' },
  { titleKey: 'DOC_FINANCE_SETUP_TITLE' },
  { titleKey: 'DOC_TROUBLESHOOTING_TITLE' },
] as const;

/**
 * Contract sentinel only: the supplied source has no authoritative support API response DTO.
 * Never fabricate a successful response. Tests receive an explicit 501 until the host contract is supplied.
 */
export const ADMIN_SUPPORT_MSW_HANDLERS = [
  http.get(ADMIN_SUPPORT_URLS.LIST, () => HttpResponse.json({
    code: 'API_CONTRACT_UNAVAILABLE',
    message: 'Support API contract is unavailable in the supplied source scope.',
  }, { status: 501 })),
];
