/** Responsibility: Superadmin System Whatsapp Message Logs; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: supplied sample log records -> localized table rows and status badges -> read-only preview; no live message logs are claimed and no message is sent. */
import { useTranslations } from 'next-intl';
import { SuperadminCommunicationWhatsappIntegrationBadge as Badge } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationBadge';
import { BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { SUPERADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationWhatsappConstants';
import type { SuperadminSystemWhatsappMessageLogsProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogsComponentTypes';

/**
 * Performs the superadmin communication whatsapp integration whatsapp message logs operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemWhatsappMessageLogsProps.
 */
export default function SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs({ logs }: SuperadminSystemWhatsappMessageLogsProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c0f28]/90 via-[#0a0d22] to-[#060810] shadow-xl overflow-hidden backdrop-blur-md">
      <div className="p-5 sm:p-6 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 size={18} className="text-emerald-400" />
            <span>{tCopy("COPY.RECENT_MESSAGE_LOGS")}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{tCopy("COPY.LAST_30_DAYS_OF_OUTBOUND_WHATSAPP_MESSAGES")}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 w-fit">
          {logs.length} Recent Outbound Events
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b border-indigo-500/20 bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">{tCopy("COPY.RECIPIENT")}</th>
              <th className="py-3 px-4">{tCopy("COPY.MESSAGE_TYPE")}</th>
              <th className="py-3 px-4">{tCopy("COPY.TEMPLATE")}</th>
              <th className="py-3 px-4">{tCopy("COPY.STATUS")}</th>
              <th className="py-3 px-4">{tCopy("COPY.SENT_AT")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10 text-slate-200">
            {logs.map((log) => {
              const cfg = SUPERADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG[log.status];
              const StatusIcon = cfg.icon;
              const isDelivered = log.status === 'delivered';
              const isFailed = log.status === 'failed';

              return (
                <tr key={log.id} className="hover:bg-indigo-500/[0.04] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-100">{log.to}</td>
                  <td className="py-3 px-4 capitalize font-medium">{log.type}</td>
                  <td className="py-3 px-4">
                    <code className="text-xs text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md font-mono">
                      {log.template}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                        isDelivered
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : isFailed
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      <StatusIcon size={11} />
                      <span>{log.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400 tabular-nums">{log.sentAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
