// Responsibility: AdminFinanceAutoSuspendPage component owned by admin_finance; responsibility folder: admin_finance_components_views.
'use client';

// RESPONSIBILITY: Coordinates auto-suspend demo state and composes bounded page sections.
// DATA FLOW: feature fixture -> local demo state -> metrics/table -> blocked live actions without an approved API contract.

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminFinanceAccessibleDialog } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/hooks/useAdminFinanceAutoSuspendAccessibleDialog';
import { ADMIN_FINANCE_DEMO_AUTO_SUSPEND_CONFIG, ADMIN_FINANCE_DEMO_SUSPENDED_STUDENTS } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/mocks/AdminFinanceAutoSuspendDemoFixtures';
import type { AdminFinanceAutoSuspendConfig, AdminFinanceSuspendedStudent } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import toast from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminFinanceAutoSuspendKpiCards from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendKpiCards';
import AdminFinanceAutoSuspendPolicyCard from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendPolicyCard';
import AdminFinanceAutoSuspendStudentsTable from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendStudentsTable';
import AdminFinanceAutoSuspendRestoreDialog from '@/app/frontend_admin/admin_finance/finance_auto_suspend/components/AdminFinanceAutoSuspendRestoreDialog';

export function AdminFinanceAutoSuspendPage() {
  const t = useTranslations('ADMIN_FINANCE_AUTO_SUSPEND');
  const [config, setConfig] = useState<AdminFinanceAutoSuspendConfig | null>(null);
  const [suspended, setSuspended] = useState<AdminFinanceSuspendedStudent[]>([]);
  const [configLoading, setConfigLoading] = useState(true);
  const [suspendedLoading, setSuspendedLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [days, setDays] = useState('');
  const [updatePending, setUpdatePending] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState<{ id: number; name: string } | null>(null);
  const [restoreReason, setRestoreReason] = useState('');
  const [restorePending, setRestorePending] = useState(false);
  const closeRestoreDialog = () => { setRestoreDialog(null); setRestoreReason(''); setRestorePending(false); };
  const { dialogRef } = useAdminFinanceAccessibleDialog({ isOpen: Boolean(restoreDialog), onClose: closeRestoreDialog });

  useEffect(() => {
    if (isFrontendDemoModeEnabled()) {
      setConfig(ADMIN_FINANCE_DEMO_AUTO_SUSPEND_CONFIG);
      setSuspended([...ADMIN_FINANCE_DEMO_SUSPENDED_STUDENTS]);
    }
    setConfigLoading(false);
    setSuspendedLoading(false);
  }, []);

  const handleSave = () => {
    if (!isFrontendDemoModeEnabled()) { toast.error(t('POLICY_SAVE_BLOCKED'), { id: 'admin_finance-finance_auto_suspend-components-AdminFinanceAutoSuspendPage-toast-44-1' }); return; }
    if (!days || !Number.isInteger(Number(days)) || Number(days) < 1) { toast.error(t('DAYS_VALIDATION'), { id: 'admin_finance-finance_auto_suspend-components-AdminFinanceAutoSuspendPage-toast-45-2' }); return; }
    setUpdatePending(true);
    setTimeout(() => {
      setConfig((previous) => previous ? { ...previous, daysBeforeSuspend: Number.parseInt(days, 10) } : previous);
      toast.info(t('POLICY_SAVED_DEMO'), { id: 'admin_finance-finance_auto_suspend-components-AdminFinanceAutoSuspendPage-toast-49-3' });
      setEditing(false);
      setUpdatePending(false);
    }, 600);
  };

  const handleRestore = () => {
    if (!isFrontendDemoModeEnabled()) { toast.error(t('RESTORE_BLOCKED'), { id: 'admin_finance-finance_auto_suspend-components-AdminFinanceAutoSuspendPage-toast-56-4' }); return; }
    if (!restoreDialog || !restoreReason.trim()) return;
    setRestorePending(true);
    setTimeout(() => {
      setSuspended((previous) => previous.filter((student) => student.studentId !== restoreDialog.id));
      setConfig((previous) => previous ? { ...previous, currentlySuspended: Math.max(0, previous.currentlySuspended - 1), manualRestores: previous.manualRestores + 1 } : previous);
      toast.info(t('RESTORE_DEMO', { name: restoreDialog.name }), { id: 'admin_finance-finance_auto_suspend-components-AdminFinanceAutoSuspendPage-toast-62-5' });
      closeRestoreDialog();
    }, 700);
  };

  const handleEdit = () => { if (config) setDays(String(config.daysBeforeSuspend)); setEditing(true); };

  return (
    <div className="space-y-6">
      <section aria-label={t('TITLE')}>
        {!isFrontendDemoModeEnabled() && <p role="status" className="mb-3 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1><p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
      </section>
      <AdminFinanceAutoSuspendKpiCards config={config} isLoading={configLoading} />
      <AdminFinanceAutoSuspendPolicyCard canEdit={isFrontendDemoModeEnabled()} config={config} isLoading={configLoading} editing={editing} days={days} updatePending={updatePending} onDaysChange={setDays} onEdit={handleEdit} onSave={handleSave} onCancel={() => setEditing(false)} />
      <AdminFinanceAutoSuspendStudentsTable students={suspended} isLoading={suspendedLoading} canRestore={isFrontendDemoModeEnabled()} onRestore={(student) => setRestoreDialog({ id: student.studentId, name: student.studentName })} />
      <AdminFinanceAutoSuspendRestoreDialog target={restoreDialog} dialogRef={dialogRef} reason={restoreReason} isPending={restorePending} onReasonChange={setRestoreReason} onClose={closeRestoreDialog} onSubmit={handleRestore} />
    </div>
  );
}
