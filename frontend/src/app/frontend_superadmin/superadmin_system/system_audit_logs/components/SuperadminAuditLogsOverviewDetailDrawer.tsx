'use client';
/** Responsibility: Superadmin Audit Logs Detail Drawer; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning feature event -> local dialog/confirmation state -> typed callback to the owning component; API writes remain contract-gated. */

import { useEffect, useRef } from 'react';
import { Shield, X } from 'lucide-react';
import SuperadminAuditLogsOverviewActionBadge from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewActionBadge';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_AUDIT_LOGS_DETAIL_DRAWER_SELECTOR } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/constants/SuperadminAuditLogsOverviewStaticConstants';
import type { SuperadminAuditLogsDetailDrawerProps } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewDetailDrawerComponentTypes';


/**
 * Performs the superadmin audit logs overview detail drawer operation within audit logs; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminAuditLogsDetailDrawerProps.
 */
export default function SuperadminAuditLogsOverviewDetailDrawer({ log, onClose }: SuperadminAuditLogsDetailDrawerProps) {
  const t = useTranslations('SUPERADMIN_AUDIT_LOGS');
  const drawerRef = useRef<HTMLDivElement>(null);

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [onClose] is the deliberate re-run boundary.
  useEffect(() => {
    
    if (!drawerRef.current) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    
    const getFocusable = () => Array.from<HTMLElement>(drawerRef.current.querySelectorAll<HTMLElement>(SUPERADMIN_AUDIT_LOGS_DETAIL_DRAWER_SELECTOR));
    getFocusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        drawerRef.current.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div className="sa-panel-overlay" role="presentation" onClick={onClose} data-testid="superadmin-superadmin-audit-logs-overview-detail-drawer-div-line-58">
      <div className="sa-panel-backdrop" aria-hidden="true" />
      <div ref={drawerRef} className="sa-panel-drawer" role="dialog" aria-modal="true" aria-label={t("COPY.SAMPLE_AUDIT_ENTRY_ARIA_LABEL", { id: log.id })} tabIndex={-1} onClick={(event) => event.stopPropagation()} data-testid="superadmin-superadmin-audit-logs-overview-detail-drawer-div-line-60">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" aria-hidden="true" />
            <span className="font-mono text-xs text-secondary">{log.id}</span>
          </div>
          <button type="button" className="sa-btn-icon" aria-label={t("COPY.CLOSE_SAMPLE_AUDIT_ENTRY")} onClick={onClose} data-testid="superadmin-audit-logs-audit-logs-detail-drawer-close-sample-audit-entry-1"><X size={16} aria-hidden="true" /></button>
        </div>
        <div className="sa-card p-4"><p className="text-sm text-secondary leading-relaxed">{log.detail}</p></div>
        <dl className="grid grid-cols-2 gap-3">
          <div className="sa-panel-info-cell"><dt className="sa-panel-info-label">{t("COPY.TIMESTAMP")}</dt><dd className="sa-panel-info-value--mono">{log.time}</dd></div>
          <div className="sa-panel-info-cell"><dt className="sa-panel-info-label">{t("COPY.PERFORMED_BY")}</dt><dd className="sa-panel-info-value--mono">{log.user}</dd></div>
          <div className="sa-panel-info-cell"><dt className="sa-panel-info-label">{t("COPY.ENTITY")}</dt><dd className="sa-panel-info-value--mono">{log.entity}</dd></div>
          <div className="sa-panel-info-cell"><dt className="sa-panel-info-label">{t("COPY.TARGET")}</dt><dd className="sa-panel-info-value--mono">{log.target}</dd></div>
          <div className="sa-panel-info-cell"><dt className="sa-panel-info-label">{t("COPY.IP_ADDRESS")}</dt><dd className="sa-panel-info-value--mono">{log.ip}</dd></div>
          <div className="sa-panel-info-cell"><dt className="sa-panel-info-label">{t("COPY.ACTION")}</dt><dd className="sa-panel-info-value--mono">{log.action}</dd></div>
        </dl>
        <SuperadminAuditLogsOverviewActionBadge action={log.action} />
      </div>
    </div>
  );
}
