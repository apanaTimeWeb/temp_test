import type { WaiverSlipPreview } from '@/app/frontend_admin/admin_members/members_directory/utils/adminMembersDirectoryDetailData';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';

function escapeHtml(value: string): string {
  return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function printMemberDossierHtml(member: AdminMembersMember): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700,noopener,noreferrer');
  if (!printWindow) { window.print(); return; }
  printWindow.opener = null;
  const html = `
    <!DOCTYPE html><html><head><title>Member Dossier - ${escapeHtml(member.name)} (${escapeHtml(member.id)})</title>
      <style>
        @page { size: portrait; margin: 12mm; }
        body { font-family: system-ui, sans-serif; color: #0f172a; padding: 15px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
        .title { font-size: 20px; font-weight: bold; } table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 8px 12px; border: 1px solid #cbd5e1; font-size: 12px; text-align: left; } th { background: #f1f5f9; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="header"><div><div class="title">Smart Library Network · Member Dossier</div><p>Confidential Admin Record · ID: ${escapeHtml(member.id)}</p></div>
      <div><p><strong>Status:</strong> ${escapeHtml(member.status)}</p><p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-IN')}</p></div></div>
      <table>
        <tr><th>Full Name</th><td>${escapeHtml(member.name)}</td><th>Member ID</th><td>${escapeHtml(member.id)}</td></tr>
        <tr><th>Email</th><td>${escapeHtml(member.email)}</td><th>Phone</th><td>${escapeHtml(member.phone)}</td></tr>
        <tr><th>Branch</th><td>${escapeHtml(member.branch || 'Downtown Central')}</td><th>Seat / Shift</th><td>${escapeHtml(member.seat || 'A-01')} · ${escapeHtml(member.shift || 'General')}</td></tr>
        <tr><th>Plan</th><td>${escapeHtml(member.plan)}</td><th>Expiry Date</th><td>${escapeHtml(member.expiryDate || '—')}</td></tr>
        <tr><th>Fee Status</th><td>${escapeHtml(member.feeStatus || 'Paid')}</td><th>Locker</th><td>${escapeHtml(member.locker || 'L-02')}</td></tr>
      </table>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printWaiverSlipHtml(member: AdminMembersMember, slip: WaiverSlipPreview): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=800,height=600,noopener,noreferrer');
  if (!printWindow) return;
  printWindow.opener = null;
  printWindow.document.open?.();
  printWindow.document.write(`
    <html><head><title>Special Concession Order - ${escapeHtml(slip.id)}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; }
        .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { margin: 0; color: #0f172a; font-size: 24px; } .header p { margin: 4px 0 0; color: #64748b; font-size: 13px; }
        .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 12px; margin-bottom: 16px; }
        .meta { margin-bottom: 24px; width: 100%; border-collapse: collapse; }
        .meta td { padding: 6px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
        .meta td:first-child { font-weight: 600; color: #475569; width: 200px; }
        .amount-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
        .amount-box .val { font-size: 28px; font-weight: 800; color: #15803d; }
        .footer { margin-top: 48px; border-top: 1px solid #cbd5e1; padding-top: 24px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
        .sig { text-align: right; } .sig-line { width: 180px; border-top: 1px solid #334155; margin-top: 40px; text-align: center; padding-top: 4px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header"><h1>SMART LIBRARY MANAGEMENT NETWORK</h1><p>Official Discretionary Fee Concession & Waiver Order</p></div>
      <div class="badge">OFFICIAL ADMIN CREDIT ORDER: ${escapeHtml(slip.id)}</div>
      <table class="meta">
        <tr><td>Order Reference:</td><td><strong>${escapeHtml(slip.id)}</strong></td></tr>
        <tr><td>Student Name:</td><td><strong>${escapeHtml(member.name)} (${escapeHtml(member.id)})</strong></td></tr>
        <tr><td>Branch Allotted:</td><td>${escapeHtml(member.branch || 'Downtown Central')}</td></tr>
        <tr><td>Waiver Category:</td><td>${escapeHtml(slip.category)}</td></tr>
        <tr><td>Sanction Date:</td><td>${escapeHtml(slip.date)}</td></tr>
        <tr><td>Admin Justification:</td><td>${escapeHtml(slip.reason)}</td></tr>
      </table>
      <div class="amount-box"><div style="font-size: 13px; font-weight: 600; color: #166534; text-transform: uppercase;">Sanctioned Waiver / Discount Amount</div><div class="val">${escapeHtml(slip.amount)}</div><div style="font-size: 12px; color: #15803d; margin-top: 4px;">Adjusted against student dues via Admin Credit Authority</div></div>
      <div class="footer"><div><p>Issued by: Central Operations Administration</p><p>Policy: Section 4(B) - Discretionary Concession Rules</p></div><div class="sig"><div class="sig-line">Master Admin Authorization</div></div></div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `);
  printWindow.document.close();
}
