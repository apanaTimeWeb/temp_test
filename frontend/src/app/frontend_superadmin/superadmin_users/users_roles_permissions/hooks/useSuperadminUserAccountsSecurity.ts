'use client';

import { useState, useCallback } from 'react';
import type { UserSecurityAccount } from '../types/SuperadminRolesPermissionsManagementTypes';
import { INITIAL_USER_SECURITY_ACCOUNTS } from '../constants/SuperadminUserSecurityAccountsData';

export function useSuperadminUserAccountsSecurity(
  initialAccounts: UserSecurityAccount[] = INITIAL_USER_SECURITY_ACCOUNTS
) {
  const [userAccounts, setUserAccounts] = useState<UserSecurityAccount[]>(initialAccounts);

  // User Account Security Controls: Lock / Unlock
  const toggleAccountLock = useCallback((userId: string, reason?: string) => {
    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      const nextLocked = !u.isLocked;
      const newLoginLog = {
        id: `lh-${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        ip: 'Internal Audit',
        device: 'SuperAdmin Console',
        browser: 'Security Gateway',
        status: (nextLocked ? 'FAILED' : 'SUCCESS') as 'FAILED' | 'SUCCESS',
        failureReason: nextLocked ? `Account locked by SuperAdmin: ${reason || 'Security precaution'}` : undefined,
      };
      return {
        ...u,
        isLocked: nextLocked,
        activeSessions: nextLocked ? [] : u.activeSessions,
        loginHistory: [newLoginLog, ...u.loginHistory],
      };
    }));
  }, []);

  // Trigger Password Reset Link
  const triggerPasswordReset = useCallback((userId: string) => {
    const target = userAccounts.find((u) => u.id === userId);
    return target ? `Password reset invitation link dispatched to ${target.email}` : 'User not found';
  }, [userAccounts]);

  // Reset MFA with Verification
  const resetMfa = useCallback((userId: string) => {
    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      return { ...u, mfaEnabled: false, mfaVerified: false };
    }));
  }, []);

  // Revoke Specific Session
  const revokeSession = useCallback((userId: string, sessionId: string) => {
    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        activeSessions: u.activeSessions.filter((s) => s.sessionId !== sessionId),
      };
    }));
  }, []);

  // Revoke All Active Sessions
  const revokeAllSessions = useCallback((userId: string) => {
    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      return { ...u, activeSessions: [] };
    }));
  }, []);

  // Grant Temporary Permissions with Expiry
  const grantTemporaryPermission = useCallback((userId: string, durationDays: number, note: string) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationDays);
    const expiryStr = `${expiry.toISOString().slice(0, 10)} (${durationDays} days left - Note: ${note})`;

    setUserAccounts((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        hasTemporaryPermissions: true,
        temporaryPermissionExpiry: expiryStr,
      };
    }));
  }, []);

  return {
    userAccounts,
    setUserAccounts,
    toggleAccountLock,
    triggerPasswordReset,
    resetMfa,
    revokeSession,
    revokeAllSessions,
    grantTemporaryPermission,
  };
}
