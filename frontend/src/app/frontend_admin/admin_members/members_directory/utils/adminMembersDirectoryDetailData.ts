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
