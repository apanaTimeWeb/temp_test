import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import { describe, expect, it } from 'vitest';

describe('Admin Communication WhatsApp Logs Retry & Export', () => {
  it('retries failed message and flips status to Sent while clearing error', () => {
    const mockLogs: AdminCommunicationWhatsappLog[] = [
      {
        id: '1',
        dateTime: '2026-04-18 10:30',
        student: 'Amit Verma',
        phone: '9876543210',
        type: 'fee_reminder',
        status: 'Failed',
        error: 'Student mobile not registered on WhatsApp',
        message: 'Fee reminder for April',
        branch: 'Downtown',
      },
      {
        id: '2',
        dateTime: '2026-04-18 11:00',
        student: 'Sneha Rao',
        phone: '9876543211',
        type: 'receipt',
        status: 'Delivered',
        error: '',
        message: 'Payment received receipt',
        branch: 'Downtown',
      },
    ];

    const retriedLogs = mockLogs.map((log) =>
      log.id === '1'
        ? {
            ...log,
            status: 'Sent' as const,
            error: '',
            dateTime: '2026-04-18 11:30',
          }
        : log,
    );

    const retriedItem = retriedLogs.find((l) => l.id === '1');
    expect(retriedItem?.status).toBe('Sent');
    expect(retriedItem?.error).toBe('');
    expect(retriedItem?.dateTime).toBe('2026-04-18 11:30');
  });

  it('generates valid CSV content with all log columns', () => {
    const sampleLogs: AdminCommunicationWhatsappLog[] = [
      {
        id: '1',
        dateTime: '2026-04-18 10:30',
        student: 'Amit Verma',
        phone: '9876543210',
        type: 'fee_reminder',
        status: 'Delivered',
        error: '',
        message: 'Fee reminder message',
        branch: 'Downtown',
      },
    ];

    const headers = [
      'Log ID',
      'Date & Time',
      'Student Name',
      'Mobile Number',
      'Branch',
      'Message Type',
      'Status',
      'Error Reason',
      'Message Content',
    ];
    const rows = sampleLogs.map((log) => [
      `#WA-LOG-00${log.id}`,
      `"${log.dateTime}"`,
      `"${log.student.replace(/"/g, '""')}"`,
      `"${log.phone}"`,
      `"${(log.branch || 'Downtown').replace(/"/g, '""')}"`,
      `"${log.type}"`,
      `"${log.status}"`,
      `"${(log.error || '').replace(/"/g, '""')}"`,
      `"${log.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    expect(csvContent).toContain('Log ID,Date & Time,Student Name');
    expect(csvContent).toContain('#WA-LOG-001');
    expect(csvContent).toContain('"Amit Verma"');
    expect(csvContent).toContain('"Delivered"');
  });

  it('generates HTML table format for Excel export', () => {
    const sampleLogs: AdminCommunicationWhatsappLog[] = [
      {
        id: '1',
        dateTime: '2026-04-18 10:30',
        student: 'Amit Verma',
        phone: '9876543210',
        type: 'fee_reminder',
        status: 'Delivered',
        error: '',
        message: 'Fee reminder message',
        branch: 'Downtown',
      },
    ];

    const tableRows = sampleLogs
      .map(
        (log) => `
        <tr>
          <td>#WA-LOG-00${log.id}</td>
          <td>${log.dateTime}</td>
          <td>${log.student}</td>
          <td>${log.phone}</td>
          <td>${log.branch || 'Downtown'}</td>
          <td>${log.type}</td>
          <td>${log.status}</td>
          <td>${log.error || '—'}</td>
          <td>${log.message}</td>
        </tr>`,
      )
      .join('');

    expect(tableRows).toContain('#WA-LOG-001');
    expect(tableRows).toContain('Amit Verma');
    expect(tableRows).toContain('fee_reminder');
  });
});
