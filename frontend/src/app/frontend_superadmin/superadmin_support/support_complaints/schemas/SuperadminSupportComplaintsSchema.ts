// FLOW: Feature form/API boundary -> superadmin_support/support_complaints/schemas/SuperadminSupportComplaintsSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Communication Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminSupportComplaintIdentifierSchema = z.union([z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }), z.number({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_NUMBER" })]).transform(String);
export const SuperadminSupportComplaintResponseSchema = z.object({
  id: SuperadminSupportComplaintIdentifierSchema,
  subject: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  title: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  description: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  createdAt: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  date: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  status: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  student: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  isAnonymous: z.boolean({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.CHOOSE_A_VALID_BOOLEAN_VALUE" }).optional(),
  resolvedBy: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  resolvedDate: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
  resolvedNote: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
}, { error: "SUPERADMIN_COMMUNICATION.VALIDATION.PROVIDE_VALID_FORM_DATA" }).passthrough();
export const SuperadminSupportComplaintsResponseSchema = z.array(SuperadminSupportComplaintResponseSchema, { error: "SUPERADMIN_COMMUNICATION.VALIDATION.PROVIDE_A_VALID_LIST" });
