// RESPONSIBILITY: AdminSystemWhatsAppIntegrationLogsSection component owned by admin_system; responsibility folder: admin_system_whatsapp_integration_page_view_sections.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { BarChart3 } from 'lucide-react';
import type useWhatsAppIntegrationPage from '@/app/frontend_admin/admin_system/system_whatsapp_integration/hooks/useAdminSystemWhatsappIntegrationWhatsAppIntegrationPage';
import { ADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG as STATUS_CFG } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/config/admin_system_whatsapp_integration.url_config';
import type { AdminSystemWhatsAppIntegrationLogsSectionProps } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';


export default function AdminSystemWhatsAppIntegrationLogsSection({ model }: AdminSystemWhatsAppIntegrationLogsSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { MESSAGE_LOGS } = model;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const paginatedLogs = useMemo(
    () => MESSAGE_LOGS.slice(page * pageSize, (page + 1) * pageSize),
    [MESSAGE_LOGS, page, pageSize]
  );
  return (
    <>
      {/* Message Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={18} strokeWidth={2} className="text-primary" /> {t('RECENT_MESSAGE_LOGS')}
                </CardTitle>
                <CardDescription>{t('SYNTHETIC_MESSAGE_LOGS')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:hidden">
                  {MESSAGE_LOGS.map((log) => {
                    const cfg = STATUS_CFG[log.status];
                    const Icon = cfg.icon;
                    return (
                      <article key={log.id} className="rounded-lg border border-border bg-card p-4 space-y-3" aria-label={`${t('MESSAGE_TYPE')}: ${log.type}`}>
                        <div className="flex items-start justify-between gap-3"><p className="break-words font-medium text-text-primary">{log.to}</p><AdminSystemBadge variant={cfg.variant}><Icon size={18} strokeWidth={2} />{log.status}</AdminSystemBadge></div>
                        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                          <div><dt className="text-xs text-text-secondary">{t('MESSAGE_TYPE')}</dt><dd className="text-text-primary">{log.type}</dd></div>
                          <div><dt className="text-xs text-text-secondary">{t('SENT_AT')}</dt><dd className="text-text-secondary">{log.sentAt}</dd></div>
                          <div className="sm:col-span-2"><dt className="text-xs text-text-secondary">{t('TEMPLATE')}</dt><dd><code className="break-all rounded bg-surface-highlight px-1.5 py-0.5 text-xs text-text-secondary">{log.template}</code></dd></div>
                        </dl>
                      </article>
                    );
                  })}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                        <th className="text-left py-3 px-4">{t('RECIPIENT')}</th>
                        <th className="text-left py-3 px-4">{t('MESSAGE_TYPE')}</th>
                        <th className="text-left py-3 px-4">{t('TEMPLATE')}</th>
                        <th className="text-left py-3 px-4">{t('STATUS')}</th>
                        <th className="text-left py-3 px-4">{t('SENT_AT')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLogs.map(log => {
                        const cfg  = STATUS_CFG[log.status];
                        const Icon = cfg.icon;
                        return (
                          <tr key={log.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                            <td className="py-3 px-4 font-mono text-sm text-text-primary">{log.to}</td>
                            <td className="py-3 px-4 text-text-primary">{log.type}</td>
                            <td className="py-3 px-4">
                              <code className="text-xs text-text-secondary bg-card px-1.5 py-0.5 rounded">
                                {log.template}
                              </code>
                            </td>
                            <td className="py-3 px-4">
                              <AdminSystemBadge variant={cfg.variant}>
                                <Icon size={18} strokeWidth={2} /> {log.status}
                              </AdminSystemBadge>
                            </td>
                            <td className="py-3 px-4 text-xs text-text-secondary">{log.sentAt}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {MESSAGE_LOGS.length > 0 && (
                    <AdminTablePagination
                      page={page}
                      pageSize={pageSize}
                      totalCount={MESSAGE_LOGS.length}
                      onPageChange={setPage}
                      onPageSizeChange={(newSize: number) => {
                        setPageSize(newSize);
                        setPage(0);
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
    </>
  );
}
