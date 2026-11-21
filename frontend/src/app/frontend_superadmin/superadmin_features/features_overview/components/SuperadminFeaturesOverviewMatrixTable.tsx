// RESPONSIBILITY: Matrix comparison table view across all 16 modules and 3 governance tiers with iOS-style toggles.
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
import { SuperadminFeaturesToggleSwitch } from './SuperadminFeaturesToggleSwitch';

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
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[1050px] text-left text-xs">
          <thead className="bg-[#060818]/90 border-b border-indigo-500/20 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Library Module</th>
              <th className="py-3.5 px-3 text-center">Category</th>
              <th className="py-3.5 px-3 text-center">SuperAdmin Control</th>
              <th className="py-3.5 px-3 text-center">L1: Platform Default</th>
              <th className="py-3.5 px-3 text-center">Starter</th>
              <th className="py-3.5 px-3 text-center">Pro</th>
              <th className="py-3.5 px-3 text-center">Enterprise</th>
              <th className="py-3.5 px-4 text-center">Effective Access</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/15">
            {items.map(({ module: mod, state, effective }) => {
              const isEffectiveAllowed = effective.effectiveAllowed;
              const isPlatformOn = state.platformDefault;

              return (
                <tr
                  key={mod.id}
                  className="hover:bg-indigo-500/[0.06] transition-colors"
                >
                  {/* Module Name & Key */}
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div>
                      <span className="font-bold text-white text-xs">{mod.name}</span>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{mod.key}</div>
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900 text-slate-300 border border-indigo-500/25">
                      {mod.category}
                    </span>
                  </td>

                  {/* SuperAdmin Control for Library Account (iOS Switch) */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!isPlatformOn ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          Killswitch
                        </span>
                      ) : onToggleLibraryModule ? (
                        <>
                          <SuperadminFeaturesToggleSwitch
                            size="sm"
                            checked={isEffectiveAllowed}
                            onChange={() => onToggleLibraryModule(mod.id)}
                            title={`Toggle ${mod.name} for current scope`}
                            ariaLabel={`Toggle ${mod.name}`}
                          />

                          {effective.override && onResetLibraryModule && (
                            <button
                              type="button"
                              onClick={() => onResetLibraryModule(mod.id)}
                              title="Reset to plan default"
                              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </div>
                  </td>

                  {/* L1: Platform Default Switch (iOS Switch) */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center">
                      <SuperadminFeaturesToggleSwitch
                        size="sm"
                        checked={state.platformDefault}
                        onChange={() => onTogglePlatformDefault(mod.id)}
                        title={`L1 Platform Switch for ${mod.name}`}
                        ariaLabel={`Platform default switch for ${mod.name}`}
                      />
                    </div>
                  </td>

                  {/* Starter Tier Entitlement */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onTogglePlanEntitlement(mod.id, 'Starter')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        state.starterPlanAllowed
                          ? 'text-emerald-400 hover:bg-emerald-500/15'
                          : 'text-slate-600 hover:bg-slate-800'
                      }`}
                      title="Toggle Starter entitlement"
                    >
                      {state.starterPlanAllowed ? <Check size={15} /> : <X size={15} />}
                    </button>
                  </td>

                  {/* Pro Tier Entitlement */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onTogglePlanEntitlement(mod.id, 'Professional')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        state.professionalPlanAllowed
                          ? 'text-emerald-400 hover:bg-emerald-500/15'
                          : 'text-slate-600 hover:bg-slate-800'
                      }`}
                      title="Toggle Pro entitlement"
                    >
                      {state.professionalPlanAllowed ? <Check size={15} /> : <X size={15} />}
                    </button>
                  </td>

                  {/* Enterprise Tier Entitlement */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onTogglePlanEntitlement(mod.id, 'Enterprise')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        state.enterprisePlanAllowed
                          ? 'text-emerald-400 hover:bg-emerald-500/15'
                          : 'text-slate-600 hover:bg-slate-800'
                      }`}
                      title="Toggle Enterprise entitlement"
                    >
                      {state.enterprisePlanAllowed ? <Check size={15} /> : <X size={15} />}
                    </button>
                  </td>

                  {/* Effective Access Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {isEffectiveAllowed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        <ShieldCheck size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                        <ShieldAlert size={12} /> Denied
                      </span>
                    )}
                  </td>

                  {/* Actions Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenOverride(mod)}
                        title="Manage Custom Override"
                        className="p-1.5 rounded-lg border border-indigo-500/25 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Settings2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenApiGuard(mod)}
                        title="Test Backend API Denial Guard"
                        className="p-1.5 rounded-lg border border-teal-500/30 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 transition-colors cursor-pointer"
                      >
                        <Terminal size={13} />
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