// RESPONSIBILITY: Central constants for Superadmin Notification & Communication management.
// FLOW: Feature domain -> constants/SuperadminCommunicationNotificationCenterNotificationConstants.ts -> components/hooks/mocks.

import type {
  NotificationCategory,
  NotificationChannel,
  NotificationDeliveryStatus,
  NotificationPriority,
  NotificationTargetAccount,
  NotificationTemplate,
  SuperadminCommunicationNotificationCategoryOption,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export const NOTIFICATION_CHANNELS: ReadonlyArray<{
  id: NotificationChannel;
  label: string;
  icon: string;
  badgeClass: string;
}> = [
  { id: 'EMAIL', label: 'Email', icon: 'Mail', badgeClass: 'bg-sky-500/15 text-sky-400 border border-sky-500/30' },
  { id: 'SMS', label: 'SMS', icon: 'MessageSquare', badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  { id: 'WHATSAPP', label: 'WhatsApp', icon: 'PhoneCall', badgeClass: 'bg-teal-500/15 text-teal-400 border border-teal-500/30' },
] as const;

export const NOTIFICATION_STATUS_CONFIG: Record<
  NotificationDeliveryStatus,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: 'CheckCheck',
  },
  SENT: {
    label: 'Sent',
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    icon: 'Send',
  },
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: 'Clock',
  },
  FAILED: {
    label: 'Failed',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    icon: 'AlertCircle',
  },
  BOUNCED: {
    label: 'Bounced',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    icon: 'AlertTriangle',
  },
};

export const NOTIFICATION_PRIORITY_CONFIG: Record<
  NotificationPriority,
  { label: string; badgeClass: string; icon: string }
