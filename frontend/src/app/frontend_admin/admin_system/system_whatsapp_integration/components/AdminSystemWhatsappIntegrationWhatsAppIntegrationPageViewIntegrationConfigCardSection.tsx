// RESPONSIBILITY: AdminSystemWhatsAppIntegrationPageViewIntegrationConfigCardSection component owned by admin_system; responsibility folder: admin_system_whatsapp_integration_page_view_sections.
'use client';

import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { Input } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveInput';
import { Label } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveLabel';
import { Eye, EyeOff, Copy, CheckCircle, Phone, Zap } from 'lucide-react';
import type useWhatsAppIntegrationPage from '@/app/frontend_admin/admin_system/system_whatsapp_integration/hooks/useAdminSystemWhatsappIntegrationWhatsAppIntegrationPage';
import type { AdminSystemWhatsAppIntegrationPageViewIntegrationConfigCardSectionProps } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';


/**
 * Renders WhatsApp provider configuration controls for local preview. Dependencies: the owning Admin System WhatsApp hook model and module-owned UI primitives. Edge cases: a local preview or connection-test placeholder must not imply real provider connectivity or persisted secrets.
 */
export default function AdminSystemWhatsAppIntegrationPageViewIntegrationConfigCardSection({ model }: AdminSystemWhatsAppIntegrationPageViewIntegrationConfigCardSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { PROVIDERS, isDemoMode, isConfigurationSaved, provider, setProvider, apiKey, setApiKey, apiSecret, setApiSecret, senderPhone, setSenderPhone, showApiKey, setShowApiKey, showSecret, setShowSecret, webhookUrl, selectedProvider, handleTestConnection, handleSaveConfiguration } = model;
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Integration Config Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={18} strokeWidth={2} className="text-primary" /> {t('API_CONFIGURATION')}
            </CardTitle>
            <CardDescription>{t('PROVIDER_NOT_CONFIGURED')}</CardDescription>
            {isConfigurationSaved && <p role="status" className="rounded-md border border-info-bg bg-info-bg p-3 text-sm text-info-text">{t('WHATSAPP_DEMO_SAVED_BANNER')}</p>}
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Provider selector */}
            <div className="space-y-2">
              <Label>{t('API_PROVIDER')}</Label>
              <div className="grid grid-cols-2 gap-2">
                {PROVIDERS.map(p => (
                  <button type="button" data-testid={`admin_system-whatsapp-provider-${p.id}`}
                    key={p.id}
                    id={`provider-${p.id}`}
                    aria-pressed={provider === p.id}
                    onClick={() => setProvider(p.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left motion-safe:transition-all motion-safe:duration-base ${
                      provider === p.id
                        ? 'border-border bg-primary-subtle text-primary'
                        : 'border-border hover:border-primary text-text-secondary hover:text-primary'
                    }`}
                  >
                    <span className="text-xl">{p.logo}</span>
                    <span className="text-sm font-semibold">{p.label}</span>
                    {provider === p.id && <CheckCircle size={18} strokeWidth={2} className="ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp-api-key">{t('API_KEY')}</Label>
              <div className="relative">
                <Input
                  id="whatsapp-api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder={t('API_KEY_PLACEHOLDER')}
                  className="pr-12"
                />
                <button data-testid="admin_system-whatsapp-toggle-api-key"
                  type="button"
                  aria-label={showApiKey ? t('HIDE_API_KEY') : t('SHOW_API_KEY')}
                  onClick={() => setShowApiKey(s => !s)}
                  className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-secondary hover:text-primary motion-safe:transition-colors motion-safe:duration-fast"
                >
                  {showApiKey ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* API Secret (conditional) */}
            {selectedProvider.requiresSecret && (
              <div className="space-y-2">
                <Label htmlFor="whatsapp-api-secret">{t('API_SECRET')}</Label>
                <div className="relative">
                  <Input
                    id="whatsapp-api-secret"
                    type={showSecret ? 'text' : 'password'}
                    value={apiSecret}
                    onChange={e => setApiSecret(e.target.value)}
                    placeholder={t('API_SECRET_PLACEHOLDER')}
                    className="pr-12"
                  />
                  <button data-testid="admin_system-whatsapp-toggle-api-secret"
                    type="button"
                    aria-label={showSecret ? t('HIDE_API_SECRET') : t('SHOW_API_SECRET')}
                    onClick={() => setShowSecret(s => !s)}
                    className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-secondary hover:text-primary motion-safe:transition-colors motion-safe:duration-fast"
                  >
                    {showSecret ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                  </button>
                </div>
              </div>
            )}

            {/* Sender Phone */}
            <div className="space-y-2">
              <Label htmlFor="sender-phone">{t('SENDER_WHATSAPP_NUMBER')}</Label>
              <div className="relative">
                <Phone size={18} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <Input
                  id="sender-phone"
                  type="tel"
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  placeholder={t('WHATSAPP_NUMBER_PLACEHOLDER')}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-text-secondary">{t('REGISTERED_WHATSAPP_NUMBER_HELP')}</p>
            </div>

            {/* Webhook URL (read-only) */}
            <div className="space-y-2">
              <Label>{t('WEBHOOK_EXAMPLE')}</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-xs font-mono text-text-secondary truncate">
                  {webhookUrl}
                </div>
                <Button data-testid="admin_system-whatsapp-copy-example-webhook"
                  id="copy-webhook-btn"
                  variant="ghost"
                  size="sm"
                  aria-label={t('COPY_WEBHOOK_ARIA')}
                  disabled
                  title={t('WEBHOOK_UNREGISTERED_NOTICE')}
                >
                  <Copy size={18} strokeWidth={2} />
                </Button>
              </div>
              <p className="text-xs text-text-secondary">{t('WEBHOOK_UNREGISTERED_NOTICE')}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button data-testid="admin_system-whatsapp-test-connection-unavailable"
              id="test-whatsapp-connection-btn"
              variant="ghost"
              disabled={!isDemoMode}
              title={!isDemoMode ? t('WHATSAPP_TEST_BLOCKED') : t('WHATSAPP_DEMO_TEST_NO_NETWORK')}
              onClick={handleTestConnection}
            >
              {isDemoMode ? t('WHATSAPP_TEST_CONNECTION') : t('WHATSAPP_TEST_CONNECTION_UNAVAILABLE')}
            </Button>
            <Button id="save-whatsapp-config-btn" variant="primary" disabled={!isDemoMode} title={!isDemoMode ? t('WHATSAPP_SAVE_BLOCKED') : t('WHATSAPP_DEMO_SAVED_BANNER')} onClick={handleSaveConfiguration}>
              {isDemoMode ? t('SAVE_CONFIG') : t('SAVE_CONFIG_UNAVAILABLE')}
            </Button>
          </CardFooter>
        </Card>

        {/* Trigger Events */}
        <Card>
          <CardHeader>
            <CardTitle>{t('AUTO_TRIGGER_EVENTS')}</CardTitle>
            <CardDescription>{t('TRIGGER_DEFAULTS_NOTICE')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {([
                { id: 'trigger-welcome', label: 'TRIGGER_WELCOME_LABEL', desc: 'TRIGGER_WELCOME_DESCRIPTION', enabled: true },
                { id: 'trigger-receipt', label: 'TRIGGER_RECEIPT_LABEL', desc: 'TRIGGER_RECEIPT_DESCRIPTION', enabled: true },
                { id: 'trigger-renewal', label: 'TRIGGER_RENEWAL_LABEL', desc: 'TRIGGER_RENEWAL_DESCRIPTION', enabled: true },
                { id: 'trigger-due', label: 'TRIGGER_DUE_LABEL', desc: 'TRIGGER_DUE_DESCRIPTION', enabled: true },
                { id: 'trigger-suspend', label: 'TRIGGER_SUSPEND_LABEL', desc: 'TRIGGER_SUSPEND_DESCRIPTION', enabled: false },
                { id: 'trigger-waitlist', label: 'TRIGGER_WAITLIST_LABEL', desc: 'TRIGGER_WAITLIST_DESCRIPTION', enabled: true },
                { id: 'trigger-absentee', label: 'TRIGGER_ABSENTEE_LABEL', desc: 'TRIGGER_ABSENTEE_DESCRIPTION', enabled: false },
              ] as const).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{t(event.label)}</p>
                    <p className="text-xs text-text-secondary">{t(event.desc)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <AdminSystemBadge variant={event.enabled ? 'success' : 'outline'}>
                      {event.enabled ? t('TRIGGER_EXAMPLE_ENABLED') : t('TRIGGER_EXAMPLE_DISABLED')}
                    </AdminSystemBadge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>;
}


export type { AdminSystemWhatsAppIntegrationPageViewIntegrationConfigCardSectionProps };
