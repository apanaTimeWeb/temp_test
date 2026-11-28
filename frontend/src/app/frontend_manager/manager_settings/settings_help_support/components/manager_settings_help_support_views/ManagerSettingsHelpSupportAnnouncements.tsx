'use client';

import { AlertCircle,Calendar,Layers,Megaphone,Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatManagerHelpSupportCalendarDate } from '@/app/frontend_manager/manager_settings/settings_help_support/utils/ManagerSettingsHelpSupportDateFormatting';

interface AnnouncementItem {
  id: string;
  tagKey: string;
  colorClass: string;
  date: string;
  titleKey: string;
  descriptionKey: string;
}

interface ManagerSettingsHelpSupportAnnouncementsProps {
  announcements: AnnouncementItem[];
  locale: string;
}

export function ManagerSettingsHelpSupportAnnouncements({
  announcements,
  locale,
}: ManagerSettingsHelpSupportAnnouncementsProps) {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');

  const getAnnouncementBadgeInfo = (ann: AnnouncementItem) => {
    if (ann.id === 'late-fees' || ann.tagKey.includes('new_feature')) {
      return {
        icon: <Megaphone size={12} className="shrink-0 text-emerald-400" />,
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        cardBorder: 'border-l-4 border-l-emerald-500',
      };
    }
    if (ann.id === 'maintenance' || ann.tagKey.includes('maintenance')) {
      return {
        icon: <Wrench size={12} className="shrink-0 text-amber-400" />,
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        cardBorder: 'border-l-4 border-l-amber-500',
      };
    }
    return {
      icon: <Layers size={12} className="shrink-0 text-cyan-400" />,
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      cardBorder: 'border-l-4 border-l-cyan-500',
    };
  };

  return (
    <div className="max-w-4xl space-y-6 motion-safe:transition-all motion-safe:duration-base">
      {/* Notice Banner */}
      <div
        className="flex items-start sm:items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-warning"
        role="status"
      >
        <AlertCircle size={16} className="shrink-0 mt-0.5 sm:mt-0 text-warning" />
        <p className="leading-relaxed">{tManagerUi('announcements_sample_content_notice')}</p>
      </div>

      {/* Announcements Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-subtle border border-border flex items-center justify-center text-primary">
            <Megaphone size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-primary">Platform Announcements</h2>
            <p className="text-xs text-secondary">
              Latest system updates, operational alerts, and feature rollouts
            </p>
          </div>
        </div>
        <span className="mgr-badge mgr-badge--info text-xs font-mono self-start sm:self-auto">
          {announcements.length} {announcements.length === 1 ? 'Update' : 'Updates'}
        </span>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann, idx) => {
          const styleInfo = getAnnouncementBadgeInfo(ann);
          return (
            <div
              key={ann.id}
              className={`mgr-card p-5 md:p-6 ${styleInfo.cardBorder} hover:border-border-focus motion-safe:transition-all motion-safe:duration-base relative overflow-hidden group`}
            >
              {/* Header row: Tag Badge + Date */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${styleInfo.badgeClass}`}
                  >
                    {styleInfo.icon}
                    <span>{tManagerUi(ann.tagKey)}</span>
                  </span>
                  {idx === 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-border">
                      Latest
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-secondary font-mono">
                  <Calendar size={13} className="text-secondary" />
                  <span>{formatManagerHelpSupportCalendarDate(ann.date, locale)}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base md:text-lg font-bold text-primary mb-2 group-hover:text-primary motion-safe:transition-colors">
                {tManagerUi(ann.titleKey)}
              </h3>
              <p className="text-sm text-secondary leading-relaxed font-normal">
                {tManagerUi(ann.descriptionKey)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
