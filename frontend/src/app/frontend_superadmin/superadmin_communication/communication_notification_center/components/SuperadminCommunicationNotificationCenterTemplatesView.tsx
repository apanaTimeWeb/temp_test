'use client';
// RESPONSIBILITY: Display and filter all 10 mandated notification templates across Email, SMS, and WhatsApp with Cyber-Luxury styling.
// FLOW: SuperadminCommunicationNotificationCenterMain -> TemplatesView -> Template detail modal.

import { useState } from 'react';
import {
  FileText,
  Mail,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
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
          <div key={i} className="h-56 rounded-2xl bg-slate-950/60 border border-indigo-500/20 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Channel Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl sm:rounded-3xl bg-[#0c102b]/85 border border-indigo-500/20 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <span>Master Multi-Channel Template Library (10 Mandated)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standardized message templates for system lifecycle events, reminders, and platform broadcasts.
          </p>
        </div>

        {/* Channel Filter Pills */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-indigo-500/25 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setChannelFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              channelFilter === 'ALL'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            All Channels
          </button>
          <button
            type="button"
            onClick={() => setChannelFilter('EMAIL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              channelFilter === 'EMAIL'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => setChannelFilter('SMS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              channelFilter === 'SMS'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>SMS</span>
          </button>
          <button
            type="button"
            onClick={() => setChannelFilter('WHATSAPP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              channelFilter === 'WHATSAPP'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
              className="p-5 rounded-2xl bg-[#0b0f28]/90 border border-indigo-500/20 hover:border-indigo-400/50 shadow-xl backdrop-blur-md transition-all hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4 group"
              data-testid={`template-card-${tmpl.id}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {tmpl.name}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-2xs font-bold ${priorityConfig.badgeClass}`}>
                        {priorityConfig.label} Priority
                      </span>
                    </div>
                    <p className="text-2xs text-indigo-400 uppercase font-mono mt-0.5 tracking-wider">
                      {tmpl.category}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-2xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Channel Badges & Details */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  {tmpl.supportedChannels.map((channel) => (
                    <span
                      key={channel}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/90 border border-indigo-500/25 text-slate-200 flex items-center gap-1.5 shadow-inner"
                    >
                      {channel === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-sky-400" />}
                      {channel === 'SMS' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                      {channel === 'WHATSAPP' && <PhoneCall className="w-3.5 h-3.5 text-teal-400" />}
                      <span>{channel}</span>
                      {channel === 'SMS' && tmpl.channelTemplates.sms.dltTemplateId && (
                        <span className="text-2xs text-slate-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-indigo-500/20">
                          DLT
                        </span>
                      )}
                      {channel === 'WHATSAPP' && tmpl.channelTemplates.whatsapp.metaTemplateStatus === 'APPROVED' && (
                        <span className="text-2xs text-emerald-400 font-bold">✓ Approved</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Dynamic Parameters Chips */}
                <div className="mt-4">
                  <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Dynamic Parameters:
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tmpl.variables.map((variable) => (
                      <span
                        key={variable}
                        className="px-2.5 py-0.5 rounded-md text-2xs font-mono bg-indigo-950/70 text-indigo-300 border border-indigo-500/30"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs">
                <span className="text-2xs text-slate-400">
                  Updated: <strong className="text-slate-300">{tmpl.lastModified}</strong> by {tmpl.modifiedBy}
                </span>

                <button
                  type="button"
                  onClick={() => handleEdit(tmpl)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/35 hover:to-purple-500/35 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                  data-testid={`edit-template-btn-${tmpl.id}`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
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
