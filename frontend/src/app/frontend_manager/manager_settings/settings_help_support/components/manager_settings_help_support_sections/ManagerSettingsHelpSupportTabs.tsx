'use client';
// RESPONSIBILITY: Render the settings help support tabs component within the components feature. It does not own backend persistence or cross-feature business logic.

import { useTranslations } from 'next-intl';
import type { ManagerSettingsHelpSupportTabsProps } from '@/app/frontend_manager/manager_settings/settings_help_support/types/ManagerSettingsHelpSupportTypes';

export function ManagerSettingsHelpSupportTabs({ tabs, activeTab, onSelect }: ManagerSettingsHelpSupportTabsProps) {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');
  const getTabLabel = (name: string) => {
    switch (name) {
      case 'Help Center': return tManagerUi('tab_help_center');
      case 'Documentation': return tManagerUi('tab_documentation');
      case 'Support Tickets': return tManagerUi('tab_support_tickets');
      case 'Announcements': return tManagerUi('tab_announcements');
      case 'System Status': return tManagerUi('tab_system_status');
      default: return name;
    }
  };
  return (
<div className="flex flex-wrap items-center gap-2 mb-8 border-b border-border pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(tab.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold motion-safe:transition-all ${
                isActive 
                  ? `bg-card text-primary border border-border shadow-md` 
                  : 'text-secondary hover:bg-card hover:text-primary border border-transparent'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? tab.bg : 'bg-transparent'}`}>
                <tab.icon size={16} className={isActive ? tab.color : 'opacity-70'} />
              </div>
              {getTabLabel(tab.name)}
            </button>
          );
        })}
      </div>
  );
}
