import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';

/** Professional enterprise WhatsApp Business templates for student & guardian communications. */
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

Wishing you productive study hours and great success! 📚✨
— *Management Team, {libraryname}*`,
  },
  {
    id: 'fee_reminder',
    labelKey: 'WHATSAPP_TEMPLATE_FEE_REMINDER',
    icon: '💰',
    category: 'Billing & Dues',
    triggerEvent: '3 days prior to scheduled due date',
    body: `*Fee Due Reminder | {libraryname}* 🔔

Dear *{name}*,
This is a gentle reminder that your monthly library membership fee is due for renewal.

📋 *Dues Summary:*
• *Member Name:* {name}
• *Seat Number:* {seat}
• *Active Plan:* {planname}
• *Payable Amount:* *₹{amount}*
• *Due Date:* *{duedate}*

💳 *Payment Instructions:*
Kindly settle your dues on or before *{duedate}* via UPI or at the front desk to ensure continuous seat reservation and high-speed Wi-Fi access.

Need help or wish to change your plan? Reach out to us at *{phone}*.

Thank you for your prompt cooperation!
— *Accounts Team, {libraryname}*`,
  },
  {
    id: 'renewal',
    labelKey: 'WHATSAPP_TEMPLATE_RENEWAL',
    icon: '🔁',
    category: 'Subscription',
    triggerEvent: 'Plan expiration alert',
    body: `*Subscription Expiry Alert | {libraryname}* ⏳

Dear *{name}*,
Your active membership plan (*{planname}*) for Seat *{seat}* is scheduled to expire in *3 days*.

⚠️ *Seat Reservation Notice:*
To avoid seat release or re-allocation to waitlisted candidates, please confirm your renewal before *{duedate}*.

📊 *Renewal Overview:*
• *Current Plan:* {planname}
• *Renewal Amount:* *₹{amount}*
• *Expiry Date:* *{duedate}*

Renew seamlessly at the reception or pay online. For any questions, call or WhatsApp us at *{phone}*.

Keep your study streak going strong! 📖
— *Front Office, {libraryname}*`,
  },
  {
    id: 'receipt',
    labelKey: 'WHATSAPP_TEMPLATE_RECEIPT',
    icon: '🧾',
    category: 'Finance & Audit',
    triggerEvent: 'Payment settlement completed',
    body: `*Payment Acknowledgment | {libraryname}* 💳

Dear *{name}*,
We gratefully acknowledge receipt of your library membership fee payment.

🧾 *Transaction Particulars:*
• *Student Name:* {name}
• *Seat Allocated:* {seat}
• *Membership Plan:* {planname}
• *Amount Received:* *₹{amount}*
• *Payment Status:* *Successful (Verified)*
• *Valid Until:* {duedate}

Your digital invoice has been registered in your student profile. Thank you for choosing {libraryname} as your learning space.

Helpdesk & Support: *{phone}*
— *Accounts & Billing Desk, {libraryname}*`,
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
  {
    id: 'absentee',
    labelKey: 'WHATSAPP_TEMPLATE_ABSENTEE',
    icon: '📅',
    category: 'Attendance & Safety',
    triggerEvent: 'Consecutive absence alert',
    body: `*Attendance Notification | {libraryname}* ⚠️

Dear Parent / Guardian,
This is an automated attendance alert regarding your ward *{name}* (Assigned Seat: *{seat}*).

📋 *Status Report:*
Our biometric & RFID access logs indicate that *{name}* has been absent from {libraryname} for consecutive study sessions as of today.

We prioritize student safety, regular study discipline, and academic progress. If this absence was planned or if you require an attendance summary report, please feel free to contact the branch manager at *{phone}*.

Best regards,
— *Student Welfare Desk, {libraryname}*`,
  },
  {
    id: 'ptp',
    labelKey: 'WHATSAPP_TEMPLATE_PTP',
    icon: '🤝',
    category: 'Credit Control',
    triggerEvent: 'Promise-to-Pay commitment date',
    body: `*Commitment Follow-up (PTP) | {libraryname}* 🤝

Dear *{name}*,
This is a courteous follow-up regarding your agreed Promise-to-Pay (PTP) commitment with library administration.

📌 *Commitment Record:*
• *Student Name:* {name}
• *Seat Reserved:* {seat}
• *Committed Amount:* *₹{amount}*
• *Committed Settlement Date:* *{duedate}*

We request you to complete this scheduled settlement by today to maintain uninterrupted seat reservation and facility privileges.

If you have already paid or need to discuss an installment adjustment, kindly visit the manager desk or contact us at *{phone}*.

Thank you for your cooperation!
— *Administration Desk, {libraryname}*`,
  },
];
