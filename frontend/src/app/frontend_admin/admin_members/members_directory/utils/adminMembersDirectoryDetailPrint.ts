import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';

export type WaiverCategory = 'EWS_ASSISTANCE' | 'MERIT_SCHOLARSHIP' | 'LATE_FEE_WAIVER' | 'SPECIAL_ADMIN_DISCRETION';

export interface MemberPaymentRecord {
  id: string;
  date: string;
  title: string;
  amount: string;
  mode: string;
  ref: string;
  status: string;
  isWaiver: boolean;
  category: string;
  reason: string;
}

export interface WaiverSlipPreview {
  id: string;
  date: string;
  title: string;
  amount: string;
  category: string;
  reason: string;
}

export interface ReceiptPreview {
  id: string;
  date: string;
  title: string;
  amount: string;
  mode: string;
  ref: string;
}

export interface DocPreview {
  type: string;
  number: string;
  fileName: string;
  note?: string;
}

export const WAIVER_CATEGORY_LABELS: Record<WaiverCategory, string> = {
  EWS_ASSISTANCE: 'EWS Financial Concession',
  MERIT_SCHOLARSHIP: 'Merit Scholarship Concession',
  LATE_FEE_WAIVER: 'Late Fee Penalty Waive-Off',
  SPECIAL_ADMIN_DISCRETION: 'Admin Discretion Discount',
};

