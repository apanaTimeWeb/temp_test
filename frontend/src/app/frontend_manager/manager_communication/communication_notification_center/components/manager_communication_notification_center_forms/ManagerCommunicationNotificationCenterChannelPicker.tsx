'use client';

import { Check, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const NOTIFICATION_CHANNELS = [
  {
    id: 'WhatsApp',
    label: 'WhatsApp',
    icon: Smartphone,
    subtitle: 'Instant delivery (High read rate)',
    activeBg: 'rgba(16, 185, 129, 0.22)',
    activeBorder: '#10b981',
    activeGlow: '0 0 14px rgba(16, 185, 129, 0.45)',
    activeColor: '#d1fae5',
    activeBox: 'border-emerald-500 font-bold',
    activeIcon: 'text-emerald-400',
    badge: 'Popular',
    badgeColor: 'bg-emerald-500/30 text-emerald-200 border-emerald-500/40',
  },
  {
    id: 'SMS',
    label: 'SMS Text',
    icon: MessageSquare,
    subtitle: 'Carrier text message',
    activeBg: 'rgba(245, 158, 11, 0.22)',
    activeBorder: '#f59e0b',
    activeGlow: '0 0 14px rgba(245, 158, 11, 0.45)',
    activeColor: '#fef3c7',
    activeBox: 'border-amber-500 font-bold',
    activeIcon: 'text-amber-400',
    badge: 'Direct',
    badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-500/40',
  },
  {
    id: 'Email',
    label: 'Email',
    icon: Mail,
    subtitle: 'Formal letter dispatch',
    activeBg: 'rgba(14, 165, 233, 0.22)',
    activeBorder: '#0ea5e9',
    activeGlow: '0 0 14px rgba(14, 165, 233, 0.45)',
    activeColor: '#e0f2fe',
    activeBox: 'border-sky-500 font-bold',
    activeIcon: 'text-sky-400',
    badge: 'Official',
    badgeColor: 'bg-sky-500/30 text-sky-200 border-sky-500/40',
  },
] as const;

interface ManagerCommunicationNotificationCenterChannelPickerProps {
  selectedChannel: string;
  onSelectChannel: (channel: 'WhatsApp' | 'SMS' | 'Email') => void;
}

/** Interactive 3-card delivery channel picker (WhatsApp, SMS, Email). */
export function ManagerCommunicationNotificationCenterChannelPicker({
  selectedChannel,
  onSelectChannel,
}: ManagerCommunicationNotificationCenterChannelPickerProps) {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="manager-notification-channel"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary"
        >
          <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
            <Smartphone size={12} />
          </span>
          <span>{tManagerUi('message_channel')}</span>
          <span className="text-rose-400 font-bold">*</span>
        </label>
        <span className="text-[11px] text-secondary">Click a box to select dispatch route</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {NOTIFICATION_CHANNELS.map((ch) => {
          const isSelected = selectedChannel === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChannel(ch.id)}
              style={
                isSelected
                  ? {
                      backgroundColor: ch.activeBg,
                      borderColor: ch.activeBorder,
                      boxShadow: ch.activeGlow,
                      color: ch.activeColor,
                    }
                  : undefined
              }
              className={`relative flex flex-col p-3.5 rounded-2xl border text-left cursor-pointer motion-safe:transition-all ${
                isSelected
                  ? ch.activeBox
                  : 'bg-card border-border text-secondary hover:border-border-focus hover:bg-card hover:text-primary'
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ch.icon size={17} className={isSelected ? ch.activeIcon : 'text-secondary'} />
                  <span className="font-bold text-xs sm:text-sm text-primary">{ch.label}</span>
                </div>
                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-primary-subtle border border-border flex items-center justify-center shrink-0">
                    <Check size={11} className="text-primary font-bold" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-border shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-secondary leading-snug">{ch.subtitle}</p>
              <span
                className={`mt-2 self-start text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                  isSelected ? ch.badgeColor : 'bg-surface border-border text-secondary'
                }`}
              >
                {ch.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
