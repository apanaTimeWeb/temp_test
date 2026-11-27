import type { StaffSalaryRecord } from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';
import { toast } from 'sonner';

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportStaffPayrollCsv(records: readonly StaffSalaryRecord[], selectedMonth: string): void {
  if (records.length === 0) {
    toast.info('No payroll records to export', { id: 'admin-staff-payroll-empty-csv' });
    return;
  }
  const headers = [
    'Staff ID', 'Staff Name', 'Role', 'Branch', 'Month',
    'Base Salary (₹)', 'Allowances (₹)', 'Deductions (₹)', 'Advance Settled (₹)', 'Net Payable (₹)',
    'Status', 'Bank Name', 'Account Number', 'IFSC Code', 'Payment Method', 'Transaction Ref / UTR', 'Disbursed At',
  ];
  const rows = records.map((r) => [
    `"${r.staffId}"`, `"${r.staffName.replace(/"/g, '""')}"`, `"${r.role}"`, `"${r.branchName}"`, `"${r.month}"`,
    r.baseSalary, r.allowances, r.deductions, r.advanceSalaryDeduction || 0, r.netPayable,
    `"${r.status}"`, `"${r.bankDetails.bankName}"`, `"${r.bankDetails.accountNoMasked}"`, `"${r.bankDetails.ifsc}"`,
    `"${r.paymentMethod || '—'}"`, `"${r.transactionRef || '—'}"`, `"${r.disbursedAt || '—'}"`,
  ]);
  const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, `admin-staff-payroll-register-${selectedMonth || 'all'}.csv`);
  toast.success(`Exported ${records.length} payroll records to CSV`, { id: 'admin-staff-payroll-csv' });
}

export function exportStaffPayrollExcel(records: readonly StaffSalaryRecord[], selectedMonth: string): void {
  if (records.length === 0) {
    toast.info('No payroll records to export', { id: 'admin-staff-payroll-empty-excel' });
    return;
  }
  const tableRows = records.map((r) => `
    <tr>
      <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${r.staffId}</td>
      <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${r.staffName}</td>
      <td style="padding:6px;border:1px solid #ccc;">${r.role}</td>
      <td style="padding:6px;border:1px solid #ccc;">${r.branchName}</td>
      <td style="padding:6px;border:1px solid #ccc;">${r.month}</td>
      <td style="padding:6px;border:1px solid #ccc;text-align:right;">₹${r.baseSalary.toLocaleString('en-IN')}</td>
      <td style="padding:6px;border:1px solid #ccc;text-align:right;color:#059669;">+₹${r.allowances.toLocaleString('en-IN')}</td>
      <td style="padding:6px;border:1px solid #ccc;text-align:right;color:#dc2626;">-₹${r.deductions.toLocaleString('en-IN')}</td>
      <td style="padding:6px;border:1px solid #ccc;text-align:right;color:#d97706;">-₹${(r.advanceSalaryDeduction || 0).toLocaleString('en-IN')}</td>
      <td style="padding:6px;border:1px solid #ccc;text-align:right;font-weight:bold;color:#047857;">₹${r.netPayable.toLocaleString('en-IN')}</td>
      <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${r.status}</td>
      <td style="padding:6px;border:1px solid #ccc;">${r.bankDetails.bankName}</td>
      <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${r.bankDetails.accountNoMasked}</td>
      <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${r.bankDetails.ifsc}</td>
      <td style="padding:6px;border:1px solid #ccc;">${r.paymentMethod || '—'}</td>
      <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${r.transactionRef || '—'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${r.disbursedAt || '—'}</td>
    </tr>`).join('');

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/><title>Staff Payroll & Bank Disbursement Register</title><style>table{border-collapse:collapse;width:100%;font-family:sans-serif;font-size:11px;}th{background-color:#0f172a;color:#ffffff;padding:8px;border:1px solid #334155;text-align:left;}td{padding:6px;border:1px solid #cbd5e1;}</style></head><body><h2>Smart Library Network · Staff Payroll Register</h2><p>Disbursement Period: ${selectedMonth} | Total Records: ${records.length} | Generated: ${new Date().toLocaleString('en-IN')}</p><table><thead><tr><th>Staff ID</th><th>Name</th><th>Role</th><th>Branch</th><th>Month</th><th>Base Salary</th><th>Allowances</th><th>Deductions</th><th>Advance Settled</th><th>Net Payable</th><th>Status</th><th>Bank Name</th><th>Account No</th><th>IFSC</th><th>Payment Method</th><th>UTR / Ref</th><th>Disbursed At</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
  triggerDownload(new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }), `admin-staff-payroll-register-${selectedMonth || 'all'}.xls`);
  toast.success(`Exported ${records.length} payroll records to Excel (.xls)`, { id: 'admin-staff-payroll-excel' });
}

export function sharePayrollSlipWhatsApp(record: StaffSalaryRecord): void {
  const slipText = `*Smart Library - Monthly Salary Slip*\n` +
    `Employee: ${record.staffName} (${record.staffId})\n` +
    `Designation: ${record.role}\nBranch: ${record.branchName}\nMonth: ${record.month}\n---------------------------\n` +
    `• Basic Salary: ₹${record.baseSalary.toLocaleString('en-IN')}\n` +
    `• Allowances / Bonus: +₹${record.allowances.toLocaleString('en-IN')}\n` +
    `• Deductions: -₹${record.deductions.toLocaleString('en-IN')}\n` +
    (record.advanceSalaryDeduction > 0 ? `• Advance Settled: -₹${record.advanceSalaryDeduction.toLocaleString('en-IN')}\n` : '') +
    `---------------------------\n*Net Take-Home: ₹${record.netPayable.toLocaleString('en-IN')}*\n` +
    `Status: ${record.status}\nBank: ${record.bankDetails.bankName} (${record.bankDetails.accountNoMasked})\n` +
    (record.transactionRef ? `Ref / UTR: ${record.transactionRef}\n` : '') +
    `---------------------------\nOfficial system generated salary slip from Smart Library Network Administration.`;
  if (typeof window !== 'undefined') {
    window.open(`https://wa.me/?text=${encodeURIComponent(slipText)}`, '_blank', 'noopener,noreferrer');
  }
}
