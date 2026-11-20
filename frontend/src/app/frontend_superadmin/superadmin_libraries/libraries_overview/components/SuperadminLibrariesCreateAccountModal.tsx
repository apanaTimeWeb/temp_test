'use client';
/** Responsibility: Superadmin Library Creation Modal; orchestrates the 4-step wizard for Organization, Admin, Branches, and Provisioning. */
import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Building2, UserCheck, GitBranch, Layers, Sparkles } from 'lucide-react';
import SuperadminLibrariesCreateStepOrganization from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateStepOrganization';
import SuperadminLibrariesCreateStepAdmin from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateStepAdmin';
import SuperadminLibrariesCreateStepBranches from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateStepBranches';
import SuperadminLibrariesCreateStepProvisioning from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateStepProvisioning';

import type {
  LibraryOrganizationDetails,
  LibraryMainAdminAccount,
  LibraryBranchCreationItem,
  LibraryProvisioningPlan,
  LibraryProvisioningResult,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes';
import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLibraryCreated: (newLibrary: SuperadminLibrariesLibrary, result: LibraryProvisioningResult) => void;
  existingCodes?: string[];
}

const DEFAULT_PLAN: LibraryProvisioningPlan = {
  planId: 'plan-pro',
  planName: 'Pro Tier (Standard)',
  maxBranches: 3, // Default plan allows up to 3 branches, extensible in plan config
  monthlyFee: 14999,
};

export default function SuperadminLibrariesCreateAccountModal({
  isOpen,
  onClose,
  onLibraryCreated,
  existingCodes = [],
}: CreateAccountModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [provisioningResult, setProvisioningResult] = useState<LibraryProvisioningResult | null>(null);

  // Form State
  const [org, setOrg] = useState<LibraryOrganizationDetails>({
    libraryName: '',
    libraryCode: 'LIB-NEW-101',
    legalBusinessName: '',
    ownerName: '',
    contactNumber: '',
    emailAddress: '',
    address: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India',
    timeZone: 'Asia/Kolkata (IST, UTC+05:30)',
    status: 'Active',
  });

  const [admin, setAdmin] = useState<LibraryMainAdminAccount>({
    adminName: '',
    adminEmail: '',
    mobileNumber: '',
    loginId: 'admin_lead',
    role: 'Library Admin',
    passwordSetupMethod: 'secure_invitation_link',
    mfaEnforced: true,
    status: 'Invited',
  });

  const [branches, setBranches] = useState<LibraryBranchCreationItem[]>([
    {
      id: 'br-init-1',
      branchName: 'Main Campus Branch',
      branchCode: 'LIB-BR01',
      branchAddress: 'Ground Floor, Commercial Complex',
      contactNumber: '+91 98765 00001',
      branchEmail: 'main@apexlibrary.in',
      branchManager: 'Ramesh Varma',
      openingDate: new Date().toISOString().split('T')[0],
      workingHours: '06:00 AM - 11:00 PM',
      weeklyHolidays: 'None (Open 7 Days)',
      status: 'Active',
      allowedModules: {
        books: true,
        members: true,
        seats: true,
        finance: true,
        accounts: true,
        communication: true,
      },
      capacitySeats: 150,
      hasAirConditioning: true,
      hasLockers: true,
    },
  ]);

  if (!isOpen) return null;

  const canGoNext = () => {
    if (step === 1) return Boolean(org.libraryName.trim() && org.libraryCode.trim());
    if (step === 2) return Boolean(admin.adminName.trim() && admin.adminEmail.trim() && admin.loginId.trim());
    if (step === 3) return branches.length > 0 && branches.every((b) => Boolean(b.branchName.trim()));
    return true;
  };

  const handleExecuteProvisioning = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const generatedTenantId = `TENANT-${org.libraryCode.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedToken = `inv_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
      const inviteUrl = `https://platform.smartlibrary.in/admin/invite?token=${generatedToken}&tenant=${generatedTenantId}`;

      const result: LibraryProvisioningResult = {
        tenantId: generatedTenantId,
        libraryCode: org.libraryCode,
        adminEmail: admin.adminEmail,
        invitationUrl: inviteUrl,
        invitationToken: generatedToken,
        provisionedAt: new Date().toLocaleString(),
        branchesCreatedCount: branches.length,
        status: 'activation_pending',
      };

      const newLib: SuperadminLibrariesLibrary = {
        id: generatedTenantId,
        name: org.libraryName,
        location: `${org.city}, ${org.state}`,
        owner: org.ownerName || admin.adminName,
        branches: branches.length,
        students: branches.reduce((sum, b) => sum + (b.capacitySeats || 0), 0),
        revenue: 14999,
        status: org.status === 'Active' ? 'Active' : 'Maintenance',
        plan: 'Enterprise',
        joinedDate: 'Just now',
        adminPanelEnabled: true,
        branchList: branches.map((b) => ({
          id: b.id,
          name: b.branchName,
          city: org.city,
          students: b.capacitySeats,
          revenue: 14999,
          status: b.status === 'Active' ? 'Active' : 'Maintenance',
        })),
        managerModules: branches[0]?.allowedModules || {},
      };

      setProvisioningResult(result);
      setIsExecuting(false);
      onLibraryCreated(newLib, result);
    }, 900);
  };

  const handleClose = () => {
    setStep(1);
    setProvisioningResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl border border-indigo-500/40 bg-[#0c1222] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950/80 via-[#151c38] to-indigo-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">Create New Library Account</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                  SuperAdmin Only
                </span>
              </div>
              <p className="text-xs text-slate-400">Workspace provisioning, main Admin access, and branch setup</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Bar */}
        {!provisioningResult && (
          <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between overflow-x-auto text-xs">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
              <Building2 size={14} />
              <span>A. Organization</span>
            </div>
            <span className="text-slate-600">➔</span>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-400 font-bold' : 'text-slate-500'}`}>
              <UserCheck size={14} />
              <span>B. Main Admin</span>
            </div>
            <span className="text-slate-600">➔</span>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
              <GitBranch size={14} />
              <span>C. Branches</span>
            </div>
            <span className="text-slate-600">➔</span>
            <div className={`flex items-center gap-2 ${step === 4 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              <Layers size={14} />
              <span>D. Provisioning</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <SuperadminLibrariesCreateStepOrganization
              data={org}
              onChange={setOrg}
              existingCodes={existingCodes}
            />
          )}

          {step === 2 && (
            <SuperadminLibrariesCreateStepAdmin
              data={admin}
              onChange={setAdmin}
              defaultEmail={org.emailAddress}
              defaultOwner={org.ownerName}
            />
          )}

          {step === 3 && (
            <SuperadminLibrariesCreateStepBranches
              branches={branches}
              onChange={setBranches}
              plan={DEFAULT_PLAN}
              libraryCodePrefix={org.libraryCode}
            />
          )}

          {step === 4 && (
            <SuperadminLibrariesCreateStepProvisioning
              organization={org}
              admin={admin}
              branches={branches}
              provisioningResult={provisioningResult}
              isExecuting={isExecuting}
              onExecuteProvisioning={handleExecuteProvisioning}
              onDone={handleClose}
            />
          )}
        </div>

        {/* Modal Footer (Controls) */}
        {!provisioningResult && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">Step {step} of 4</span>

            {step < 4 ? (
              <button
                type="button"
                disabled={!canGoNext()}
                onClick={() => setStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s))}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/60 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
