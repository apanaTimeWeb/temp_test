/** Responsibility: Superadmin System Whatsapp Summary; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning WhatsApp integration page -> typed status/count props -> localized connection-status banner and KPI cards; no live provider status or persistence is implied by this presentation. */
import { useTranslations } from 'next-intl';
import { SuperadminCommunicationWhatsappIntegrationBadge as Badge } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationBadge';
import type { SuperadminSystemWhatsappSummaryProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationWhatsappSummaryComponentTypes';
import { Radio, Send, CheckCircle2, AlertTriangle, IndianRupee, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Performs the superadmin communication whatsapp integration whatsapp summary operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemWhatsappSummaryProps.
 */
export default function SuperadminCommunicationWhatsappIntegrationWhatsappSummary({ testStatus, messageCount, deliveredCount, failedCount, deliveryRate }: SuperadminSystemWhatsappSummaryProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');

  return (
    <div className="space-y-6 mb-6">
      {/* Connection Status Banner */}
      <div className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border shadow-lg backdrop-blur-md transition-all ${
        testStatus === 'unavailable'
          ? 'bg-gradient-to-r from-amber-950/40 via-[#101426] to-[#0a0d22] border-amber-500/30 shadow-amber-950/20'
          : 'bg-gradient-to-r from-emerald-950/40 via-[#0a1814] to-[#060810] border-emerald-500/30 shadow-emerald-950/20'
      }`}>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl shrink-0 border shadow-inner ${
          testStatus === 'unavailable'
            ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
        }`}>
          <Radio size={22} className="animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <p className="text-sm sm:text-base font-bold text-slate-100">
              {testStatus === 'unavailable' ? tCopy('COPY.CONNECTION_TEST_UNAVAILABLE') : tCopy('COPY.WHATSAPP_NOT_TESTED')}
            </p>
            <Badge variant={testStatus === 'unavailable' ? 'warning' : 'outline'}>
              {testStatus === 'unavailable' ? tCopy('COPY.UNAVAILABLE') : tCopy('COPY.NOT_TESTED')}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {testStatus === 'unavailable'
              ? tCopy('COPY.NO_PROVIDER_TEST_INTEGRATION')
              : tCopy('COPY.CONNECTION_NOT_TESTED')}
          </p>
        </div>
      </div>

      <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs text-amber-200" role="status">
        {tCopy("COPY.SAMPLE_MESSAGE_LOGS_ONLY_API_CREDENTIALS_ARE_BLANK_UNTIL_HOST_CONF_230216D6")}
      </p>

      {/* Usage Stats - 4 Premium KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sent */}
        <div className="group relative overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-950/50 via-[#0a0d22] to-[#060810] p-5 shadow-lg shadow-sky-950/20 transition-all hover:scale-[1.01] hover:border-sky-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.SENT_THIS_MONTH")}</span>
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Send size={16} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white tracking-tight">{messageCount}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-sky-300 bg-sky-500/10 border-sky-500/25">
              {tCopy("COPY.ALL_MESSAGES")}
            </span>
          </div>
        </div>

        {/* Delivered */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/50 via-[#061814] to-[#060810] p-5 shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.01] hover:border-emerald-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.DELIVERED")}</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-400 tracking-tight">{deliveredCount}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
              <TrendingUp size={12} /> {tCopy("COPY.DELIVERY_RATE", { percent: deliveryRate })}
            </span>
          </div>
        </div>

        {/* Failed */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/50 via-[#180a12] to-[#060810] p-5 shadow-lg shadow-rose-950/20 transition-all hover:scale-[1.01] hover:border-rose-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.FAILED")}</span>
            <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-rose-400 tracking-tight">{failedCount}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
              {failedCount > 0 ? <TrendingDown size={12} /> : <Minus size={12} />} {tCopy("COPY.FAILED_DELIVERIES")}
            </span>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/50 via-[#18120a] to-[#060810] p-5 shadow-lg shadow-amber-950/20 transition-all hover:scale-[1.01] hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.ESTIMATED_COST")}</span>
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <IndianRupee size={16} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-400 tracking-tight">Free Tier / Prep</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
              {tCopy("COPY.NO_PROVIDER_USAGE_DATA")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
