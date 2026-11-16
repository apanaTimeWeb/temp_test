'use client';

import { useTranslations } from 'next-intl';
import {
  History,
  ShieldCheck,
  PauseCircle,
  IndianRupee,
  BookOpen,
  Lock,
  Clock,
} from 'lucide-react';
import type { ManagerMembersDirectorySupportingSectionsProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';

interface AuditTrailEvent {
  id: string;
  memberId: string;
  memberName: string;
  action: string;
  type: 'leave' | 'fee' | 'kyc' | 'seat';
  details: string;
  timestamp: string;
  badge: string;
}

const RECENT_AUDIT_EVENTS: AuditTrailEvent[] = [
  {
    id: 'EVT-501',
    memberId: 'LIB-001',
    memberName: 'Aarav Sharma',
    action: 'Leave / Freeze Registered',
    type: 'leave',
    details: '15 Days break for UPSC Prelims Center visit. Expiry extended by 15 days.',
    timestamp: 'Today, 11:30 AM',
    badge: 'On Leave',
  },
  {
    id: 'EVT-502',
    memberId: 'LIB-002',
    memberName: 'Priya Singh',
    action: 'Plan Renewed & Fee Collected',
    type: 'fee',
    details: '₹2,200 collected via UPI (Full Day Shift · Seat B-05). Receipt #REC-8841.',
    timestamp: 'Today, 10:15 AM',
    badge: 'Renewed',
  },
  {
    id: 'EVT-503',
    memberId: 'LIB-003',
    memberName: 'Rohan Gupta',
    action: 'KYC Document Verified',
    type: 'kyc',
    details: 'Aadhaar Card proof approved & phone verified by Counter Manager.',
    timestamp: 'Yesterday, 04:45 PM',
    badge: 'Verified',
  },
  {
    id: 'EVT-504',
    memberId: 'LIB-004',
    memberName: 'Sneha Patel',
    action: 'Locker Assigned',
    type: 'seat',
    details: 'Locker #L-14 allotted with ₹500 refundable security deposit.',
    timestamp: '14 Nov 2026',
    badge: 'Locker Allocated',
  },
];

const DIRECTORY_SOPS = [
  {
    title: 'Membership Freeze & Leave Rules',
    icon: PauseCircle,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    badge: 'Max 30 Days',
    points: [
      'Allowed for outstation exams, home festivals, or verified illness.',
      'Plan expiration date is automatically extended by the freeze duration.',
      'Seat is marked as buffer-available for guest day passes while student is away.',
    ],
  },
  {
    title: 'Counter Fee Collection & Renewals',
    icon: IndianRupee,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    badge: 'Composite Bill',
    points: [
      'Profile page allows 1-click jump to Fee Collection with pre-filled student details.',
      'Single receipt covers Seat Fee + Registration + Locker + Security Deposit.',
      'Digital confirmation sent directly to member via WhatsApp & SMS.',
    ],
  },
  {
    title: 'KYC & Document Verification',
    icon: ShieldCheck,
    color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    badge: 'Mandatory',
    points: [
      'Government Photo ID proof (Aadhaar / Voter / License) required within 7 days.',
      'Target exam admit card or coaching enrollment slip for student verification.',
      'Guardian emergency contact must be verified before biometric or 24h pass issuance.',
    ],
  },
  {
    title: 'Security Deposit & Exit Clearance',
    icon: Lock,
    color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400',
    badge: 'No-Dues',
    points: [
      'Physical locker key surrendered and locker inspected by shift manager.',
      'Zero outstanding dues verified on library fee ledger.',
      'Security deposit refunded to original payment UPI within 24 operational hours.',
    ],
  },
];

export function ManagerMembersDirectorySupportingSections({
  activeTab,
}: ManagerMembersDirectorySupportingSectionsProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');

  return (
    <section
      aria-label="Directory Operational Support & Audit Log"
      className="mt-8 pt-8 border-t border-border space-y-8"
    >
      {/* ── SECTION 1: Counter SOP & Membership Guidelines ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
              <BookOpen size={16} />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                Membership Operations & Counter SOP Guidelines
              </h3>
              <p className="text-xs text-muted-foreground">
                Standard operating procedures for student leave, fee collection, and KYC verification
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground bg-surface-highlight border border-border px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Operational Scope: {activeTab}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIRECTORY_SOPS.map((sop) => {
            const Icon = sop.icon;
            return (
              <div
                key={sop.title}
                className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-card transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center bg-gradient-to-br ${sop.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                      {sop.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-2 group-hover:text-primary transition-colors">
                    {sop.title}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {sop.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-tight">
                        <span className="text-primary font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: Member Lifecycle Audit Trail & Activity Log ── */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-highlight border border-border text-primary flex items-center justify-center font-bold">
              <History size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                <span>{tManagerUi('audit_activity_history') || 'Recent Member Lifecycle Activity & Audit Log'}</span>
                <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Live Log
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Verified timeline of membership leaves, fee renewals, and KYC approvals
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {RECENT_AUDIT_EVENTS.map((event) => {
            const badgeClass =
              event.type === 'leave'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : event.type === 'fee'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : event.type === 'kyc'
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                : 'bg-purple-500/15 text-purple-300 border-purple-500/30';

            return (
              <div
                key={event.id}
                className="p-3.5 rounded-xl border border-border bg-surface-highlight hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-0.5">
                    {event.memberId.slice(-3)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-foreground">
                        {event.memberName}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        ({event.memberId})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md border ${badgeClass}`}>
                        {event.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {event.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-right">
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock size={12} className="text-muted-foreground" />
                    <span>{event.timestamp}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
