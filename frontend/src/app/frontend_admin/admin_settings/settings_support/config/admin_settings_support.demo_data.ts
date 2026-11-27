/** Synthetic support data shown only when explicit frontend demo mode is enabled. */
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
  { titleKey: 'ANNOUNCEMENT_CRM_TITLE', dateKey: 'ANNOUNCEMENT_SAMPLE_DATE', contentKey: 'ANNOUNCEMENT_CRM_CONTENT' },
  { titleKey: 'ANNOUNCEMENT_MAINTENANCE_TITLE', dateKey: 'ANNOUNCEMENT_ILLUSTRATIVE_DATE', contentKey: 'ANNOUNCEMENT_MAINTENANCE_CONTENT' },
  { titleKey: 'ANNOUNCEMENT_WELCOME_TITLE', dateKey: 'ANNOUNCEMENT_SAMPLE_DATE', contentKey: 'ANNOUNCEMENT_WELCOME_CONTENT' },
] as const;

export const ADMIN_SUPPORT_DOCUMENTATION_FIXTURES = [
  { titleKey: 'DOC_ADMIN_MANUAL_TITLE' },
  { titleKey: 'DOC_FINANCE_SETUP_TITLE' },
  { titleKey: 'DOC_TROUBLESHOOTING_TITLE' },
] as const;
