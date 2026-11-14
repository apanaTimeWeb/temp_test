// RESPONSIBILITY: Define validation schemas for accounting financial reports; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_accounting/accounting_financial_reports/schemas/superadmin_accounting_financial_reports.schemas.ts -> parsed/validated input -> typed feature action.
/**
 * Schema boundary status for accounting_financial_reports.
 * No verified API payload schema is supplied. This is a status marker, not a Zod schema.
 * Do not validate invented fields; add the real Zod schema after the backend contract is approved.
 */
export const SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_SCHEMA_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  zodSchemaDefined: false,
  reason: 'No approved request/response field contract exists in the supplied archive.',
} as const;
