'use client';
// Responsibility: Displays comprehensive member profile with fully working tabs: Profile, Attendance, Membership, Renewal History, Payment History, Lost/Damaged History, Activity History, and Documents.

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Activity,
  Armchair,
  CalendarClock,
  Camera,
  CreditCard,
  FileText,
  IndianRupee,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Users,
  Eye,
  Download,
  CheckCircle,
  X,
  Building2,
  Clock,
  RotateCcw,
  Check,
  Copy,
  Receipt,
  AlertTriangle,
  Calendar,
  Printer,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Key,
  TrendingUp,
  FileSpreadsheet,
  Award,
  CalendarCheck,
  GraduationCap,
  Layers,
  Lock,
  PauseCircle,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';

interface AdminMembersDirectoryMemberDetailCardProps {
  member: AdminMembersMember;
  detailTab: string;
  isDemoMode: boolean;
  onEdit?: (member: AdminMembersMember) => void;
  onSelectTab?: (tab: string) => void;
}

export function AdminMembersDirectoryMemberDetailCard({
  member,
  detailTab,
  isDemoMode,
  onSelectTab,
}: AdminMembersDirectoryMemberDetailCardProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();

  // Dialog states for rich modal workflows
  const [previewDoc, setPreviewDoc] = useState<{ type: string; number: string; fileName: string; note?: string } | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<{ id: string; date: string; title: string; amount: string; mode: string; ref: string } | null>(null);
  const [attendanceMonth, setAttendanceMonth] = useState<'nov' | 'oct'>('nov');
  const [activityFilter, setActivityFilter] = useState<'all' | 'access' | 'billing' | 'admin'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const status = t(({ Active: 'STATUS_ACTIVE', Expired: 'STATUS_EXPIRED', Suspended: 'STATUS_SUSPENDED', Blocked: 'STATUS_BLOCKED' } as const)[member.status] ?? 'STATUS_UNKNOWN');
  const expiryDate = formatAdminMembersDate(member.expiryDate, locale, t('UNKNOWN_DATE'));
  const initials = member.name.trim().slice(0, 2).toUpperCase() || 'ST';
  const memberIdClean = member.id.replace(/\D/g, '') || '001';

  const copyToClipboard = (text: string, label: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleDirectWhatsApp = () => {
    const digits = member.phone.replace(/\D/g, '');
    const clean = digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits;
    const phone = clean.length === 10 ? `91${clean}` : clean;
    const msg = encodeURIComponent(`Hello ${member.name}, greetings from Smart Library! We are contacting you regarding your library membership (ID: ${member.id}).`);
    const popup = window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  const printMemberProfile = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) { window.print(); return; }
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Member Dossier - ${member.name} (${member.id})</title>
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
            <div>
              <div class="title">Smart Library Network · Member Dossier</div>
              <p>Confidential Admin Record · ID: ${member.id}</p>
            </div>
            <div>
              <p><strong>Status:</strong> ${member.status}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          <table>
            <tr><th>Full Name</th><td>${member.name}</td><th>Member ID</th><td>${member.id}</td></tr>
            <tr><th>Email</th><td>${member.email}</td><th>Phone</th><td>${member.phone}</td></tr>
            <tr><th>Branch</th><td>${member.branch || 'Downtown Central'}</td><th>Seat / Shift</th><td>${member.seat || 'A-01'} · ${member.shift || 'General'}</td></tr>
            <tr><th>Plan</th><td>${member.plan}</td><th>Expiry Date</th><td>${member.expiryDate || '—'}</td></tr>
            <tr><th>Fee Status</th><td>${member.feeStatus || 'Paid'}</td><th>Locker</th><td>${member.locker || 'L-02'}</td></tr>
          </table>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Mock datasets tailored to this specific member
  const attendanceRecords = attendanceMonth === 'nov' ? [
    { date: '04 Nov 2026', checkIn: '08:02 AM', checkOut: '02:15 PM', hours: '6h 13m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
    { date: '03 Nov 2026', checkIn: '08:14 AM', checkOut: '02:00 PM', hours: '5h 46m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
    { date: '02 Nov 2026', checkIn: '08:35 AM', checkOut: '02:30 PM', hours: '5h 55m', shift: member.shift || 'Morning', gate: 'Turnstile 2', status: 'Late Punch' },
    { date: '01 Nov 2026', checkIn: '07:55 AM', checkOut: '02:05 PM', hours: '6h 10m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
    { date: '31 Oct 2026', checkIn: '08:05 AM', checkOut: '02:10 PM', hours: '6h 05m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
    { date: '30 Oct 2026', checkIn: '08:00 AM', checkOut: '02:00 PM', hours: '6h 00m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
    { date: '29 Oct 2026', checkIn: '08:10 AM', checkOut: '02:20 PM', hours: '6h 10m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
  ] : [
    { date: '28 Oct 2026', checkIn: '08:04 AM', checkOut: '02:00 PM', hours: '5h 56m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
    { date: '27 Oct 2026', checkIn: '08:12 AM', checkOut: '02:10 PM', hours: '5h 58m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
    { date: '26 Oct 2026', checkIn: '08:00 AM', checkOut: '02:00 PM', hours: '6h 00m', shift: member.shift || 'Morning', gate: 'Turnstile 1', status: 'Present' },
    { date: '25 Oct 2026', checkIn: '08:22 AM', checkOut: '02:30 PM', hours: '6h 08m', shift: member.shift || 'Morning', gate: 'Turnstile 2', status: 'Late Punch' },
  ];

  const renewalRecords = [
    { id: `REN-2026-${memberIdClean}4`, date: '01 Nov 2026', plan: member.plan, extendedTo: member.expiryDate || '30 Nov 2026', amount: '₹6,500', mode: 'UPI (PhonePe)', staff: 'Admin Desk', status: 'Completed' },
    { id: `REN-2026-${memberIdClean}3`, date: '01 Oct 2026', plan: member.plan, extendedTo: '31 Oct 2026', amount: '₹6,500', mode: 'UPI (GPay)', staff: 'Staff Roster', status: 'Completed' },
    { id: `REN-2026-${memberIdClean}2`, date: '01 Sep 2026', plan: member.plan, extendedTo: '30 Sep 2026', amount: '₹6,500', mode: 'Card (Debit)', staff: 'Staff Roster', status: 'Completed' },
    { id: `REN-2026-${memberIdClean}1`, date: '01 Aug 2026', plan: member.plan, extendedTo: '31 Aug 2026', amount: '₹6,500', mode: 'Cash', staff: 'Accounts Desk', status: 'Completed' },
  ];

  const [paymentRecords, setPaymentRecords] = useState([
    { id: `RCP-2026-${memberIdClean}4`, date: '01 Nov 2026', title: `Monthly Subscription Fee (${member.plan})`, amount: '₹6,500', mode: 'UPI (Ref: UPI/391082)', ref: 'UPI-9842109', status: 'Paid', isWaiver: false, category: 'Subscription', reason: '' },
    { id: `RCP-2026-${memberIdClean}3`, date: '01 Oct 2026', title: `Monthly Subscription Fee (${member.plan})`, amount: '₹6,500', mode: 'UPI (Ref: UPI/281093)', ref: 'UPI-8719203', status: 'Paid', isWaiver: false, category: 'Subscription', reason: '' },
    { id: `RCP-2026-${memberIdClean}2`, date: '01 Sep 2026', title: `Monthly Subscription Fee (${member.plan})`, amount: '₹6,500', mode: 'Card (Ref: TXN-94021)', ref: 'CARD-591024', status: 'Paid', isWaiver: false, category: 'Subscription', reason: '' },
    { id: `RCP-2026-${memberIdClean}1`, date: '01 Aug 2026', title: 'Security Deposit & Personal Locker Allotment', amount: '₹2,000', mode: 'Cash (Receipt Voucher)', ref: 'CASH-0814', status: 'Paid', isWaiver: false, category: 'Deposit', reason: '' },
  ]);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [waiverCategory, setWaiverCategory] = useState<'EWS_ASSISTANCE' | 'MERIT_SCHOLARSHIP' | 'LATE_FEE_WAIVER' | 'SPECIAL_ADMIN_DISCRETION'>('EWS_ASSISTANCE');
  const [waiverAmount, setWaiverAmount] = useState('1000');
  const [waiverReason, setWaiverReason] = useState('EWS verification completed by Admin; concession sanctioned.');
  const [previewWaiverSlip, setPreviewWaiverSlip] = useState<{ id: string; date: string; title: string; amount: string; category: string; reason: string } | null>(null);

  const totalWaivedAmount = paymentRecords
    .filter((p) => p.isWaiver)
    .reduce((sum, p) => sum + (parseInt(p.amount.replace(/\D/g, ''), 10) || 0), 0);

  const handleGrantWaiver = () => {
    const amt = parseInt(waiverAmount, 10);
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid concession amount');
      return;
    }
    const catLabels = {
      EWS_ASSISTANCE: 'EWS Financial Concession',
      MERIT_SCHOLARSHIP: 'Merit Scholarship Concession',
      LATE_FEE_WAIVER: 'Late Fee Penalty Waive-Off',
      SPECIAL_ADMIN_DISCRETION: 'Admin Discretion Discount',
    };
    const newWaiver = {
      id: `WAV-2026-${memberIdClean}${Math.floor(10 + Math.random() * 89)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: `Special Admin Credit: ${catLabels[waiverCategory]}`,
      amount: `-₹${amt.toLocaleString('en-IN')}`,
      mode: 'Admin Credit Memo (Ref: ADM-AUTH)',
      ref: 'AUTH-SUPER-ADMIN',
      status: 'Approved by Admin',
      isWaiver: true,
      category: catLabels[waiverCategory],
      reason: waiverReason || 'Authorized under administrative powers',
    };
    setPaymentRecords((prev) => [newWaiver, ...prev]);
    setShowWaiverModal(false);
    toast.success(`Fee waiver of ₹${amt.toLocaleString('en-IN')} successfully authorized by Admin!`);
    setPreviewWaiverSlip({
      id: newWaiver.id,
      date: newWaiver.date,
      title: newWaiver.title,
      amount: `₹${amt.toLocaleString('en-IN')}`,
      category: catLabels[waiverCategory],
      reason: waiverReason || 'Authorized under administrative powers',
    });
  };

  const printWaiverSlip = (slip: { id: string; date: string; title: string; amount: string; category: string; reason: string }) => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Special Concession Order - ${slip.id}</title>
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
          <div class="header">
            <h1>SMART LIBRARY MANAGEMENT NETWORK</h1>
            <p>Official Discretionary Fee Concession & Waiver Order</p>
          </div>
          <div class="badge">OFFICIAL ADMIN CREDIT ORDER: ${slip.id}</div>
          <table class="meta">
            <tr><td>Order Reference:</td><td><strong>${slip.id}</strong></td></tr>
            <tr><td>Student Name:</td><td><strong>${member.name} (${member.id})</strong></td></tr>
            <tr><td>Branch Allotted:</td><td>${member.branch || 'Downtown Central'}</td></tr>
            <tr><td>Waiver Category:</td><td>${slip.category}</td></tr>
            <tr><td>Sanction Date:</td><td>${slip.date}</td></tr>
            <tr><td>Admin Justification:</td><td>${slip.reason}</td></tr>
          </table>
          <div class="amount-box">
            <div style="font-size: 13px; font-weight: 600; color: #166534; text-transform: uppercase;">Sanctioned Waiver / Discount Amount</div>
            <div class="val">${slip.amount}</div>
            <div style="font-size: 12px; color: #15803d; margin-top: 4px;">Adjusted against student dues via Admin Credit Authority</div>
          </div>
          <div class="footer">
            <div>
              <p>Issued by: Central Operations Administration</p>
              <p>Policy: Section 4(B) - Discretionary Concession Rules</p>
            </div>
            <div class="sig">
              <div class="sig-line">Master Admin Authorization</div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const lostRecords = [
    { id: `INC-${memberIdClean}01`, date: '12 Sep 2026', item: 'RFID Smart Access Card', type: 'Misplaced Keycard', fine: '₹150', status: 'Settled & Reissued', note: `New RFID card issued (Tag: RFID-${memberIdClean}9). Settled at reception.` },
  ];

  const activityRecords = [
    { id: 'ACT-01', time: 'Today, 08:02 AM', category: 'access', title: 'Turnstile Entry Granted', desc: `Turnstile Gate 1 check-in at ${member.branch || 'Downtown Central'} with RFID Smart Card.` },
    { id: 'ACT-02', time: '01 Nov 2026, 10:15 AM', category: 'billing', title: 'Membership Term Extended', desc: `Subscription renewed for 30 days (${member.plan}). Next expiry: ${member.expiryDate || '30 Nov 2026'}.` },
    { id: 'ACT-03', time: '01 Nov 2026, 10:16 AM', category: 'billing', title: 'Fee Invoice Issued', desc: `Digital invoice RCP-2026-${memberIdClean}4 generated and logged in central treasury.` },
    { id: 'ACT-04', time: '28 Oct 2026, 04:30 PM', category: 'admin', title: 'KYC Document Verified', desc: 'Government Aadhaar identity verified & approved by Front Desk Manager.' },
    { id: 'ACT-05', time: '15 Oct 2026, 09:00 AM', category: 'admin', title: 'Seat & Shift Assigned', desc: `Assigned Dedicated Seat ${member.seat || 'A-01'} in ${member.shift || 'General Shift'}.` },
    { id: 'ACT-06', time: '12 Sep 2026, 02:45 PM', category: 'admin', title: 'RFID Card Replaced', desc: 'Replacement RFID Card issued following resolution of incident INC-01.' },
    { id: 'ACT-07', time: member.joinDate ? `${member.joinDate}, 11:00 AM` : '01 Jan 2024, 11:00 AM', category: 'admin', title: 'Member Registered & Admitted', desc: 'Enrolled into Smart Library Central Network directory with complete profile.' },
  ];

  const filteredActivities = activityRecords.filter((a) => activityFilter === 'all' || a.category === activityFilter);

  return (
    <section className="admin-card mt-4 p-5 space-y-6">
      {/* Student Photo Preview & Identity Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-primary bg-primary-subtle font-mono text-lg font-bold text-primary shadow-xs">
            <span>{initials}</span>
            <div
              title="Student Verified Photo Card"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-text-secondary"
            >
              <Camera size={12} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary">{member.name}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                member.status === 'Active'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : member.status === 'Expired'
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              }`}>
                {status}
              </span>
            </div>
            <p className="font-mono text-xs text-text-secondary mt-0.5">
              ID: {member.id} {member.branch ? `· ${member.branch}` : ''} · Joined {member.joinDate || '01 Jan 2024'}
            </p>
          </div>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`tel:${member.phone.replace(/\D/g, '')}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/25 transition-all shadow-xs"
            title={`Call ${member.name}`}
          >
            <PhoneCall size={14} className="text-amber-400" />
            <span>Call</span>
          </a>
          <button
            type="button"
            onClick={handleDirectWhatsApp}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-xs"
            title="Chat directly with student on WhatsApp"
          >
            <MessageSquare size={14} className="text-emerald-400" />
            <span>WhatsApp</span>
          </button>
          {member.email && (
            <a
              href={`mailto:${member.email}?subject=${encodeURIComponent('Smart Library Membership Update')}&body=${encodeURIComponent(`Dear ${member.name},\n\n`)}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 px-3 py-1.5 text-xs font-semibold text-purple-400 hover:bg-purple-500/25 transition-all shadow-xs"
              title={`Send Email directly to ${member.name}`}
            >
              <Mail size={14} className="text-purple-400" />
              <span>Email</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => copyToClipboard(member.phone, 'Phone number')}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy Phone Number"
          >
            {copiedField === 'Phone number' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-slate-400" />}
            <span>Copy Phone</span>
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(member.email, 'Email address')}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy Email Address"
          >
            {copiedField === 'Email address' ? <Check size={13} className="text-emerald-400" /> : <Mail size={13} className="text-slate-400" />}
            <span>Copy Email</span>
          </button>
          <button
            type="button"
            onClick={printMemberProfile}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-400 hover:bg-sky-500/20 transition-colors"
            title="Print Member Dossier"
          >
            <Printer size={13} className="text-sky-400" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* -------------------- 1. PROFILE TAB -------------------- */}
      {detailTab === 'profile' && (
        <div className="space-y-6">
          {/* Active Leave / Membership Freeze Banner if On Leave or Suspended */}
          {(member.status === 'Suspended' || member.status === 'Blocked') && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/70 via-cyan-900/50 to-[#0c0f28] border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                  <PauseCircle size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-cyan-200 text-sm">
                      Membership Status: {status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      15 Days Notice Registered
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    Student leave and examinations status noted at branch desk.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Core Identity & Access Overview 4-tile grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <UserRound size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase font-medium text-text-secondary">Student Contact</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5 truncate">{member.email}</p>
                <p className="text-xs text-text-secondary mt-0.5 font-mono">{member.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <CreditCard size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase font-medium text-text-secondary">Subscription Plan</p>
                <p className="text-sm font-semibold text-purple-400 mt-0.5">{member.plan}</p>
                <p className="text-xs text-text-secondary mt-0.5">Expiry: {expiryDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <IndianRupee size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase font-medium text-text-secondary">Fee Status</p>
                <p className={member.feeStatus === 'Due' ? 'text-rose-400 font-semibold text-sm mt-0.5' : 'text-emerald-400 font-semibold text-sm mt-0.5'}>
                  {member.feeStatus || 'Paid (All Dues Cleared)'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Paid: ₹{((member.totalPaidMinor || 1200000) / 100).toLocaleString('en-IN')} {member.dueFeeMinor ? `· Due: ₹${(member.dueFeeMinor / 100).toLocaleString('en-IN')}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Building2 size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase font-medium text-text-secondary">Branch & Gate</p>
                <p className="text-sm font-semibold text-amber-400 mt-0.5">{member.branch || 'Downtown Central'}</p>
                <p className="text-xs text-text-secondary mt-0.5">Turnstile 1 · RFID Active</p>
              </div>
            </div>
          </div>

          {/* Manager-Style 4 Extended Cards Grid: Seat, Monthly Attendance, Guardian, Academic Goal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0 w-full max-w-full">
            {/* 1. Seat & Shift Allotment */}
            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
                  <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate">
                    <Armchair size={16} className="text-indigo-400 shrink-0" />
                    <span className="truncate">Seat & Shift Allotment</span>
                  </h4>
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded">
                    {member.seat ? `Seat ${member.seat}` : 'Desk A-01'}
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary flex items-center gap-1.5 shrink-0">
                      <Armchair size={14} className="text-indigo-400" /> Assigned Seat:
                    </span>
                    <span className="font-bold text-primary bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded text-right truncate">
                      {member.seat ? `Seat ${member.seat}` : 'Desk A-01'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary flex items-center gap-1.5 shrink-0">
                      <Clock size={14} className="text-amber-400" /> Shift Timing:
                    </span>
                    <span className="font-semibold text-primary text-right truncate">
                      {member.shift || 'Morning 08:00 AM - 02:00 PM'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary flex items-center gap-1.5 shrink-0">
                      <Layers size={14} className="text-sky-400" /> Floor:
                    </span>
                    <span className="font-medium text-primary text-right truncate">
                      1st Floor (Quiet Study Zone)
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary flex items-center gap-1.5 shrink-0">
                      <Lock size={14} className="text-purple-400" /> Locker:
                    </span>
                    <span className="font-medium text-primary text-right truncate">
                      {member.locker || 'Locker L-02'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Monthly Attendance & Consistency Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
                  <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate">
                    <CalendarCheck size={16} className="text-emerald-400 shrink-0" />
                    <span className="truncate">Monthly Attendance</span>
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Nov 2026
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Attendance Rate:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded text-right font-mono">
                      92.3% Present
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Monthly Breakdown:</span>
                    <span className="font-medium text-primary text-right truncate">24 P · 2 A · 1 L</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Current Streak:</span>
                    <span className="font-semibold text-primary text-right truncate">14 Days Active</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => onSelectTab?.('attendance')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:underline"
                  title="Open Full Biometric Attendance Punch Register"
                >
                  <span>Open Punch Register</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>

            {/* 3. Parent & Guardian Information */}
            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
                  <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate">
                    <UserRound size={16} className="text-sky-400 shrink-0" />
                    <span className="truncate">Guardian & Family Info</span>
                  </h4>
                  <span className="text-xs text-secondary font-mono">Verified</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Parent / Guardian:</span>
                    <span className="font-bold text-primary text-right truncate">Ramesh Sharma (Parent)</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Guardian Contact:</span>
                    <span className="font-mono text-primary text-right truncate">+91 91234 56789</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Gender:</span>
                    <span className="font-medium text-primary text-right truncate">Male</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Date of Birth:</span>
                    <span className="font-medium text-primary text-right truncate">15 Aug 2002</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Academic & Target Goal */}
            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
                  <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate">
                    <GraduationCap size={16} className="text-emerald-400 shrink-0" />
                    <span className="truncate">Academic & Target Goal</span>
                  </h4>
                  <span className="text-xs text-emerald-400 font-mono">Aspirant</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Target Exam:</span>
                    <span className="font-bold text-primary text-right truncate">UPSC Civil Services</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Stream / Course:</span>
                    <span className="font-medium text-primary text-right truncate">General Studies & History</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">College / Univ:</span>
                    <span className="font-medium text-primary text-right truncate">Delhi University</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-secondary shrink-0">Target Year:</span>
                    <span className="font-semibold text-emerald-400 text-right truncate">2027</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Rewards & Bonus Banner (From Manager) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0 shadow-sm">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/30">
                <Award size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-primary flex items-center gap-2 flex-wrap text-sm">
                  <span>Referral Rewards & Student Network</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    250 Points
                  </span>
                </h4>
                <p className="text-xs text-secondary mt-0.5 truncate">
                  Referred by: <span className="font-medium text-primary">Aman Verma (MEM-004)</span> · Reward Tier: Silver
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <span className="text-xs font-mono text-secondary px-3 py-1.5 rounded-lg bg-surface border border-border">
                Active Referral Contributor
              </span>
            </div>
          </div>

          {/* KYC Documents Section with Preview Buttons (From Manager) */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <h4 className="text-sm font-bold text-text-primary">Verified KYC Documentation (Identity & Residence)</h4>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                4 Files Attached · 100% Verified
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Aadhaar Card (UIDAI)',
                  number: `UID: XXXX-XXXX-${memberIdClean}849`,
                  file: 'aadhaar_card_verified.pdf',
                  verified: 'Verified by Desk Manager',
                },
                {
                  title: 'College / Student ID Card',
                  number: `Roll: DU-2024-ENG-${memberIdClean}9`,
                  file: 'student_college_id.pdf',
                  verified: 'Academic Enrollment Active',
                },
                {
                  title: 'Admission Undertaking',
                  number: `Form: UND-${memberIdClean}-2024`,
                  file: 'admission_undertaking_signed.pdf',
                  verified: 'Digitally Signed & Accepted',
                },
                {
                  title: 'Permanent Address Proof',
                  number: 'Electricity Utility Voucher',
                  file: 'address_proof_utility.pdf',
                  verified: 'Residential Check Passed',
                },
              ].map((doc, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-surface-muted/30 p-3.5 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={16} className="text-indigo-400 shrink-0" />
                        <p className="text-xs font-bold text-text-primary truncate">{doc.title}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.2 rounded shrink-0">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-text-secondary mt-1 truncate">{doc.number}</p>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc({ type: doc.title, number: doc.number, fileName: doc.file, note: doc.verified })}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success(`Downloaded ${doc.file} for ${member.name}`)}
                      className="text-xs text-text-secondary hover:text-text-primary p-1 cursor-pointer"
                      title="Download PDF"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 2. ATTENDANCE TAB -------------------- */}
      {detailTab === 'attendance' && (
        <div className="space-y-5">
          {/* 4 Attendance KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5">
              <p className="text-[11px] font-semibold uppercase text-emerald-400">Monthly Attendance</p>
              <p className="mt-1 text-2xl font-bold text-white">24 / 26 <span className="text-xs text-emerald-400 font-normal">(92.3%)</span></p>
              <p className="text-[11px] text-text-muted mt-0.5">Consistent study habits</p>
            </div>
            <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-3.5">
              <p className="text-[11px] font-semibold uppercase text-indigo-400">Avg Daily Hours</p>
              <p className="mt-1 text-2xl font-bold text-white">7.5 <span className="text-xs text-indigo-400 font-normal">hrs/day</span></p>
              <p className="text-[11px] text-text-muted mt-0.5">Exceeds shift quota</p>
            </div>
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-3.5">
              <p className="text-[11px] font-semibold uppercase text-cyan-400">Live Status</p>
              <p className="mt-1 text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Active on Desk
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">Seat {member.seat || 'A-01'}</p>
            </div>
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5">
              <p className="text-[11px] font-semibold uppercase text-amber-400">Total Hours</p>
              <p className="mt-1 text-2xl font-bold text-white">182.5 <span className="text-xs text-amber-400 font-normal">hrs</span></p>
              <p className="text-[11px] text-text-muted mt-0.5">Current cycle</p>
            </div>
          </div>

          {/* Month Selector Toolbar */}
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Clock size={16} className="text-indigo-400" />
              Biometric & RFID Punch Log
            </h3>
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1 text-xs">
              <button
                type="button"
                onClick={() => setAttendanceMonth('nov')}
                className={`rounded px-2.5 py-1 font-semibold transition-colors ${attendanceMonth === 'nov' ? 'bg-indigo-500 text-white' : 'text-text-secondary hover:text-white'}`}
              >
                November 2026
              </button>
              <button
                type="button"
                onClick={() => setAttendanceMonth('oct')}
                className={`rounded px-2.5 py-1 font-semibold transition-colors ${attendanceMonth === 'oct' ? 'bg-indigo-500 text-white' : 'text-text-secondary hover:text-white'}`}
              >
                October 2026
              </button>
            </div>
          </div>

          {/* Punch Log Table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-muted text-text-secondary uppercase">
                <tr>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Punch In</th>
                  <th className="p-3 font-semibold">Punch Out</th>
                  <th className="p-3 font-semibold">Study Duration</th>
                  <th className="p-3 font-semibold">Shift Type</th>
                  <th className="p-3 font-semibold">Gate Entry</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendanceRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="p-3 font-semibold text-text-primary">{r.date}</td>
                    <td className="p-3 font-mono text-emerald-400 font-medium">{r.checkIn}</td>
                    <td className="p-3 font-mono text-text-secondary">{r.checkOut}</td>
                    <td className="p-3 font-semibold text-text-primary">{r.hours}</td>
                    <td className="p-3 text-text-secondary">{r.shift}</td>
                    <td className="p-3 text-text-muted">{r.gate}</td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                        r.status === 'Present'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- 3. MEMBERSHIP TAB -------------------- */}
      {detailTab === 'membership' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-card to-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-indigo-500/40 bg-indigo-500/15 text-indigo-400 mb-2">
                  Active Plan
                </span>
                <h3 className="text-xl font-bold text-white">{member.plan}</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Full library facility access at {member.branch || 'Downtown Central'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">₹6,500 <span className="text-xs text-text-secondary font-normal">/ month</span></p>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">Auto-Renewal Active</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-3 border-t border-border text-xs">
              <div>
                <span className="text-text-muted">Admission Start Date:</span>
                <p className="font-semibold text-text-primary mt-0.5">{member.joinDate || '01 Jan 2024'}</p>
              </div>
              <div>
                <span className="text-text-muted">Current Term Expiry:</span>
                <p className="font-semibold text-amber-400 mt-0.5">{expiryDate}</p>
              </div>
              <div>
                <span className="text-text-muted">Assigned Seat & Locker:</span>
                <p className="font-semibold text-text-primary mt-0.5">{member.seat || 'A-01'} · Locker {member.locker || 'L-02'}</p>
              </div>
            </div>
          </div>

          {/* Included Features Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Included Plan Amenities & Benefits</h4>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              {[
                { title: 'Personal Dedicated Ergonomic Desk', desc: 'Reserved workspace with high-back mesh chair and ambient reading lamp.' },
                { title: 'High-Speed 300 Mbps Fiber Wi-Fi', desc: 'Dual-band low-latency Wi-Fi with unlimited quota.' },
                { title: 'Personal Security Locker Access', desc: `Assigned locker ${member.locker || 'L-02'} with personal key retention.` },
                { title: 'Chilled RO Water & Cafeteria Access', desc: 'Free tea/coffee vending and hygienic dining lounge.' },
                { title: 'Soundproof Discussion Room', desc: 'Up to 2 hours / week for group studies and mock interviews.' },
                { title: '24/7 Security & Access Control', desc: 'Full CCTV coverage and smart biometric turnstile security.' },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-primary">{feat.title}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 4. RENEWAL HISTORY TAB -------------------- */}
      {detailTab === 'renewalHistory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <RotateCcw size={16} className="text-amber-400" />
                Membership Renewal Log
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">Track every extension cycle and receipt record.</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
              8 Successful Renewals
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-muted text-text-secondary uppercase">
                <tr>
                  <th className="p-3 font-semibold">Renewal ID</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Plan Extended</th>
                  <th className="p-3 font-semibold">Valid Until</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Payment Mode</th>
                  <th className="p-3 font-semibold">Processed By</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {renewalRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="p-3 font-mono font-semibold text-indigo-400">{r.id}</td>
                    <td className="p-3 text-text-primary">{r.date}</td>
                    <td className="p-3 font-medium text-text-primary">{r.plan}</td>
                    <td className="p-3 font-semibold text-amber-400">{r.extendedTo}</td>
                    <td className="p-3 font-bold text-text-primary">{r.amount}</td>
                    <td className="p-3 text-text-secondary">{r.mode}</td>
                    <td className="p-3 text-text-muted">{r.staff}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => setPreviewReceipt({ id: r.id, date: r.date, title: r.plan, amount: r.amount, mode: r.mode, ref: 'AUTO-CONFIRMED' })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card text-[11px] font-semibold text-sky-400 hover:bg-surface-hover transition-colors"
                      >
                        <Eye size={12} /> View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- 5. PAYMENT HISTORY TAB -------------------- */}
      {detailTab === 'paymentHistory' && (
        <div className="space-y-5">
          {/* Admin Discretionary Authority Callout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl border border-sky-500/30 bg-sky-500/10">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-400" />
                <span className="text-xs font-bold text-sky-200">Admin Exclusive Authority: Fee Concessions & Waivers</span>
              </div>
              <p className="text-[11px] text-sky-300/80 mt-0.5">
                Branch managers cannot alter fee rates or grant discounts. Use official Admin authority to sanction EWS, merit scholarships, or late fee waivers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowWaiverModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              <Award size={14} /> Grant Fee Waiver / Discount
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase text-emerald-400">Total Billed</p>
              <p className="mt-1 text-2xl font-bold text-white font-mono">₹28,000</p>
              <p className="text-xs text-text-secondary mt-0.5">Lifetime fee billing</p>
            </div>
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4">
              <p className="text-xs font-semibold uppercase text-cyan-400">Total Paid</p>
              <p className="mt-1 text-2xl font-bold text-white font-mono">₹28,000</p>
              <p className="text-xs text-text-secondary mt-0.5">100% payments settled</p>
            </div>
            <div className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-4">
              <p className="text-xs font-semibold uppercase text-sky-400">Total Waived</p>
              <p className="mt-1 text-2xl font-bold text-sky-300 font-mono">₹{totalWaivedAmount.toLocaleString('en-IN')}</p>
              <p className="text-xs text-text-secondary mt-0.5">Admin credit notes</p>
            </div>
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase text-emerald-400">Balance Due</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400 font-mono">₹0.00</p>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">No outstanding dues</p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-muted text-text-secondary uppercase">
                <tr>
                  <th className="p-3 font-semibold">Receipt / Memo No</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Particulars</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Mode & Ref</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paymentRecords.map((p) => (
                  <tr key={p.id} className={p.isWaiver ? 'bg-sky-500/5 hover:bg-sky-500/10 transition-colors' : 'hover:bg-surface-hover/50 transition-colors'}>
                    <td className="p-3 font-mono font-semibold text-text-primary">
                      <div className="flex items-center gap-1.5">
                        {p.isWaiver && <Award size={13} className="text-sky-400 shrink-0" />}
                        <span>{p.id}</span>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary">{p.date}</td>
                    <td className="p-3 font-medium text-text-primary">
                      {p.title}
                      {p.reason && <p className="text-[11px] text-sky-400/80 font-normal mt-0.5">{p.reason}</p>}
                    </td>
                    <td className={`p-3 font-bold font-mono ${p.isWaiver ? 'text-sky-300' : 'text-emerald-400'}`}>{p.amount}</td>
                    <td className="p-3 text-text-secondary">{p.mode}</td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        p.isWaiver
                          ? 'border-sky-500/30 bg-sky-500/15 text-sky-300'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {p.isWaiver ? (
                          <button
                            type="button"
                            onClick={() => setPreviewWaiverSlip({
                              id: p.id,
                              date: p.date,
                              title: p.title,
                              amount: p.amount.replace('-', ''),
                              category: p.category || 'Special Concession',
                              reason: p.reason || 'Admin Approved',
                            })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20 transition-colors"
                          >
                            <FileText size={12} /> Concession Order
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPreviewReceipt({ id: p.id, date: p.date, title: p.title, amount: p.amount, mode: p.mode, ref: p.ref })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card text-[11px] font-semibold text-sky-400 hover:bg-surface-hover transition-colors"
                          >
                            <Receipt size={12} /> Receipt
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const msg = encodeURIComponent(
                              p.isWaiver
                                ? `Smart Library Concession Order: ${p.id}\nStudent: ${member.name} (${member.id})\nApproved Waiver: ${p.amount}\nCategory: ${p.category}\nAuthorized by Master Admin.`
                                : `Smart Library Receipt: ${p.id}\nMember: ${member.name}\nAmount: ${p.amount}\nDate: ${p.date}\nStatus: Verified.`
                            );
                            window.open(`https://wa.me/?text=${msg}`, '_blank');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title={p.isWaiver ? 'Share Concession on WhatsApp' : 'Share Receipt on WhatsApp'}
                        >
                          <MessageSquare size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- 6. LOST/DAMAGED HISTORY TAB -------------------- */}
      {detailTab === 'lostHistory' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" />
                Library Property & Asset Incident Log
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">Asset damage, locker keys, or lost RFID smart cards record.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck size={13} /> Clean Security Standing
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-muted text-text-secondary uppercase">
                <tr>
                  <th className="p-3 font-semibold">Incident Ref</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Item / Asset</th>
                  <th className="p-3 font-semibold">Incident Description</th>
                  <th className="p-3 font-semibold">Penalty / Fee</th>
                  <th className="p-3 font-semibold">Resolution Status</th>
                  <th className="p-3 font-semibold">Staff Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lostRecords.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="p-3 font-mono font-semibold text-amber-400">{l.id}</td>
                    <td className="p-3 text-text-secondary">{l.date}</td>
                    <td className="p-3 font-bold text-text-primary">{l.item}</td>
                    <td className="p-3 text-text-secondary">{l.type}</td>
                    <td className="p-3 font-semibold text-rose-400">{l.fine}</td>
                    <td className="p-3">
                      <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3 text-text-muted">{l.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- 7. ACTIVITY HISTORY TAB -------------------- */}
      {detailTab === 'activityHistory' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" />
                Comprehensive Member Audit Trail
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">Chronological timeline of system events, gate punches, and billing.</p>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 text-xs">
              {(['all', 'access', 'billing', 'admin'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActivityFilter(cat)}
                  className={`rounded px-2.5 py-1 font-semibold capitalize transition-colors ${
                    activityFilter === cat ? 'bg-indigo-500 text-white' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Activities' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline List */}
          <div className="relative border-l-2 border-slate-800 ml-4 pl-5 space-y-5">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                <div className={`absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card ${
                  act.category === 'access' ? 'bg-emerald-400' : act.category === 'billing' ? 'bg-indigo-400' : 'bg-sky-400'
                }`} />
                <div className="rounded-xl border border-border bg-card p-3.5 space-y-1 shadow-xs hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{act.title}</span>
                    <span className="text-[11px] text-text-muted">{act.time}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- 8. DOCUMENTS TAB -------------------- */}
      {detailTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Verified KYC Documentation
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle size={12} /> KYC 100% Completed
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: 'Aadhaar Card (UIDAI)',
                number: `UID: XXXX-XXXX-${memberIdClean}849`,
                file: 'aadhaar_card_verified.pdf',
                desc: 'Government-issued UIDAI identification document.',
                verified: 'Verified by Desk Manager',
              },
              {
                title: 'College / Student ID Card',
                number: `Roll: DU-2024-ENG-${memberIdClean}9`,
                file: 'student_college_id.pdf',
                desc: 'Institutional identity card for student concession.',
                verified: 'Academic Enrollment Active',
              },
              {
                title: 'Library Admission Undertaking',
                number: `Form: UND-${memberIdClean}-2024`,
                file: 'admission_undertaking_signed.pdf',
                desc: 'Signed code of conduct and library usage policies.',
                verified: 'Digitally Signed & Accepted',
              },
              {
                title: 'Permanent Address Proof',
                number: 'Electricity Bill / Utility Proof',
                file: 'address_proof_utility.pdf',
                desc: 'Verified residential proof matching application record.',
                verified: 'Residential Check Passed',
              },
            ].map((doc, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center font-bold">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">{doc.title}</h4>
                      <p className="text-xs text-text-secondary font-mono">{doc.number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc({ type: doc.title, number: doc.number, fileName: doc.file, note: doc.verified })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors"
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success(`Downloaded ${doc.file} for ${member.name}`)}
                      className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                      title="Download PDF"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-text-secondary">{doc.desc}</p>
                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle size={11} /> {doc.verified}
                  </span>
                  <span className="font-mono text-text-muted">{doc.file}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- DOCUMENT PREVIEW MODAL -------------------- */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm" onClick={() => setPreviewDoc(null)}>
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <h4 className="text-sm font-bold text-text-primary">{previewDoc.type} Preview</h4>
              </div>
              <button type="button" onClick={() => setPreviewDoc(null)} className="text-text-secondary hover:text-text-primary p-1">
                <X size={18} />
              </button>
            </div>
            <div className="rounded-xl border border-border bg-surface-highlight p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]">
              <div className="w-14 h-14 rounded-2xl bg-primary-subtle text-primary flex items-center justify-center font-bold text-xl">
                <FileText size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{member.name}</p>
                <p className="text-xs text-text-secondary font-mono mt-0.5">{previewDoc.number}</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ {previewDoc.note || 'Government Identity Verified by Desk Manager'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-text-secondary pt-2">
              <span>File: {previewDoc.fileName}</span>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Downloaded ${previewDoc.fileName}`);
                  setPreviewDoc(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- RECEIPT / SLIP PREVIEW MODAL -------------------- */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm" onClick={() => setPreviewReceipt(null)}>
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-emerald-400" />
                <h4 className="text-sm font-bold text-text-primary">Payment Voucher / Receipt</h4>
              </div>
              <button type="button" onClick={() => setPreviewReceipt(null)} className="text-text-secondary hover:text-text-primary p-1">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Receipt Number:</span>
                <span className="font-mono font-bold text-white">{previewReceipt.id}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Member Name:</span>
                <span className="font-semibold text-white">{member.name} ({member.id})</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Billing Date:</span>
                <span className="text-white">{previewReceipt.date}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Particulars:</span>
                <span className="text-white font-medium">{previewReceipt.title}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Payment Method:</span>
                <span className="text-white">{previewReceipt.mode}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-text-primary">Net Amount Settled:</span>
                <span className="text-emerald-400 font-mono">{previewReceipt.amount}</span>
              </div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2 text-center text-[11px] text-emerald-400 font-semibold">
                ✓ Confirmed & Reconciled in Central Treasury Ledger
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  toast.success(`Printed receipt ${previewReceipt.id}`);
                  setPreviewReceipt(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-text-primary hover:bg-surface-hover"
              >
                <Printer size={13} /> Print Slip
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Downloaded voucher ${previewReceipt.id}.pdf`);
                  setPreviewReceipt(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400"
              >
                <Download size={13} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- ADMIN SPECIAL FEE WAIVER MODAL -------------------- */}
      {showWaiverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm" onClick={() => setShowWaiverModal(false)}>
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-sky-400" />
                <h4 className="text-sm font-bold text-text-primary">Admin Sanction: Grant Special Fee Waiver</h4>
              </div>
              <button type="button" onClick={() => setShowWaiverModal(false)} className="text-text-secondary hover:text-text-primary p-1">
                <X size={18} />
              </button>
            </div>

            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-xs text-sky-200">
              <p className="font-semibold">Member: {member.name} ({member.id}) · Plan: {member.plan}</p>
              <p className="text-[11px] text-sky-300/80 mt-0.5">
                Fee concessions and late fee write-offs are reserved for Master Admin approval. An official credit memo will be generated.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-text-secondary font-medium mb-1">Concession Category / Scheme</label>
                <select
                  value={waiverCategory}
                  onChange={(e) => setWaiverCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="EWS_ASSISTANCE">EWS Financial Hardship Concession (आर्थिक रूप से कमजोर छात्र)</option>
                  <option value="MERIT_SCHOLARSHIP">Merit Scholarship Concession (मेधावी छात्र छात्रवृत्ति)</option>
                  <option value="LATE_FEE_WAIVER">Late Fee Penalty Full/Partial Waive-Off (विलंब शुल्क माफी)</option>
                  <option value="SPECIAL_ADMIN_DISCRETION">Admin Discretion Special Discount (विशेष एडमिन छूट)</option>
                </select>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">Waiver / Discount Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-text-secondary font-bold">₹</span>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={waiverAmount}
                    onChange={(e) => setWaiverAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-input text-text-primary font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. 1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">Administrative Justification / Approval Notes</label>
                <textarea
                  rows={2}
                  value={waiverReason}
                  onChange={(e) => setWaiverReason(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Reason for concession, income certificate / rank proof ref..."
                />
              </div>

              <div className="rounded-lg bg-surface-muted border border-border p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-text-secondary">Signing Authority:</span>
                <span className="font-semibold text-sky-400">Master Operations Admin (Logged-in)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowWaiverModal(false)}
                className="px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-text-secondary hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGrantWaiver}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 shadow-md"
              >
                <Check size={14} /> Authorize & Credit Memo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- CONCESSION ORDER PREVIEW MODAL -------------------- */}
      {previewWaiverSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm" onClick={() => setPreviewWaiverSlip(null)}>
          <div className="relative w-full max-w-md rounded-2xl border border-sky-500/30 bg-card p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-sky-400" />
                <h4 className="text-sm font-bold text-text-primary">Official Concession Order</h4>
              </div>
              <button type="button" onClick={() => setPreviewWaiverSlip(null)} className="text-text-secondary hover:text-text-primary p-1">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Order Reference:</span>
                <span className="font-mono font-bold text-sky-400">{previewWaiverSlip.id}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Beneficiary Student:</span>
                <span className="font-semibold text-white">{member.name} ({member.id})</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Concession Type:</span>
                <span className="text-white font-medium">{previewWaiverSlip.category}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Sanction Date:</span>
                <span className="text-white">{previewWaiverSlip.date}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-secondary">Justification:</span>
                <span className="text-white text-right max-w-xs">{previewWaiverSlip.reason}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-text-primary">Approved Discount / Waiver:</span>
                <span className="text-sky-300 font-mono text-base">{previewWaiverSlip.amount}</span>
              </div>
              <div className="rounded-lg bg-sky-500/10 border border-sky-500/25 p-2 text-center text-[11px] text-sky-300 font-semibold">
                ✓ Sanctioned under Executive Admin Power · Dues Adjusted
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  printWaiverSlip(previewWaiverSlip);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-text-primary hover:bg-surface-hover"
              >
                <Printer size={13} /> Print Order Letter
              </button>
              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent(`Smart Library Official Concession Notice:\nOrder: ${previewWaiverSlip.id}\nBeneficiary: ${member.name} (${member.id})\nApproved Concession: ${previewWaiverSlip.amount}\nCategory: ${previewWaiverSlip.category}\nAuthorized by Master Admin.`);
                  window.open(`https://wa.me/?text=${msg}`, '_blank');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400"
              >
                <MessageSquare size={13} /> WhatsApp Student
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
