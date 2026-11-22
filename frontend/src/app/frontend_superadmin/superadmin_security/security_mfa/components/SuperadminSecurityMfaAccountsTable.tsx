'use client';

import { useState } from 'react';
import { ShieldAlert, Search, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { MfaEnrollmentAccount } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaPolicyPanelsComponentTypes';

interface SuperadminSecurityMfaAccountsTableProps {
  accounts: MfaEnrollmentAccount[];
}

export default function SuperadminSecurityMfaAccountsTable({
  accounts,
}: SuperadminSecurityMfaAccountsTableProps) {
  const [accountSearch, setAccountSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'SuperAdmin' | 'Admin'>('All');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesRole = roleFilter === 'All' || acc.role === roleFilter;
    const matchesSearch =
      acc.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
      acc.email.toLowerCase().includes(accountSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="p-5 sm:p-6 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert size={18} className="text-emerald-400" />
            <span>Administrator MFA Enrollment & Compliance Status</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Live status of SuperAdmin break-glass accounts, operations leads, and tenant administrators.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="search"
              value={accountSearch}
              onChange={(e) => setAccountSearch(e.target.value)}
              placeholder="Search admin name/email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-card border border-border/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'All' | 'SuperAdmin' | 'Admin')}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-card border border-border/80 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Roles</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-card/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-border/70">
            <tr>
              <th className="py-2.5 px-3">Administrator Account</th>
              <th className="py-2.5 px-3">Role Scope</th>
              <th className="py-2.5 px-3">MFA Method</th>
              <th className="py-2.5 px-3">Enrolled At</th>
              <th className="py-2.5 px-3">Last Verified</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-mono">
            {filteredAccounts.map((acc) => {
              const isSuper = acc.role === 'SuperAdmin';
              const isEnforced = acc.status === 'Enforced';
              return (
                <tr key={acc.id} className="hover:bg-card/40 transition-colors">
                  <td className="py-3 px-3 font-sans">
                    <p className="font-bold text-slate-100">{acc.name}</p>
                    <p className="text-[11px] text-slate-400">{acc.email}</p>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSuper
                          ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                          : 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300'
                      }`}
                    >
                      {acc.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-200">{acc.method}</td>
                  <td className="py-3 px-3 text-slate-400">{acc.enrolledAt}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{acc.lastVerified}</td>
                  <td className="py-3 px-3 font-sans">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isEnforced
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                          : acc.status === 'Active'
                          ? 'bg-sky-500/10 text-sky-300 border border-sky-500/25'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                      }`}
                    >
                      {isEnforced ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {acc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => toast.info(`MFA challenge verification sent to ${acc.email}`, { id: `mfa-test-${acc.id}` })}
                      className="px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-[11px] font-semibold text-indigo-300 hover:text-white active:scale-95 transition-all cursor-pointer shadow-xs"
                    >
                      Test Auth
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}