'use client';
// RESPONSIBILITY: Render complete action-level interactive matrix editor for 10 modules x 10 actions.
import { useState } from 'react';
import { X, ShieldCheck, CheckSquare, Square, RotateCcw, Save } from 'lucide-react';
import type {
  RoleDefinition,
  ModulePermissionMatrix,
  SystemModuleKey,
  ActionPermissionKey,
} from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminRolesPermissionsManagementTypes';
import {
  SYSTEM_MODULES,
  PERMISSION_ACTIONS,
  createEmptyPermissionMatrix,
} from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/constants/SuperadminRolesPermissionsMetadata';

interface SuperadminRolePermissionEditorModalProps {
  role: RoleDefinition;
  onClose: () => void;
  onSave: (roleId: string, updated: ModulePermissionMatrix) => void;
}

export default function SuperadminRolePermissionEditorModal({
  role,
  onClose,
  onSave,
}: SuperadminRolePermissionEditorModalProps) {
  const [matrix, setMatrix] = useState<ModulePermissionMatrix>(() => JSON.parse(JSON.stringify(role.permissions)));

  const toggleCell = (m: SystemModuleKey, a: ActionPermissionKey) => {
    setMatrix((prev) => ({
      ...prev,
      [m]: {
        ...prev[m],
        [a]: !prev[m]?.[a],
      },
    }));
  };

  const toggleEntireRow = (m: SystemModuleKey) => {
    const allChecked = PERMISSION_ACTIONS.every((a) => matrix[m]?.[a.key]);
    setMatrix((prev) => {
      const nextRow = { ...prev[m] };
      PERMISSION_ACTIONS.forEach((a) => { nextRow[a.key] = !allChecked; });
      return { ...prev, [m]: nextRow };
    });
  };

  const handleApplyPreset = (preset: 'all' | 'view_only' | 'clear') => {
    const next = createEmptyPermissionMatrix();
    SYSTEM_MODULES.forEach((m) => {
      PERMISSION_ACTIONS.forEach((a) => {
        if (preset === 'all') next[m.key][a.key] = true;
        else if (preset === 'view_only') next[m.key][a.key] = a.key === 'view';
        else next[m.key][a.key] = false;
      });
    });
    setMatrix(next);
  };

  const handleSave = () => {
    onSave(role.id, matrix);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-indigo-500/40 bg-[#0c0f28] p-5 sm:p-6 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Action-Level Permissions Editor</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {role.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{role.description} • Scope: {role.scope}</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('all')}
              className="px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-600/30 font-semibold"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('view_only')}
              className="px-2.5 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-600/30 font-semibold"
            >
              View Only
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('clear')}
              className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Matrix Scrollable Body */}
        <div className="overflow-auto my-4 flex-1 border border-indigo-500/20 rounded-xl bg-[#090b1e]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#101438] text-slate-300 sticky top-0 z-10 border-b border-indigo-500/30 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th scope="col" className="py-2.5 px-3 min-w-[180px]">Module / Service</th>
                {PERMISSION_ACTIONS.map((a) => (
                  <th key={a.key} scope="col" className="py-2.5 px-2 text-center min-w-[70px]" title={a.description}>
                    <div className="flex flex-col items-center">
                      <span>{a.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10">
              {SYSTEM_MODULES.map((mod) => (
                <tr key={mod.key} className="hover:bg-indigo-500/5 transition-colors">
                  {/* Module Name + Row Select Toggle */}
                  <td className="py-2.5 px-3 font-semibold text-white">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-white">{mod.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{mod.category}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleEntireRow(mod.key)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-200 underline shrink-0 cursor-pointer"
                        title="Toggle all actions in this row"
                      >
                        All
                      </button>
                    </div>
                  </td>

                  {/* 10 Action Checkboxes */}
                  {PERMISSION_ACTIONS.map((act) => {
                    const isChecked = !!matrix[mod.key]?.[act.key];
                    return (
                      <td key={act.key} className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCell(mod.key, act.key)}
                          className={`inline-flex items-center justify-center h-6 w-6 rounded-md motion-safe:transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-600/30 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-600/40'
                              : 'bg-slate-900 border border-slate-700/60 text-transparent hover:border-slate-500'
                          }`}
                          title={`${mod.label} - ${act.label}: ${isChecked ? 'Allowed' : 'Denied'}`}
                        >
                          {isChecked ? <CheckSquare size={13} /> : <Square size={13} className="text-slate-700" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-indigo-500/20 shrink-0">
          <p className="text-xs text-slate-400">
            Changes apply instantly to all active accounts assigned to <strong>{role.name}</strong>.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md cursor-pointer"
            >
              <Save size={14} />
              <span>Save Permissions Matrix</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
