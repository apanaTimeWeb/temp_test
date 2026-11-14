'use client';
import SuperadminCommunicationWhatsappIntegrationEmptyState from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationEmptyState';
import { useSuperadminCommunicationWhatsappIntegrationState } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/hooks/useSuperadminCommunicationWhatsappIntegrationState';
/** Responsibility: Superadmin System Whatsapp Integration Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationWhatsappIntegrationPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';

import { SuperadminCommunicationWhatsappIntegrationCard as Card } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCard';
import { SuperadminCommunicationWhatsappIntegrationCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardHeader';
import { SuperadminCommunicationWhatsappIntegrationCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardTitle';
import { SuperadminCommunicationWhatsappIntegrationCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardDescription';
import { SuperadminCommunicationWhatsappIntegrationCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardContent';
import { SuperadminCommunicationWhatsappIntegrationCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardFooter';
import { SuperadminCommunicationWhatsappIntegrationButton as Button } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationButton';
import { SuperadminCommunicationWhatsappIntegrationBadge as Badge } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationBadge';
import { SuperadminCommunicationWhatsappIntegrationInput as Input } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationInput';
import { SuperadminCommunicationWhatsappIntegrationLabel as Label } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationLabel';
import SuperadminCommunicationWhatsappIntegrationWhatsappSummary from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary';
import SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs';
import { SUPERADMIN_WHATSAPP_PROVIDERS, SUPERADMIN_WHATSAPP_SAMPLE_LOGS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/mocks/fixtures/SuperadminCommunicationWhatsappIntegrationWhatsappMockFixtures';
import {
  MessageSquare, ChevronRight, CheckCircle, Phone, Zap, Copy
} from 'lucide-react';
import { SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_WEBHOOK_URL } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants';
import { SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_TEST_STATUS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants';

/**
 * Renders the `superadmin_system` view owned by `SuperadminCommunicationWhatsappIntegrationPageClient`.
 * Owns local UI state for `provider`, `senderPhone`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminCommunicationWhatsappIntegrationPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const { provider, setProvider, senderPhone, setSenderPhone } = useSuperadminCommunicationWhatsappIntegrationState();
  

   // Supplied host application must configure the approved webhook URL.

  const selectedProvider = SUPERADMIN_WHATSAPP_PROVIDERS.find(p => p.id === provider)!;

  const deliveredCount = SUPERADMIN_WHATSAPP_SAMPLE_LOGS.filter(l => l.status === 'delivered').length;
  const failedCount    = SUPERADMIN_WHATSAPP_SAMPLE_LOGS.filter(l => l.status === 'failed').length;
  const deliveryRate   = Math.round((deliveredCount / SUPERADMIN_WHATSAPP_SAMPLE_LOGS.length) * 100);



  return (
    <div>
      {(SUPERADMIN_WHATSAPP_SAMPLE_LOGS.length === 0) && <SuperadminCommunicationWhatsappIntegrationEmptyState filtered />}

      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span><ChevronRight size={12} /><span>{tCopy("COPY.WHATSAPP_INTEGRATION")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <MessageSquare size={28} className="text-primary" />
          {tCopy("COPY.WHATSAPP_INTEGRATION")}</h1>
        <p className="text-secondary mt-1 text-sm">
          {tCopy("COPY.CONNECT_A_WHATSAPP_BUSINESS_API_PROVIDER_TO_SEND_AUTOMATED_RECEIPT_DF9646A6")}</p>
      </div>

      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.INTEGRATION_IS_PREVIEW_ONLY_CREDENTIAL_FIELDS_ARE_DISABLED_BECAUSE_E4018276")}</p>

      <SuperadminCommunicationWhatsappIntegrationWhatsappSummary
        testStatus={SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_TEST_STATUS}
        messageCount={SUPERADMIN_WHATSAPP_SAMPLE_LOGS.length}
        deliveredCount={deliveredCount}
        failedCount={failedCount}
        deliveryRate={deliveryRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Integration Config Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={18} className="text-primary" /> {tCopy("COPY.API_CONFIGURATION")}</CardTitle>
            <CardDescription>{tCopy("COPY.CONNECT_YOUR_WHATSAPP_BUSINESS_API_PROVIDER")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Provider selector */}
            <div className="space-y-2">
              <Label>{tCopy("COPY.API_PROVIDER")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {SUPERADMIN_WHATSAPP_PROVIDERS.map((p) => (
                  <button type="button"
                    key={p.id}
                    id={`provider-${p.id}`}
                    onClick={() => setProvider(p.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left motion-safe:transition-all motion-reduce:transition-none ${
                      provider === p.id
                        ? 'border-focus bg-primary-subtle text-primary'
                        : 'border-border hover:border-focus text-secondary hover:text-primary'
                    }`}
                   data-testid={`superadmin-system-system-whatsapp-integration-set-provider-1-${String(p.id)}`}>
                    <span className="text-xl">{p.logo}</span>
                    <span className="text-sm font-semibold">{p.label}</span>
                    {provider === p.id && <CheckCircle size={14} className="ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp-api-key">{tCopy("COPY.API_KEY")}</Label>
              <div className="relative">
                <Input
                  id="whatsapp-api-key"
                  type="password"
                  value=""
                  disabled
                  placeholder={tCopy("COPY.UNAVAILABLE_HOST_INTEGRATION_REQUIRED")}
                  className="pr-12"
                  aria-describedby="whatsapp-credential-contract-note"
                 data-testid="superadmin_communication_whatsapp_integration-whatsapp-api-key"/>
              </div>
            </div>

            {/* API Secret (conditional) */}
            {selectedProvider.requiresSecret && (
              <div className="space-y-2">
                <Label htmlFor="whatsapp-api-secret">{tCopy("COPY.API_SECRET")}</Label>
                <div className="relative">
                  <Input
                    id="whatsapp-api-secret"
                    type="password"
                    value=""
                    disabled
                    placeholder={tCopy("COPY.UNAVAILABLE_HOST_INTEGRATION_REQUIRED")}
                    className="pr-12"
                    aria-describedby="whatsapp-credential-contract-note"
                   data-testid="superadmin_communication_whatsapp_integration-whatsapp-api-secret"/>
                </div>
              </div>
            )}

            {/* Sender Phone */}
            <div className="space-y-2">
              <Label htmlFor="sender-phone">{tCopy("COPY.SENDER_WHATSAPP_NUMBER")}</Label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <Input
                  id="sender-phone"
                  type="tel"
                  value=""
                  disabled
                  placeholder={tCopy("COPY.UNAVAILABLE_HOST_INTEGRATION_REQUIRED")}
                  className="pl-9"
                 data-testid="superadmin_communication_whatsapp_integration-sender-phone"/>
              </div>
              <p id="whatsapp-credential-contract-note" className="text-xs text-warning">{tCopy("COPY.CREDENTIAL_AND_SENDER_CONFIGURATION_IS_DISABLED_UNTIL_A_SECURE_HOS_DDDA16D0")}</p>
            </div>

            {/* Webhook URL (read-only) */}
            <div className="space-y-2">
              <Label>{tCopy("COPY.INBOUND_WEBHOOK_URL")}</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-xs font-mono text-secondary truncate">
                  {SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_WEBHOOK_URL || tCopy('COPY.NOT_CONFIGURED_BY_HOST')}
                </div>
                <Button
                  id="copy-webhook-btn"
                  variant="ghost"
                  size="sm"
                  disabled
                  title={tCopy("COPY.UNAVAILABLE_THE_HOST_APPLICATION_HAS_NOT_SUPPLIED_A_VERIFIED_WEBHOOK_URL")}
                 data-testid="superadmin_communication_whatsapp_integration-copy-webhook-btn">
                  <Copy size={14} />
                </Button>
              </div>
              <p className="text-xs text-secondary">{tCopy("COPY.A_VERIFIED_WEBHOOK_URL_MUST_BE_SUPPLIED_BY_THE_HOST_APPLICATION_BEFORE_CONFIGURATION")}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              id="test-whatsapp-connection-btn"
              variant="ghost"
              disabled
              title={tCopy("COPY.UNAVAILABLE_THIS_SOURCE_SLICE_INCLUDES_NO_PROVIDER_NETWORK_ADAPTER")}
             data-testid="superadmin_communication_whatsapp_integration-test-whatsapp-connection-btn">
              {tCopy("COPY.TEST_CONNECTION_UNAVAILABLE_2")}</Button>
            <Button id="save-whatsapp-config-btn" variant="primary" disabled title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_PROVIDER_CONFIGURATION_API_CONTRACT_IS_SUPPLIED")} data-testid="superadmin_communication_whatsapp_integration-save-whatsapp-config-btn">
              {tCopy("COPY.SAVE_CONFIGURATION_UNAVAILABLE")}</Button>
          </CardFooter>
        </Card>

        {/* Trigger Events */}
        <Card>
          <CardHeader>
            <CardTitle>{tCopy("COPY.AUTO_TRIGGER_EVENTS")}</CardTitle>
            <CardDescription>{tCopy("COPY.MESSAGES_SENT_AUTOMATICALLY_WHEN_THESE_EVENTS_OCCUR")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'trigger-welcome',  label: tCopy('COPY.WELCOME_MESSAGE'),      desc: tCopy('COPY.WHEN_A_NEW_STUDENT_IS_ADMITTED'),             enabled: true  },
                { id: 'trigger-receipt',  label: tCopy('COPY.FEE_RECEIPT'),           desc: tCopy('COPY.WHEN_A_PAYMENT_IS_RECORDED'),                 enabled: true  },
                { id: 'trigger-renewal',  label: tCopy('COPY.RENEWAL_REMINDER'),      desc: tCopy('COPY.TEXT_3_DAYS_BEFORE_SUBSCRIPTION_EXPIRES'),         enabled: true  },
                { id: 'trigger-due',      label: tCopy('COPY.FEE_DUE_ALERT'),         desc: tCopy('COPY.ON_DUE_DATE_1_DAY_IF_UNPAID'),              enabled: true  },
                { id: 'trigger-suspend',  label: tCopy('COPY.AUTO_SUSPEND_NOTICE'),   desc: tCopy('COPY.WHEN_SEAT_IS_AUTO_SUSPENDED'),                enabled: false },
                { id: 'trigger-waitlist', label: tCopy('COPY.WAITLIST_NOTIFICATION'), desc: tCopy('COPY.WHEN_SEAT_BECOMES_AVAILABLE_FOR_WAITLISTED'), enabled: true  },
                { id: 'trigger-absentee', label: tCopy('COPY.ABSENTEE_ALERT'),        desc: tCopy('COPY.WHEN_STUDENT_ABSENT_FOR_3_DAYS'),            enabled: false },
              ].map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                  <div>
                    <p className="text-sm font-medium text-primary">{event.label}</p>
                    <p className="text-xs text-secondary">{event.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={event.enabled ? 'success' : 'outline'}>
                      {event.enabled ? tCopy('COPY.STATUS_ON') : tCopy('COPY.STATUS_OFF')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs logs={SUPERADMIN_WHATSAPP_SAMPLE_LOGS} />
    </div>
  );
}
