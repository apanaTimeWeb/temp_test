// FLOW: Feature form/API boundary -> superadmin_communication/communication_notices/schemas/SuperadminCommunicationNoticesSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Communication Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminCommunicationIdentifierSchema = z.union([z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }), z.number({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_NUMBER" })]).transform(String);
export const SuperadminCommunicationNoticeResponseSchema = z.object({
  id: SuperadminCommunicationIdentifierSchema,
  title: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  message: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  createdAt: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  validTill: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
}, { error: "SUPERADMIN_COMMUNICATION.VALIDATION.PROVIDE_VALID_FORM_DATA" }).passthrough();
export const SuperadminCommunicationNoticesResponseSchema = z.array(SuperadminCommunicationNoticeResponseSchema, { error: "SUPERADMIN_COMMUNICATION.VALIDATION.PROVIDE_A_VALID_LIST" });
