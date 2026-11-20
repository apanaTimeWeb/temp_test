'use client';

import React, { useState } from 'react';
import {
  X, Sliders, CheckCircle, AlertTriangle, ShieldCheck,
  Check
} from 'lucide-react';
import type { SuperadminLibrariesLibrary } from '../types/SuperadminLibrariesOverviewTypes';
import { SUPERADMIN_MANAGER_MODULES_CATALOG } from '../constants/SuperadminLibrariesManagerModulesCatalog';

interface SuperadminLibrariesManagerModulesModalProps {
  lib: SuperadminLibrariesLibrary;
  onClose: () => void;
  onSaveModules: (tenantId: string, modules: Record<string, boolean>) => void;
}

export default function SuperadminLibrariesManagerModulesModal({
  lib,
  onClose,
  onSaveModules,
}: SuperadminLibrariesManagerModulesModalProps) {
  const [modules, setModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SUPERADMIN_MANAGER_MODULES_CATALOG.forEach((mod) => {
      if (lib.managerModules && lib.managerModules[mod.key] !== undefined) {
        initial[mod.key] = lib.managerModules[mod.key];
      } else {
        initial[mod.key] = mod.defaultOn ?? true;
      }
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleModule = (key: string) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedSuccess(false);
  };

  const handleSelectAll = () => {
    const updated: Record<string, boolean> = {};
    SUPERADMIN_MANAGER_MODULES_CATALOG.forEach((mod) => {
      updated[mod.key] = true;
    });
    setModules(updated);
    setSavedSuccess(false);
  };

  const handleDeselectAll = () => {
    const updated: Record<string, boolean> = {};
    SUPERADMIN_MANAGER_MODULES_CATALOG.forEach((mod) => {
      updated[mod.key] = false;
    });
    setModules(updated);
    setSavedSuccess(false);
  };

  const handleSave = () => {
    onSaveModules(lib.id, modules);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const enabledCount = Object.values(modules).filter(Boolean).length;
  const categories = Array.from(new Set(SUPERADMIN_MANAGER_MODULES_CATALOG.map((m) => m.category)));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager-modules-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-indigo-500/30 bg-[#0a0d22] text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-[#0a0d22] to-[#0c0f28]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Sliders size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="manager-modules-modal-title" className="text-base sm:text-lg font-bold text-white">
                  Manager Panel Module Permissions
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {enabledCount} / {SUPERADMIN_MANAGER_MODULES_CATALOG.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Library: <strong className="text-slate-200">{lib.name}</strong> ({lib.owner})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3.5 bg-indigo-950/30 border-b border-indigo-500/15 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <ShieldCheck size={16} className="text-indigo-400 shrink-0" />
            <span>Control which operational tools branch managers and desk staff can access for this library.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] text-indigo-300 hover:text-white underline cursor-pointer"
            >
              Enable All
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              Disable All
            </button>
          </div>
        </div>

        {/* Scrollable Catalog grouped by Category */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {categories.map((cat) => {
            const catModules = SUPERADMIN_MANAGER_MODULES_CATALOG.filter((m) => m.category === cat);
            return (
              <div key={cat} className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  {cat} Modules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {catModules.map((mod) => {
                    const isEnabled = Boolean(modules[mod.key]);
                    const IconComp = mod.icon;
                    return (
                      <button
                        key={mod.key}
                        type="button"
                        onClick={() => toggleModule(mod.key)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isEnabled
                            ? 'border-indigo-500/40 bg-indigo-500/10 hover:border-indigo-400/60 shadow-xs'
                            : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg border shrink-0 transition-colors ${
                            isEnabled
                              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                              : 'bg-slate-800/60 border-slate-700 text-slate-500'
                          }`}
                        >
                          <IconComp size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold ${isEnabled ? 'text-white' : 'text-slate-400'}`}>
                              {mod.name}
                            </span>
                            <span
                              className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 text-[10px] ${
                                isEnabled
                                  ? 'bg-indigo-600 border-indigo-400 text-white'
                                  : 'border-slate-700 bg-slate-800 text-transparent'
                              }`}
                            >
                              {isEnabled && <Check size={11} strokeWidth={3} />}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 bg-slate-900/60 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in">
                <CheckCircle size={14} /> Module permissions saved!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-950/50 transition-all cursor-pointer active:scale-95"
            >
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
