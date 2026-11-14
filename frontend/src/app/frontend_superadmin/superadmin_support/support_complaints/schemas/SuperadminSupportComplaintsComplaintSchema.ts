// FLOW: Feature form/API boundary -> superadmin_support/support_complaints/schemas/SuperadminSupportComplaintsComplaintSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Communication Complaint Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

export const SuperadminSupportComplaintSchema = z.object({
  student: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(120, "SUPERADMIN_COMMUNICATION.VALIDATION.STUDENT_NAME_MUST_BE_120_CHARACTERS_OR_FEWER").default(''),
  anonymous: z.boolean({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.CHOOSE_A_VALID_BOOLEAN_VALUE" }).default(false),
  title: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(3, "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_COMPLAINT_TITLE_WITH_AT_LEAST_3_CHARACTERS").max(120, "SUPERADMIN_COMMUNICATION.VALIDATION.TITLE_MUST_BE_120_CHARACTERS_OR_FEWER"),
  description: z.string({ error: "SUPERADMIN_COMMUNICATION.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(5, "SUPERADMIN_COMMUNICATION.VALIDATION.DESCRIBE_THE_COMPLAINT_IN_AT_LEAST_5_CHARACTERS").max(2000, "SUPERADMIN_COMMUNICATION.VALIDATION.DESCRIPTION_MUST_BE_2_000_CHARACTERS_OR_FEWER"),
}, { error: "SUPERADMIN_COMMUNICATION.VALIDATION.PROVIDE_VALID_FORM_DATA" });
/**
 * Defines the public SuperadminSupportComplaintFormValues contract for support complaints. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminSupportComplaintFormValues = z.infer<typeof SuperadminSupportComplaintSchema>;
