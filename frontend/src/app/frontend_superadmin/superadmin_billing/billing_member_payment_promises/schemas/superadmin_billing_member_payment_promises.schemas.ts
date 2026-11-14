// RESPONSIBILITY: Validate the payment-promise local preview date-change form; this schema is not a backend request contract.
// FLOW: Form input -> Zod validation -> typed local preview update only; no network write is permitted.
import { z } from 'zod';

function isValidCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  return candidate.getUTCFullYear() === year && candidate.getUTCMonth() === month - 1 && candidate.getUTCDate() === day;
}

export const SuperadminBillingOverviewMemberPaymentPromisesExtensionSchema = z.object({
  newDate: z.string().trim().min(1, 'PROMISE_DATE_REQUIRED').refine(isValidCalendarDate, 'PROMISE_DATE_INVALID'),
  reason: z.string().trim().min(3, 'EXTENSION_REASON_REQUIRED').max(250, 'EXTENSION_REASON_TOO_LONG'),
});

export type SuperadminBillingOverviewMemberPaymentPromisesExtensionValues = z.infer<typeof SuperadminBillingOverviewMemberPaymentPromisesExtensionSchema>;

// RESPONSIBILITY: Define validation schemas for billing member payment promises; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_billing/billing_member_payment_promises/schemas/superadmin_billing_member_payment_promises.schemas.ts -> parsed/validated input -> typed feature action.
/**
 * Schema boundary status for member_payment_promises.
 * No verified API payload schema is supplied. This is a status marker, not a Zod schema.
 * Do not validate invented fields; add the real Zod schema after the backend contract is approved.
 */
export const SUPERADMIN_MEMBER_PAYMENT_PROMISES_SCHEMA_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  zodSchemaDefined: false,
  reason: 'No approved request/response field contract exists in the supplied archive.',
} as const;
