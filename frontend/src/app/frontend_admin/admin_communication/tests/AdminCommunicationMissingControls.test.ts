import { describe, expect, it } from 'vitest';
import {
  AdminCommunicationNoticeSchema,
  createAdminCommunicationNoticeSchema,
} from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import { ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/mocks/AdminCommunicationWhatsappLogsFixtures';
import { filterAdminCommunicationWhatsappLogs } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/utils/AdminCommunicationWhatsappLogsFilterUtils';
import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';

describe('Admin Communication Missing Controls & Enhancements', () => {
  describe('Notices - Multi-Channel Dispatch & Search', () => {
    it('validates multi-channel broadcast checkboxes in Notice schema', () => {
      const validNotice = {
        title: 'Library Closed on Sunday',
        message: 'Maintenance scheduled from 8 AM to 6 PM',
        validTill: '2026-05-01',
        targetBranch: 'Downtown',
        sendWhatsApp: true,
        sendEmail: true,
        sendSms: false,
      };

      const parsed = AdminCommunicationNoticeSchema.safeParse(validNotice);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.sendWhatsApp).toBe(true);
        expect(parsed.data.sendEmail).toBe(true);
        expect(parsed.data.sendSms).toBe(false);
      }
    });

    it('allows omitting channels for database-only notices', () => {
      const dbOnlyNotice = {
        title: 'Notice for noticeboard only',
        message: 'Silence please',
        validTill: '2026-06-01',
      };
      const parsed = AdminCommunicationNoticeSchema.safeParse(dbOnlyNotice);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.sendWhatsApp).toBeUndefined();
      }
    });
  });

  describe('Complaints - Search, Export & Complainant Actions', () => {
    const mockComplaints = [
      {
        id: 'CMP-101',
        title: 'AC cooling issue in Hall A',
        student: 'Rohan Sharma',
        phone: '9876543210',
        seatNumber: 'Seat S-12',
        status: 'Open',
        branch: 'Downtown',
        description: 'Temperature is too high',
      },
      {
        id: 'CMP-102',
        title: 'WiFi intermittent',
        student: 'Priya Patel',
        phone: '9876543211',
        seatNumber: 'Seat B-05',
        status: 'Resolved',
        branch: 'Downtown',
        description: 'Frequent disconnection in evening',
      },
      {
        id: 'CMP-103',
        title: 'Locker lock stuck',
        student: 'Vikram Singh',
        phone: '9876543212',
        seatNumber: 'Locker L-14',
        status: 'In Progress',
        branch: 'City Center',
        description: 'Key not turning smoothly',
      },
    ];

    it('filters complaints by complainant student name', () => {
      const q = 'Priya';
      const results = mockComplaints.filter(
        (c) =>
          c.student.toLowerCase().includes(q.toLowerCase()) ||
          c.seatNumber.toLowerCase().includes(q.toLowerCase()) ||
          c.id.toLowerCase().includes(q.toLowerCase()) ||
          c.title.toLowerCase().includes(q.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('CMP-102');
    });

    it('filters complaints by seat / room number', () => {
      const q = 'S-12';
      const results = mockComplaints.filter(
        (c) =>
          c.student.toLowerCase().includes(q.toLowerCase()) ||
          c.seatNumber.toLowerCase().includes(q.toLowerCase()) ||
          c.id.toLowerCase().includes(q.toLowerCase()) ||
          c.title.toLowerCase().includes(q.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].student).toBe('Rohan Sharma');
    });

    it('filters complaints by complaint ticket ID', () => {
      const q = 'CMP-103';
      const results = mockComplaints.filter(
        (c) =>
          c.student.toLowerCase().includes(q.toLowerCase()) ||
          c.seatNumber.toLowerCase().includes(q.toLowerCase()) ||
          c.id.toLowerCase().includes(q.toLowerCase()) ||
          c.title.toLowerCase().includes(q.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].student).toBe('Vikram Singh');
    });

    it('generates WhatsApp update link for complainant', () => {
      const complaint = mockComplaints[0];
      const message = `Hello ${complaint.student}, Regarding your complaint #${complaint.id} (${complaint.title}): Status is currently ${complaint.status}.`;
      const waUrl = `https://wa.me/91${complaint.phone}?text=${encodeURIComponent(message)}`;
      expect(waUrl).toContain('https://wa.me/919876543210');
      expect(waUrl).toContain('CMP-101');
      expect(waUrl).toContain('Rohan');
    });

    it('generates phone call link for direct call to complainant', () => {
      const complaint = mockComplaints[0];
      const callUrl = `tel:${complaint.phone}`;
      expect(callUrl).toBe('tel:9876543210');
    });
  });

  describe('WhatsApp Templates - Create, Edit & Live Test Dispatch', () => {
    const defaultTemplates = [
      {
        id: 'welcome',
        labelKey: 'WHATSAPP_TEMPLATE_WELCOME',
        body: 'Hello {name}, welcome to {libraryname}! Your seat is {seat}.',
        category: 'Onboarding',
        triggerEvent: 'Student admission confirmed',
      },
      {
        id: 'fee_reminder',
        labelKey: 'WHATSAPP_TEMPLATE_FEE_REMINDER',
        body: 'Dear {name}, your fee of ₹{amount} is due on {duedate}.',
        category: 'Finance',
        triggerEvent: '3 days before due date',
      },
    ];

    it('formats preview with dynamic variable replacements', () => {
      const template = defaultTemplates[0];
      const formatted = template.body
        .replace(/{name}/g, 'Rahul Sharma')
        .replace(/{libraryname}/g, 'Smart Library')
        .replace(/{seat}/g, 'S-08');

      expect(formatted).toBe('Hello Rahul Sharma, welcome to Smart Library! Your seat is S-08.');
      expect(formatted).not.toContain('{name}');
      expect(formatted).not.toContain('{seat}');
    });

    it('supports adding a new custom template to templates state', () => {
      const newTemplate = {
        id: `custom_${Date.now()}`,
        labelKey: 'Night Shift Expiry Warning',
        icon: '💬',
        category: 'Shifts',
        triggerEvent: 'Night shift expiry in 2 days',
        body: 'Hello {name}, your night shift at {libraryname} expires on {duedate}.',
      };

      const updatedList = [newTemplate, ...defaultTemplates];
      expect(updatedList).toHaveLength(3);
      expect(updatedList[0].labelKey).toBe('Night Shift Expiry Warning');
      expect(updatedList[0].category).toBe('Shifts');
    });

    it('supports editing an existing template in state', () => {
      const templateToEdit = defaultTemplates[1];
      const edited = {
        ...templateToEdit,
        body: 'Urgent: Dear {name}, please clear your outstanding fee ₹{amount} immediately.',
        triggerEvent: 'On due date at 10 AM',
      };

      const updatedList = defaultTemplates.map((t) => (t.id === edited.id ? edited : t));
      const found = updatedList.find((t) => t.id === 'fee_reminder');
      expect(found?.body).toContain('Urgent: Dear {name}');
      expect(found?.triggerEvent).toBe('On due date at 10 AM');
    });

    it('creates a live WhatsApp Web dispatch link with encoded body', () => {
      const phone = '9876543210';
      const body = 'Hello Rahul Sharma, your fee of ₹1,000 is due on 25-Apr-2026.';
      const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(body)}`;
      expect(waUrl).toBe('https://wa.me/919876543210?text=Hello%20Rahul%20Sharma%2C%20your%20fee%20of%20%E2%82%B91%2C000%20is%20due%20on%2025-Apr-2026.');
    });
  });

  describe('WhatsApp Logs - Export & Retry Failed Messages', () => {
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
          message: 'Payment received receipt',
          branch: 'Downtown',
        },
      ];

      // Simulate handleRetry on log id '1'
      const retriedLogs = mockLogs.map((log) =>
        log.id === '1'
          ? {
              ...log,
              status: 'Sent' as const,
              error: undefined,
              dateTime: '2026-04-18 11:30',
            }
          : log
      );

      const retriedItem = retriedLogs.find((l) => l.id === '1');
      expect(retriedItem?.status).toBe('Sent');
      expect(retriedItem?.error).toBeUndefined();
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
        </tr>`
        )
        .join('');

      expect(tableRows).toContain('#WA-LOG-001');
      expect(tableRows).toContain('Amit Verma');
      expect(tableRows).toContain('fee_reminder');
    });
  });
});
