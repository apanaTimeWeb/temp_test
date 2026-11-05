'use client';

import React from 'react';
import { Megaphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatManagerHelpSupportCalendarDate } from '../../utils/ManagerSettingsHelpSupportDateFormatting';

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

  return (
    <div className="max-w-4xl space-y-6 motion-safe:transition-all motion-safe:duration-base">
      <p className="text-sm text-warning" role="status">
        {tManagerUi('announcements_sample_content_notice')}
      </p>
      {announcements.map((ann) => (
        <div
          key={ann.id}
          className="mgr-card p-6 border-l-4 border-l-primary relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Megaphone size={100} />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded border ${ann.colorClass}`}>
              {tManagerUi(ann.tagKey)}
            </span>
            <span className="text-sm text-secondary">
              {formatManagerHelpSupportCalendarDate(ann.date, locale)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">{tManagerUi(ann.titleKey)}</h2>
          <p className="text-secondary leading-relaxed">{tManagerUi(ann.descriptionKey)}</p>
        </div>
      ))}
    </div>
  );
}

