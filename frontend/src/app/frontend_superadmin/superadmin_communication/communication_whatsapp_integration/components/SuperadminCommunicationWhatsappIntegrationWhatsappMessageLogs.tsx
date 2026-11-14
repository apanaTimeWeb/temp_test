/** Responsibility: Superadmin System Whatsapp Message Logs; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: supplied sample log records -> localized table rows and status badges -> read-only preview; no live message logs are claimed and no message is sent. */
import { useTranslations } from 'next-intl';
import { SuperadminCommunicationWhatsappIntegrationCard as Card } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCard';
import { SuperadminCommunicationWhatsappIntegrationCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardHeader';
import { SuperadminCommunicationWhatsappIntegrationCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardTitle';
import { SuperadminCommunicationWhatsappIntegrationCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardDescription';
import { SuperadminCommunicationWhatsappIntegrationCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationCardContent';
import { SuperadminCommunicationWhatsappIntegrationBadge as Badge } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationBadge';
import { BarChart3 } from 'lucide-react';
import { SUPERADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationWhatsappConstants';
import type { SuperadminSystemWhatsappMessageLogsProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogsComponentTypes';



/**
 * Performs the superadmin communication whatsapp integration whatsapp message logs operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemWhatsappMessageLogsProps.
 */
export default function SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs({ logs }: SuperadminSystemWhatsappMessageLogsProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" /> {tCopy("COPY.RECENT_MESSAGE_LOGS")}</CardTitle>
          <CardDescription>{tCopy("COPY.LAST_30_DAYS_OF_OUTBOUND_WHATSAPP_MESSAGES")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-secondary text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">{tCopy("COPY.RECIPIENT")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.MESSAGE_TYPE")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.TEMPLATE")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.STATUS")}</th>
                  <th className="text-left py-3">{tCopy("COPY.SENT_AT")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const cfg  = SUPERADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG[log.status];
                  const StatusIcon = cfg.icon;
                  
                  return (
                    <tr key={log.id} className="hover:bg-card motion-safe:transition-colors motion-reduce:transition-none">
                      <td className="py-3 pr-4 font-mono text-sm text-primary">{log.to}</td>
                      <td className="py-3 pr-4 text-primary">{log.type}</td>
                      <td className="py-3 pr-4">
                        <code className="text-xs text-secondary bg-card px-1.5 py-0.5 rounded">
                          {log.template}
                        </code>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={cfg.variant}>
                          <StatusIcon size={10} /> {log.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-secondary">{log.sentAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
  );
}
