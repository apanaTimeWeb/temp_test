'use client';
/** Responsibility: Step D of Library Creation Wizard; executes multi-tenant workspace provisioning, generates secure admin invitation link, and records audit trail. */
import { useState } from 'react';
import {CheckCircle2, Copy, Check, ShieldCheck, Building, KeyRound, ExternalLink, Layers} from 'lucide-react';
import type {
  LibraryOrganizationDetails,
  LibraryMainAdminAccount,
  LibraryBranchCreationItem,
  LibraryProvisioningResult,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes';

interface StepProvisioningProps {
  organization: LibraryOrganizationDetails;
  admin: LibraryMainAdminAccount;
  branches: LibraryBranchCreationItem[];
  provisioningResult: LibraryProvisioningResult | null;
  isExecuting: boolean;
  onExecuteProvisioning: () => void;
  onDone: () => void;
}

export default function SuperadminLibrariesCreateStepProvisioning({
  organization,
  admin,
  branches,
  provisioningResult,
  isExecuting,
  onExecuteProvisioning,
  onDone,
}: StepProvisioningProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!provisioningResult?.invitationUrl) return;
    navigator.clipboard.writeText(provisioningResult.invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If already provisioned, render Success Screen
  if (provisioningResult) {
    return (
      <div className="space-y-5 text-center py-4">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-white">Library Workspace Provisioned Successfully!</h3>
          <p className="text-xs text-slate-300 mt-1">
            Tenant workspace created on unified multi-tenant architecture with separate data isolation.
          </p>
        </div>

        {/* Tenant ID and Invitation Link Card */}
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 max-w-lg mx-auto text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Generated Tenant ID:</span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {provisioningResult.tenantId}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Admin Email:</span>
            <span className="font-semibold text-white">{provisioningResult.adminEmail}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Branches Provisioned:</span>
            <span className="font-semibold text-emerald-300">{provisioningResult.branchesCreatedCount} Branch(es)</span>
          </div>

          <div className="pt-2 border-t border-emerald-500/20">
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              One-Time Admin Onboarding & MFA Invitation Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={provisioningResult.invitationUrl}
                className="w-full rounded-xl border border-emerald-500/30 bg-slate-900 px-3 py-2 text-xs font-mono text-emerald-200 select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Share this secure invitation with the Admin. They will set their password and complete MFA.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onDone}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            Done & View in Library Directory
          </button>
        </div>
      </div>
    );
  }

  // Pre-provisioning Review
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
        <Layers size={18} className="text-amber-400" />
        <h3 className="text-sm font-bold text-white">Section D: Review & Account Provisioning</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Org Summary */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">Organization</span>
          <p className="text-sm font-bold text-white truncate">{organization.libraryName || 'Unnamed'}</p>
          <p className="text-xs text-slate-400">Code: <strong className="text-indigo-300 font-mono">{organization.libraryCode}</strong></p>
          <p className="text-xs text-slate-400">Owner: {organization.ownerName}</p>
          <p className="text-xs text-slate-400">City: {organization.city || 'India'}</p>
        </div>

        {/* Admin Summary */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">Main Admin</span>
          <p className="text-sm font-bold text-white truncate">{admin.adminName || 'Unnamed'}</p>
          <p className="text-xs text-slate-400 truncate">Email: {admin.adminEmail}</p>
          <p className="text-xs text-slate-400">Login ID: <strong className="text-purple-300 font-mono">{admin.loginId}</strong></p>
          <p className="text-xs text-emerald-400 font-medium">MFA: {admin.mfaEnforced ? 'Mandatory' : 'Optional'}</p>
        </div>

        {/* Branches Summary */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">Branches</span>
          <p className="text-sm font-bold text-white">{branches.length} Branch(es) Configured</p>
          <div className="space-y-0.5 text-xs text-slate-400">
            {branches.map((b, i) => (
              <p key={b.id || i} className="truncate">
                • {b.branchName} ({b.capacitySeats} seats)
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Tenant Automated Pipeline Notice */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>Automated Workspace Provisioning Workflow</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Clicking <strong>Confirm & Provision Account</strong> will automatically:
        </p>
        <ul className="text-xs text-slate-300 space-y-1 list-disc pl-5">
          <li>Create the unique Library Tenant ID in the multi-tenant architecture.</li>
          <li>Assign the Admin user with full workspace authority.</li>
          <li>Register all {branches.length} branch records with their selected module entitlements.</li>
          <li>Generate a zero-knowledge, single-use invitation link for the Admin.</li>
          <li>Record an immutable SuperAdmin audit log entry.</li>
        </ul>
      </div>

      <div className="pt-2 text-center">
        <button
          type="button"
          disabled={isExecuting}
          onClick={onExecuteProvisioning}
          className="w-full sm:w-auto min-w-[260px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isExecuting ? (
            <span>Provisioning Workspace Architecture...</span>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>Confirm & Provision Library Account</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
