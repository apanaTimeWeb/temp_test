// RESPONSIBILITY: Individual module card with 3-tier status controls, iOS-style toggle switches, override and API Guard actions.
import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Settings2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Layers,
  BookOpen,
  Users,
  ArrowLeftRight,
  Wallet,
  Calculator,
  BellRing,
  UserCheck,
  FileText,
  FileSpreadsheet,
  Zap,
  MessageSquare,
  Send,
  QrCode,
  LayoutDashboard,
  KeyRound,
  Box,
  Fingerprint,
} from 'lucide-react';
import type {
  ModuleDefinition,
  PlatformModuleState,
  EffectiveAccessResult,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { SuperadminFeaturesToggleSwitch } from './SuperadminFeaturesToggleSwitch';

interface ModuleCardProps {
  module: ModuleDefinition;
  state: PlatformModuleState;
  effective: EffectiveAccessResult;
  isGlobalScope: boolean;
  onTogglePlatformDefault: (id: string) => void;
  onToggleLibraryModule?: (id: string) => void;
  onResetLibraryModule?: (id: string) => void;
  onOpenOverride: (mod: ModuleDefinition) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  BookOpen,
  Users,
  Layers,
  ArrowLeftRight,
  Wallet,
  Calculator,
  BellRing,
  UserCheck,
  FileText,
  FileSpreadsheet,
  Zap,
  MessageSquare,
  Send,
  QrCode,
  KeyRound,
  Box,
  Fingerprint,
};

export default function SuperadminFeaturesOverviewModuleCard({
  module,
  state,
  effective,
  isGlobalScope,
  onTogglePlatformDefault,
  onToggleLibraryModule,
  onResetLibraryModule,
  onOpenOverride,
}: ModuleCardProps) {
  const Icon = ICON_MAP[module.iconName] || Layers;
  const isGlobalAllowed = state.platformDefault;
  const isEffectiveAllowed = effective.effectiveAllowed;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-lg backdrop-blur-xl ${
        isEffectiveAllowed
          ? 'border-indigo-500/30 bg-[#0a0d24]/90 hover:border-indigo-500/50 shadow-indigo-950/30'
          : 'border-rose-500/25 bg-slate-950/80 hover:border-rose-500/40'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`p-2.5 rounded-xl shrink-0 ${
                isEffectiveAllowed
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-xs'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-sm leading-tight truncate">{module.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-indigo-500/20">
                  {module.minPlanTier}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5 block truncate">key: {module.key}</span>
            </div>
          </div>

          {/* Scope Primary Toggle Switch */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {isGlobalScope ? (
              <>
                <SuperadminFeaturesToggleSwitch
                  checked={isGlobalAllowed}
                  onChange={() => onTogglePlatformDefault(module.id)}
                  size="md"
                  title={`Platform Default: ${isGlobalAllowed ? 'Enabled' : 'Disabled'}`}
                  ariaLabel={`Platform default toggle for ${module.name}`}
                />
                <span className={`text-[9px] uppercase tracking-wider font-extrabold ${isGlobalAllowed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isGlobalAllowed ? 'PLATFORM: ON' : 'KILLSWITCH: OFF'}
                </span>
              </>
            ) : (
              <>
                <SuperadminFeaturesToggleSwitch
                  checked={isGlobalAllowed}
                  onChange={() => onTogglePlatformDefault(module.id)}
                  size="sm"
                  title={`L1 Platform Master Killswitch for ${module.name}`}
                  ariaLabel={`L1 Master Killswitch for ${module.name}`}
                />
                <span className={`text-[9px] uppercase tracking-wider font-extrabold ${isGlobalAllowed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isGlobalAllowed ? 'L1: ARMED' : 'L1: BLOCKED'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
          {module.description}
        </p>

        {/* Endpoints Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {module.apiEndpoints.map((ep) => (
            <span
              key={ep}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950/80 border border-indigo-500/20 text-slate-400"
            >
              {ep}
            </span>
          ))}
        </div>

        {/* Tier Entitlements Matrix mini-bar */}
        <div className="mt-3.5 pt-3 border-t border-indigo-500/20 grid grid-cols-3 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            {state.starterPlanAllowed ? (
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={13} className="text-slate-600 shrink-0" />
            )}
            <span className={state.starterPlanAllowed ? 'text-slate-200 font-medium' : 'text-slate-500'}>
              Starter
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {state.professionalPlanAllowed ? (
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={13} className="text-slate-600 shrink-0" />
            )}
            <span className={state.professionalPlanAllowed ? 'text-slate-200 font-medium' : 'text-slate-500'}>
              Pro
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {state.enterprisePlanAllowed ? (
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={13} className="text-slate-600 shrink-0" />
            )}
            <span className={state.enterprisePlanAllowed ? 'text-slate-200 font-medium' : 'text-slate-500'}>
              Enterprise
            </span>
          </div>
        </div>

        {/* SuperAdmin Control for Selected Library (Tenant Scope) */}
        {!isGlobalScope && onToggleLibraryModule && (
          <div className="mt-3.5 p-3 rounded-xl border border-indigo-500/20 bg-slate-950/70 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-200 block">
                Library Access Control:
              </span>
              <span className="text-[10px] text-slate-400">
                {!isGlobalAllowed
                  ? 'Globally Blocked by Platform Killswitch'
                  : effective.override
                  ? `Override: ${effective.override.overrideStatus}`
                  : 'Inherited from Library Plan'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <SuperadminFeaturesToggleSwitch
                checked={isEffectiveAllowed}
                onChange={() => onToggleLibraryModule(module.id)}
                size="md"
                disabled={!isGlobalAllowed}
                title={!isGlobalAllowed ? 'Blocked by Platform Killswitch' : `Toggle ${module.name} for current library`}
                ariaLabel={`Toggle ${module.name} for current library`}
              />

              {effective.override && onResetLibraryModule && (
                <button
                  type="button"
                  onClick={() => onResetLibraryModule(module.id)}
                  title="Reset to plan default"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer & Actions */}
      <div className="mt-4 pt-3.5 border-t border-indigo-500/20 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {isEffectiveAllowed ? (
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Effective: Active
              </span>
            ) : (
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <ShieldAlert size={14} /> Effective: Denied
              </span>
            )}
          </div>
          {effective.override && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              L3 Override
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400 truncate" title={effective.reason}>
          {effective.reason}
        </p>

        <div className="mt-1">
          <button
            type="button"
            onClick={() => onOpenOverride(module)}
            className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Settings2 size={13} />
            <span>Manage Custom Override</span>
          </button>
        </div>
      </div>
    </div>
  );
}
