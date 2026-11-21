'use client';
// RESPONSIBILITY: Accessible semantic table for Admin, Manager and Staff account security and live session controls.
import { Lock, Unlock, KeyRound, ShieldAlert, Laptop, Clock, ShieldCheck } from 'lucide-react';
import type { UserSecurityAccount } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';

interface SuperadminUserSecurityAccountsTableProps {
  users: UserSecurityAccount[];
  onOpenSecurityModal: (user: UserSecurityAccount) => void;
  onToggleLock: (userId: string, reason?: string) => void;
  onTriggerPasswordReset: (userId: string) => void;
}

export default function SuperadminUserSecurityAccountsTable({
  users,
  onOpenSecurityModal,
  onToggleLock,
  onTriggerPasswordReset,
}: SuperadminUserSecurityAccountsTableProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-hidden">
      <div className="p-4 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <KeyRound size={16} className="text-indigo-400" />
            <span>Admin & Staff Account Security Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Live session counts, account locks, MFA enrollment, and password controls.</p>
        </div>
        <span className="text-xs text-indigo-300 font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0">
          {users.length} Authorized Accounts
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#101438] text-slate-300 border-b border-indigo-500/20 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="py-3 px-4">User Identity</th>
              <th scope="col" className="py-3 px-4">Assigned Role</th>
              <th scope="col" className="py-3 px-4">Tenant / Branch Scope</th>
              <th scope="col" className="py-3 px-4">Account Status</th>
              <th scope="col" className="py-3 px-4">MFA Setup</th>
              <th scope="col" className="py-3 px-4">Active Sessions</th>
              <th scope="col" className="py-3 px-4">Last Active</th>
              <th scope="col" className="py-3 px-4 min-w-[220px] text-right">Security Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10 text-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-indigo-500/5 transition-colors">
                {/* User Identity */}
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-sm">{user.name}</div>
                  <div className="text-[11px] text-slate-400">{user.email}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{user.phone}</div>
                </td>

                {/* Role */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-300">
                    <ShieldCheck size={12} className="text-indigo-400" />
                    {user.roleName}
                  </span>
                  {user.hasTemporaryPermissions && (
                    <div className="text-[10px] text-amber-300 mt-0.5" title={user.temporaryPermissionExpiry}>
                      ⚡ Temp Elevation Active
                    </div>
                  )}
                </td>

                {/* Tenant / Branch */}
                <td className="py-3 px-4">
                  {user.libraryName ? (
                    <div>
                      <div className="font-semibold text-slate-200">{user.libraryName}</div>
                      <div className="text-[10px] text-slate-400">{user.branchName || 'All Assigned Branches'}</div>
                    </div>
                  ) : (
                    <span className="text-purple-300 font-semibold">Global Platform Internal</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    user.isLocked
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {user.isLocked ? <Lock size={10} /> : <Unlock size={10} />}
                    {user.isLocked ? 'LOCKED' : 'ACTIVE'}
                  </span>
                </td>

                {/* MFA */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {user.mfaEnabled ? (
                    <span className="text-emerald-400 font-semibold">Enrolled & Verified</span>
                  ) : (
                    <span className="text-amber-400 font-semibold">Pending Enrollment</span>
                  )}
                </td>

                {/* Sessions */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-slate-300 font-semibold">
                    <Laptop size={12} className="text-indigo-400" />
                    {user.activeSessions.length} live
                  </span>
                </td>

                {/* Last Active */}
                <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-500 shrink-0" />
                    <span>{user.lastActive}</span>
                  </div>
                </td>

                {/* Single-line Horizontal Actions */}
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5 flex-nowrap whitespace-nowrap">
                    {/* Security Hub */}
                    <button
                      type="button"
                      onClick={() => onOpenSecurityModal(user)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 font-semibold cursor-pointer shrink-0"
                      title="Manage Sessions, MFA & Temp Elevation"
                    >
                      <KeyRound size={12} />
                      <span>Security & Sessions</span>
                    </button>

                    {/* Lock / Unlock Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleLock(user.id)}
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-lg border transition-all cursor-pointer shrink-0 ${
                        user.isLocked
                          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-600/30'
                          : 'border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-600/30'
                      }`}
                      title={user.isLocked ? 'Unlock Account' : 'Lock Account'}
                    >
                      {user.isLocked ? <Unlock size={12} /> : <Lock size={12} />}
                    </button>

                    {/* Password Reset */}
                    <button
                      type="button"
                      onClick={() => onTriggerPasswordReset(user.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 font-semibold cursor-pointer shrink-0"
                      title="Dispatch Password Reset Link"
                    >
                      <span>Reset PWD</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
