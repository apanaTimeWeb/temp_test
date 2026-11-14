// FLOW: Feature form/API boundary -> superadmin_settings/settings_general/schemas/SuperadminSettingsGeneralSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Settings Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

export const SUPERADMIN_SETTINGS_SCHEMA = z.object({
  generalConfig: z.object({
    platformName: z.string({ error: "SUPERADMIN_SETTINGS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_SETTINGS.VALIDATION.PLATFORM_NAME_IS_REQUIRED").max(80, "SUPERADMIN_SETTINGS.VALIDATION.PLATFORM_NAME_MUST_BE_80_CHARACTERS_OR_FEWER"),
    supportEmail: z.string({ error: "SUPERADMIN_SETTINGS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().email("SUPERADMIN_SETTINGS.VALIDATION.ENTER_A_VALID_SUPPORT_EMAIL").max(254, "SUPERADMIN_SETTINGS.VALIDATION.SUPPORT_EMAIL_MUST_BE_254_CHARACTERS_OR_FEWER"),
    currency: z.enum(['INR (₹)', 'USD ($)', 'AED (د.إ)'], { error: "SUPERADMIN_SETTINGS.VALIDATION.SELECT_A_VALID_OPTION" }),
    timezone: z.enum(['Asia/Kolkata', 'UTC', 'America/New_York'], { error: "SUPERADMIN_SETTINGS.VALIDATION.SELECT_A_VALID_OPTION" }),
  }, { error: "SUPERADMIN_SETTINGS.VALIDATION.PROVIDE_VALID_FORM_DATA" }),
  apiConfig: z.object({
    emailProvider: z.enum(['AWS SES', 'SendGrid', 'SMTP Custom'], { error: "SUPERADMIN_SETTINGS.VALIDATION.SELECT_A_VALID_OPTION" }),
    smsProvider: z.enum(['Twilio', 'Fast2SMS', 'Msg91'], { error: "SUPERADMIN_SETTINGS.VALIDATION.SELECT_A_VALID_OPTION" }),
  }, { error: "SUPERADMIN_SETTINGS.VALIDATION.PROVIDE_VALID_FORM_DATA" }),
  maintenance: z.object({
    enabled: z.boolean({ error: "SUPERADMIN_SETTINGS.VALIDATION.CHOOSE_A_VALID_BOOLEAN_VALUE" }),
    message: z.string({ error: "SUPERADMIN_SETTINGS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(500, "SUPERADMIN_SETTINGS.VALIDATION.MAINTENANCE_MESSAGE_MUST_BE_500_CHARACTERS_OR_FEWER"),
  }, { error: "SUPERADMIN_SETTINGS.VALIDATION.PROVIDE_VALID_FORM_DATA" }).superRefine((maintenance, context) => {
    if (maintenance.enabled && !maintenance.message.trim()) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['message'], message: "SUPERADMIN_SETTINGS.VALIDATION.MAINTENANCE_MESSAGE_IS_REQUIRED" });
    }
  }),
}, { error: "SUPERADMIN_SETTINGS.VALIDATION.PROVIDE_VALID_FORM_DATA" });