function escapeHtml(value: string): string {
  return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function printMemberDossierHtml(member: AdminMembersMember): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) { window.print(); return; }
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Member Dossier - ${escapeHtml(member.name)} (${escapeHtml(member.id)})</title>
        <style>
          @page { size: portrait; margin: 12mm; }
          body { font-family: system-ui, sans-serif; color: #0f172a; padding: 15px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
          .title { font-size: 20px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 8px 12px; border: 1px solid #cbd5e1; font-size: 12px; text-align: left; }
          th { background: #f1f5f9; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="header">
          <div><div class="title">Smart Library Network · Member Dossier</div><p>Confidential Admin Record · ID: ${escapeHtml(member.id)}</p></div>
          <div><p><strong>Status:</strong> ${escapeHtml(member.status)}</p><p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-IN')}</p></div>
        </div>
        <table>
          <tr><th>Full Name</th><td>${escapeHtml(member.name)}</td><th>Member ID</th><td>${escapeHtml(member.id)}</td></tr>
          <tr><th>Email</th><td>${escapeHtml(member.email)}</td><th>Phone</th><td>${escapeHtml(member.phone)}</td></tr>
          <tr><th>Branch</th><td>${escapeHtml(member.branch || 'Downtown Central')}</td><th>Seat / Shift</th><td>${escapeHtml(member.seat || 'A-01')} · ${escapeHtml(member.shift || 'General')}</td></tr>
          <tr><th>Plan</th><td>${escapeHtml(member.plan)}</td><th>Expiry Date</th><td>${escapeHtml(member.expiryDate || '—')}</td></tr>
          <tr><th>Fee Status</th><td>${escapeHtml(member.feeStatus || 'Paid')}</td><th>Locker</th><td>${escapeHtml(member.locker || 'L-02')}</td></tr>
        </table>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printWaiverSlipHtml(member: AdminMembersMember, slip: WaiverSlipPreview): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>Special Concession Order - ${escapeHtml(slip.id)}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; color: #0f172a; font-size: 24px; }
          .header p { margin: 4px 0 0; color: #64748b; font-size: 13px; }
          .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 12px; margin-bottom: 16px; }
          .meta { margin-bottom: 24px; width: 100%; border-collapse: collapse; }
          .meta td { padding: 6px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
          .meta td:first-child { font-weight: 600; color: #475569; width: 200px; }
          .amount-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
          .amount-box .val { font-size: 28px; font-weight: 800; color: #15803d; }
          .footer { margin-top: 48px; border-top: 1px solid #cbd5e1; padding-top: 24px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
          .sig { text-align: right; }
          .sig-line { width: 180px; border-top: 1px solid #334155; margin-top: 40px; text-align: center; padding-top: 4px; font-weight: bold; }
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
        <div class="amount-box">
          <div style="font-size: 13px; font-weight: 600; color: #166534; text-transform: uppercase;">Sanctioned Waiver / Discount Amount</div>
          <div class="val">${escapeHtml(slip.amount)}</div>
          <div style="font-size: 12px; color: #15803d; margin-top: 4px;">Adjusted against student dues via Admin Credit Authority</div>
        </div>
        <div class="footer">
          <div><p>Issued by: Central Operations Administration</p><p>Policy: Section 4(B) - Discretionary Concession Rules</p></div>
          <div class="sig"><div class="sig-line">Master Admin Authorization</div></div>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function buildMemberAttendance(member: AdminMembersMember, month: 'nov' | 'oct') {
  const shift = member.shift || 'Morning';
  return month === 'nov'
    ? [
        { date: '04 Nov 2026', checkIn: '08:02 AM', checkOut: '02:15 PM', hours: '6h 13m', shift, gate: 'Turnstile 1', status: 'Present' },
        { date: '03 Nov 2026', checkIn: '08:14 AM', checkOut: '02:00 PM', hours: '5h 46m', shift, gate: 'Turnstile 1', status: 'Present' },
        { date: '02 Nov 2026', checkIn: '08:35 AM', checkOut: '02:30 PM', hours: '5h 55m', shift, gate: 'Turnstile 2', status: 'Late Punch' },
        { date: '01 Nov 2026', checkIn: '07:55 AM', checkOut: '02:05 PM', hours: '6h 10m', shift, gate: 'Turnstile 1', status: 'Present' },
        { date: '31 Oct 2026', checkIn: '08:05 AM', checkOut: '02:10 PM', hours: '6h 05m', shift, gate: 'Turnstile 1', status: 'Present' },
        { date: '30 Oct 2026', checkIn: '08:00 AM', checkOut: '02:00 PM', hours: '6h 00m', shift, gate: 'Turnstile 1', status: 'Present' },
        { date: '29 Oct 2026', checkIn: '08:10 AM', checkOut: '02:20 PM', hours: '6h 10m', shift, gate: 'Turnstile 1', status: 'Present' },
      ]
    : [
        { date: '28 Oct 2026', checkIn: '08:04 AM', checkOut: '02:00 PM', hours: '5h 56m', shift, gate: 'Turnstile 1', status: 'Present' },
        { date: '27 Oct 2026', checkIn: '08:12 AM', checkOut: '02:10 PM', hours: '5h 58m', shift, gate: 'Turnstile 1', status: 'Present' },
        { date: '26 Oct 2026', checkIn: '08:00 AM', checkOut: '02:00 PM', hours: '6h 00m', shift, gate: 'Turnstile 1', status: 'Present' },
        { date: '25 Oct 2026', checkIn: '08:22 AM', checkOut: '02:30 PM', hours: '6h 08m', shift, gate: 'Turnstile 2', status: 'Late Punch' },
      ];
}

export function buildMemberRenewals(member: AdminMembersMember, memberIdClean: string) {
  return [
    { id: `REN-2026-${memberIdClean}4`, date: '01 Nov 2026', plan: member.plan, extendedTo: member.expiryDate || '30 Nov 2026', amount: '₹6,500', mode: 'UPI (PhonePe)', staff: 'Admin Desk', status: 'Completed' },
    { id: `REN-2026-${memberIdClean}3`, date: '01 Oct 2026', plan: member.plan, extendedTo: '31 Oct 2026', amount: '₹6,500', mode: 'UPI (GPay)', staff: 'Staff Roster', status: 'Completed' },
    { id: `REN-2026-${memberIdClean}2`, date: '01 Sep 2026', plan: member.plan, extendedTo: '30 Sep 2026', amount: '₹6,500', mode: 'Card (Debit)', staff: 'Staff Roster', status: 'Completed' },
    { id: `REN-2026-${memberIdClean}1`, date: '01 Aug 2026', plan: member.plan, extendedTo: '31 Aug 2026', amount: '₹6,500', mode: 'Cash', staff: 'Accounts Desk', status: 'Completed' },
  ];
}

export function buildInitialMemberPayments(member: AdminMembersMember, memberIdClean: string): MemberPaymentRecord[] {
  return [
    { id: `RCP-2026-${memberIdClean}4`, date: '01 Nov 2026', title: `Monthly Subscription Fee (${member.plan})`, amount: '₹6,500', mode: 'UPI (Ref: UPI/391082)', ref: 'UPI-9842109', status: 'Paid', isWaiver: false, category: 'Subscription', reason: '' },
    { id: `RCP-2026-${memberIdClean}3`, date: '01 Oct 2026', title: `Monthly Subscription Fee (${member.plan})`, amount: '₹6,500', mode: 'UPI (Ref: UPI/281093)', ref: 'UPI-8719203', status: 'Paid', isWaiver: false, category: 'Subscription', reason: '' },
    { id: `RCP-2026-${memberIdClean}2`, date: '01 Sep 2026', title: `Monthly Subscription Fee (${member.plan})`, amount: '₹6,500', mode: 'Card (Ref: TXN-94021)', ref: 'CARD-591024', status: 'Paid', isWaiver: false, category: 'Subscription', reason: '' },
    { id: `RCP-2026-${memberIdClean}1`, date: '01 Aug 2026', title: 'Security Deposit & Personal Locker Allotment', amount: '₹2,000', mode: 'Cash (Receipt Voucher)', ref: 'CASH-0814', status: 'Paid', isWaiver: false, category: 'Deposit', reason: '' },
  ];
}
