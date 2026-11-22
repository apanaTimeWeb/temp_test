// RESPONSIBILITY: Notification templates for Superadmin Communication.
// FLOW: Constants -> Templates -> views/mocks.

import type { NotificationTemplate } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export const SYSTEM_NOTIFICATION_TEMPLATES: ReadonlyArray<NotificationTemplate> = [
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
