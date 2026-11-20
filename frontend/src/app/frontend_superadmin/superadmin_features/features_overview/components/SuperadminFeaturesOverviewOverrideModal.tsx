// RESPONSIBILITY: Modal dialog for managing Level 3 Account & Branch custom overrides.
import React, { useState } from 'react';
import { X, KeyRound, AlertTriangle, Trash2, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import type {
  ModuleDefinition,
  TenantModuleOverride,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import type { MockTenantOption } from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';
import { TENANT_MODULE_OVERRIDE_SCHEMA } from '@/app/frontend_superadmin/superadmin_features/features_overview/schemas/superadmin_features_overview.schema';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <KeyRound size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Custom Exception Override</h2>
              <p className="text-xs text-neutral-400">
                Module: <span className="text-neutral-200 font-semibold">{module.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Target Tenant Organization */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Target Library Organization *
            </label>
            <select
              value={tenantId}
              onChange={(e) => {
                setTenantId(e.target.value);
                setBranchId('');
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
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
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Branch Scope (Optional)
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">Whole Organization (All Branches)</option>
              {selectedTenant?.branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-400 mt-1">
              Leave blank to apply this override to all branches of this organization.
            </p>
          </div>

          {/* Action: Force Enabled or Force Disabled */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Override Enforcement Action *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOverrideStatus('Force_Enabled')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  overrideStatus === 'Force_Enabled'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                    : 'border-border bg-card/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Force Enable</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Grant access even if not in plan
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOverrideStatus('Force_Disabled')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  overrideStatus === 'Force_Disabled'
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                    : 'border-border bg-card/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Force Disable</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Block access even if plan permits
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Audit Reason */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Audit Justification / Reason *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Granted 30-day trial for marketing campaign or compliance block..."
              rows={2}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-input text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Expiry Date (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Optional Expiry Date (Temporary Exception)
            </label>
            <div className="relative">
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Existing Overrides for this module */}
          {moduleOverrides.length > 0 && (
            <div className="pt-3 border-t border-border/60">
              <h4 className="text-xs font-semibold text-neutral-300 mb-2">
                Active Exceptions for this Module ({moduleOverrides.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {moduleOverrides.map((ovr) => (
                  <div
                    key={ovr.id}
                    className="p-2.5 rounded-lg border border-border bg-neutral-900/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {ovr.tenantName} {ovr.branchName ? `(${ovr.branchName})` : ''}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Status: <span className="text-amber-400">{ovr.overrideStatus}</span> • {ovr.reason}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(ovr.id)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-400 transition-colors"
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-input text-neutral-300 text-xs font-medium hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Save Custom Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
