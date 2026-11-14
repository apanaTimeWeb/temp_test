// RESPONSIBILITY: Define local sample fixtures for communication whatsapp logs; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_communication/communication_whatsapp_logs/mocks/fixtures/SuperadminCommunicationWhatsappLogsWhatsappLogMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminCommunicationWhatsappLog } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/types/SuperadminCommunicationWhatsappLogsWhatsappTypes';

/** Synthetic sample rows only. These are not real message delivery records. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_SAMPLE_LOGS: SuperadminCommunicationWhatsappLog[] = [
  { id: 'sample-1', dateTime: '2026-04-12 10:45 AM', phone: '98****0001', student: 'Sample Student A', type: 'receipt', status: 'Delivered', error: '', message: 'Sample receipt notification. No payment or message was sent.' },
  { id: 'sample-2', dateTime: '2026-04-12 09:30 AM', phone: '97****0002', student: 'Sample Student B', type: 'renewal', status: 'Delivered', error: '', message: 'Sample renewal reminder. No notification was sent.' },
  { id: 'sample-3', dateTime: '2026-04-11 06:01 PM', phone: '89****0003', student: 'Sample Student C', type: 'welcome', status: 'Delivered', error: '', message: 'Sample welcome message. No notification was sent.' },
  { id: 'sample-4', dateTime: '2026-04-11 02:00 PM', phone: '73****0004', student: 'Sample Student D', type: 'fee_reminder', status: 'Failed', error: 'Illustrative sample failure; no message was attempted', message: 'Sample fee reminder. No payment or message was sent.' },
  { id: 'sample-5', dateTime: '2026-04-10 11:00 AM', phone: '91****0005', student: 'Sample Student E', type: 'notice', status: 'Delivered', error: '', message: 'Sample notice notification. No notice was sent.' },
  { id: 'sample-6', dateTime: '2026-04-10 09:15 AM', phone: '98****0006', student: 'Sample Student F', type: 'receipt', status: 'Sent', error: '', message: 'Sample receipt notification. No payment or message was sent.' },
  { id: 'sample-7', dateTime: '2026-04-09 03:00 PM', phone: '96****0007', student: 'Sample Student G', type: 'fee_reminder', status: 'Pending', error: '', message: 'Sample fee reminder. No notification was sent.' },
];
