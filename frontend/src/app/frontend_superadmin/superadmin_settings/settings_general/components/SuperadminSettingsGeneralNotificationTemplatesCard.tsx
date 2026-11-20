'use client';
// RESPONSIBILITY: Renders the Default Notification Templates configuration card with tag chips and live preview.
// DATA FLOW: RHF context -> SuperadminSettingsGeneralNotificationTemplatesCard -> user edits -> template state
import { useState, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Bell, Mail, Eye, Sparkles, Tag, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import {
  NOTIFICATION_TEMPLATE_OPTIONS,
  TEMPLATE_PLACEHOLDERS,
} from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';

export const SuperadminSettingsGeneralNotificationTemplatesCard: FC = () => {
  const { register, watch, setValue } = useFormContext<SuperadminSettingsFormValues>();
  const [activeTab, setActiveTab] = useState<'WELCOME' | 'PASSWORD_RESET' | 'DUE_REMINDER' | 'ANNOUNCEMENT'>('WELCOME');

  const welcomeSubject = watch('notificationTemplates.welcomeEmailSubject') || '';
  const welcomeBody = watch('notificationTemplates.welcomeEmailBody') || '';
  const resetBody = watch('notificationTemplates.passwordResetBody') || '';
  const dueBody = watch('notificationTemplates.dueReminderBody') || '';
  const announcementBody = watch('notificationTemplates.announcementBody') || '';

  const getCurrentText = () => {
    switch (activeTab) {
      case 'WELCOME': return welcomeBody;
      case 'PASSWORD_RESET': return resetBody;
      case 'DUE_REMINDER': return dueBody;
      case 'ANNOUNCEMENT': return announcementBody;
    }
  };

  const interpolatePreview = (raw: string) => {
    return raw
      .replace(/{memberName}/g, 'Aarav Sharma')
      .replace(/{libraryName}/g, 'Vedic Central Library')
      .replace(/{branchName}/g, 'Kothrud Main Branch')
      .replace(/{expiryDate}/g, '31-Dec-2026')
      .replace(/{amountDue}/g, '₹2,499')
      .replace(/{loginUrl}/g, 'https://vedic.libraryos.com/login')
      .replace(/{resetUrl}/g, 'https://vedic.libraryos.com/reset?token=xyz')
      .replace(/{announcementText}/g, 'Scheduled database optimization will run this Sunday between 02:00 AM and 03:00 AM IST.');
  };

  const handleInsertTag = (tag: string) => {
    switch (activeTab) {
      case 'WELCOME':
        setValue('notificationTemplates.welcomeEmailBody', `${welcomeBody} ${tag}`, { shouldDirty: true });
        break;
      case 'PASSWORD_RESET':
        setValue('notificationTemplates.passwordResetBody', `${resetBody} ${tag}`, { shouldDirty: true });
        break;
      case 'DUE_REMINDER':
        setValue('notificationTemplates.dueReminderBody', `${dueBody} ${tag}`, { shouldDirty: true });
        break;
      case 'ANNOUNCEMENT':
        setValue('notificationTemplates.announcementBody', `${announcementBody} ${tag}`, { shouldDirty: true });
        break;
    }
    toast.info(`Inserted variable tag: ${tag}`, { id: 'tag-inserted' });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">4. Default Notification Templates</h2>
            <p className="text-xs text-secondary">System-wide transactional notification templates for onboarding, security, and billing alerts.</p>
          </div>
        </div>
        <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
          Email • SMS • App
        </span>
      </div>

      {/* Template Type Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Notification Templates">
        {NOTIFICATION_TEMPLATE_OPTIONS.map((tmpl) => (
          <button
            key={tmpl.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tmpl.key}
            onClick={() => setActiveTab(tmpl.key as typeof activeTab)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tmpl.key
                ? 'bg-primary-subtle text-primary border border-focus shadow-xs'
                : 'bg-surface-zebra text-secondary hover:text-foreground'
            }`}
            data-testid={`superadmin-settings-template-tab-${tmpl.key}`}
          >
            {tmpl.label}
          </button>
        ))}
      </div>

      {/* Available Placeholders Tags */}
      <div className="space-y-1.5 rounded-xl border border-border bg-surface-zebra p-3.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
          <Tag size={12} className="text-primary" /> Click to Insert Variable Tags
        </span>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {TEMPLATE_PLACEHOLDERS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleInsertTag(tag)}
              className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs font-mono text-primary hover:border-focus hover:bg-primary-subtle transition-all cursor-pointer"
              title="Click to insert into template"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Template Edit Form */}
        <div className="space-y-4">
          {activeTab === 'WELCOME' && (
            <div className="space-y-1.5">
              <label htmlFor="settings-welcome-email-subject" className="text-xs font-bold uppercase tracking-wider text-secondary">
                Welcome Email Subject Line
              </label>
              <input
                id="settings-welcome-email-subject"
                type="text"
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
                {...register('notificationTemplates.welcomeEmailSubject')}
                data-testid="superadmin-settings-welcome-subject-input"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="settings-template-body" className="text-xs font-bold uppercase tracking-wider text-secondary">
              Template Body Content ({activeTab})
            </label>
            {activeTab === 'WELCOME' && (
              <textarea
                id="settings-template-body"
                rows={6}
                className="w-full rounded-xl border border-border bg-input p-3.5 font-mono text-xs text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
                {...register('notificationTemplates.welcomeEmailBody')}
                data-testid="superadmin-settings-welcome-body-input"
              />
            )}
            {activeTab === 'PASSWORD_RESET' && (
              <textarea
                id="settings-template-body"
                rows={6}
                className="w-full rounded-xl border border-border bg-input p-3.5 font-mono text-xs text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
                {...register('notificationTemplates.passwordResetBody')}
                data-testid="superadmin-settings-reset-body-input"
              />
            )}
            {activeTab === 'DUE_REMINDER' && (
              <textarea
                id="settings-template-body"
                rows={6}
                className="w-full rounded-xl border border-border bg-input p-3.5 font-mono text-xs text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
                {...register('notificationTemplates.dueReminderBody')}
                data-testid="superadmin-settings-due-body-input"
              />
            )}
            {activeTab === 'ANNOUNCEMENT' && (
              <textarea
                id="settings-template-body"
                rows={6}
                className="w-full rounded-xl border border-border bg-input p-3.5 font-mono text-xs text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
                {...register('notificationTemplates.announcementBody')}
                data-testid="superadmin-settings-announcement-body-input"
              />
            )}
          </div>
        </div>

        {/* Right: Live Rendered Preview Box */}
        <div className="rounded-xl border border-border bg-surface-zebra p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Eye size={14} className="text-cyan-400" /> Live Interpolated Preview
            </span>
            <span className="text-[11px] text-secondary">Mock Data Injected</span>
          </div>

          {activeTab === 'WELCOME' && (
            <div className="text-xs font-bold text-foreground">
              <span className="text-secondary font-normal">Subject: </span>
              {welcomeSubject.replace(/{libraryName}/g, 'Vedic Central Library')}
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-4 font-sans text-xs text-foreground leading-relaxed whitespace-pre-line shadow-xs">
            {interpolatePreview(getCurrentText())}
          </div>
        </div>
      </div>
    </div>
  );
};
