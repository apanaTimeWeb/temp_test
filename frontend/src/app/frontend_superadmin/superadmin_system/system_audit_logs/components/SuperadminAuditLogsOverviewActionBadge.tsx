/** Responsibility: SuperadminAuditLogsOverviewActionBadge; module-owned presentation component for audit_logs. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminAuditLogsOverviewActionBadge formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { useTranslations } from 'next-intl';
import type { SuperadminAuditLogsActionBadgeProps } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewActionBadgeComponentTypes';


/**
 * Performs the superadmin audit logs overview action badge operation within audit logs; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminAuditLogsActionBadgeProps.
 */
export default function SuperadminAuditLogsOverviewActionBadge({ action }: SuperadminAuditLogsActionBadgeProps) {
  const t = useTranslations('SUPERADMIN_AUDIT_LOGS');
  if (action === 'Created') return <span className="sa-action-badge sa-action-badge--created">{t("COPY.CREATED")}</span>;
  if (action === 'Updated') return <span className="sa-action-badge sa-action-badge--updated">{t("COPY.UPDATED")}</span>;
  if (action === 'Deleted') return <span className="sa-action-badge sa-action-badge--deleted">{t("COPY.DELETED")}</span>;
  if (action === 'Fee_Collected') return <span className="sa-action-badge sa-action-badge--fee">{t("COPY.FEE_COLLECTED")}</span>;
  return <span className="sa-action-badge">{action || t('COPY.UNKNOWN_ACTION')}</span>;
}