> = {
  LOW: { label: 'Low', badgeClass: 'bg-slate-500/15 text-slate-400 border border-slate-500/30', icon: '🟢' },
  NORMAL: { label: 'Normal', badgeClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30', icon: '🔵' },
  HIGH: { label: 'High', badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', icon: '🟡' },
  URGENT: { label: 'Urgent', badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30', icon: '🔴' },
};

/** Pre-configured target library accounts for account-specific dispatch */
export const TARGET_LIBRARY_ACCOUNTS: NotificationTargetAccount[] = [
  { id: 'lib-001', name: 'Central Apex Library', code: 'CAL-HQ', email: 'admin@apexlibrary.in', phone: '+919876543210', planName: 'Enterprise SaaS', branchCount: 8, status: 'ACTIVE' },
  { id: 'lib-002', name: 'City Central Reading Lounge', code: 'CCRL-01', email: 'director@citylounge.com', phone: '+919811223344', planName: 'Growth Plan', branchCount: 3, status: 'ACTIVE' },
  { id: 'lib-003', name: 'Knowledge Hub Study Rooms', code: 'KHUB-09', email: 'owner@knowledgehub.org', phone: '+919822334455', planName: 'Starter Pro', branchCount: 1, status: 'ACTIVE' },
  { id: 'lib-004', name: 'Prism Quiet Study Library', code: 'PRISM-02', email: 'billing@prismlib.in', phone: '+919833445566', planName: 'Standard Plan', branchCount: 2, status: 'TRIAL' },
  { id: 'lib-005', name: 'Metro Digital Library & Coworking', code: 'METRO-05', email: 'contact@metrolib.com', phone: '+919844556677', planName: 'Enterprise SaaS', branchCount: 5, status: 'SUSPENDED' },
];

/** The 10 Mandated System Notification Templates with full Email, SMS, WhatsApp copies */
export const MANDATED_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tmpl-01',
    category: 'ADMIN_INVITATION',
    name: 'Admin Invitations',
    description: 'Sent when SuperAdmin provisions or invites a new Library Owner or Admin',
    defaultPriority: 'HIGH',
    supportedChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
    variables: ['admin_name', 'library_name', 'invite_link', 'temporary_password', 'support_email'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'Welcome to Smart Library 360 - Complete Your Admin Setup for {{library_name}}',
        body: 'Hello {{admin_name}},\n\nYou have been invited as an Administrator for {{library_name}} on Smart Library 360.\n\nPlease click the button below to set up your password and access your dashboard:\n{{invite_link}}\n\nYour temporary password: {{temporary_password}}\n\nIf you have any questions, reach out to {{support_email}}.',
      },
      sms: {
        channel: 'SMS',
        enabled: true,
        dltTemplateId: 'DLT-SMS-INV-1001',
        body: 'Hello {{admin_name}}, you are invited as Admin for {{library_name}}. Complete your setup: {{invite_link}} - SmartLib',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'admin_onboarding_invite_v2',
        metaTemplateStatus: 'APPROVED',
        body: '👋 Hello *{{admin_name}}*,\n\nYou have been granted Admin access for *{{library_name}}*.\n\n🔗 Setup your portal: {{invite_link}}\n🔑 Temporary PIN: `{{temporary_password}}`\n\nWelcome aboard! 🚀',
      },
    },
  },
  {
    id: 'tmpl-02',
    category: 'WELCOME_MESSAGE',
    name: 'Welcome Message',
    description: 'Onboarding welcome message dispatched after account verification',
    defaultPriority: 'NORMAL',
    supportedChannels: ['EMAIL', 'WHATSAPP'],
    variables: ['admin_name', 'library_name', 'dashboard_url', 'guide_url'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'Welcome to the Smart Library 360 Network, {{library_name}}!',
        body: 'Dear {{admin_name}},\n\nYour library account {{library_name}} is now live and fully activated. You can begin configuring your branches, slots, shifts, and member records.\n\nAccess Dashboard: {{dashboard_url}}\nRead Getting Started Guide: {{guide_url}}\n\nHappy managing!',
      },
      sms: {
        channel: 'SMS',
        enabled: false,
        body: 'Welcome to Smart Library 360! Your account {{library_name}} is now active. Dashboard: {{dashboard_url}}',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'library_account_welcome_v1',
        metaTemplateStatus: 'APPROVED',
        body: '🎉 Welcome to *Smart Library 360*, *{{admin_name}}*!\n\nYour account for *{{library_name}}* is now active.\n\nReady to get started? Log in to your cockpit:\n{{dashboard_url}}\n\nNeed quick help? Reply HELP anytime.',
      },
    },
  },
  {
    id: 'tmpl-03',
    category: 'SUBSCRIPTION_EXPIRY_REMINDER',
    name: 'Subscription Expiry Reminder',
    description: 'Automated notification dispatched 7, 3, and 1 days prior to SaaS plan renewal',
    defaultPriority: 'HIGH',
    supportedChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
    variables: ['library_name', 'plan_name', 'expiry_date', 'days_left', 'renewal_link', 'amount'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'Urgent: Your {{plan_name}} Plan for {{library_name}} expires in {{days_left}} days',
        body: 'Dear {{library_name}} Team,\n\nYour subscription for {{plan_name}} will expire on {{expiry_date}} ({{days_left}} days remaining).\n\nTo ensure zero disruption to branch attendance, seat allocations, and member access, please renew today:\n{{renewal_link}}\n\nRenewal Amount: ₹{{amount}}',
      },
      sms: {
        channel: 'SMS',
        enabled: true,
        dltTemplateId: 'DLT-SMS-EXP-2002',
        body: 'Alert: Subscription for {{library_name}} expires on {{expiry_date}}. Renew now to avoid interruption: {{renewal_link}}',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'subscription_expiry_alert_v3',
        metaTemplateStatus: 'APPROVED',
        body: '⚠️ *Subscription Renewal Notice*\n\nHi *{{library_name}}*, your *{{plan_name}}* plan is due to expire on *{{expiry_date}}* (in {{days_left}} days).\n\n💰 Renewal Fee: *₹{{amount}}*\n👉 Quick Renew: {{renewal_link}}\n\nAvoid any branch software interruptions.',
      },
    },
  },
  {
    id: 'tmpl-04',
    category: 'PAYMENT_REMINDER',
    name: 'Payment Reminder',
    description: 'Upcoming invoice payment reminder sent to library account billing contact',
    defaultPriority: 'HIGH',
    supportedChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
    variables: ['library_name', 'invoice_number', 'amount', 'due_date', 'payment_link'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'Payment Reminder: Invoice {{invoice_number}} for {{library_name}}',
        body: 'Dear Accounts Team,\n\nThis is a gentle reminder that invoice {{invoice_number}} of ₹{{amount}} for {{library_name}} is due on {{due_date}}.\n\nPlease complete your payment securely at: {{payment_link}}.',
      },
      sms: {
        channel: 'SMS',
        enabled: true,
        dltTemplateId: 'DLT-SMS-PAY-3003',
        body: 'Invoice {{invoice_number}} of Rs. {{amount}} for {{library_name}} is due on {{due_date}}. Pay here: {{payment_link}}',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'invoice_payment_reminder_v1',
        metaTemplateStatus: 'APPROVED',
        body: '💳 *Invoice Payment Reminder*\n\nLibrary: *{{library_name}}*\nInvoice: *#{{invoice_number}}*\nAmount Due: *₹{{amount}}*\nDue Date: *{{due_date}}*\n\n🔗 Pay online in 1-click: {{payment_link}}',
      },
    },
  },
  {
    id: 'tmpl-05',
    category: 'FAILED_PAYMENT_NOTIFICATION',
    name: 'Failed Payment Notification',
    description: 'Dispatched immediately when an automated card or UPI payment attempt fails',
    defaultPriority: 'URGENT',
    supportedChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
    variables: ['library_name', 'invoice_number', 'amount', 'failure_reason', 'retry_payment_url'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'Payment Failed: Action Required for Invoice {{invoice_number}}',
        body: 'Alert: Your recent automated transaction of ₹{{amount}} for invoice {{invoice_number}} could not be completed.\n\nReason: {{failure_reason}}\n\nPlease update your payment method or retry the transaction to prevent account lock: {{retry_payment_url}}',
      },
      sms: {
        channel: 'SMS',
        enabled: true,
        dltTemplateId: 'DLT-SMS-FAIL-4004',
        body: 'Payment failed for {{library_name}} (Inv {{invoice_number}}). Reason: {{failure_reason}}. Retry now: {{retry_payment_url}}',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'payment_failed_urgent_v1',
        metaTemplateStatus: 'APPROVED',
        body: '🚨 *Urgent: Payment Failed*\n\nTransaction for *{{library_name}}* could not be processed.\n\n❌ Reason: {{failure_reason}}\n💵 Amount: ₹{{amount}}\n\n👉 Update card or pay via UPI: {{retry_payment_url}}',
      },
    },
  },
  {
    id: 'tmpl-06',
    category: 'BRANCH_CREATION_CONFIRMATION',
    name: 'Branch Creation Confirmation',
    description: 'Sent when a new branch location is successfully provisioned and linked to a library',
    defaultPriority: 'NORMAL',
    supportedChannels: ['EMAIL', 'WHATSAPP'],
    variables: ['library_name', 'branch_name', 'branch_code', 'branch_address', 'manager_name'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'Branch Provisioned: {{branch_name}} is now live for {{library_name}}',
        body: 'Congratulations {{library_name}}!\n\nYour new branch {{branch_name}} (Code: {{branch_code}}) located at {{branch_address}} has been activated. Branch manager: {{manager_name}}.\n\nYou can now start allocating seats and shifts.',
      },
      sms: {
        channel: 'SMS',
        enabled: false,
        body: 'New branch {{branch_name}} provisioned for {{library_name}}. Code: {{branch_code}}.',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'branch_creation_confirmed_v1',
        metaTemplateStatus: 'APPROVED',
        body: '🏢 *New Branch Activated!*\n\nLibrary: *{{library_name}}*\nBranch: *{{branch_name}}* ({{branch_code}})\nAssigned Manager: *{{manager_name}}*\n\nYour branch seat layout is ready for assignment! 🎯',
      },
    },
  },
  {
    id: 'tmpl-07',
    category: 'MAINTENANCE_ALERT',
    name: 'Maintenance Alert',
    description: 'Notifies administrators of scheduled system maintenance and expected read-only windows',
    defaultPriority: 'HIGH',
    supportedChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
    variables: ['start_time', 'end_time', 'duration', 'expected_impact', 'status_page_url'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'Scheduled Platform Maintenance Notice: {{start_time}} to {{end_time}}',
        body: 'Hello Library Administrators,\n\nWe will be conducting scheduled system optimization and database index upgrades.\n\nWindow: {{start_time}} to {{end_time}} (Approx {{duration}})\nImpact: {{expected_impact}}\n\nLive updates will be posted on: {{status_page_url}}.',
      },
      sms: {
        channel: 'SMS',
        enabled: true,
        dltTemplateId: 'DLT-SMS-MAINT-6006',
        body: 'Scheduled Maintenance: SmartLib will undergo upgrades on {{start_time}} ({{duration}}). Live status: {{status_page_url}}',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'maintenance_schedule_broadcast_v1',
        metaTemplateStatus: 'APPROVED',
        body: '🛠️ *Scheduled Maintenance Notice*\n\nSmart Library 360 will undergo routine infrastructure upgrades.\n\n📅 Window: *{{start_time}}* - *{{end_time}}*\n⏳ Duration: *{{duration}}*\nℹ️ Impact: *{{expected_impact}}*\n\nUpdates: {{status_page_url}}',
      },
    },
  },
  {
    id: 'tmpl-08',
    category: 'SYSTEM_OUTAGE_NOTIFICATION',
    name: 'System Outage Notification',
    description: 'High-priority advisory dispatched during unexpected service degradation or gateway outages',
    defaultPriority: 'URGENT',
    supportedChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
    variables: ['incident_title', 'affected_service', 'start_time', 'investigation_status', 'status_url'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'CRITICAL ADVISORY: {{incident_title}} affecting {{affected_service}}',
        body: 'Urgent Advisory:\n\nOur engineering team has detected an incident with {{affected_service}} starting at {{start_time}}.\n\nCurrent status: {{investigation_status}}.\n\nEngineers are actively investigating and resolving. Track progress: {{status_url}}.',
      },
      sms: {
        channel: 'SMS',
        enabled: true,
        dltTemplateId: 'DLT-SMS-OUTAGE-7007',
        body: 'Urgent: Service disruption detected in {{affected_service}}. Our team is investigating. Details: {{status_url}}',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'system_outage_advisory_v1',
        metaTemplateStatus: 'APPROVED',
        body: '🔴 *System Incident Alert*\n\n⚠️ Affected: *{{affected_service}}*\n🕒 Started: *{{start_time}}*\n🔍 Status: *{{investigation_status}}*\n\nOur DevOps team is working on immediate recovery. Follow live updates: {{status_url}}',
      },
    },
  },
  {
    id: 'tmpl-09',
    category: 'SECURITY_ALERT',
    name: 'Security Alert',
    description: 'Dispatched on suspicious login attempts, MFA reset, or unexpected IP change',
    defaultPriority: 'URGENT',
    supportedChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
    variables: ['user_name', 'ip_address', 'location', 'device_name', 'timestamp', 'security_portal_url'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'Security Alert: New Sign-in from {{location}} ({{ip_address}})',
        body: 'Hello {{user_name}},\n\nA login was detected from a new location or device.\n\nIP: {{ip_address}}\nLocation: {{location}}\nDevice: {{device_name}}\nTime: {{timestamp}}\n\nIf this was not you, lock your credentials immediately: {{security_portal_url}}.',
      },
      sms: {
        channel: 'SMS',
        enabled: true,
        dltTemplateId: 'DLT-SMS-SEC-8008',
        body: 'Security Alert: Sign-in from {{location}} (IP: {{ip_address}}). Not you? Lock account: {{security_portal_url}}',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'security_login_challenge_v2',
        metaTemplateStatus: 'APPROVED',
        body: '🔒 *Security Alert: New Sign-in*\n\nHi *{{user_name}}*, a login was detected:\n📍 Location: *{{location}}*\n🌐 IP: `{{ip_address}}`\n📱 Device: *{{device_name}}*\n\nIf this was NOT you, secure your account now:\n{{security_portal_url}}',
      },
    },
  },
  {
    id: 'tmpl-10',
    category: 'PRODUCT_ANNOUNCEMENT',
    name: 'Product Announcements',
    description: 'Platform enhancement broadcasts, feature rollouts, and policy updates',
    defaultPriority: 'NORMAL',
    supportedChannels: ['EMAIL', 'WHATSAPP'],
    variables: ['feature_name', 'headline', 'release_summary', 'learn_more_url'],
    active: true,
    lastModified: '2026-11-20',
    modifiedBy: 'SuperAdmin System',
    channelTemplates: {
      email: {
        channel: 'EMAIL',
        enabled: true,
        subject: 'New on Smart Library 360: Introducing {{feature_name}} 🚀',
        body: 'Hello Library Leaders,\n\n{{headline}}\n\n{{release_summary}}\n\nExplore the feature directly in your cockpit: {{learn_more_url}}.',
      },
      sms: {
        channel: 'SMS',
        enabled: false,
        body: 'New on Smart Library: {{feature_name}}! Check it out: {{learn_more_url}}',
      },
      whatsapp: {
        channel: 'WHATSAPP',
        enabled: true,
        metaTemplateName: 'feature_announcement_broadcast_v1',
        metaTemplateStatus: 'APPROVED',
        body: '🚀 *New Feature Release: {{feature_name}}*\n\n{{headline}}\n\n✨ *What is new:*\n{{release_summary}}\n\n👉 Learn more: {{learn_more_url}}',
      },
    },
  },
];

