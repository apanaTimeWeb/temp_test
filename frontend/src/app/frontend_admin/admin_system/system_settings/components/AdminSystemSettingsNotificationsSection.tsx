'use client';

// RESPONSIBILITY: AdminSystemSettingsNotificationsSection component owned by admin_system; responsibility folder: admin_system_settings_page_view_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Input } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveInput';
import { Label } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveLabel';
import { Eye, EyeOff, Save } from 'lucide-react';
import type useSettingsPage from '@/app/frontend_admin/admin_system/system_settings/hooks/useAdminSystemSettingsPage';
import type { AdminSystemSettingsNotificationsSectionProps } from '@/app/frontend_admin/admin_system/system_settings/types/AdminSystemSettingsComponentTypes';


export default function AdminSystemSettingsNotificationsSection({ model }: AdminSystemSettingsNotificationsSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { showApiKey, setShowApiKey, form, setForm, handleSave } = model;
  return (
    <Card>
                  <CardHeader>
                    <CardTitle>{t('NOTIFICATIONS')}</CardTitle>
                    <CardDescription>{t('NOTIFICATIONS_DESCRIPTION')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">{t('NOTIFICATION_API_KEY')}</Label>
                      <div className="relative">
                        <Input
                          id="api-key"
                          type={showApiKey ? 'text' : 'password'}
                          value={form.apiKey}
                          onChange={e => setForm(f => ({ ...f, apiKey: e.target.value }))}
                          className="pr-12"
                        />
                        <button data-testid="admin_system-AdminSystemSettingsPageView-control-006"
                          type="button"
                          aria-label={showApiKey ? t('HIDE_API_KEY') : t('SHOW_API_KEY')}
                          aria-pressed={showApiKey}
                          onClick={() => setShowApiKey(s => !s)}
                          className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-secondary hover:text-primary motion-safe:transition-colors motion-safe:duration-fast"
                        >
                          {showApiKey ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                        </button>
                      </div>
                    </div>
                    <Button id="test-connection-btn" variant="ghost" disabled title={t('CONNECTION_TEST_UNAVAILABLE')}>{t('TEST_CONNECTION')}</Button>
                    <p role="status" className="text-xs text-text-secondary">{t('CONNECTION_TEST_UNAVAILABLE')}</p>
                  </CardContent>
                  <CardFooter>
                    <Button data-testid="admin_system-AdminSystemSettingsPageView-control-007" id="save-notifications-btn" onClick={handleSave} disabled={!model.isDemoMode} title={!model.isDemoMode ? t('SETTINGS_SAVE_BLOCKED') : undefined} variant="primary">
                      <Save size={18} strokeWidth={2} /> {t('SAVE_SETTINGS')}
                    </Button>
                  </CardFooter>
                </Card>
  );
}
