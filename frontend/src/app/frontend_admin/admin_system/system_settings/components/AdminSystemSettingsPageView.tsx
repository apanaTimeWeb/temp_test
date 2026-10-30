// RESPONSIBILITY: AdminSystemSettingsPageView component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import type useSettingsPage from '@/app/frontend_admin/admin_system/system_settings/hooks/useAdminSystemSettingsPage';
import { ADMIN_SYSTEM_SETTINGS_CATEGORIES } from '@/app/frontend_admin/admin_system/system_settings/config/admin_system_settings.url_config';
import { ChevronRight, Settings } from 'lucide-react';

import AdminSystemSettingsCanonicalDestinationCard from '@/app/frontend_admin/admin_system/system_settings/components/AdminSystemSettingsCanonicalDestinationCard';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

import AdminSystemSettingsUpiSection from '@/app/frontend_admin/admin_system/system_settings/components/AdminSystemSettingsUpiSection';

import AdminSystemSettingsNotificationsSection from '@/app/frontend_admin/admin_system/system_settings/components/AdminSystemSettingsNotificationsSection';

import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Input } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveInput';
import { Label } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveLabel';
import { Save } from 'lucide-react';
import type { AdminSystemSettingsPageViewProps } from '@/app/frontend_admin/admin_system/system_settings/types/AdminSystemSettingsComponentTypes';


const validationFieldKeys: Record<string, string> = {
  appName: 'LIBRARY_NAME',
  upiId: 'UPI_ID',
  apiKey: 'NOTIFICATION_API_KEY',
};

export default function AdminSystemSettingsPageView({ model }: AdminSystemSettingsPageViewProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { isDemoMode, active, setActive } = model;
  const validationErrors = Object.entries(model.formMethods.formState.errors).flatMap(([field, error]) => {
    const message = error && typeof error.message === 'string' ? error.message : '';
    return message ? [{ field, message }] : [];
  });
  return (
    <div>
      {model.formMethods.formState.submitCount > 0 && validationErrors.length > 0 && (
        <section id="settings-validation-summary" role="alert" aria-live="assertive" aria-labelledby="settings-validation-summary-title" className="mb-4 rounded-lg border border-danger-bg bg-danger-bg p-4 text-danger-text">
          <h2 id="settings-validation-summary-title" className="font-semibold">{t('SETTINGS_VALIDATION_SUMMARY_TITLE')}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {validationErrors.map(({ field, message }) => (
              <li key={field}><span className="font-medium">{t(validationFieldKeys[field] ?? 'SETTINGS_VALIDATION_FIELD_GENERIC')}:</span> {message}</li>
            ))}
          </ul>
        </section>
      )}
      {!isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('SETTINGS_API_DISABLED')}</p>}
      {isDemoMode && <p role="status" className="mb-4 rounded-md border border-info-bg bg-info-bg p-3 text-info-text">{t('SETTINGS_LOCAL_STATE_NOTICE')}</p>}
      <header className="mb-8">
        <nav aria-label={t('BREADCRUMB_ARIA')} className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-text-secondary"><span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} aria-hidden="true" /><span aria-current="page">{t('SETTINGS')}</span></nav>
        <h1 className="flex items-center gap-3 text-page-title font-bold text-text-primary"><Settings size={18} strokeWidth={2} aria-hidden="true" className="text-primary" />{t('SETTINGS')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('SETTINGS_HEADER_DESCRIPTION')}</p>
      </header>

      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Left sidebar nav */}
        <aside className="w-full min-w-0 lg:w-52 lg:shrink-0">
          <nav aria-label={t('SETTINGS_CATEGORIES_ARIA')} className="flex flex-wrap gap-1 lg:flex-col">
            {ADMIN_SYSTEM_SETTINGS_CATEGORIES.map(({ id, labelKey, icon: Icon }) => (
              <button data-testid={`admin_system-AdminSystemSettingsPageView-navigation-${id}`}
                key={id}
                id={`settings-nav-${id}`}
                aria-pressed={active === id}
                onClick={() => setActive(id)}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium motion-safe:transition-colors motion-safe:duration-base text-left ${
                  active === id
                    ? 'bg-primary-subtle text-primary border border-border'
                    : 'text-text-secondary hover:bg-card hover:text-primary'
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                {t(labelKey)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right panel */}
        <fieldset disabled={!isDemoMode} className="min-w-0 flex-1 disabled:opacity-80">
          {active === 'branding' && <AdminSystemSettingsCanonicalDestinationCard title={t('BRANDING')} href={ADMIN_ROUTES.SYSTEM_BRANDING} />}

          {active === 'late-fee' && <AdminSystemSettingsCanonicalDestinationCard title={t('LATE_FEE_RULES')} href={ADMIN_ROUTES.FINANCE_LATE_FEES} />}

          {active === 'auto-suspend' && <AdminSystemSettingsCanonicalDestinationCard title={t('AUTO_SUSPEND_RULES')} href={ADMIN_ROUTES.FINANCE_AUTO_SUSPEND} />}

          {active === 'upi' && <AdminSystemSettingsUpiSection model={model} />}

          {active === 'notifications' && <AdminSystemSettingsNotificationsSection model={model} />}

          {active === 'general' && <Card>
            <CardHeader><CardTitle>{t('GENERAL')}</CardTitle><CardDescription>{t('GENERAL_DESCRIPTION')}</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2"><Label htmlFor="library-name">{t('LIBRARY_NAME')}</Label><Input id="library-name" value={model.form.appName} onChange={(event) => model.setForm((current) => ({ ...current, appName: event.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="library-timezone">{t('TIMEZONE')}</Label><Input id="library-timezone" value="Asia/Kolkata (IST)" disabled aria-describedby="library-settings-contract-note" /></div>
              <div className="space-y-2"><Label htmlFor="library-currency">{t('CURRENCY')}</Label><Input id="library-currency" value="INR" disabled aria-describedby="library-settings-contract-note" /></div>
            </CardContent>
            <p id="library-settings-contract-note" className="px-6 text-xs text-text-secondary">{t('TIMEZONE_CURRENCY_READONLY')}</p>
            <CardFooter><Button data-testid="admin_system-AdminSystemSettingsPageView-control-008" id="save-general-btn" onClick={model.handleSave} disabled={!model.isDemoMode} title={!model.isDemoMode ? t('SETTINGS_SAVE_BLOCKED') : undefined} variant="primary"><Save size={18} strokeWidth={2} /> {t('SAVE_SETTINGS')}</Button></CardFooter>
          </Card>}
        </fieldset>
      </div>
    </div>
  );
}


export type { AdminSystemSettingsPageViewProps };
