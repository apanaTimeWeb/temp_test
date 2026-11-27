'use client';

import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import {
  formatDirectoryInrRupees,
  getDepositSettlementFinanceUrl,
  type MemberDepositSettlementInfo,
} from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDepositSettlement';
import { ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ManagerMembersDirectoryDepositClearanceCardProps {
  member: ManagerMembersDirectoryRecord;
  depositInfo: MemberDepositSettlementInfo;
  depositAction: 'refund_now' | 'leave_held';
  setDepositAction: (val: 'refund_now' | 'leave_held') => void;
}

export function ManagerMembersDirectoryDepositClearanceCard({
  member,
  depositInfo,
  depositAction,
  setDepositAction,
}: ManagerMembersDirectoryDepositClearanceCardProps) {
  if (!depositInfo.hasHeldDeposit) {
    return (
      <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <div>
            <span className="font-semibold text-primary block">Verify No-Dues & Deposit Clearance</span>
            <span className="text-[11px] text-secondary block">
              {depositInfo.status === 'Refunded'
                ? 'Security deposit is already refunded. Safe to graduate without outstanding financial dues.'
                : 'No active held security deposit on record. Locker & account clearance verified.'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={getDepositSettlementFinanceUrl(member.name, member.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-secondary hover:text-primary hover:underline"
            title="View Security Deposits ledger"
          >
            <span>Ledger</span>
            <ExternalLink size={10} />
          </a>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Clearance Verified
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3" data-testid="held-deposit-clearance-box">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-500">
                {`Active Security Deposit Held: ${formatDirectoryInrRupees(depositInfo.amount)}`}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400">
                Pending Settlement
              </span>
            </div>
            <p className="text-[11px] text-secondary mt-0.5">
              Student has an active refundable deposit on record. Settle or verify refund before closing account to prevent risk of unreturned dues.
            </p>
          </div>
        </div>
        <a
          href={getDepositSettlementFinanceUrl(member.name, member.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 motion-safe:transition-colors shrink-0"
          title="Open Finance Security Deposits desk in new tab"
        >
          <span>Settle Deposit ↗</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-amber-500/20 text-xs">
        <label
          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer motion-safe:transition-colors ${
            depositAction === 'refund_now' ? 'bg-amber-500/15 border-amber-500/50 text-primary font-semibold' : 'bg-surface border-border text-secondary hover:bg-surface-hover'
          }`}
        >
          <input type="radio" name="depositAction" value="refund_now" checked={depositAction === 'refund_now'} onChange={() => setDepositAction('refund_now')} className="w-3.5 h-3.5 text-amber-500 focus:ring-amber-400 cursor-pointer" />
          <span>{`Mark Refunded Now (${formatDirectoryInrRupees(depositInfo.amount)})`}</span>
        </label>

        <label
          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer motion-safe:transition-colors ${
            depositAction === 'leave_held' ? 'bg-amber-500/15 border-amber-500/50 text-primary font-semibold' : 'bg-surface border-border text-secondary hover:bg-surface-hover'
          }`}
        >
          <input type="radio" name="depositAction" value="leave_held" checked={depositAction === 'leave_held'} onChange={() => setDepositAction('leave_held')} className="w-3.5 h-3.5 text-amber-500 focus:ring-amber-400 cursor-pointer" />
          <span>Keep Held (Settle Later in Alumni)</span>
        </label>
      </div>
    </div>
  );
}