/** Preserved category filters for backward compatibility */
export const SUPERADMIN_COMMUNICATION_NOTIFICATION_FILTERS: SuperadminCommunicationNotificationCategoryOption[] = [
  { id: 'All', labelKey: 'COPY.NOTIFICATION_CATEGORY_ALL', icon: '🔔' },
  { id: 'Finance', labelKey: 'COPY.NOTIFICATION_CATEGORY_FINANCE', icon: '💰' },
  { id: 'CRM', labelKey: 'COPY.NOTIFICATION_CATEGORY_CRM', icon: '📞' },
  { id: 'Operations', labelKey: 'COPY.NOTIFICATION_CATEGORY_OPERATIONS', icon: '🪑' },
  { id: 'Attendance', labelKey: 'COPY.NOTIFICATION_CATEGORY_ATTENDANCE', icon: '📅' },
  { id: 'High Only', labelKey: 'COPY.NOTIFICATION_CATEGORY_HIGH_ONLY', icon: '🔴' },
];

export const SUPERADMIN_COMMUNICATION_NOTIFICATION_ICON_CLASS: Readonly<Record<string, string>> = {
  Finance: 'eng-notif-icon--finance',
  CRM: 'eng-notif-icon--crm',
  Operations: 'eng-notif-icon--ops',
  Attendance: 'eng-notif-icon--attend',
};
