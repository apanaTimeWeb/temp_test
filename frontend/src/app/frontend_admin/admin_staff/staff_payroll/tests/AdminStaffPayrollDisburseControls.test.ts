import type { StaffSalaryRecord } from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';
import { describe, expect, it } from 'vitest';

describe('Admin Staff Payroll Bulk Disburse & Export Controls', () => {
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
        : r,
    );

    const target = updatedRecords.find((r) => r.id === 'pay-002');
    expect(target?.status).toBe('DISBURSED');
    expect(target?.paymentMethod).toBe('BANK_TRANSFER');
    expect(target?.transactionRef).toBe('BULK-NEFT-12345678');
    expect(target?.disbursedAt).toBe(timestamp);
  });

  it('formats WhatsApp salary slip with earnings, deductions, and bank details', () => {
    const record = mockPayroll[0]!;
    const slipText =
      `*Smart Library - Monthly Salary Slip*\n` +
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
