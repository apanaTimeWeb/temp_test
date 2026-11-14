// FLOW: Feature form/API boundary -> superadmin_communication/communication_notices/schemas/SuperadminCommunicationNoticesNoticeSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Communication Notice Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';
const SuperadminCommunicationIsoDateSchema = z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).regex(/^\d{4}-\d{2}-\d{2}$/, "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_DATE").refine((value) => { const date = new Date(`${value}T00:00:00.000Z`); return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value; }, "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_REAL_CALENDAR_DATE");
export const SuperadminCommunicationNoticeSchema = z.object({
  title: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(3, "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_NOTICE_TITLE_WITH_AT_LEAST_3_CHARACTERS").max(120, "SUPERADMIN_COMMUNICATION.VALIDATION.TITLE_MUST_BE_120_CHARACTERS_OR_FEWER"),
  message: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(5, "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_NOTICE_MESSAGE_WITH_AT_LEAST_5_CHARACTERS").max(4000, "SUPERADMIN_COMMUNICATION.VALIDATION.MESSAGE_MUST_BE_4_000_CHARACTERS_OR_FEWER"),
  validTill: SuperadminCommunicationIsoDateSchema,
}, { error: "SUPERADMIN_COMMUNICATION.VALIDATION.PROVIDE_VALID_FORM_DATA" });
/**
 * Defines the public SuperadminCommunicationNoticeFormValues contract for communication notices. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminCommunicationNoticeFormValues = z.infer<typeof SuperadminCommunicationNoticeSchema>;
