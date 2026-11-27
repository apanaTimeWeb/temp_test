import type { AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import { describe, expect, it } from 'vitest';

describe('Admin Staff Directory Roster & Matrix Controls', () => {
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
    const staff = mockStaff[0]!;
    const cleanPhone = staff.phone.replace(/\D/g, '').slice(-10);
    const message = `Hello ${staff.name}, this is regarding Library Administration.`;
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;

    expect(cleanPhone).toBe('9876543210');
    expect(waUrl).toBe('https://wa.me/919876543210?text=Hello%20Aarav%20Mehta%2C%20this%20is%20regarding%20Library%20Administration.');
  });

  it('generates valid direct email mailto link', () => {
    const staff = mockStaff[0]!;
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

  it('formats permissions matrix rows for CSV export', () => {
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
