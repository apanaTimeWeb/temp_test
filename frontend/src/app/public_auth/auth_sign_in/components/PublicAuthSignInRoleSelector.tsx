'use client';

import type { ReactNode } from 'react';
import { Shield, Users, Zap } from 'lucide-react';
import type { PublicAuthRole } from '@/app/public_auth/auth_sign_in/utils/PublicAuthSignInConstants';

export interface RoleOptionConfig {
  id: PublicAuthRole;
  label: string;
  email: string;
  password: string;
  icon: string;
}

const ROLE_DEST_LABEL: Record<PublicAuthRole, string> = {
  superadmin: 'Multi-Branch & Platform Administration',
  admin: 'Branch Dashboard, Seats, Shifts & Lockers',
  manager: 'Daily Operations, Attendance & Admissions',
};

const ROLE_ICONS: Record<PublicAuthRole, ReactNode> = {
  superadmin: <Shield size={15} className="text-violet-400" />,
  admin: <Zap size={15} className="text-cyan-400" />,
  manager: <Users size={15} className="text-emerald-400" />,
};

const ROLE_BANNER_COLORS: Record<PublicAuthRole, string> = {
  superadmin: 'from-violet-950/70 via-purple-950/40 to-transparent border-violet-500/30 text-violet-300',
  admin: 'from-cyan-950/70 via-blue-950/40 to-transparent border-cyan-500/30 text-cyan-300',
  manager: 'from-emerald-950/70 via-teal-950/40 to-transparent border-emerald-500/30 text-emerald-300',
};

interface PublicAuthSignInRoleSelectorProps {
  roles: readonly RoleOptionConfig[];
  selectedRole: RoleOptionConfig;
  disabled: boolean;
  onSelect: (role: RoleOptionConfig) => void;
}

/** Accessible Super Admin / Admin / Manager quick role selector tabs and destination banner. */
export default function PublicAuthSignInRoleSelector({
  roles,
  selectedRole,
  disabled,
  onSelect,
}: PublicAuthSignInRoleSelectorProps) {
  return (
    <>
      <div className="role-selector-track grid grid-cols-3 gap-1.5 mb-3 p-1 rounded-xl border border-white/10">
        {roles.map((role) => {
          const isActive = selectedRole.id === role.id;
          return (
            <button
              key={role.id}
              type="button"
              id={`role-btn-${role.id}`}
              data-testid={`auth-login-role-${role.id}-select`}
              aria-pressed={isActive}
              disabled={disabled}
              onClick={() => onSelect(role)}
              className={`py-2 px-1 rounded-lg text-xs font-bold motion-safe:transition-all motion-safe:duration-fast flex flex-col items-center gap-1 role-tab cursor-pointer ${
                isActive ? 'role-tab-active' : ''
              }`}
            >
              <span>{ROLE_ICONS[role.id]}</span>
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>

      <div
        className={`bg-gradient-to-r ${ROLE_BANNER_COLORS[selectedRole.id]} border rounded-lg px-3 py-1.5 flex items-center gap-2 mb-3.5 text-xs`}
      >
        <span className="text-sm shrink-0">{selectedRole.icon}</span>
        <div className="min-w-0 flex-1">
          <span className="font-bold text-white text-xs block truncate">{selectedRole.label} Portal</span>
          <span className="text-xs text-slate-400 block truncate">
            Destination: {ROLE_DEST_LABEL[selectedRole.id]}
          </span>
        </div>
      </div>
    </>
  );
}
