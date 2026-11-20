'use client';
// RESPONSIBILITY: Display and filter all 10 mandated notification templates across Email, SMS, and WhatsApp.
// FLOW: SuperadminCommunicationNotificationCenterMain -> TemplatesView -> Template detail modal.

import { useState } from 'react';
import {
  FileText,
  Mail,
  MessageSquare,
  PhoneCall,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { useSuperadminTemplatesQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import { NOTIFICATION_PRIORITY_CONFIG } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import type {
  NotificationChannel,
  NotificationTemplate,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export function SuperadminCommunicationNotificationCenterTemplatesView() {
  const { data: templates, isLoading } = useSuperadminTemplatesQuery();
  const { setSelectedTemplate, setIsTemplateModalOpen } = useSuperadminCommunicationNotificationCenterStore();
  const [channelFilter, setChannelFilter] = useState<NotificationChannel | 'ALL'>('ALL');

  const filteredTemplates = templates?.filter((tmpl) => {
    if (channelFilter !== 'ALL' && !tmpl.supportedChannels.includes(channelFilter)) return false;
    return true;
  }) ?? [];

  const handleEdit = (tmpl: NotificationTemplate) => {
    setSelectedTemplate(tmpl);
    setIsTemplateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-card border border-border/80 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Channel Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Master Multi-Channel Template Library (10 Templates)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Standardized message templates for system lifecycle events, reminders, and platform broadcasts.
          </p>
        </div>

        {/* Channel Filter Pills */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/50 shrink-0">
          <button
            type="button"
            onClick={() => setChannelFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              channelFilter === 'ALL' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Channels
          </button>
          <button
            type="button"
            onClick={() => setChannelFilter('EMAIL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              channelFilter === 'EMAIL' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => setChannelFilter('SMS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              channelFilter === 'SMS' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>SMS</span>
          </button>
          <button
            type="button"
            onClick={() => setChannelFilter('WHATSAPP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              channelFilter === 'WHATSAPP' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((tmpl) => {
          const priorityConfig = NOTIFICATION_PRIORITY_CONFIG[tmpl.defaultPriority] ?? NOTIFICATION_PRIORITY_CONFIG.NORMAL;

          return (
            <div
              key={tmpl.id}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all space-y-4"
              data-testid={`template-card-${tmpl.id}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground">{tmpl.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${priorityConfig.badgeClass}`}>
                        {priorityConfig.label} Priority
                      </span>
                    </div>
                    <p className="text-2xs text-muted-foreground uppercase font-mono mt-0.5">
                      {tmpl.category}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Channel Badges & Details */}
                <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                  {tmpl.supportedChannels.map((channel) => (
                    <span
                      key={channel}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted/50 border border-border/60 text-foreground flex items-center gap-1.5"
                    >
                      {channel === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-sky-400" />}
                      {channel === 'SMS' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                      {channel === 'WHATSAPP' && <PhoneCall className="w-3.5 h-3.5 text-teal-400" />}
                      <span>{channel}</span>
                      {channel === 'SMS' && tmpl.channelTemplates.sms.dltTemplateId && (
                        <span className="text-2xs text-muted-foreground font-mono bg-background/80 px-1 rounded">
                          DLT
                        </span>
                      )}
                      {channel === 'WHATSAPP' && tmpl.channelTemplates.whatsapp.metaTemplateStatus === 'APPROVED' && (
                        <span className="text-2xs text-emerald-400 font-bold">✓ Approved</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Variables Chips */}
                <div className="mt-3.5">
                  <p className="text-2xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                    Dynamic Parameters:
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tmpl.variables.map((variable) => (
                      <span
                        key={variable}
                        className="px-2 py-0.5 rounded-md text-2xs font-mono bg-primary/10 text-primary border border-primary/20"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                <span className="text-2xs text-muted-foreground">
                  Updated: {tmpl.lastModified} by {tmpl.modifiedBy}
                </span>

                <button
                  type="button"
                  onClick={() => handleEdit(tmpl)}
                  className="px-3.5 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-border/60"
                  data-testid={`edit-template-btn-${tmpl.id}`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-primary" />
                  <span>Inspect & Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
