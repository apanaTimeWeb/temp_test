'use client';

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import type { DocPreview } from '@/app/frontend_admin/admin_members/members_directory/utils/adminMembersDirectoryDetailPrint';
import { Armchair, Award, Building2, CalendarCheck, Clock, CreditCard, Download, ExternalLink, Eye, FileText, GraduationCap, IndianRupee, Layers, Lock, PauseCircle, ShieldCheck, UserRound } from 'lucide-react';
import { toast } from 'sonner';

interface AdminMembersDirectoryDetailProfileTabProps {
  member: AdminMembersMember;
  status: string;
  expiryDate: string;
  memberIdClean: string;
  onSelectTab?: (tab: string) => void;
  onPreviewDoc: (doc: DocPreview) => void;
}

export function AdminMembersDirectoryDetailProfileTab({
  member,
  status,
  expiryDate,
  memberIdClean,
  onSelectTab,
  onPreviewDoc,
}: AdminMembersDirectoryDetailProfileTabProps) {
  const kycDocs = [
    { title: 'Aadhaar Card (UIDAI)', number: `UID: XXXX-XXXX-${memberIdClean}849`, file: 'aadhaar_card_verified.pdf', verified: 'Verified by Desk Manager' },
    { title: 'College / Student ID Card', number: `Roll: DU-2024-ENG-${memberIdClean}9`, file: 'student_college_id.pdf', verified: 'Academic Enrollment Active' },
    { title: 'Admission Undertaking', number: `Form: UND-${memberIdClean}-2024`, file: 'admission_undertaking_signed.pdf', verified: 'Digitally Signed & Accepted' },
    { title: 'Permanent Address Proof', number: 'Electricity Utility Voucher', file: 'address_proof_utility.pdf', verified: 'Residential Check Passed' },
  ];

  return (
    <div className="space-y-6">
      {(member.status === 'Suspended' || member.status === 'Blocked') && (
        <div className="p-4 rounded-xl bg-info-bg border border-info flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-card border border-info text-info-text flex items-center justify-center shrink-0 mt-0.5">
              <PauseCircle size={22} aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-info-text text-sm">Membership Status: {status}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-card text-info-text border border-info">15 Days Notice Registered</span>
              </div>
              <p className="text-text-primary mt-1">Student leave and examinations status noted at branch desk.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-card">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info-bg text-info-text border border-info"><UserRound size={18} aria-hidden="true" /></div>
          <div className="min-w-0">
            <p className="text-xs uppercase font-medium text-text-secondary">Student Contact</p>
            <p className="text-sm font-semibold text-text-primary mt-0.5 truncate">{member.email}</p>
            <p className="text-xs text-text-secondary mt-0.5 font-mono">{member.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-card">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-bg text-purple border border-border"><CreditCard size={18} aria-hidden="true" /></div>
          <div className="min-w-0">
            <p className="text-xs uppercase font-medium text-text-secondary">Subscription Plan</p>
            <p className="text-sm font-semibold text-purple mt-0.5">{member.plan}</p>
            <p className="text-xs text-text-secondary mt-0.5">Expiry: {expiryDate}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-card">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-bg text-success-text border border-success"><IndianRupee size={18} aria-hidden="true" /></div>
          <div className="min-w-0">
            <p className="text-xs uppercase font-medium text-text-secondary">Fee Status</p>
            <p className={member.feeStatus === 'Due' ? 'text-danger-text font-semibold text-sm mt-0.5' : 'text-success-text font-semibold text-sm mt-0.5'}>
              {member.feeStatus || 'Paid (All Dues Cleared)'}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Paid: ₹{((member.totalPaidMinor || 1200000) / 100).toLocaleString('en-IN')} {member.dueFeeMinor ? `· Due: ₹${(member.dueFeeMinor / 100).toLocaleString('en-IN')}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-card">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-bg text-warning-text border border-warning"><Building2 size={18} aria-hidden="true" /></div>
          <div className="min-w-0">
            <p className="text-xs uppercase font-medium text-text-secondary">Branch & Gate</p>
            <p className="text-sm font-semibold text-warning-text mt-0.5">{member.branch || 'Downtown Central'}</p>
            <p className="text-xs text-text-secondary mt-0.5">Turnstile 1 · RFID Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0 w-full max-w-full">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
              <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate"><Armchair size={16} aria-hidden="true" /> <span className="truncate">Seat & Shift Allotment</span></h4>
              <span className="font-mono text-xs font-bold text-primary bg-primary-subtle border border-border-focus px-2 py-0.5 rounded">{member.seat ? `Seat ${member.seat}` : 'Desk A-01'}</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center gap-2"><span className="text-text-secondary flex items-center gap-1.5"><Armchair size={14} className="text-primary" aria-hidden="true" /> Assigned Seat:</span><span className="font-bold text-primary bg-primary-subtle border border-border-focus px-2 py-0.5 rounded">{member.seat ? `Seat ${member.seat}` : 'Desk A-01'}</span></div>
              <div className="flex justify-between items-center gap-2"><span className="text-text-secondary flex items-center gap-1.5"><Clock size={14} className="text-warning-text" aria-hidden="true" /> Shift Timing:</span><span className="font-semibold text-text-primary text-right truncate">{member.shift || 'Morning 08:00 AM - 02:00 PM'}</span></div>
              <div className="flex justify-between items-center gap-2"><span className="text-text-secondary flex items-center gap-1.5"><Layers size={14} className="text-info-text" aria-hidden="true" /> Floor:</span><span className="font-medium text-text-primary text-right truncate">1st Floor (Quiet Study Zone)</span></div>
              <div className="flex justify-between items-center gap-2"><span className="text-text-secondary flex items-center gap-1.5"><Lock size={14} className="text-purple" aria-hidden="true" /> Locker:</span><span className="font-medium text-text-primary text-right truncate">{member.locker || 'Locker L-02'}</span></div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
              <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate"><CalendarCheck size={16} className="text-success-text" aria-hidden="true" /> <span className="truncate">Monthly Attendance</span></h4>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-success-bg text-success-text border border-success">Nov 2026</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Attendance Rate:</span><span className="font-bold text-success-text bg-success-bg border border-success px-2 py-0.5 rounded font-mono">92.3% Present</span></div>
              <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Monthly Breakdown:</span><span className="font-medium text-text-primary">24 P · 2 A · 1 L</span></div>
              <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Current Streak:</span><span className="font-semibold text-text-primary">14 Days Active</span></div>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <button type="button" onClick={() => onSelectTab?.('attendance')} className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1.5" title="Open Full Biometric Attendance Punch Register">
              <span>Open Punch Register</span> <ExternalLink size={12} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-card">
          <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
            <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate"><UserRound size={16} className="text-info-text" aria-hidden="true" /> <span className="truncate">Guardian & Family Info</span></h4>
            <span className="text-xs text-text-secondary font-mono">Verified</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Parent / Guardian:</span><span className="font-bold text-text-primary">Ramesh Sharma (Parent)</span></div>
            <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Guardian Contact:</span><span className="font-mono text-text-primary">+91 91234 56789</span></div>
            <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Gender:</span><span className="font-medium text-text-primary">Male</span></div>
            <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Date of Birth:</span><span className="font-medium text-text-primary">15 Aug 2002</span></div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 min-w-0 shadow-card">
          <div className="flex items-center justify-between border-b border-border pb-2 gap-2 mb-3">
            <h4 className="font-bold text-primary flex items-center gap-2 text-sm truncate"><GraduationCap size={16} className="text-success-text" aria-hidden="true" /> <span className="truncate">Academic & Target Goal</span></h4>
            <span className="text-xs text-success-text font-mono">Aspirant</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Target Exam:</span><span className="font-bold text-text-primary">UPSC Civil Services</span></div>
            <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Stream / Course:</span><span className="font-medium text-text-primary">General Studies & History</span></div>
            <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">College / Univ:</span><span className="font-medium text-text-primary">Delhi University</span></div>
            <div className="flex justify-between items-center gap-2"><span className="text-text-secondary">Target Year:</span><span className="font-semibold text-success-text">2027</span></div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-warning-bg flex items-center justify-center text-warning-text shrink-0 border border-warning"><Award size={24} aria-hidden="true" /></div>
          <div className="min-w-0">
            <h4 className="font-bold text-primary flex items-center gap-2 flex-wrap text-sm">
              <span>Referral Rewards & Student Network</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-warning-bg text-warning-text border border-warning">250 Points</span>
            </h4>
            <p className="text-xs text-text-secondary mt-0.5 truncate">Referred by: <span className="font-medium text-text-primary">Aman Verma (MEM-004)</span> · Reward Tier: Silver</p>
          </div>
        </div>
        <span className="text-xs font-mono text-text-secondary px-3 py-1.5 rounded-lg bg-surface-highlight border border-border self-start sm:self-auto">Active Referral Contributor</span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-success-text" aria-hidden="true" /><h4 className="text-sm font-bold text-text-primary">Verified KYC Documentation (Identity & Residence)</h4></div>
          <span className="text-xs text-success-text font-semibold bg-success-bg border border-success rounded-full px-2.5 py-0.5">4 Files Attached · 100% Verified</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kycDocs.map((doc) => (
            <div key={doc.file} className="rounded-xl border border-border bg-surface-highlight p-3.5 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0"><FileText size={16} className="text-primary shrink-0" aria-hidden="true" /><p className="text-xs font-bold text-text-primary truncate">{doc.title}</p></div>
                  <span className="text-[10px] font-semibold text-success-text bg-success-bg border border-success px-1.5 py-0.5 rounded shrink-0">Verified</span>
                </div>
                <p className="text-[11px] font-mono text-text-secondary mt-1 truncate">{doc.number}</p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <button type="button" onClick={() => onPreviewDoc({ type: doc.title, number: doc.number, fileName: doc.file, note: doc.verified })} className="text-xs text-info-text hover:underline font-semibold inline-flex items-center gap-1">
                  <Eye size={12} aria-hidden="true" /> Preview
                </button>
                <button type="button" onClick={() => toast.success(`Downloaded ${doc.file} for ${member.name}`, { id: `admin-doc-dl-${doc.file}` })} className="text-xs text-text-secondary hover:text-text-primary p-1" title="Download PDF" aria-label={`Download ${doc.file}`}>
                  <Download size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
