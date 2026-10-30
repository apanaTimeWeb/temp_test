'use client';
// RESPONSIBILITY: AdminSystemSettingsUpiSection component owned by admin_system; responsibility folder: admin_system_settings_page_view_sections.
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
import { Upload, Save } from 'lucide-react';
import type useSettingsPage from '@/app/frontend_admin/admin_system/system_settings/hooks/useAdminSystemSettingsPage';
import { ADMIN_SYSTEM_SETTINGS_PAYMENT_MODE_OPTIONS } from '@/app/frontend_admin/admin_system/system_settings/config/admin_system_settings.url_config';
import type { AdminSystemSettingsUpiSectionProps } from '@/app/frontend_admin/admin_system/system_settings/types/AdminSystemSettingsComponentTypes';


export default function AdminSystemSettingsUpiSection({ model }: AdminSystemSettingsUpiSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { form, setForm, handleSave } = model;
  return (
    <Card>
                  <CardHeader>
                    <CardTitle>{t('UPI_PAYMENT')}</CardTitle>
                    <CardDescription>{t('PAYMENT_METHODS_DESCRIPTION')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="upi-qr">{t('UPI_QR_CODE')}</Label>
                      <div id="upi-qr" className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8" role="note">
                        <Upload size={18} strokeWidth={2} aria-hidden="true" className="text-text-secondary mb-2" />
                        <span className="text-sm text-text-secondary">{t('QR_UPLOAD_UNAVAILABLE')}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">{t('UPI_ID')}</Label>
                      <Input id="upi-id" placeholder={t('UPI_PLACEHOLDER')} value={form.upiId} onChange={e => setForm(f => ({ ...f, upiId: e.target.value }))} />
                    </div>
                    <div className="space-y-3">
                      <Label>{t('ACCEPTED_PAYMENT_MODES')}</Label>
                      {ADMIN_SYSTEM_SETTINGS_PAYMENT_MODE_OPTIONS.map(({ key, labelKey }) => (
                        <label key={key} htmlFor={`payment-${key}`} className="flex min-h-11 cursor-pointer items-center gap-3">
                          <input type="checkbox" id={`payment-${key}`} checked={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))} className="h-4 w-4 rounded border-border bg-card accent-primary" />
                          <span className="text-sm text-primary">{t(labelKey)}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button data-testid="admin_system-AdminSystemSettingsPageView-control-005" id="save-upi-btn" onClick={handleSave} disabled={!model.isDemoMode} title={!model.isDemoMode ? t('SETTINGS_SAVE_BLOCKED') : undefined} variant="primary">
                      <Save size={18} strokeWidth={2} /> {t('SAVE_SETTINGS')}
                    </Button>
                  </CardFooter>
                </Card>
  );
}
