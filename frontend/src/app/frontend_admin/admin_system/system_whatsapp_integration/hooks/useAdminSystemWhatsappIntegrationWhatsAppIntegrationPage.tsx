// DATA FLOW: system_whatsapp_integration route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ADMIN_SYSTEM_WHATSAPP_PROVIDER_EXAMPLES, ADMIN_SYSTEM_WHATSAPP_MESSAGE_LOGS } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/mocks/AdminSystemWhatsappIntegrationWhatsAppFixtures';
import toast from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
export default function useAdminSystemWhatsAppIntegrationPage() {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [provider, setProviderState] = useState('wati');
  const [apiKey, setApiKeyState] = useState('');
  const [apiSecret, setApiSecretState] = useState('');
  const [senderPhone, setSenderPhoneState] = useState('+91 9000000000');
  const [savedConfiguration, setSavedConfiguration] = useState<{ provider: string; apiKeyConfigured: boolean; apiSecretConfigured: boolean; senderPhone: string } | null>(null);
  const setProvider = (value: string) => { setProviderState(value); setSavedConfiguration(null); };
  const setApiKey = (value: string) => { setApiKeyState(value); setSavedConfiguration(null); };
  const setApiSecret = (value: string) => { setApiSecretState(value); setSavedConfiguration(null); };
  const setSenderPhone = (value: string) => { setSenderPhoneState(value); setSavedConfiguration(null); };
  const [showApiKey,  setShowApiKey]  = useState(false);
  const [showSecret,  setShowSecret]  = useState(false);

  const webhookUrl = 'https://example.invalid/webhooks/whatsapp/inbound'; // Placeholder only; not a registered provider endpoint.

  const selectedProvider = ADMIN_SYSTEM_WHATSAPP_PROVIDER_EXAMPLES.find(p => p.id === provider) ?? ADMIN_SYSTEM_WHATSAPP_PROVIDER_EXAMPLES[0]!;

  // Fixture activity is exposed only in explicitly enabled demo mode, never as a live log fallback.
  const messageLogs = isDemoMode ? ADMIN_SYSTEM_WHATSAPP_MESSAGE_LOGS : [];
  const deliveredCount = messageLogs.filter(l => l.status === 'delivered').length;
  const failedCount    = messageLogs.filter(l => l.status === 'failed').length;

  const handleTestConnection = () => {
    if (!isDemoMode) { toast.error(t('WHATSAPP_TEST_BLOCKED'), { id: 'admin-system-whatsapp-test-blocked' }); return; }
    toast.info(t('WHATSAPP_DEMO_TEST_NO_NETWORK'), { id: 'admin-system-whatsapp-demo-test' });
  };

  const handleSaveConfiguration = () => {
    if (!isDemoMode) { toast.error(t('WHATSAPP_SAVE_BLOCKED'), { id: 'admin-system-whatsapp-save-blocked' }); return; }
    setSavedConfiguration({ provider, apiKeyConfigured: Boolean(apiKey.trim()), apiSecretConfigured: Boolean(apiSecret.trim()), senderPhone: senderPhone.trim() });
    toast.success(t('WHATSAPP_DEMO_SAVED'), { id: 'admin-system-whatsapp-demo-saved' });
  };



  return {
    PROVIDERS: ADMIN_SYSTEM_WHATSAPP_PROVIDER_EXAMPLES,
    isDemoMode,
    isConfigurationSaved: savedConfiguration !== null,
    savedConfiguration,
    MESSAGE_LOGS: messageLogs,
    provider,
    setProvider,
    apiKey,
    setApiKey,
    apiSecret,
    setApiSecret,
    senderPhone,
    setSenderPhone,
    showApiKey,
    setShowApiKey,
    showSecret,
    setShowSecret,
    webhookUrl,
    selectedProvider,
    deliveredCount,
    failedCount,
    handleTestConnection,
    handleSaveConfiguration,
  } as const;
}
