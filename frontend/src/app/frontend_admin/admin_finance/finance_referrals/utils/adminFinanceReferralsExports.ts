import type { AdminFinanceDemoReferrer, ReferralPayoutVoucher } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { toast } from 'sonner';

export function exportReferralsCsv(filteredReferrers: readonly AdminFinanceDemoReferrer[], fallbackBranchName: string) {
  const headers = ['Rank', 'Referrer Student', 'Smart ID', 'Branch', 'Referred Count', 'Referred Students', 'Total Bonus Earned (INR)', 'Redeemed (INR)', 'Outstanding Balance (INR)'];
  const rows = filteredReferrers.map((r, i) => [
    i + 1,
    `"${r.name.replace(/"/g, '""')}"`,
    r.smartId,
    `"${(r.branch ?? fallbackBranchName).replace(/"/g, '""')}"`,
    r.referredNames.length,
    `"${r.referredNames.join(', ').replace(/"/g, '""')}"`,
    r.bonusEarned / 100,
    r.redeemed / 100,
    r.balance / 100,
  ]);
  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-finance-referral-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${filteredReferrers.length} referral records to CSV`, { id: 'admin-finance-referrals-export-csv' });
}

export function exportReferralsExcel(filteredReferrers: readonly AdminFinanceDemoReferrer[], fallbackBranchName: string) {
  const headers = ['Rank', 'Referrer Student', 'Smart ID', 'Branch', 'Referred Count', 'Referred Students', 'Total Bonus Earned (INR)', 'Redeemed (INR)', 'Outstanding Balance (INR)'];
  const rows = filteredReferrers.map((r, i) => [
    i + 1,
    r.name,
    r.smartId,
    r.branch ?? fallbackBranchName,
    r.referredNames.length,
    r.referredNames.join(', '),
    r.bonusEarned / 100,
    r.redeemed / 100,
    r.balance / 100,
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Referrals</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #4338ca; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #3730a3; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #eef2ff; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `.trim();
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-finance-referral-leaderboard-${new Date().toISOString().slice(0, 10)}.xls`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${filteredReferrers.length} referral records to Excel (.xls)`, { id: 'admin-finance-referrals-export-excel' });
}

export function printReferralsLeaderboard(
  filteredReferrers: readonly AdminFinanceDemoReferrer[],
  branchLabel: string,
  timeRangeLabel: string,
) {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=850,height=750');
  if (!printWindow) {
    window.print();
    return;
  }
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Smart Library - Referral Rewards Leaderboard</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 15px; }
          .title { font-size: 18px; font-weight: 800; color: #4338ca; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
          th { background: #4f46e5; color: #fff; padding: 8px; text-align: left; font-size: 11px; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">SMART LIBRARY NETWORK</div>
            <div style="font-size: 11px; color: #64748b;">Referral Rewards Program & Student Leaderboard · ${timeRangeLabel}</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            <div>Scope: ${branchLabel}</div>
            <div>Generated: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Referrer Name</th>
              <th>Smart ID</th>
              <th>Referred Count</th>
              <th style="text-align: right;">Total Bonus</th>
              <th style="text-align: right;">Redeemed</th>
              <th style="text-align: right;">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${filteredReferrers.map((r, i) => `
              <tr>
                <td>#${i + 1}</td>
                <td><strong>${r.name}</strong></td>
                <td>${r.smartId}</td>
                <td>${r.referredNames.length} students</td>
                <td style="text-align: right; font-weight: bold; color: #15803d;">₹${(r.bonusEarned / 100).toLocaleString('en-IN')}</td>
                <td style="text-align: right;">₹${(r.redeemed / 100).toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-weight: bold;">₹${(r.balance / 100).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Smart Library Student Ambassador & Referral Program · Certified by Accounts</p>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function buildReferralVoucherPrintHtml(voucher: ReferralPayoutVoucher, amountRupees: number) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Referral Bonus Payout Voucher - ${voucher.voucherId}</title>
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
          .logo { font-size: 16px; font-weight: 800; color: #047857; text-transform: uppercase; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
          .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
          th { background: #047857; color: #fff; padding: 6px; text-align: left; }
          td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
          .net-box { background: #ecfdf5; border: 2px solid #059669; border-radius: 6px; padding: 10px; text-align: right; margin-bottom: 15px; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; margin-top: 25px; }
          .signature-box { width: 180px; border-top: 1px solid #000; text-align: center; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SMART LIBRARY NETWORK</div>
            <div style="font-size: 11px; color: #64748b;">Referral Rewards & Student Payout Department · Branch: ${voucher.branch}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#dcfce7; color:#15803d;">REFERRAL PAYOUT VOUCHER</span>
            <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Voucher: ${voucher.voucherId}</div>
            <div style="font-size: 10px; color: #64748b;">Date: ${voucher.disbursedAt}</div>
          </div>
        </div>
        <div class="grid">
          <div class="box">
            <div class="box-title">Student Beneficiary</div>
            <div style="font-size: 13px; font-weight: bold;">${voucher.studentName}</div>
            <div>Smart ID: <strong>${voucher.smartId}</strong></div>
            <div>Branch: ${voucher.branch}</div>
          </div>
          <div class="box">
            <div class="box-title">Settlement Channel</div>
            <div>Mode: <strong>${voucher.mode === 'fee_adjustment' ? 'Adjusted in Next Month Desk Fee' : 'Direct Reward Payout (' + (voucher.subChannel || 'UPI') + ')'}</strong></div>
            ${voucher.invoiceCreditNote ? `<div>Credit Note Ref: <strong>${voucher.invoiceCreditNote}</strong></div>` : ''}
            ${voucher.utrReference ? `<div>Transaction UTR: <strong>${voucher.utrReference}</strong></div>` : ''}
            <div>Authorized By: <strong>${voucher.authorizedBy}</strong></div>
          </div>
        </div>
        <table>
          <thead><tr><th>Disbursement Particulars</th><th style="text-align: right;">Amount (INR)</th></tr></thead>
          <tbody>
            <tr>
              <td>Referral Bonus Earned Clearance (${voucher.studentName})</td>
              <td style="text-align: right; font-family: monospace; font-size: 13px; font-weight: bold;">₹${amountRupees.toLocaleString('en-IN')}.00</td>
            </tr>
            ${voucher.notes ? `<tr><td colspan="2" style="color: #64748b; font-size: 10px;"><strong>Accounting Remarks:</strong> ${voucher.notes}</td></tr>` : ''}
          </tbody>
        </table>
        <div class="net-box">
          <span style="font-size: 12px; color: #065f46; font-weight: bold;">TOTAL DISBURSED BONUS: </span>
          <span style="font-size: 18px; font-weight: 800; color: #047857;">₹${amountRupees.toLocaleString('en-IN')}.00</span>
        </div>
        <div class="footer">
          <div class="signature-box"><span>Student Signature / Acknowledgement</span><br/><small style="color: #64748b;">(${voucher.studentName})</small></div>
          <div class="signature-box"><span>Admin / Cashier Signature</span><br/><small style="color: #64748b;">(Smart Library Accounts)</small></div>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
}
