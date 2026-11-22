'use client';
/** Responsibility: Step B of Library Creation Wizard; provisions the main library admin account with zero-knowledge invitation tokens and mandatory MFA. */
import { CheckCircle2, UserCheck, ShieldCheck, Mail, Phone, Lock, KeyRound } from 'lucide-react';
import type { LibraryMainAdminAccount } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes';

interface StepAdminProps {
  data: LibraryMainAdminAccount;
  onChange: (updated: LibraryMainAdminAccount) => void;
  defaultEmail?: string;
  defaultOwner?: string;
}

export default function SuperadminLibrariesCreateStepAdmin({
  data,
  onChange,
  defaultEmail,
  defaultOwner,
}: StepAdminProps) {
  const handleAutoFillFromOwner = () => {
    if (!data.adminName && defaultOwner) {
      data.adminName = defaultOwner;
    }
    if (!data.adminEmail && defaultEmail) {
      data.adminEmail = defaultEmail;
    }
    const derivedLoginId = (data.adminEmail || defaultEmail || 'admin')
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');
    onChange({
      ...data,
      adminName: data.adminName || defaultOwner || '',
      adminEmail: data.adminEmail || defaultEmail || '',
      loginId: derivedLoginId || `admin_${Math.floor(100 + Math.random() * 900)}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <UserCheck size={18} className="text-purple-400" />
          <h3 className="text-sm font-bold text-white">Section B: Main Admin Account Creation</h3>
        </div>
        {(defaultOwner || defaultEmail) && (
          <button
            type="button"
            onClick={handleAutoFillFromOwner}
            className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 size={11} className="text-emerald-400" />
            <span>Copy From Owner Details</span>
          </button>
        )}
      </div>

      {/* Row 1: Admin Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Admin Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rajesh Sharma"
            value={data.adminName}
            onChange={(e) => onChange({ ...data, adminName: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1">
            <Mail size={11} className="text-purple-400" />
            <span>Admin Email (Login Identity)</span> <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="admin@apexlibrary.in"
            value={data.adminEmail}
            onChange={(e) => onChange({ ...data, adminEmail: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Row 2: Mobile Number and Login ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1">
            <Phone size={11} className="text-purple-400" />
            <span>Mobile Number (Verification)</span> <span className="text-rose-400">*</span>
          </label>
          <input maxLength={15}
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={data.mobileNumber}
            onChange={(e) => onChange({ ...data, mobileNumber: e.target.value })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Unique Login ID <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. rajesh_apex"
            value={data.loginId}
            onChange={(e) => onChange({ ...data, loginId: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs font-mono font-bold text-purple-300 placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Row 3: Role and Account Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Role Permission</label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold">
            <ShieldCheck size={16} />
            <span>Library Admin (Full Workspace Authority)</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Admin Status</label>
          <select
            value={data.status}
            onChange={(e) => onChange({ ...data, status: e.target.value as 'Invited' | 'Active' | 'Suspended' })}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 focus:border-purple-400 focus:outline-none cursor-pointer"
          >
            <option value="Invited">Invited (Awaiting Password & MFA Setup)</option>
            <option value="Active">Active (Provisioned)</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Security Architecture Recommendation Callout */}
      <div className="p-4 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
          <KeyRound size={15} />
          <span>Zero-Knowledge Secure Invitation Protocol</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          As recommended, SuperAdmin does NOT set a permanent plain-text password. The platform generates an encrypted single-use onboarding token. The Admin receives the invite, securely chooses their private credentials, and completes multi-factor enrollment.
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-indigo-500/20 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-medium">
            <input
              type="checkbox"
              checked={data.mfaEnforced}
              onChange={(e) => onChange({ ...data, mfaEnforced: e.target.checked })}
              className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
            />
            <span>Enforce Mandatory Multi-Factor Authentication (MFA)</span>
          </label>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Enterprise Security</span>
        </div>
      </div>
    </div>
  );
}
