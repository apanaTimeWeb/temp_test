// RESPONSIBILITY: Define complete TypeScript types for Superadmin Notification & Communication management.
// FLOW: Feature domain -> types/SuperadminCommunicationNotificationCenterNotificationTypes.ts -> components/hooks/api/mocks.

/** Supported communication transmission channels */
export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP';

/** 10 Canonical Notification Template & Event Categories mandated for Superadmin */
export type NotificationCategory =
  | 'ADMIN_INVITATION'
  | 'WELCOME_MESSAGE'
  | 'SUBSCRIPTION_EXPIRY_REMINDER'
  | 'PAYMENT_REMINDER'
  | 'FAILED_PAYMENT_NOTIFICATION'
  | 'BRANCH_CREATION_CONFIRMATION'
  | 'MAINTENANCE_ALERT'
  | 'SYSTEM_OUTAGE_NOTIFICATION'
  | 'SECURITY_ALERT'
  | 'PRODUCT_ANNOUNCEMENT';

/** Target scope: Global system-wide vs. Account-specific */
export type NotificationTargetScope = 'GLOBAL' | 'ACCOUNT_SPECIFIC' | 'BRANCH_SPECIFIC' | 'ROLE_SPECIFIC';

/** Delivery execution status */
export type NotificationDeliveryStatus = 'DELIVERED' | 'SENT' | 'PENDING' | 'FAILED' | 'BOUNCED';

/** Urgency priority */
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

/** Target user role */
export type NotificationTargetRole = 'SUPERADMIN' | 'LIBRARY_ADMIN' | 'BRANCH_MANAGER' | 'STAFF' | 'MEMBER' | 'ALL_ROLES';

/** Information about an account target (e.g. specific Library) */
export interface NotificationTargetAccount {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  planName: string;
  branchCount: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
}

/** Individual notification dispatch record */
export interface NotificationRecord {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  targetScope: NotificationTargetScope;
  targetAccount?: NotificationTargetAccount | null;
  targetRecipient: {
    name: string;
    email?: string;
    phone?: string;
    role?: NotificationTargetRole;
  };
  channels: NotificationChannel[];
  priority: NotificationPriority;
  status: NotificationDeliveryStatus;
  failureReason?: string | null;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  sentAt?: string | null;
  deliveredAt?: string | null;
  lastRetryAt?: string | null;
  idempotencyKey: string;
  read: boolean;
  metadata?: Record<string, unknown>;
}

/** Channel-specific template variant */
export interface ChannelTemplateVariant {
  channel: NotificationChannel;
  enabled: boolean;
  subject?: string; // For Email
  body: string;
  dltTemplateId?: string; // For Indian SMS compliance
  metaTemplateName?: string; // For WhatsApp Cloud API
  metaTemplateStatus?: 'APPROVED' | 'PENDING' | 'REJECTED';
}

/** Reusable multi-channel template entity */
export interface NotificationTemplate {
  id: string;
  category: NotificationCategory;
  name: string;
  description: string;
  defaultPriority: NotificationPriority;
  supportedChannels: NotificationChannel[];
  variables: string[]; // e.g. ['library_name', 'admin_name', 'amount', 'due_date']
  channelTemplates: {
    email: ChannelTemplateVariant;
    sms: ChannelTemplateVariant;
    whatsapp: ChannelTemplateVariant;
  };
  lastModified: string;
  modifiedBy: string;
  active: boolean;
}

/** Channel-level usage metrics */
export interface ChannelUsageMetric {
  channel: NotificationChannel;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  monthlyQuota: number;
  quotaUsedPercent: number;
  deliverySuccessRate: number;
  costInMinorUnits: number; // In paise (minor unit contract)
}

/** Overall platform notification usage metrics */
export interface NotificationUsageAnalytics {
  period: string; // e.g. 'Nov 2026'
  totalDispatched: number;
  totalDelivered: number;
  totalFailed: number;
  overallDeliveryRate: number;
  activeAutomatedTriggersCount: number;
  channels: {
    email: ChannelUsageMetric;
    sms: ChannelUsageMetric;
    whatsapp: ChannelUsageMetric;
  };
  dailyVolume: Array<{
    date: string;
    email: number;
    sms: number;
    whatsapp: number;
    failures: number;
  }>;
  recentFailures: Array<{
    id: string;
    category: NotificationCategory;
    channel: NotificationChannel;
    recipientName: string;
    targetAccountName?: string;
    failureReason: string;
    timestamp: string;
    retryable: boolean;
  }>;
}

/** Payload for dispatching a notification */
export interface DispatchNotificationDto {
  category: NotificationCategory;
  title: string;
  message: string;
  targetScope: NotificationTargetScope;
  targetAccountId?: string | null;
  targetRole?: NotificationTargetRole;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  variables?: Record<string, string>;
  testRecipient?: {
    email?: string;
    phone?: string;
  };
}

/** Legacy types retained for backward compatibility */
export type SuperadminCommunicationNotificationCategory = 'Finance' | 'CRM' | 'Operations' | 'Attendance' | NotificationCategory;
export type SuperadminCommunicationNotificationPriority = 'High' | 'Medium' | NotificationPriority;

export interface SuperadminCommunicationNotification {
  id: string;
  category: SuperadminCommunicationNotificationCategory;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  timeKey: string;
  priority: SuperadminCommunicationNotificationPriority;
  link: string;
  read: boolean;
}

export type SuperadminCommunicationNotificationFilter = 'All' | SuperadminCommunicationNotificationCategory | 'High Only';

export interface SuperadminCommunicationNotificationCategoryOption {
  id: SuperadminCommunicationNotificationFilter;
  labelKey: string;
  icon: string;
}
