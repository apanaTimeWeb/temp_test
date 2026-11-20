// data_backup_operations/page.tsx
import { Suspense } from 'react';
import { SuperadminDataBackupOperationsMain } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsMain';
import { SuperadminDataBackupOperationsSkeleton } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/components/SuperadminDataBackupOperationsSkeleton';

export const metadata = {
  title: 'Backup Schedules & Full Platform Recovery | Superadmin',
  description: 'Manage automated cron backup schedules and trigger on-demand full platform disaster recovery snapshots',
};

export default function SuperadminDataBackupOperationsPage() {
  return (
    <div className="min-w-0" data-feature-module="superadmin_data" data-feature-submodule="data_backup_operations">
      <Suspense fallback={<SuperadminDataBackupOperationsSkeleton />}>
        <SuperadminDataBackupOperationsMain />
      </Suspense>
    </div>
  );
}
