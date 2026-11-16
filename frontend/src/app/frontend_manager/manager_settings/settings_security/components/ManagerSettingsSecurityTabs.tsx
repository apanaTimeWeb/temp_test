'use client';

import React from 'react';
import { KeyRound, Shield, MonitorSmartphone, History } from 'lucide-react';
import type { ManagerSecurityTab } from '../types/ManagerSettingsSecurityTypes';

interface ManagerSettingsSecurityTabsProps {
  activeTab: ManagerSecurityTab;
  onTabChange: (tab: ManagerSecurityTab) => void;
  activeSessionsCount: number;
  is2faEnabled: boolean;
}

export function ManagerSettingsSecurityTabs({
  activeTab,
  onTabChange,
  activeSessionsCount,
  is2faEnabled,
}: ManagerSettingsSecurityTabsProps) {
  const tabs: Array<{
    id: ManagerSecurityTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeVariant?: 'success' | 'warning' | 'neutral';
  }> = [
    {
      id: 'password',
      label: 'Password',
      icon: KeyRound,
    },
    {
      id: '2fa',
      label: 'Two-Factor (2FA)',
      icon: Shield,
      badge: is2faEnabled ? 'ON' : 'OFF',
      badgeVariant: is2faEnabled ? 'success' : 'warning',
    },
    {
      id: 'sessions',
      label: 'Active Sessions',
      icon: MonitorSmartphone,
      badge: activeSessionsCount,
      badgeVariant: 'neutral',
    },
    {
      id: 'history',
      label: 'Login Activity',
      icon: History,
    },
  ];

  return (
    <div className="border-b border-white/10 bg-[#0a0c20]/60 px-3 sm:px-5">
      <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar" aria-label="Security Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`group inline-flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={16}
                className={`transition-colors ${
                  isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    tab.badgeVariant === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : tab.badgeVariant === 'warning'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
