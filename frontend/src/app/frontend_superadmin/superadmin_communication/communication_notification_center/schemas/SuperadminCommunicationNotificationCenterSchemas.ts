// RESPONSIBILITY: Zod runtime validation schemas for Superadmin Notification & Communication Center.
// FLOW: Form/API boundary -> schemas/SuperadminCommunicationNotificationCenterSchemas.ts -> parsed/safe typed inputs.

import { z } from 'zod';

export const notificationChannelEnum = z.enum(['EMAIL', 'SMS', 'WHATSAPP']);

export const notificationCategoryEnum = z.enum([
  'ADMIN_INVITATION',
  'WELCOME_MESSAGE',
  'SUBSCRIPTION_EXPIRY_REMINDER',
  'PAYMENT_REMINDER',
  'FAILED_PAYMENT_NOTIFICATION',
  'BRANCH_CREATION_CONFIRMATION',
  'MAINTENANCE_ALERT',
  'SYSTEM_OUTAGE_NOTIFICATION',
  'SECURITY_ALERT',
  'PRODUCT_ANNOUNCEMENT',
]);

export const notificationTargetScopeEnum = z.enum([
  'GLOBAL',
  'ACCOUNT_SPECIFIC',
  'BRANCH_SPECIFIC',
  'ROLE_SPECIFIC',
]);

export const notificationDeliveryStatusEnum = z.enum([
  'DELIVERED',
  'SENT',
  'PENDING',
  'FAILED',
  'BOUNCED',
]);

export const notificationPriorityEnum = z.enum([
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
]);

export const notificationTargetRoleEnum = z.enum([
  'SUPERADMIN',
  'LIBRARY_ADMIN',
  'BRANCH_MANAGER',
  'STAFF',
  'MEMBER',
  'ALL_ROLES',
]);

/** Schema for dispatching a notification */
export const dispatchNotificationSchema = z.object({
  category: notificationCategoryEnum,
  title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title cannot exceed 150 characters'),
  message: z.string().min(10, 'Message body must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters'),
  targetScope: notificationTargetScopeEnum,
  targetAccountId: z.string().optional().nullable(),
  targetRole: notificationTargetRoleEnum.default('ALL_ROLES'),
  channels: z.array(notificationChannelEnum).min(1, 'Please select at least one channel (Email, SMS, or WhatsApp)'),
  priority: notificationPriorityEnum.default('NORMAL'),
  testRecipient: z
    .object({
      email: z.string().email('Invalid email address').optional().or(z.literal('')),
      phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid international phone number format (E.164)').optional().or(z.literal('')),
    })
    .optional(),
});

export type DispatchNotificationSchema = z.infer<typeof dispatchNotificationSchema>;

/** Schema for updating a template */
export const updateTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(5),
  defaultPriority: notificationPriorityEnum,
  channelTemplates: z.object({
    email: z.object({
      enabled: z.boolean(),
      subject: z.string().min(3, 'Subject is required for Email'),
      body: z.string().min(10, 'Email body is required'),
    }),
    sms: z.object({
      enabled: z.boolean(),
      body: z.string().min(5, 'SMS body is required').max(160, 'SMS should typically be within 160 characters'),
      dltTemplateId: z.string().optional(),
    }),
    whatsapp: z.object({
      enabled: z.boolean(),
      body: z.string().min(10, 'WhatsApp body is required'),
      metaTemplateName: z.string().optional(),
    }),
  }),
});

export type UpdateTemplateSchema = z.infer<typeof updateTemplateSchema>;

/** Status contract export for backward compatibility */
export const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_SCHEMA_CONTRACT_STATUS = {
  status: 'ACTIVE_ZOD_ENFORCED',
  zodSchemaDefined: true,
  source: 'WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1',
} as const;
