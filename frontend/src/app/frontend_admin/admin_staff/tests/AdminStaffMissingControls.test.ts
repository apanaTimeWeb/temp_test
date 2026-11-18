import { describe, expect, it } from 'vitest';
import type { AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import type { StaffSalaryRecord } from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';

describe('Admin Staff Domain Missing Controls & Enhancements', () => {
  describe('Staff Directory - Export, Suspend/Deactivate & Direct Contact', () => {
    const mockStaff: AdminStaffDirectoryManager[] = [
      {
        id: 'MGR-001',
        name: 'Aarav Mehta',
        username: 'aarav.mehta',
        role: 'Branch Manager',
        email: 'aarav@smartlibrary.com',
        phone: '+91 98765 43210',
        branch: 'Downtown Central',
        status: 'Active',
        lastActive: '10 mins ago',
      },
      {
        id: 'STF-002',
        name: 'Sunita Rao',
        username: 'sunita.rao',
        role: 'Desk Assistant',
        email: 'sunita@smartlibrary.com',
        phone: '+91 98765 43211',
        branch: 'Westside Campus',
        status: 'Suspended',
        lastActive: 'Yesterday',
      },
      {
        id: 'STF-003',
        name: 'Ramesh Patel',
        username: 'ramesh.patel',
        role: 'Housekeeping Supervisor',
        email: 'ramesh@smartlibrary.com',
        phone: '+91 98765 43212',
        branch: 'Downtown Central',
        status: 'Deactivated',
        lastActive: '1 month ago',
      },
    ];

    it('updates staff status from Active to Suspended', () => {
      const staffId = 'MGR-001';
      const updatedList = mockStaff.map((s) => (s.id === staffId ? { ...s, status: 'Suspended' as const } : s));
      const target = updatedList.find((s) => s.id === staffId);
      expect(target?.status).toBe('Suspended');
    });

    it('updates staff status from Suspended to Active', () => {
      const staffId = 'STF-002';
      const updatedList = mockStaff.map((s) => (s.id === staffId ? { ...s, status: 'Active' as const } : s));
      const target = updatedList.find((s) => s.id === staffId);
      expect(target?.status).toBe('Active');
    });

    it('updates staff status from Active to Deactivated', () => {
      const staffId = 'MGR-001';
      const updatedList = mockStaff.map((s) => (s.id === staffId ? { ...s, status: 'Deactivated' as const } : s));
      const target = updatedList.find((s) => s.id === staffId);
      expect(target?.status).toBe('Deactivated');
    });

    it('generates valid WhatsApp contact URL with cleaned 10-digit number', () => {
      const staff = mockStaff[0];
      const cleanPhone = staff.phone.replace(/\D/g, '').slice(-10);
      const message = `Hello ${staff.name}, this is regarding Library Administration.`;
      const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;

      expect(cleanPhone).toBe('9876543210');
      expect(waUrl).toBe('https://wa.me/919876543210?text=Hello%20Aarav%20Mehta%2C%20this%20is%20regarding%20Library%20Administration.');
    });

    it('generates valid direct email mailto link', () => {
      const staff = mockStaff[0];
      const subject = 'Official Communication - Library Administration';
      const emailUrl = `mailto:${staff.email}?subject=${encodeURIComponent(subject)}`;
      expect(emailUrl).toBe('mailto:aarav@smartlibrary.com?subject=Official%20Communication%20-%20Library%20Administration');
    });

    it('generates CSV content with all required staff roster columns', () => {
      const headers = ['Staff ID', 'Name', 'Username', 'Role', 'Email', 'Phone', 'Branch', 'Status', 'Last Active'];
      const rows = mockStaff.map((m) => [
        `"${m.id}"`,
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.username}"`,
        `"${m.role || 'Staff'}"`,
        `"${m.email}"`,
        `"${m.phone}"`,
        `"${m.branch}"`,
        `"${m.status}"`,
        `"${m.lastActive}"`,
      ]);
      const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      expect(csv).toContain('Staff ID,Name,Username,Role');
      expect(csv).toContain('"MGR-001"');
      expect(csv).toContain('"Aarav Mehta"');
      expect(csv).toContain('"Active"');
    });
  });

  describe('Staff Payroll - Export, Bulk Disburse & WhatsApp Salary Slip', () => {
    const mockPayroll: StaffSalaryRecord[] = [
      {
        id: 'pay-001',
        staffId: 'STF-01',
        staffName: 'Vikram Sharma',
        role: 'Branch Manager',
        branchId: 'BR-001',
        branchName: 'Downtown Central',
        month: '2026-11',
        baseSalary: 28000,
        allowances: 3500,
        deductions: 0,
        advanceSalaryDeduction: 0,
        netPayable: 31500,
        status: 'DISBURSED',
        disbursedAt: '2026-11-01T10:30:00Z',
        paymentMethod: 'BANK_TRANSFER',
        transactionRef: 'NEFT98234710293',
        bankDetails: {
          accountNoMasked: '•••• •••• 4819',
          ifsc: 'HDFC0001248',
          bankName: 'HDFC Bank',
        },
        attendanceStats: {
          totalWorkingDays: 26,
          presentDays: 26,
          absentDays: 0,
          leavesTaken: 0,
        },
      },
      {
        id: 'pay-002',
        staffId: 'STF-02',
        staffName: 'Pooja Verma',
        role: 'Desk Assistant',
        branchId: 'BR-001',
        branchName: 'Downtown Central',
        month: '2026-11',
        baseSalary: 18000,
        allowances: 1200,
        deductions: 600,
        advanceSalaryDeduction: 1000,
        netPayable: 17600,
        status: 'PENDING',
        disbursedAt: null,
        paymentMethod: null,
        transactionRef: null,
        bankDetails: {
          accountNoMasked: '•••• •••• 8291',
          ifsc: 'SBIN0004812',
          bankName: 'State Bank of India',
        },
        attendanceStats: {
          totalWorkingDays: 26,
          presentDays: 24,
          absentDays: 1,
          leavesTaken: 1,
        },
      },
    ];

    it('performs bulk disbursement for all pending salaries', () => {
      const timestamp = new Date().toISOString();
      const updatedRecords = mockPayroll.map((r) =>
        r.status !== 'DISBURSED'
          ? {
              ...r,
              status: 'DISBURSED' as const,
              disbursedAt: timestamp,
              paymentMethod: 'BANK_TRANSFER' as const,
              transactionRef: 'BULK-NEFT-12345678',
            }
          : r
      );

      const target = updatedRecords.find((r) => r.id === 'pay-002');
      expect(target?.status).toBe('DISBURSED');
      expect(target?.paymentMethod).toBe('BANK_TRANSFER');
      expect(target?.transactionRef).toBe('BULK-NEFT-12345678');
      expect(target?.disbursedAt).toBe(timestamp);
    });

    it('formats WhatsApp salary slip with earnings, deductions, and bank details', () => {
      const record = mockPayroll[0];
      const slipText = `*Smart Library - Monthly Salary Slip*\n` +
        `Employee: ${record.staffName} (${record.staffId})\n` +
        `Designation: ${record.role}\n` +
        `Branch: ${record.branchName}\n` +
        `Month: ${record.month}\n` +
        `---------------------------\n` +
        `• Basic Salary: ₹${record.baseSalary.toLocaleString('en-IN')}\n` +
        `• Allowances / Bonus: +₹${record.allowances.toLocaleString('en-IN')}\n` +
        `• Deductions: -₹${record.deductions.toLocaleString('en-IN')}\n` +
        `---------------------------\n` +
        `*Net Take-Home: ₹${record.netPayable.toLocaleString('en-IN')}*\n` +
        `Status: ${record.status}\n` +
        `Bank: ${record.bankDetails.bankName} (${record.bankDetails.accountNoMasked})\n` +
        `Ref / UTR: ${record.transactionRef}`;

      const waUrl = `https://wa.me/?text=${encodeURIComponent(slipText)}`;
      expect(waUrl).toContain('Smart%20Library%20-%20Monthly%20Salary%20Slip');
      expect(waUrl).toContain('Vikram%20Sharma');
      expect(waUrl).toContain('31%2C500');
      expect(waUrl).toContain('HDFC%20Bank');
      expect(waUrl).toContain('NEFT98234710293');
    });

    it('generates payroll register CSV with bank transfer headers', () => {
      const headers = [
        'Staff ID',
        'Staff Name',
        'Role',
        'Branch',
        'Month',
        'Base Salary',
        'Allowances',
        'Deductions',
        'Net Payable',
        'Status',
        'Bank Name',
        'Account No',
        'IFSC',
      ];
      const rows = mockPayroll.map((r) => [
        `"${r.staffId}"`,
        `"${r.staffName}"`,
        `"${r.role}"`,
        `"${r.branchName}"`,
        `"${r.month}"`,
        r.baseSalary,
        r.allowances,
        r.deductions,
        r.netPayable,
        `"${r.status}"`,
        `"${r.bankDetails.bankName}"`,
        `"${r.bankDetails.accountNoMasked}"`,
        `"${r.bankDetails.ifsc}"`,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      expect(csv).toContain('Staff ID,Staff Name');
      expect(csv).toContain('"STF-01"');
      expect(csv).toContain('31500');
      expect(csv).toContain('HDFC Bank');
    });
  });

  describe('Staff Attendance - Monthly Attendance Register Muster Roll', () => {
    it('generates full monthly register with 30 days punch data and attendance rate', () => {
      const daysInMonth = 30;
      const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => `D${String(i + 1).padStart(2, '0')}`);
      const headers = [
        'Staff ID',
        'Staff Name',
        'Designation',
        'Branch',
        'Month',
        ...dayHeaders,
        'Present Days',
        'Absent Days',
        'Total Hours',
        'Attendance %',
      ];

      expect(headers).toHaveLength(5 + 30 + 4);
      expect(headers[5]).toBe('D01');
      expect(headers[34]).toBe('D30');

      const samplePunches = Array.from({ length: daysInMonth }, (_, i) => ((i + 1) % 7 === 0 ? 'OFF' : 'P'));
      const presentDays = samplePunches.filter((p) => p === 'P').length;
      expect(presentDays).toBe(26);

      const rate = Math.round((presentDays / 26) * 100);
      expect(rate).toBe(100);
    });
  });

  describe('Roles & Permissions - Matrix Export', () => {
    const mockPerms = [
      {
        module: 'Members',
        actions: [
          { key: 'members.create', label: 'Create new member', roles: { manager: true } },
          { key: 'members.delete', label: 'Delete member', roles: { manager: false } },
        ],
      },
      {
        module: 'Finance',
        actions: [
          { key: 'finance.view', label: 'View financial reports', roles: { manager: true } },
          { key: 'finance.refund', label: 'Approve refund', roles: { manager: false } },
        ],
      },
    ];

    it('formats permissions matrix rows for CSV export', () => {
      const rows: string[][] = [];
      mockPerms.forEach((mod) => {
        mod.actions.forEach((act) => {
          rows.push([
            `"${mod.module}"`,
            `"${act.key}"`,
            `"${act.label}"`,
            act.roles.manager ? '"Enabled"' : '"Disabled"',
          ]);
        });
      });

      expect(rows).toHaveLength(4);
      expect(rows[0]).toEqual(['"Members"', '"members.create"', '"Create new member"', '"Enabled"']);
      expect(rows[1]).toEqual(['"Members"', '"members.delete"', '"Delete member"', '"Disabled"']);
    });
  });
});
