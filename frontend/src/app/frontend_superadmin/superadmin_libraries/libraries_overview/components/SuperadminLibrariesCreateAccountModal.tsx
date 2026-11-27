'use client';
// RESPONSIBILITY: Superadmin Library Creation Modal matching Branch Creation Modal mechanics, backdrop-blur, portal mount, and scroll lock.
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Building2, UserCheck, GitBranch, Layers } from 'lucide-react';
import SuperadminLibrariesCreateStepOrganization from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateStepOrganization';
import SuperadminLibrariesCreateStepAdmin from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateStepAdmin';
import SuperadminLibrariesCreateStepBranches from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateStepBranches';
import SuperadminLibrariesCreateStepProvisioning from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateStepProvisioning';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import {
  DEFAULT_PROVISIONING_PLAN,
  INITIAL_ORG_STATE,
  INITIAL_ADMIN_STATE,
  INITIAL_BRANCHES_STATE,
  generateProvisioningPayload,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesCreateAccountUtils';

import type {
  LibraryOrganizationDetails,
  LibraryMainAdminAccount,
  LibraryBranchCreationItem,
  LibraryProvisioningResult,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes';
import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLibraryCreated: (newLibrary: SuperadminLibrariesLibrary, result: LibraryProvisioningResult) => void;
  existingCodes?: string[];
}

export default function SuperadminLibrariesCreateAccountModal({
  isOpen,
  onClose,
  onLibraryCreated,
  existingCodes = [],
}: CreateAccountModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [provisioningResult, setProvisioningResult] = useState<LibraryProvisioningResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalScrollLock(Boolean(isOpen && mounted));

  const handleClose = useCallback(() => {
    setStep(1);
    setProvisioningResult(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const [org, setOrg] = useState<LibraryOrganizationDetails>(INITIAL_ORG_STATE);
  const [admin, setAdmin] = useState<LibraryMainAdminAccount>(INITIAL_ADMIN_STATE);
  const [branches, setBranches] = useState<LibraryBranchCreationItem[]>(INITIAL_BRANCHES_STATE);

  if (!isOpen || !mounted) return null;

  const canGoNext = () => {
    if (step === 1) return Boolean(org.libraryName.trim() && org.libraryCode.trim());
    if (step === 2) return Boolean(admin.adminName.trim() && admin.adminEmail.trim() && admin.loginId.trim());
    if (step === 3) return branches.length > 0 && branches.every((b) => Boolean(b.branchName.trim()));
    return true;
  };

  const handleExecuteProvisioning = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const { result, newLib } = generateProvisioningPayload(org, admin, branches);
      setProvisioningResult(result);
      setIsExecuting(false);
      onLibraryCreated(newLib, result);
    }, 900);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in motion-safe:duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-indigo-500/40 bg-[#0d102b] shadow-2xl text-white max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 motion-safe:duration-200 ease-out"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950/80 via-[#151c38] to-indigo-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Create New Library Account (SuperAdmin Only)</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PROVISIONING
                </span>
              </div>
              <p className="text-xs text-slate-400">Workspace provisioning, main Admin access, and multi-branch setup</p>
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
          <div className="px-5 py-3 border-b border-indigo-500/20 bg-[#0c0f28] flex items-center justify-between overflow-x-auto text-xs shrink-0">
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
            <div className={`flex items-center gap-2 ${step === 4 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <Layers size={14} />
              <span>D. Provisioning</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
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
              plan={DEFAULT_PROVISIONING_PLAN}
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

        {/* Modal Footer Controls */}
        {!provisioningResult && (
          <div className="p-4 border-t border-indigo-500/20 bg-[#0c0f28]/95 flex items-center justify-between shrink-0">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none motion-safe:transition-all cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-950/60 disabled:opacity-40 disabled:pointer-events-none motion-safe:transition-all cursor-pointer active:scale-95"
              >
                <span>Continue</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
