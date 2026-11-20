'use client';
import SuperadminCommunicationWhatsappIntegrationEmptyState from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationEmptyState';
import { useSuperadminCommunicationWhatsappIntegrationState } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/hooks/useSuperadminCommunicationWhatsappIntegrationState';
/** Responsibility: Superadmin System Whatsapp Integration Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationWhatsappIntegrationPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import SuperadminCommunicationWhatsappIntegrationWhatsappSummary from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary';
import SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs';
import { SUPERADMIN_WHATSAPP_PROVIDERS, SUPERADMIN_WHATSAPP_SAMPLE_LOGS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/mocks/fixtures/SuperadminCommunicationWhatsappIntegrationWhatsappMockFixtures';
import {
  MessageSquare, CheckCircle, Phone, Zap, Copy, Lock, ShieldCheck, KeyRound, Bell, Radio, Check
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_WEBHOOK_URL } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants';
import { SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_TEST_STATUS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants';

/**
 * Renders the `superadmin_system` view owned by `SuperadminCommunicationWhatsappIntegrationPageClient`.
 * Owns local UI state for `provider`, `senderPhone`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminCommunicationWhatsappIntegrationPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const { provider, setProvider } = useSuperadminCommunicationWhatsappIntegrationState();
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const selectedProvider = SUPERADMIN_WHATSAPP_PROVIDERS.find(p => p.id === provider)!;

  const deliveredCount = SUPERADMIN_WHATSAPP_SAMPLE_LOGS.filter(l => l.status === 'delivered').length;
  const failedCount    = SUPERADMIN_WHATSAPP_SAMPLE_LOGS.filter(l => l.status === 'failed').length;
  const deliveryRate   = Math.round((deliveredCount / SUPERADMIN_WHATSAPP_SAMPLE_LOGS.length) * 100);

  const handleCopyWebhook = () => {
    const text = SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_WEBHOOK_URL || 'https://api.libraryos.com/v1/webhook/whatsapp';
    navigator.clipboard?.writeText(text);
    setCopiedWebhook(true);
    toast.success('Webhook URL copied to clipboard');
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {SUPERADMIN_WHATSAPP_SAMPLE_LOGS.length === 0 && <SuperadminCommunicationWhatsappIntegrationEmptyState filtered />}

      {/* Hero Header */}
      <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/70 via-[#061814] to-[#040d0a] p-5 sm:p-6 shadow-xl shadow-emerald-950/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{tCopy("COPY.COMMUNICATION") || 'Communication'}</span>
              <span>/</span>
              <span className="text-emerald-400 font-medium">WhatsApp Gateway</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
                <MessageSquare size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  {tCopy("COPY.WHATSAPP_INTEGRATION")}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Meta Cloud API & Twilio Ready
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              {tCopy("COPY.CONNECT_A_WHATSAPP_BUSINESS_API_PROVIDER_TO_SEND_AUTOMATED_RECEIPT_DF9646A6")}
            </p>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs text-amber-200" role="status">
        {tCopy("COPY.INTEGRATION_IS_PREVIEW_ONLY_CREDENTIAL_FIELDS_ARE_DISABLED_BECAUSE_E4018276")}
      </p>

      {/* KPI & Connection Status Summary */}
      <SuperadminCommunicationWhatsappIntegrationWhatsappSummary
        testStatus={SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_TEST_STATUS}
        messageCount={SUPERADMIN_WHATSAPP_SAMPLE_LOGS.length}
        deliveredCount={deliveredCount}
        failedCount={failedCount}
        deliveryRate={deliveryRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0c1428] via-[#0a0d22] to-[#060810] p-6 shadow-xl space-y-6">
          <div className="border-b border-indigo-500/20 pb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Zap size={18} className="text-emerald-400" />
              <span>{tCopy("COPY.API_CONFIGURATION")}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {tCopy("COPY.CONNECT_YOUR_WHATSAPP_BUSINESS_API_PROVIDER")}
            </p>
          </div>

          <div className="space-y-5">
            {/* Provider Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {tCopy("COPY.API_PROVIDER")}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {SUPERADMIN_WHATSAPP_PROVIDERS.map((p) => {
                  const isSelected = provider === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      id={`provider-${p.id}`}
                      onClick={() => setProvider(p.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500/60 bg-emerald-500/15 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                      data-testid={`superadmin-system-system-whatsapp-integration-set-provider-1-${String(p.id)}`}
                    >
                      <span className="text-xl">{p.logo}</span>
                      <span className="text-xs font-semibold">{p.label}</span>
                      {isSelected && <CheckCircle size={14} className="ml-auto text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label htmlFor="whatsapp-api-key" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {tCopy("COPY.API_KEY")}
              </label>
              <div className="relative">
                <input
                  id="whatsapp-api-key"
                  type="password"
                  value=""
                  disabled
                  placeholder={tCopy("COPY.UNAVAILABLE_HOST_INTEGRATION_REQUIRED")}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/60 px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 disabled:opacity-75 focus:outline-none"
                  aria-describedby="whatsapp-credential-contract-note"
                  data-testid="superadmin_communication_whatsapp_integration-whatsapp-api-key"
                />
              </div>
            </div>

            {/* API Secret (conditional) */}
            {selectedProvider.requiresSecret && (
              <div className="space-y-2">
                <label htmlFor="whatsapp-api-secret" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {tCopy("COPY.API_SECRET")}
                </label>
                <div className="relative">
                  <input
                    id="whatsapp-api-secret"
                    type="password"
                    value=""
                    disabled
                    placeholder={tCopy("COPY.UNAVAILABLE_HOST_INTEGRATION_REQUIRED")}
                    className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/60 px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 disabled:opacity-75 focus:outline-none"
                    aria-describedby="whatsapp-credential-contract-note"
                    data-testid="superadmin_communication_whatsapp_integration-whatsapp-api-secret"
                  />
                </div>
              </div>
            )}

            {/* Sender Phone */}
            <div className="space-y-2">
              <label htmlFor="sender-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {tCopy("COPY.SENDER_WHATSAPP_NUMBER")}
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="sender-phone"
                  type="tel"
                  value=""
                  disabled
                  placeholder={tCopy("COPY.UNAVAILABLE_HOST_INTEGRATION_REQUIRED")}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/60 pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 disabled:opacity-75 focus:outline-none"
                  data-testid="superadmin_communication_whatsapp_integration-sender-phone"
                />
              </div>
              <p id="whatsapp-credential-contract-note" className="text-xs text-amber-300/80">
                {tCopy("COPY.CREDENTIAL_AND_SENDER_CONFIGURATION_IS_DISABLED_UNTIL_A_SECURE_HOS_DDDA16D0")}
              </p>
            </div>

            {/* Webhook URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {tCopy("COPY.INBOUND_WEBHOOK_URL")}
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-xs font-mono text-emerald-300 truncate">
                  {SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_WEBHOOK_URL || tCopy('COPY.NOT_CONFIGURED_BY_HOST')}
                </div>
                <button
                  type="button"
                  id="copy-webhook-btn"
                  onClick={handleCopyWebhook}
                  title="Copy Webhook URL"
                  className="px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  data-testid="superadmin_communication_whatsapp_integration-copy-webhook-btn"
                >
                  {copiedWebhook ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                {tCopy("COPY.A_VERIFIED_WEBHOOK_URL_MUST_BE_SUPPLIED_BY_THE_HOST_APPLICATION_BEFORE_CONFIGURATION")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-500/20">
            <button
              type="button"
              id="test-whatsapp-connection-btn"
              disabled
              title={tCopy("COPY.UNAVAILABLE_THIS_SOURCE_SLICE_INCLUDES_NO_PROVIDER_NETWORK_ADAPTER")}
              className="px-4 py-2 rounded-xl border border-slate-700/60 bg-slate-800/40 text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed"
              data-testid="superadmin_communication_whatsapp_integration-test-whatsapp-connection-btn"
            >
              {tCopy("COPY.TEST_CONNECTION_UNAVAILABLE_2")}
            </button>
            <button
              type="button"
              id="save-whatsapp-config-btn"
              disabled
              title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_PROVIDER_CONFIGURATION_API_CONTRACT_IS_SUPPLIED")}
              className="px-4 py-2 rounded-xl bg-emerald-600/50 text-xs font-semibold text-white opacity-60 cursor-not-allowed"
              data-testid="superadmin_communication_whatsapp_integration-save-whatsapp-config-btn"
            >
              {tCopy("COPY.SAVE_CONFIGURATION_UNAVAILABLE")}
            </button>
          </div>
        </div>

        {/* Trigger Events Card */}
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c1428] via-[#0a0d22] to-[#060810] p-6 shadow-xl space-y-6">
          <div className="border-b border-indigo-500/20 pb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Bell size={18} className="text-sky-400" />
              <span>{tCopy("COPY.AUTO_TRIGGER_EVENTS")}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {tCopy("COPY.MESSAGES_SENT_AUTOMATICALLY_WHEN_THESE_EVENTS_OCCUR")}
            </p>
          </div>

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
              <div key={event.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-indigo-500/20 hover:border-indigo-500/30 transition-all">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-100">{event.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{event.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      event.enabled
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {event.enabled ? tCopy('COPY.STATUS_ON') : tCopy('COPY.STATUS_OFF')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Logs */}
      <SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs logs={SUPERADMIN_WHATSAPP_SAMPLE_LOGS} />
    </div>
  );
}
