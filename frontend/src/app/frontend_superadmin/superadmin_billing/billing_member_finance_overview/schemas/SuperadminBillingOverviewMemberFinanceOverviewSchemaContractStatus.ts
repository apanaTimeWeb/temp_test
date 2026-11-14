// RESPONSIBILITY: Define validation schemas for billing member finance overview; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_billing/billing_member_finance_overview/schemas/SuperadminBillingOverviewMemberFinanceOverviewSchemaContractStatus.ts -> parsed/validated input -> typed feature action.
/**
 * Schema boundary status for member_finance_overview.
 * No verified API payload schema is supplied. This is a status marker, not a Zod schema.
 * Do not validate invented fields; add the real Zod schema after the backend contract is approved.
 */
export const SUPERADMIN_MEMBER_FINANCE_OVERVIEW_SCHEMA_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  zodSchemaDefined: false,
  reason: 'No approved request/response field contract exists in the supplied archive.',
} as const;
