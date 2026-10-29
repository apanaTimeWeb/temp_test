'use client';

import { PUBLIC_AUTH_ROLE_IDS, type PublicAuthRole } from '@/app/public_auth/auth_sign_in/utils/PublicAuthSignInConstants';
import type { ReactNode } from 'react';

interface PublicAuthSignInRoleSelectorProps {
  label: string;
  selectedRole: PublicAuthRole;
  roleText: Record<PublicAuthRole, { label: string; description: string }>;
  roleIcon: Record<PublicAuthRole, ReactNode>;
  disabled: boolean;
  onSelect: (role: PublicAuthRole) => void;
}

/** RESPONSIBILITY: Render the accessible role-context selector. FLOW: parent form state -> role selection callback. */
export default function PublicAuthSignInRoleSelector({ label, selectedRole, roleText, roleIcon, disabled, onSelect }: PublicAuthSignInRoleSelectorProps) {
  return (
    <div className="mb-6 space-y-2">
      <p className="text-sm font-semibold text-primary">{label}</p>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label={label} data-testid="auth-login-role-selector">
        {PUBLIC_AUTH_ROLE_IDS.map((role) => (
          <button
            key={role}
            id={`auth-role-${role}`}
            data-testid={`auth-login-role-${role}-select`}
            type="button"
            aria-pressed={selectedRole === role}
            onClick={() => onSelect(role)}
            className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold motion-safe:transition-colors motion-safe:duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selectedRole === role ? 'border-primary bg-primary-subtle text-primary' : 'border-border bg-card text-secondary hover:bg-surface-hover'} disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled`}
            disabled={disabled}
          >
            {roleIcon[role]}
            <span>{roleText[role].label}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-secondary" aria-live="polite" data-testid="auth-login-role-description">{roleText[selectedRole].description}</p>
    </div>
  );
}
