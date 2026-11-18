import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';

/** Admin WhatsApp Business templates: Only primary Admin-level communications (Welcome Onboarding & Official Notices). Member-level billing, receipts and follow-ups are managed at the Branch Manager counter. */
export const ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_FIXTURES: AdminCommunicationWhatsappTemplate[] = [
  {
    id: 'welcome',
    labelKey: 'WHATSAPP_TEMPLATE_WELCOME',
    icon: '👋',
    category: 'Onboarding',
    triggerEvent: 'New student admission / seat allocation',
    body: `*Welcome to {libraryname}!* 🎉

Dear *{name}*,
We are delighted to welcome you to our study community. Your dedicated workspace has been successfully activated.

📌 *Membership Particulars:*
• *Assigned Seat:* {seat}
• *Selected Plan:* {planname}
• *Digital Access:* Active via QR check-in

💡 *Guidelines for a Great Experience:*
1. Maintain silent zone discipline in study halls.
2. Wi-Fi credentials are available at the front desk.
3. Keep your personal locker secured at all times.

For any assistance or queries, feel free to contact our Helpdesk at *{phone}*.

Wishing you productive study hours and great success! 📚
— *Management Team, {libraryname}*`,
  },
  {
    id: 'notice',
    labelKey: 'WHATSAPP_TEMPLATE_NOTICE',
    icon: '📢',
    category: 'Announcements',
    triggerEvent: 'Campus schedule / facility update',
    body: `*Official Notice | {libraryname}* 📢

Dear *{name}*,
Please take note of the following important operational announcement regarding library premises and schedule:

📌 *Announcement:*
{libraryname} will undergo scheduled facility maintenance & power backup inspection on *{duedate}*. Quiet study halls and air-conditioned zones will remain functional as scheduled.

⚠️ *Reminders:*
• Please ensure personal study desks remain tidy after your shift.
• Locker keys must be deposited at the front desk before extended absence.

For any immediate operational queries, contact management at *{phone}*.

Warm regards,
— *Administration Office, {libraryname}*`,
  },
];
