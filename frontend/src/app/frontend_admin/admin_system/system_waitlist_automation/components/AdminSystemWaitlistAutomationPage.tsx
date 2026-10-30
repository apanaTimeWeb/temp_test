'use client';
// RESPONSIBILITY: AdminSystemWaitlistAutomationPage component owned by admin_system; responsibility folder: admin_system_components_tables.

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_SYSTEM_WAITLIST_PREVIEW_DEFAULT_TEMPLATE } from '@/app/frontend_admin/admin_system/system_waitlist_automation/mocks/scenarios/admin_system_waitlist_automation.scenarios';
import { createAdminSystemWaitlistPreviewSchema, type AdminSystemWaitlistPreviewFormValues } from '@/app/frontend_admin/admin_system/system_waitlist_automation/schemas/AdminSystemWaitlistAutomationWaitlistPreviewSchema';
import { ChevronRight, ListOrdered } from 'lucide-react';
import AdminSystemWaitlistStatusSection from '@/app/frontend_admin/admin_system/system_waitlist_automation/components/AdminSystemWaitlistAutomationWaitlistStatusSection';
import AdminSystemWaitlistConfigurationSection from '@/app/frontend_admin/admin_system/system_waitlist_automation/components/AdminSystemWaitlistAutomationWaitlistConfigurationSection';
import AdminSystemWaitlistQueueSection from '@/app/frontend_admin/admin_system/system_waitlist_automation/components/AdminSystemWaitlistAutomationWaitlistQueueSection';

export function AdminSystemWaitlistAutomationPage() {
  const t = useTranslations('ADMIN_SYSTEM_WAITLIST');
  const isDemoMode = isFrontendDemoModeEnabled();
  const previewSchema = useMemo(() => createAdminSystemWaitlistPreviewSchema({
    delayInvalid: t('VALIDATION_DELAY_INVALID'),
    templateRequired: t('VALIDATION_TEMPLATE_REQUIRED'),
    templateTooLong: t('VALIDATION_TEMPLATE_TOO_LONG'),
  }), [t]);
  const form = useForm<AdminSystemWaitlistPreviewFormValues>({ resolver: zodResolver(previewSchema), mode: 'onBlur', defaultValues: { enabled: true, delay: 0, template: ADMIN_SYSTEM_WAITLIST_PREVIEW_DEFAULT_TEMPLATE } });
  const enabled = form.watch('enabled');
  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1><p role="status" className="text-warning-text">{t('LIVE_UNAVAILABLE')}</p></section>;
  return (
    <div>
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_NOTICE')}</p>
      <p role="status" className="mb-4 text-sm text-text-secondary">{t('SAVE_BLOCKED')}</p>
      <header className="mb-8"><div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-text-secondary"><span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('TITLE')}</span></div><h1 className="flex items-center gap-3 text-page-title font-bold text-text-primary"><ListOrdered size={18} strokeWidth={2} className="text-primary" />{t('TITLE')}</h1><p className="mt-1 text-sm text-text-secondary">{t('SUBTITLE')}</p></header>
      <AdminSystemWaitlistStatusSection enabled={enabled} onEnabledChange={(value) => form.setValue('enabled', value, { shouldDirty: true, shouldValidate: true })} />
      <AdminSystemWaitlistConfigurationSection form={form} />
      <AdminSystemWaitlistQueueSection />
    </div>
  );
}
