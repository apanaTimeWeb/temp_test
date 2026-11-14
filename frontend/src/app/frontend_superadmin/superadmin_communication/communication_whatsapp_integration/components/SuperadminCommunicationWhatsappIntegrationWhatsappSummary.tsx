/** Responsibility: Superadmin System Whatsapp Summary; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning WhatsApp integration page -> typed status/count props -> localized connection-status banner and KPI cards; no live provider status or persistence is implied by this presentation. */
import { useTranslations } from 'next-intl';
import { SuperadminCommunicationWhatsappIntegrationBadge as Badge } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationBadge';
import { SuperadminCommunicationWhatsappIntegrationKpiCard as KpiCard } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationKpiCard';
import type { SuperadminSystemWhatsappSummaryProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationWhatsappSummaryComponentTypes';


/**
 * Performs the superadmin communication whatsapp integration whatsapp summary operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemWhatsappSummaryProps.
 */
export default function SuperadminCommunicationWhatsappIntegrationWhatsappSummary({ testStatus, messageCount, deliveredCount, failedCount, deliveryRate }: SuperadminSystemWhatsappSummaryProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <>
      {/* Connection Status Banner */}
      <div className={`flex items-center gap-4 p-4 rounded-2xl border mb-8 ${
        testStatus === 'unavailable' ? 'bg-warning-bg border-border' : 'bg-floating border-border'
      }`}>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${
          testStatus === 'unavailable' ? 'bg-warning-bg' : 'bg-card'
        }`}>
          {testStatus === 'unavailable' ? '⚠️' : '📡'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="text-base font-semibold text-primary">
              {testStatus === 'unavailable' ? tCopy('COPY.CONNECTION_TEST_UNAVAILABLE') : tCopy('COPY.WHATSAPP_NOT_TESTED')}
            </p>
            <Badge variant={testStatus === 'unavailable' ? 'warning' : 'outline'}>
              {testStatus === 'unavailable' ? tCopy('COPY.UNAVAILABLE') : tCopy('COPY.NOT_TESTED')}
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-0.5">
            {testStatus === 'unavailable'
              ? tCopy('COPY.NO_PROVIDER_TEST_INTEGRATION')
              : tCopy('COPY.CONNECTION_NOT_TESTED')}
          </p>
        </div>
        
      </div>

      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SAMPLE_MESSAGE_LOGS_ONLY_API_CREDENTIALS_ARE_BLANK_UNTIL_HOST_CONF_230216D6")}</p>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard title={tCopy("COPY.SENT_THIS_MONTH")}  value={messageCount} icon="📤"  subtitle={tCopy("COPY.ALL_MESSAGES")}      />
        <KpiCard title={tCopy("COPY.DELIVERED")}        value={deliveredCount}      icon="✅"  trend="up" trendLabel={tCopy("COPY.DELIVERY_RATE", { percent: deliveryRate })} />
        <KpiCard title={tCopy("COPY.FAILED")}           value={failedCount}         icon="❌"  trend={failedCount > 0 ? 'down' : 'neutral'} trendLabel={tCopy("COPY.FAILED_DELIVERIES")} />
        <KpiCard title={tCopy("COPY.ESTIMATED_COST")} value="Sample only" icon="💸" subtitle={tCopy("COPY.NO_PROVIDER_USAGE_DATA")} />
      </div>

    </>
  );
}
