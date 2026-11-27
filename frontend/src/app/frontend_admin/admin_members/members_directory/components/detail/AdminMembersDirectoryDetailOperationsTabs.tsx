'use client';

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import {
  buildMemberAttendance,
  buildMemberRenewals,
  type DocPreview,
  type ReceiptPreview,
} from '@/app/frontend_admin/admin_members/members_directory/utils/adminMembersDirectoryDetailPrint';
import { formatAdminMembersDirectoryCurrency } from '@/app/frontend_admin/admin_members/members_directory/utils/formatAdminMembersDirectoryCurrency';
import { Activity, AlertTriangle, CheckCircle, Clock, Download, Eye, FileText, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface AdminMembersDirectoryDetailOperationsTabsProps {
  detailTab: string;
  member: AdminMembersMember;
  expiryDate: string;
  memberIdClean: string;
  attendanceMonth: 'nov' | 'oct';
  onChangeAttendanceMonth: (month: 'nov' | 'oct') => void;
  activityFilter: 'all' | 'access' | 'billing' | 'admin';
  onChangeActivityFilter: (filter: 'all' | 'access' | 'billing' | 'admin') => void;
  onPreviewReceipt: (receipt: ReceiptPreview) => void;
  onPreviewDoc: (doc: DocPreview) => void;
}

export function AdminMembersDirectoryDetailOperationsTabs({
  detailTab,
  member,
  expiryDate,
  memberIdClean,
  attendanceMonth,
  onChangeAttendanceMonth,
  activityFilter,
  onChangeActivityFilter,
  onPreviewReceipt,
  onPreviewDoc,
}: AdminMembersDirectoryDetailOperationsTabsProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  if (detailTab === 'attendance') {
    const attendanceRecords = buildMemberAttendance(member, attendanceMonth);
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-success bg-success-bg p-3.5"><p className="text-[11px] font-semibold uppercase text-success-text">Monthly Attendance</p><p className="mt-1 text-2xl font-bold text-text-primary">24 / 26 <span className="text-xs text-success-text font-normal">(92.3%)</span></p><p className="text-[11px] text-text-secondary mt-0.5">Consistent study habits</p></div>
          <div className="rounded-xl border border-border-focus bg-primary-subtle p-3.5"><p className="text-[11px] font-semibold uppercase text-primary">Avg Daily Hours</p><p className="mt-1 text-2xl font-bold text-text-primary">7.5 <span className="text-xs text-primary font-normal">hrs/day</span></p><p className="text-[11px] text-text-secondary mt-0.5">Exceeds shift quota</p></div>
          <div className="rounded-xl border border-info bg-info-bg p-3.5"><p className="text-[11px] font-semibold uppercase text-info-text">Live Status</p><p className="mt-1 text-base font-bold text-success-text flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success motion-safe:animate-ping" /> Active on Desk</p><p className="text-[11px] text-text-secondary mt-0.5">Seat {member.seat || 'A-01'}</p></div>
          <div className="rounded-xl border border-warning bg-warning-bg p-3.5"><p className="text-[11px] font-semibold uppercase text-warning-text">Total Hours</p><p className="mt-1 text-2xl font-bold text-text-primary">182.5 <span className="text-xs text-warning-text font-normal">hrs</span></p><p className="text-[11px] text-text-secondary mt-0.5">Current cycle</p></div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2"><Clock size={16} className="text-primary" aria-hidden="true" /> Biometric & RFID Punch Log</h3>
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1 text-xs">
            <button type="button" onClick={() => onChangeAttendanceMonth('nov')} className={`rounded px-2.5 py-1 font-semibold motion-safe:transition-colors ${attendanceMonth === 'nov' ? 'bg-primary text-on-primary' : 'text-text-secondary hover:text-text-primary'}`}>November 2026</button>
            <button type="button" onClick={() => onChangeAttendanceMonth('oct')} className={`rounded px-2.5 py-1 font-semibold motion-safe:transition-colors ${attendanceMonth === 'oct' ? 'bg-primary text-on-primary' : 'text-text-secondary hover:text-text-primary'}`}>October 2026</button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-highlight text-text-secondary uppercase">
              <tr><th className="p-3 font-semibold">Date</th><th className="p-3 font-semibold">Punch In</th><th className="p-3 font-semibold">Punch Out</th><th className="p-3 font-semibold">Study Duration</th><th className="p-3 font-semibold">Shift Type</th><th className="p-3 font-semibold">Gate Entry</th><th className="p-3 font-semibold">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendanceRecords.map((r) => (
                <tr key={`${r.date}-${r.checkIn}-${r.shift}`} className="hover:bg-surface-hover motion-safe:transition-colors">
                  <td className="p-3 font-semibold text-text-primary">{r.date}</td><td className="p-3 font-mono text-success-text font-medium">{r.checkIn}</td><td className="p-3 font-mono text-text-secondary">{r.checkOut}</td><td className="p-3 font-semibold text-text-primary">{r.hours}</td><td className="p-3 text-text-secondary">{r.shift}</td><td className="p-3 text-text-secondary">{r.gate}</td>
                  <td className="p-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border ${r.status === 'Present' ? 'border-success bg-success-bg text-success-text' : 'border-warning bg-warning-bg text-warning-text'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailTab === 'membership') {
    const amenities = [
      { title: 'Personal Dedicated Ergonomic Desk', desc: 'Reserved workspace with high-back mesh chair and ambient reading lamp.' },
      { title: 'High-Speed 300 Mbps Fiber Wi-Fi', desc: 'Dual-band low-latency Wi-Fi with unlimited quota.' },
      { title: 'Personal Security Locker Access', desc: `Assigned locker ${member.locker || 'L-02'} with personal key retention.` },
      { title: 'Chilled RO Water & Cafeteria Access', desc: 'Free tea/coffee vending and hygienic dining lounge.' },
      { title: 'Soundproof Discussion Room', desc: 'Up to 2 hours / week for group studies and mock interviews.' },
      { title: '24/7 Security & Access Control', desc: 'Full CCTV coverage and smart biometric turnstile security.' },
    ];
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border-focus bg-primary-subtle p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-border-focus bg-card text-primary mb-2">Active Plan</span><h3 className="text-xl font-bold text-text-primary">{member.plan}</h3><p className="text-xs text-text-secondary mt-1">Full library facility access at {member.branch || 'Downtown Central'}</p></div>
            <div className="text-right"><p className="text-2xl font-bold text-text-primary">{formatAdminMembersDirectoryCurrency(6500, locale)} <span className="text-xs text-text-secondary font-normal">{t('DETAIL_PER_MONTH')}</span></p><p className="text-xs text-success-text font-semibold mt-0.5">Auto-Renewal Active</p></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 pt-3 border-t border-border text-xs">
            <div><span className="text-text-secondary">Admission Start Date:</span><p className="font-semibold text-text-primary mt-0.5">{member.joinDate || '01 Jan 2024'}</p></div>
            <div><span className="text-text-secondary">Current Term Expiry:</span><p className="font-semibold text-warning-text mt-0.5">{expiryDate}</p></div>
            <div><span className="text-text-secondary">Assigned Seat & Locker:</span><p className="font-semibold text-text-primary mt-0.5">{member.seat || 'A-01'} · Locker {member.locker || 'L-02'}</p></div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Included Plan Amenities & Benefits</h4>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            {amenities.map((feat) => (
              <div key={feat.title} className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3">
                <CheckCircle size={16} className="text-success-text shrink-0 mt-0.5" aria-hidden="true" />
                <div><p className="font-semibold text-text-primary">{feat.title}</p><p className="text-[11px] text-text-secondary mt-0.5">{feat.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (detailTab === 'renewalHistory') {
    const renewalRecords = buildMemberRenewals(member, memberIdClean);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div><h3 className="text-sm font-bold text-text-primary flex items-center gap-2"><RotateCcw size={16} className="text-warning-text" aria-hidden="true" /> Membership Renewal Log</h3><p className="text-xs text-text-secondary mt-0.5">Track every extension cycle and receipt record.</p></div>
          <span className="text-xs text-success-text font-semibold bg-success-bg border border-success rounded-full px-3 py-1">8 Successful Renewals</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-highlight text-text-secondary uppercase">
              <tr><th className="p-3 font-semibold">Renewal ID</th><th className="p-3 font-semibold">Date</th><th className="p-3 font-semibold">Plan Extended</th><th className="p-3 font-semibold">Valid Until</th><th className="p-3 font-semibold">Amount</th><th className="p-3 font-semibold">Payment Mode</th><th className="p-3 font-semibold">Processed By</th><th className="p-3 font-semibold">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {renewalRecords.map((r) => (
                <tr key={r.id} className="hover:bg-surface-hover motion-safe:transition-colors">
                  <td className="p-3 font-mono font-semibold text-primary">{r.id}</td><td className="p-3 text-text-primary">{r.date}</td><td className="p-3 font-medium text-text-primary">{r.plan}</td><td className="p-3 font-semibold text-warning-text">{r.extendedTo}</td><td className="p-3 font-bold text-text-primary">{r.amount}</td><td className="p-3 text-text-secondary">{r.mode}</td><td className="p-3 text-text-secondary">{r.staff}</td>
                  <td className="p-3"><button type="button" onClick={() => onPreviewReceipt({ id: r.id, date: r.date, title: r.plan, amount: r.amount, mode: r.mode, ref: 'AUTO-CONFIRMED' })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card text-[11px] font-semibold text-info-text hover:bg-surface-hover motion-safe:transition-colors"><Eye size={12} aria-hidden="true" /> View Slip</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailTab === 'lostHistory') {
    const lostRecords = [{ id: `INC-${memberIdClean}01`, date: '12 Sep 2026', item: 'RFID Smart Access Card', type: 'Misplaced Keycard', fine: '₹150', status: 'Settled & Reissued', note: `New RFID card issued (Tag: RFID-${memberIdClean}9). Settled at reception.` }];
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div><h3 className="text-sm font-bold text-text-primary flex items-center gap-2"><AlertTriangle size={16} className="text-warning-text" aria-hidden="true" /> Library Property & Asset Incident Log</h3><p className="text-xs text-text-secondary mt-0.5">Asset damage, locker keys, or lost RFID smart cards record.</p></div>
          <span className="inline-flex items-center gap-1 rounded-full border border-success bg-success-bg px-3 py-1 text-xs font-semibold text-success-text"><ShieldCheck size={13} aria-hidden="true" /> Clean Security Standing</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-highlight text-text-secondary uppercase">
              <tr><th className="p-3 font-semibold">Incident Ref</th><th className="p-3 font-semibold">Date</th><th className="p-3 font-semibold">Item / Asset</th><th className="p-3 font-semibold">Incident Description</th><th className="p-3 font-semibold">Penalty / Fee</th><th className="p-3 font-semibold">Resolution Status</th><th className="p-3 font-semibold">Staff Notes</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lostRecords.map((l) => (
                <tr key={l.id} className="hover:bg-surface-hover motion-safe:transition-colors">
                  <td className="p-3 font-mono font-semibold text-warning-text">{l.id}</td><td className="p-3 text-text-secondary">{l.date}</td><td className="p-3 font-bold text-text-primary">{l.item}</td><td className="p-3 text-text-secondary">{l.type}</td><td className="p-3 font-semibold text-danger-text">{l.fine}</td>
                  <td className="p-3"><span className="inline-flex rounded-full border border-success bg-success-bg px-2 py-0.5 text-[10px] font-semibold text-success-text">{l.status}</span></td>
                  <td className="p-3 text-text-secondary">{l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailTab === 'activityHistory') {
    const activityRecords = [
      { id: 'ACT-01', time: 'Today, 08:02 AM', category: 'access', title: 'Turnstile Entry Granted', desc: `Turnstile Gate 1 check-in at ${member.branch || 'Downtown Central'} with RFID Smart Card.` },
      { id: 'ACT-02', time: '01 Nov 2026, 10:15 AM', category: 'billing', title: 'Membership Term Extended', desc: `Subscription renewed for 30 days (${member.plan}). Next expiry: ${member.expiryDate || '30 Nov 2026'}.` },
      { id: 'ACT-03', time: '01 Nov 2026, 10:16 AM', category: 'billing', title: 'Fee Invoice Issued', desc: `Digital invoice RCP-2026-${memberIdClean}4 generated and logged in central treasury.` },
      { id: 'ACT-04', time: '28 Oct 2026, 04:30 PM', category: 'admin', title: 'KYC Document Verified', desc: 'Government Aadhaar identity verified & approved by Front Desk Manager.' },
      { id: 'ACT-05', time: '15 Oct 2026, 09:00 AM', category: 'admin', title: 'Seat & Shift Assigned', desc: `Assigned Dedicated Seat ${member.seat || 'A-01'} in ${member.shift || 'General Shift'}.` },
      { id: 'ACT-06', time: '12 Sep 2026, 02:45 PM', category: 'admin', title: 'RFID Card Replaced', desc: 'Replacement RFID Card issued following resolution of incident INC-01.' },
      { id: 'ACT-07', time: member.joinDate ? `${member.joinDate}, 11:00 AM` : '01 Jan 2024, 11:00 AM', category: 'admin', title: 'Member Registered & Admitted', desc: 'Enrolled into Smart Library Central Network directory with complete profile.' },
    ];
    const filtered = activityRecords.filter((a) => activityFilter === 'all' || a.category === activityFilter);
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="text-sm font-bold text-text-primary flex items-center gap-2"><Activity size={16} className="text-primary" aria-hidden="true" /> Comprehensive Member Audit Trail</h3><p className="text-xs text-text-secondary mt-0.5">Chronological timeline of system events, gate punches, and billing.</p></div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 text-xs">
            {(['all', 'access', 'billing', 'admin'] as const).map((cat) => (
              <button key={cat} type="button" onClick={() => onChangeActivityFilter(cat)} className={`rounded px-2.5 py-1 font-semibold capitalize motion-safe:transition-colors ${activityFilter === cat ? 'bg-primary text-on-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                {cat === 'all' ? 'All Activities' : cat}
              </button>
            ))}
          </div>
        </div>
        <div className="relative border-l-2 border-border ml-4 pl-5 space-y-5">
          {filtered.map((act) => (
            <div key={act.id} className="relative group">
              <div className={`absolute -left-[27px] top-1 h-4 w-4 rounded-full border-2 border-card ${act.category === 'access' ? 'bg-success' : act.category === 'billing' ? 'bg-primary' : 'bg-info'}`} />
              <div className="rounded-xl border border-border bg-card p-3.5 space-y-1 shadow-card hover:border-border-focus motion-safe:transition-colors">
                <div className="flex items-center justify-between"><span className="text-xs font-bold text-text-primary">{act.title}</span><span className="text-[11px] text-text-secondary">{act.time}</span></div>
                <p className="text-xs text-text-secondary">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (detailTab === 'documents') {
    const docs = [
      { title: 'Aadhaar Card (UIDAI)', number: `UID: XXXX-XXXX-${memberIdClean}849`, file: 'aadhaar_card_verified.pdf', desc: 'Government-issued UIDAI identification document.', verified: 'Verified by Desk Manager' },
      { title: 'College / Student ID Card', number: `Roll: DU-2024-ENG-${memberIdClean}9`, file: 'student_college_id.pdf', desc: 'Institutional identity card for student concession.', verified: 'Academic Enrollment Active' },
      { title: 'Library Admission Undertaking', number: `Form: UND-${memberIdClean}-2024`, file: 'admission_undertaking_signed.pdf', desc: 'Signed code of conduct and library usage policies.', verified: 'Digitally Signed & Accepted' },
      { title: 'Permanent Address Proof', number: 'Electricity Bill / Utility Proof', file: 'address_proof_utility.pdf', desc: 'Verified residential proof matching application record.', verified: 'Residential Check Passed' },
    ];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2"><FileText size={16} className="text-primary" aria-hidden="true" /> Verified KYC Documentation</h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success-text border border-success"><CheckCircle size={12} aria-hidden="true" /> KYC 100% Completed</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {docs.map((doc) => (
            <div key={doc.file} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center"><ShieldCheck size={20} aria-hidden="true" /></div>
                  <div><h4 className="text-sm font-bold text-text-primary">{doc.title}</h4><p className="text-xs text-text-secondary font-mono">{doc.number}</p></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => onPreviewDoc({ type: doc.title, number: doc.number, fileName: doc.file, note: doc.verified })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"><Eye size={12} aria-hidden="true" /> Preview</button>
                  <button type="button" onClick={() => toast.success(`Downloaded ${doc.file} for ${member.name}`, { id: `admin-doc-tab-dl-${doc.file}` })} className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors" title="Download PDF" aria-label={`Download ${doc.file}`}><Download size={13} aria-hidden="true" /></button>
                </div>
              </div>
              <p className="text-[11px] text-text-secondary">{doc.desc}</p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                <span className="text-success-text font-semibold flex items-center gap-1"><CheckCircle size={11} aria-hidden="true" /> {doc.verified}</span>
                <span className="font-mono text-text-secondary">{doc.file}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
