// RESPONSIBILITY: Matrix comparison table view across all 16 modules and 3 governance tiers with SuperAdmin controls.
import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Settings2,
  Terminal,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import type {
  ModuleDefinition,
  PlatformModuleState,
  EffectiveAccessResult,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';

interface MatrixTableProps {
  items: Array<{
    module: ModuleDefinition;
    state: PlatformModuleState;
    effective: EffectiveAccessResult;
  }>;
  isGlobalScope?: boolean;
  onTogglePlatformDefault: (id: string) => void;
  onTogglePlanEntitlement: (id: string, tier: 'Starter' | 'Professional' | 'Enterprise') => void;
  onToggleLibraryModule?: (id: string) => void;
  onResetLibraryModule?: (id: string) => void;
  onOpenOverride: (mod: ModuleDefinition) => void;
  onOpenApiGuard: (mod: ModuleDefinition) => void;
}

export default function SuperadminFeaturesOverviewMatrixTable({
  items,
  isGlobalScope = false,
  onTogglePlatformDefault,
  onTogglePlanEntitlement,
  onToggleLibraryModule,
  onResetLibraryModule,
  onOpenOverride,
  onOpenApiGuard,
}: MatrixTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card/80 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-900/80 border-b border-border text-neutral-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Library Module</th>
              <th className="py-3 px-3 text-center">Category</th>
              <th className="py-3 px-3 text-center">SuperAdmin Control</th>
              <th className="py-3 px-3 text-center">L1: Platform Default</th>
              <th className="py-3 px-3 text-center">Starter</th>
              <th className="py-3 px-3 text-center">Pro</th>
              <th className="py-3 px-3 text-center">Enterprise</th>
              <th className="py-3 px-4 text-center">Effective Access</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map(({ module: mod, state, effective }) => {
              const isEffectiveAllowed = effective.effectiveAllowed;
              const isPlatformOn = state.platformDefault;

              return (
                <tr
                  key={mod.id}
                  className="hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-white">
                    <div>
                      <span className="font-semibold">{mod.name}</span>
                      <div className="text-[11px] font-mono text-neutral-400">{mod.key}</div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-neutral-800 text-neutral-300 border border-border">
                      {mod.category}
                    </span>
                  </td>

                  {/* SuperAdmin Control for Library Account */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {!isPlatformOn ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          Killswitch
                        </span>
                      ) : onToggleLibraryModule ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onToggleLibraryModule(mod.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                              isEffectiveAllowed
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                            }`}
                          >
                            {isEffectiveAllowed ? <Check size={12} /> : <X size={12} />}
                            <span>{isEffectiveAllowed ? 'Enabled' : 'Disabled'}</span>
                          </button>

                          {effective.override && onResetLibraryModule && (
                            <button
                              type="button"
                              onClick={() => onResetLibraryModule(mod.id)}
                              title="Reset to plan default"
                              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">—</span>
                      )}
                    </div>
                  </td>

                  {/* L1: Platform Default */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onTogglePlatformDefault(mod.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        state.platformDefault
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {state.platformDefault ? 'ON' : 'KILLSWITCH'}
                    </button>
                  </td>

                  {/* Starter Tier */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onTogglePlanEntitlement(mod.id, 'Starter')}
                      className={`p-1.5 rounded transition-colors ${
                        state.starterPlanAllowed
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-neutral-500 hover:bg-neutral-800'
                      }`}
                      title="Toggle Starter entitlement"
                    >
                      {state.starterPlanAllowed ? <Check size={15} /> : <X size={15} />}
                    </button>
                  </td>

                  {/* Pro Tier */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onTogglePlanEntitlement(mod.id, 'Professional')}
                      className={`p-1.5 rounded transition-colors ${
                        state.professionalPlanAllowed
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-neutral-500 hover:bg-neutral-800'
                      }`}
                      title="Toggle Pro entitlement"
                    >
                      {state.professionalPlanAllowed ? <Check size={15} /> : <X size={15} />}
                    </button>
                  </td>

                  {/* Enterprise Tier */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onTogglePlanEntitlement(mod.id, 'Enterprise')}
                      className={`p-1.5 rounded transition-colors ${
                        state.enterprisePlanAllowed
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-neutral-500 hover:bg-neutral-800'
                      }`}
                      title="Toggle Enterprise entitlement"
                    >
                      {state.enterprisePlanAllowed ? <Check size={15} /> : <X size={15} />}
                    </button>
                  </td>

                  {/* Effective Access */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isEffectiveAllowed
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                        }`}
                      >
                        {isEffectiveAllowed ? (
                          <>
                            <ShieldCheck size={12} /> Active
                          </>
                        ) : (
                          <>
                            <ShieldAlert size={12} /> Denied
                          </>
                        )}
                      </span>
                      {effective.override && (
                        <span className="text-[10px] text-amber-400 mt-0.5 font-medium">
                          Override applied
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenOverride(mod)}
                        className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-300 transition-colors"
                        title="Set Custom Tenant/Branch Override"
                      >
                        <Settings2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenApiGuard(mod)}
                        className="p-1.5 rounded-md hover:bg-teal-500/20 text-teal-400 transition-colors"
                        title="Simulate API Guard Request"
                      >
                        <Terminal size={14} />
                      </button>
                    </div>
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
