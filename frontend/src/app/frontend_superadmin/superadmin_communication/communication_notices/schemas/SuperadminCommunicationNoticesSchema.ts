// FLOW: Feature form/API boundary -> superadmin_communication/communication_notices/schemas/SuperadminCommunicationNoticesSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Communication Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminCommunicationIdentifierSchema = z.union([
  z.string({ required_error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }),
  z.number({ required_error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_NUMBER" })
]).transform(String);

export const SuperadminCommunicationNoticeResponseSchema = z.object({
  id: SuperadminCommunicationIdentifierSchema,
  title: z.string().optional(),
  message: z.string().optional(),
  createdAt: z.string().optional(),
  validTill: z.string().optional(),
}).passthrough();

export const SuperadminCommunicationNoticesResponseSchema = z.array(SuperadminCommunicationNoticeResponseSchema);
