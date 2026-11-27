'use client';

import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import { formatAlumniInr, getDepositSettlementFinanceUrl } from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniDepositSettlement';
import { ExternalLink, ShieldAlert } from 'lucide-react';

interface DepositClearanceProps {
  name: string;
  phone: string;
  depositAmount: number;
  depositSettlementStatus: MembersAlumniRow['depositSettlementStatus'];
  onChangeSettlement: (val: MembersAlumniRow['depositSettlementStatus']) => void;
}

export function ManagerMembersAlumniDepositClearanceBox({
  name,
  phone,
  depositAmount,
  depositSettlementStatus,
  onChangeSettlement,
}: DepositClearanceProps) {
  return (
    <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5" data-testid="alumni-held-deposit-box">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-500">Security Deposit Held: {formatAlumniInr(depositAmount)}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400">Pending Refund</span>
            </div>
            <p className="text-[11px] text-secondary mt-0.5">
              Verify deposit refund or handover before creating alumni record to ensure student account is cleared.
            </p>
          </div>
        </div>
        <a
          href={getDepositSettlementFinanceUrl(name, phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 motion-safe:transition-colors shrink-0"
          title="Open Finance Security Deposits desk in new tab"
        >
          <span>Settle Deposit ↗</span>
          <ExternalLink size={11} />
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1.5 border-t border-amber-500/20 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer text-primary font-medium">
          <input type="radio" name="alumniDepositAction" value="Refunded" checked={depositSettlementStatus === 'Refunded'} onChange={() => onChangeSettlement('Refunded')} className="w-3.5 h-3.5 text-amber-500 focus:ring-amber-400 cursor-pointer" />
          <span>Refund Deposit Now ({formatAlumniInr(depositAmount)})</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer text-secondary hover:text-primary">
          <input type="radio" name="alumniDepositAction" value="Held" checked={depositSettlementStatus === 'Held'} onChange={() => onChangeSettlement('Held')} className="w-3.5 h-3.5 text-amber-500 focus:ring-amber-400 cursor-pointer" />
          <span>Keep as Held (Pending Settlement)</span>
        </label>
      </div>
    </div>
  );
}
