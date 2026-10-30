import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';

/** Synthetic, read-only records shown only while the explicit frontend demo mode is enabled. */
export const ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES: AdminCommunicationWhatsappLog[] = [
  { id: '1', dateTime: '2026-04-12 10:45 AM', phone: '98****2310', student: 'Rahul Sharma', type: 'receipt', status: 'Delivered', error: '', message: `Dear Rahul, your payment of ₹1000 has been received. Receipt #R-2026-001. Thank you! — ${ADMIN_BRAND_CONFIG.displayName}` },
  { id: '2', dateTime: '2026-04-12 09:30 AM', phone: '97****8810', student: 'Priya Verma', type: 'renewal', status: 'Delivered', error: '', message: `Hi Priya, your subscription expires in 3 days on 15-Apr-2026. Please renew to continue access. — ${ADMIN_BRAND_CONFIG.displayName}` },
  { id: '3', dateTime: '2026-04-11 06:01 PM', phone: '89****1230', student: 'Amit Kumar', type: 'welcome', status: 'Delivered', error: '', message: `Welcome to ${ADMIN_BRAND_CONFIG.displayName}, Amit! Your seat S-03 (Morning shift) is confirmed. Smart ID: #003. — ${ADMIN_BRAND_CONFIG.displayName}` },
  { id: '4', dateTime: '2026-04-11 02:00 PM', phone: '73****5670', student: 'Sneha Patel', type: 'fee_reminder', status: 'Failed', error: 'Number not on WhatsApp', message: `Hi Sneha, your fee of ₹1000 is due on 15-Apr-2026. Please pay on time to avoid late charges. — ${ADMIN_BRAND_CONFIG.displayName}` },
  { id: '5', dateTime: '2026-04-10 11:00 AM', phone: '91****4430', student: 'Rohan Das', type: 'notice', status: 'Delivered', error: '', message: `Notice: Library will be closed on 14-Apr-2026 (Dr. Ambedkar Jayanti). Normal operations resume 15-Apr. — ${ADMIN_BRAND_CONFIG.displayName}` },
  { id: '6', dateTime: '2026-04-10 09:15 AM', phone: '98****0010', student: 'Kavita Singh', type: 'receipt', status: 'Sent', error: '', message: `Dear Kavita, your payment of ₹800 has been received. Receipt #R-2026-002. Thank you! — ${ADMIN_BRAND_CONFIG.displayName}` },
  { id: '7', dateTime: '2026-04-09 03:00 PM', phone: '96****7720', student: 'Deepak Mishra', type: 'fee_reminder', status: 'Pending', error: '', message: `Hi Deepak, your fee of ₹1200 is due on 10-Apr-2026. Please pay on time. — ${ADMIN_BRAND_CONFIG.displayName}` },
];
