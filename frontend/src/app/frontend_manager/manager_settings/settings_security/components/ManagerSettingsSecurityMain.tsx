'use client';

import { ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect,useState } from 'react';

import {
INITIAL_ACTIVE_SESSIONS,
INITIAL_LOGIN_HISTORY,
INITIAL_MANAGER_PROFILE,
INITIAL_TWO_FACTOR_CONFIG,
} from '../constants/ManagerSettingsSecurityConstants';
import type {
ManagerActiveSession,
ManagerSecurityTab,
ManagerTwoFactorConfig,
} from '../types/ManagerSettingsSecurityTypes';

import { ManagerSettingsSecurityActiveSessionsPanel } from './ManagerSettingsSecurityActiveSessionsPanel';
import { ManagerSettingsSecurityHeader } from './ManagerSettingsSecurityHeader';
import { ManagerSettingsSecurityLoginHistoryPanel } from './ManagerSettingsSecurityLoginHistoryPanel';
import { ManagerSettingsSecurityPasswordForm } from './ManagerSettingsSecurityPasswordForm';
import { ManagerSettingsSecurityTabs } from './ManagerSettingsSecurityTabs';
import { ManagerSettingsSecurityTwoFactorPanel } from './ManagerSettingsSecurityTwoFactorPanel';

interface ManagerSettingsSecurityMainProps {
  initialTab?: ManagerSecurityTab;
}

export function ManagerSettingsSecurityMain({ initialTab }: ManagerSettingsSecurityMainProps) {
  const searchParams = useSearchParams();

  const tabFromQuery = searchParams?.get('tab') as ManagerSecurityTab | null;
  const validTabs: ManagerSecurityTab[] = ['password', '2fa', 'sessions', 'history'];

  const initialResolvedTab: ManagerSecurityTab =
    initialTab && validTabs.includes(initialTab)
      ? initialTab
      : tabFromQuery && validTabs.includes(tabFromQuery)
      ? tabFromQuery
      : 'password';

  const [activeTab, setActiveTab] = useState<ManagerSecurityTab>(initialResolvedTab);
  const [twoFactor, setTwoFactor] = useState<ManagerTwoFactorConfig>(INITIAL_TWO_FACTOR_CONFIG);
  const [activeSessions, setActiveSessions] = useState<ManagerActiveSession[]>(INITIAL_ACTIVE_SESSIONS);
  const [loginHistory] = useState(INITIAL_LOGIN_HISTORY);

  useEffect(() => {
    if (tabFromQuery && validTabs.includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleTabChange = (tab: ManagerSecurityTab) => {
    setActiveTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // In SSR or test runners
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleLogoutAllOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
  };

  return (
    <div className="mgr-page-animate pb-8 space-y-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-white/5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <ShieldCheck className="text-indigo-400 shrink-0" size={24} />
            <span>Security & Authentication</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage manager password, two-factor authentication, and monitor active device sessions.
          </p>
        </div>
      </div>

      {/* Hero Badge */}
      <ManagerSettingsSecurityHeader
        profile={INITIAL_MANAGER_PROFILE}
        twoFactor={twoFactor}
        activeSessions={activeSessions}
      />

      {/* Main Tabbed Container */}
      <div className="rounded-2xl border border-indigo-500/20 bg-card shadow-card overflow-hidden">
        {/* Tabs */}
        <ManagerSettingsSecurityTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          activeSessionsCount={activeSessions.length}
          is2faEnabled={twoFactor.enabled}
        />

        {/* Tab Body */}
        <div className="p-4 sm:p-6">
          {activeTab === 'password' && <ManagerSettingsSecurityPasswordForm />}

          {activeTab === '2fa' && (
            <ManagerSettingsSecurityTwoFactorPanel
              twoFactor={twoFactor}
              onUpdateTwoFactor={setTwoFactor}
            />
          )}

          {activeTab === 'sessions' && (
            <ManagerSettingsSecurityActiveSessionsPanel
              sessions={activeSessions}
              onRevokeSession={handleRevokeSession}
              onLogoutAllOtherSessions={handleLogoutAllOtherSessions}
            />
          )}

          {activeTab === 'history' && (
            <ManagerSettingsSecurityLoginHistoryPanel history={loginHistory} />
          )}
        </div>
      </div>
    </div>
  );
}
