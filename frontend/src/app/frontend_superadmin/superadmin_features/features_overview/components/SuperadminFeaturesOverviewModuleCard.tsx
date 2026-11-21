// RESPONSIBILITY: Individual module card with 3-tier status controls, 1-click Library switch, override and API Guard actions.
import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Terminal,
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
  Sparkles,
  MessageSquare,
  Send,
  QrCode,
  LayoutDashboard,
  KeyRound,
  Check,
  X,
} from 'lucide-react';
import type {
  ModuleDefinition,
  PlatformModuleState,
  EffectiveAccessResult,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';

interface ModuleCardProps {
  module: ModuleDefinition;
  state: PlatformModuleState;
  effective: EffectiveAccessResult;
  isGlobalScope: boolean;
  onTogglePlatformDefault: (id: string) => void;
  onToggleLibraryModule?: (id: string) => void;
  onResetLibraryModule?: (id: string) => void;
  onOpenOverride: (mod: ModuleDefinition) => void;
  onOpenApiGuard: (mod: ModuleDefinition) => void;
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
  Sparkles,
  MessageSquare,
  Send,
  QrCode,
  KeyRound,
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
  onOpenApiGuard,
}: ModuleCardProps) {
  const Icon = ICON_MAP[module.iconName] || Layers;
  const isGlobalAllowed = state.platformDefault;
  const isEffectiveAllowed = effective.effectiveAllowed;

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
        isEffectiveAllowed
          ? 'border-border bg-card shadow-sm hover:border-neutral-700'
          : 'border-neutral-800 bg-neutral-900/40 opacity-90'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-lg shrink-0 ${
                isEffectiveAllowed
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                  : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
              }`}
            >
              <Icon size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm leading-tight">{module.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  {module.minPlanTier}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">key: {module.key}</span>
            </div>
          </div>

          {/* Level 1: Platform Switch Toggle */}
          <div className="flex flex-col items-end">
            <button
              type="button"
              onClick={() => onTogglePlatformDefault(module.id)}
              aria-pressed={isGlobalAllowed}
              title={`Platform Default: ${isGlobalAllowed ? 'Enabled' : 'Disabled (Platform Killswitch)'}`}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isGlobalAllowed ? 'bg-teal-500' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isGlobalAllowed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-neutral-500 mt-1">
              L1 Default
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed">
          {module.description}
        </p>

        {/* Endpoints */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {module.apiEndpoints.map((ep) => (
            <span
              key={ep}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-border text-neutral-400"
            >
              {ep}
            </span>
          ))}
        </div>

        {/* Tier Entitlements Matrix mini-bar */}
        <div className="mt-3 pt-2.5 border-t border-border/50 grid grid-cols-3 gap-1 text-[11px]">
          <div className="flex items-center gap-1">
            {state.starterPlanAllowed ? (
              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={12} className="text-neutral-500 shrink-0" />
            )}
            <span className={state.starterPlanAllowed ? 'text-neutral-300' : 'text-neutral-500'}>
              Starter
            </span>
          </div>
          <div className="flex items-center gap-1">
            {state.professionalPlanAllowed ? (
              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={12} className="text-neutral-500 shrink-0" />
            )}
            <span className={state.professionalPlanAllowed ? 'text-neutral-300' : 'text-neutral-500'}>
              Pro
            </span>
          </div>
          <div className="flex items-center gap-1">
            {state.enterprisePlanAllowed ? (
              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={12} className="text-neutral-500 shrink-0" />
            )}
            <span className={state.enterprisePlanAllowed ? 'text-neutral-300' : 'text-neutral-500'}>
              Enterprise
            </span>
          </div>
        </div>

        {/* SuperAdmin Control for Selected Library */}
        {!isGlobalScope && onToggleLibraryModule && (
          <div className="mt-3 p-2.5 rounded-lg border border-border bg-neutral-900/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-neutral-300 block">
                SuperAdmin Control:
              </span>
              <span className="text-[10px] text-neutral-400">
                {effective.override ? 'Custom Override Active' : 'Inherited from Subscription Plan'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {!isGlobalAllowed ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                  Killswitched (L1)
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onToggleLibraryModule(module.id)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isEffectiveAllowed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                    }`}
                  >
                    {isEffectiveAllowed ? <Check size={13} /> : <X size={13} />}
                    <span>{isEffectiveAllowed ? 'Enabled' : 'Disabled'}</span>
                  </button>

                  {effective.override && onResetLibraryModule && (
                    <button
                      type="button"
                      onClick={() => onResetLibraryModule(module.id)}
                      title="Reset to plan default"
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <RotateCcw size={12} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer & Actions */}
      <div className="mt-3.5 pt-3 border-t border-border flex flex-col gap-2">
        {/* Effective Access Result */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {isEffectiveAllowed ? (
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} /> Effective: Active
              </span>
            ) : (
              <span className="font-semibold text-rose-400 flex items-center gap-1">
                <ShieldAlert size={13} /> Effective: Denied
              </span>
            )}
          </div>
          {effective.override && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
              L3 Override
            </span>
          )}
        </div>

        <p className="text-[11px] text-neutral-400 truncate" title={effective.reason}>
          {effective.reason}
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            type="button"
            onClick={() => onOpenOverride(module)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-input hover:bg-neutral-800 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Settings2 size={13} />
            <span>Set Override</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenApiGuard(module)}
            className="px-2.5 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Terminal size={13} />
            <span>Test API Guard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
