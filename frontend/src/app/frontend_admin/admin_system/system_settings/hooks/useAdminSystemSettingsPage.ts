// DATA FLOW: system_settings route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { createAdminSystemSettingsSchema } from '@/app/frontend_admin/admin_system/system_settings/api/admin_system_settings_api';
import type { AdminSystemSettingsFormValues } from '@/app/frontend_admin/admin_system/system_settings/api/admin_system_settings_api';
import { ADMIN_SYSTEM_SETTINGS_CATEGORIES, type AdminSystemSettingsCategoryId } from '@/app/frontend_admin/admin_system/system_settings/config/admin_system_settings.url_config';

function createDefaultForm(isDemoMode: boolean): AdminSystemSettingsFormValues {
  return {
    appName: '',
    upiId: '',
    acceptCash: isDemoMode,
    acceptUpi: isDemoMode,
    acceptCard: false,
    acceptBank: false,
    // Never display a placeholder that resembles a live API credential.
    apiKey: '',
  };
}

function isSettingsCategory(value: string | null): value is AdminSystemSettingsCategoryId {
  return value !== null && ADMIN_SYSTEM_SETTINGS_CATEGORIES.some((category) => category.id === value);
}

export default function useAdminSystemSettingsPage() {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const isDemoMode = isFrontendDemoModeEnabled();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedView = searchParams.get('view');
  const [active, setActiveState] = useState<AdminSystemSettingsCategoryId>(() => isSettingsCategory(requestedView) ? requestedView : 'branding');
  const [showApiKey, setShowApiKey] = useState(false);
  const setActive = useCallback((category: AdminSystemSettingsCategoryId) => {
    setActiveState(category);
    const next = new URLSearchParams(searchParams.toString());
    next.set('view', category);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    setActiveState(isSettingsCategory(requestedView) ? requestedView : 'branding');
  }, [requestedView]);
  const settingsSchema = useMemo(() => createAdminSystemSettingsSchema({
    appNameRequired: t('SETTINGS_VALIDATION_APP_NAME_REQUIRED'),
    appNameTooLong: t('SETTINGS_VALIDATION_APP_NAME_TOO_LONG'),
    upiIdRequired: t('SETTINGS_VALIDATION_UPI_REQUIRED'),
    upiIdTooLong: t('SETTINGS_VALIDATION_UPI_TOO_LONG'),
    apiKeyTooLong: t('SETTINGS_VALIDATION_API_KEY_TOO_LONG'),
  }), [t]);
  const formMethods = useForm<AdminSystemSettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: createDefaultForm(isDemoMode),
    mode: 'onBlur',
  });
  const form = formMethods.watch();

  const setForm = (updater: (current: AdminSystemSettingsFormValues) => AdminSystemSettingsFormValues) => {
    const current = formMethods.getValues();
    const next = updater(current);
    (Object.keys(next) as Array<keyof AdminSystemSettingsFormValues>).forEach((key) => {
      if (next[key] !== current[key]) formMethods.setValue(key, next[key], { shouldDirty: true, shouldValidate: true });
    });
  };

  const handleSave = async () => {
    if (!isDemoMode) {
      toast.error(t('SETTINGS_SAVE_BLOCKED'), { id: 'admin-system-settings-save-blocked' });
      return;
    }
    const fieldsByCategory: Record<AdminSystemSettingsCategoryId, readonly FieldPath<AdminSystemSettingsFormValues>[]> = {
      branding: [],
      'late-fee': [],
      'auto-suspend': [],
      upi: ['upiId'],
      notifications: ['apiKey'],
      general: ['appName'],
    };
    const fields = fieldsByCategory[active];
    const valid = fields.length === 0 || await formMethods.trigger([...fields]);
    if (!valid) return;
    toast.info(t('SETTINGS_LOCAL_STATE_NOTICE'), { id: 'admin-system-settings-local-state-notice' });
  };

  const handleTestConnection = () => {
    toast.info(t('SYSTEM_CONNECTION_TEST_DEMO'), { id: 'admin-system-connection-test-demo' });
  };

  return { isDemoMode, active, setActive, showApiKey, setShowApiKey, form, setForm, formMethods, handleSave, handleTestConnection } as const;
}
