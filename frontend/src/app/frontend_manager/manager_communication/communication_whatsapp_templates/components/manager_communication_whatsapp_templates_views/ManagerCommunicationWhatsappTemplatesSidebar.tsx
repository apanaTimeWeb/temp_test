'use client';

import { ChevronRight } from 'lucide-react';
import type { Template } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDemoRepository';

export interface TemplateMeta {
  icon: React.ReactNode;
  conditionTag: string;
  conditionDesc: string;
  badge: string;
  iconBox: string;
  accentBorder: string;
  ring: string;
}

interface ManagerCommunicationWhatsappTemplatesSidebarProps {
  templates: Template[];
  activeId: string;
  setActiveId: (id: string) => void;
  templateConfigs: Record<string, TemplateMeta>;
  templateLabel: (t: Template) => string;
}

export function ManagerCommunicationWhatsappTemplatesSidebar({
  templates,
  activeId,
  setActiveId,
  templateConfigs,
  templateLabel,
}: ManagerCommunicationWhatsappTemplatesSidebarProps) {
  return (
    <div className="lg:col-span-4 xl:col-span-4 space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          Trigger Conditions ({templates.length})
        </span>
        <span className="text-[11px] text-secondary">Select to customize</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
        {templates.map((t) => {
          const config = templateConfigs[t.id] || templateConfigs.welcome;
          const isActive = activeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              aria-pressed={isActive}
              className={`w-full p-3 sm:p-3.5 rounded-xl text-left motion-safe:transition-all motion-safe:duration-fast cursor-pointer flex items-center justify-between border ${
                isActive
                  ? `bg-surface-highlight/80 ${config.accentBorder} shadow-md ring-1 ${config.ring}`
                  : 'bg-card/70 border-border hover:bg-card hover:border-border-focus'
              } active:scale-[0.99]`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${config.iconBox}`}
                >
                  {config.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-primary'}`}>
                      {templateLabel(t)}
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary truncate mt-0.5">
                    {config.conditionDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badge}`}
                >
                  {config.conditionTag}
                </span>
                <ChevronRight
                  size={14}
                  className={isActive ? 'text-primary' : 'text-secondary'}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
