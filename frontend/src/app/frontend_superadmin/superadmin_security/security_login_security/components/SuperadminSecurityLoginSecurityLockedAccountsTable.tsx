'use client';

import { useState, useMemo } from 'react';
import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
import { UserX, CheckCircle2, Send } from 'lucide-react';

export interface LockedAccount {
  id: string;
  email: string;
  role: string;
  failedCount: number;
  lockedAt: string;
  ip: string;
  reason: string;
}

interface SuperadminSecurityLoginSecurityLockedAccountsTableProps {
  lockedAccounts: LockedAccount[];
  onUnlockAccount: (id: string, email: string) => void;
  onSendRecoveryLink: (email: string) => void;
}

export default function SuperadminSecurityLoginSecurityLockedAccountsTable({
  lockedAccounts,
  onUnlockAccount,
  onSendRecoveryLink,
}: SuperadminSecurityLoginSecurityLockedAccountsTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const paginatedAccounts = useMemo(() => {
    return lockedAccounts.slice(page * pageSize, (page + 1) * pageSize);
  }, [lockedAccounts, page, pageSize]);
  return (
    <div className="p-5 sm:p-6 border border-rose-500/30 bg-gradient-to-b from-[#180d1e]/85 to-[#0e0714]/90 rounded-2xl shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <UserX size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Locked Accounts & Recovery Operations
            </h3>
            <p className="text-xs text-slate-400">
              Accounts locked due to brute-force limits. SuperAdmin can unlock directly or dispatch secure reset links.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300">
          {lockedAccounts.length} Accounts Currently Locked
        </span>
      </div>

      {lockedAccounts.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-400">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-400" />
          No accounts currently locked out. All administrator logins operating normally.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0a0d26]/80 text-slate-300 font-semibold uppercase tracking-wider border-b border-indigo-500/20">
              <tr>
                <th className="py-2.5 px-3">Locked Account</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Failed Attempts</th>
                <th className="py-2.5 px-3">Locked At</th>
                <th className="py-2.5 px-3">Trigger IP</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3 text-right">Recovery Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10 font-mono">
              {paginatedAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-indigo-950/20 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-slate-100">{acc.email}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200">
                      {acc.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-rose-400 font-bold">{acc.failedCount} failures</td>
                  <td className="py-3 px-3 text-slate-400">{acc.lockedAt}</td>
                  <td className="py-3 px-3 text-slate-300">{acc.ip}</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{acc.reason}</td>
                  <td className="py-3 px-3 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onUnlockAccount(acc.id, acc.email)}
                        className="px-3 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 text-[11px] font-semibold text-emerald-300 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Unlock
                      </button>
                      <button
                        type="button"
                        onClick={() => onSendRecoveryLink(acc.email)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-[11px] font-semibold text-indigo-300 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        <Send size={11} />
                        <span>Send Link</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SuperadminTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={lockedAccounts.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="locked accounts"
        />
        </div>
      )}
    </div>
  );
}