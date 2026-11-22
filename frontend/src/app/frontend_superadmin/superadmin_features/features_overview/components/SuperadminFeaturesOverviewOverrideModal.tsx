// RESPONSIBILITY: Modal dialog for managing Level 3 Account & Branch custom overrides.
import React, { useState, useEffect } from 'react';
import { X, KeyRound, AlertTriangle, Trash2, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import type {
  ModuleDefinition,
  TenantModuleOverride,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import type { MockTenantOption } from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';
import { TENANT_MODULE_OVERRIDE_SCHEMA } from '@/app/frontend_superadmin/superadmin_features/features_overview/schemas/superadmin_features_overview.schema';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import { SuperadminFeaturesToggleSwitch } from './SuperadminFeaturesToggleSwitch';

interface OverrideModalProps {
  module: ModuleDefinition;
  tenants: MockTenantOption[];
  overrides: TenantModuleOverride[];
  currentTenantId: string;
  onClose: () => void;
  onSave: (override: Omit<TenantModuleOverride, 'id' | 'updatedAt' | 'updatedBy'>) => void;
  onDelete: (overrideId: string) => void;
}

export default function SuperadminFeaturesOverviewOverrideModal({
  module,
  tenants,
  overrides,
  currentTenantId,
  onClose,
  onSave,
  onDelete,
}: OverrideModalProps) {
  useModalScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const initialTenantId = currentTenantId !== 'global' ? currentTenantId : (tenants[0]?.id ?? '');
  const [tenantId, setTenantId] = useState<string>(initialTenantId);
  const [branchId, setBranchId] = useState<string>('');
  const [overrideStatus, setOverrideStatus] = useState<'Force_Enabled' | 'Force_Disabled'>('Force_Enabled');
  const [reason, setReason] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedTenant = tenants.find((t) => t.id === tenantId);
  const selectedBranch = selectedTenant?.branches.find((b) => b.id === branchId);
  const moduleOverrides = overrides.filter((o) => o.moduleId === module.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      tenantId,
      tenantName: selectedTenant?.name ?? tenantId,
      branchId: branchId || undefined,
      branchName: selectedBranch?.name || undefined,
      moduleId: module.id,
      moduleName: module.name,
      overrideStatus,
      reason,
      expiresAt: expiresAt || undefined,
    };

    const result = TENANT_MODULE_OVERRIDE_SCHEMA.safeParse(payload);
    if (!result.success) {
      setErrorMessage(result.error.issues[0]?.message ?? 'Invalid override details.');
      return;
    }

    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-3xl border border-indigo-500/30 bg-[#0a0d24] text-white shadow-2xl shadow-indigo-950/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-500/20 bg-[#060818]/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <KeyRound size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Custom Exception Override</h2>
              <p className="text-xs text-slate-400">
                Module: <span className="text-white font-semibold">{module.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 scrollbar-thin">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Target Tenant Organization */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Target Library Organization *
            </label>
            <select
              value={tenantId}
              onChange={(e) => {
                setTenantId(e.target.value);
                setBranchId('');
              }}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-indigo-500/25 bg-slate-950/80 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.code} - {t.planTier} Tier)
                </option>
              ))}
            </select>
          </div>

          {/* Branch Target (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Branch Scope (Optional)
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-indigo-500/25 bg-slate-950/80 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="">Whole Organization (All Branches)</option>
              {selectedTenant?.branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to apply this override to all branches of this organization.
            </p>
          </div>

          {/* Action: Force Enabled or Force Disabled Toggle */}
          <div className="p-4 rounded-2xl border border-indigo-500/20 bg-slate-950/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-200">
                  Override Enforcement State
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {overrideStatus === 'Force_Enabled'
                    ? 'Force Enable: Grant access even if plan restricts'
                    : 'Force Disable: Deny access even if plan permits'}
                </p>
              </div>
              <SuperadminFeaturesToggleSwitch
                checked={overrideStatus === 'Force_Enabled'}
                onChange={(checked) => setOverrideStatus(checked ? 'Force_Enabled' : 'Force_Disabled')}
                size="md"
                labelOn="ON"
                labelOff="OFF"
              />
            </div>
          </div>

          {/* Audit Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Audit Justification / Reason *
            </label>
            <textarea maxLength={1000}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Granted 30-day trial for marketing campaign or compliance block..."
              rows={2}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-indigo-500/25 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Expiry Date (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Optional Expiry Date (Temporary Exception)
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-indigo-500/25 bg-slate-950/80 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Existing Overrides for this module */}
          {moduleOverrides.length > 0 && (
            <div className="pt-3 border-t border-indigo-500/20">
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                Active Exceptions for this Module ({moduleOverrides.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                {moduleOverrides.map((ovr) => (
                  <div
                    key={ovr.id}
                    className="p-3 rounded-xl border border-indigo-500/15 bg-slate-950/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {ovr.tenantName} {ovr.branchName ? `(${ovr.branchName})` : ''}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Status: <span className="text-amber-400 font-bold">{ovr.overrideStatus}</span> • {ovr.reason}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(ovr.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Remove Override"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/25 transition-all cursor-pointer active:scale-95"
            >
              Save Custom Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}