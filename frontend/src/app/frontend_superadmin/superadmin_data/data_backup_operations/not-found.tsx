// data_backup_operations/not-found.tsx
import Link from 'next/link';
import { CalendarClock, ArrowLeft } from 'lucide-react';
import { SUPERADMIN_DATA_BACKUP_OPERATIONS_ROUTES } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/config/superadmin_data_backup_operations.url_config';

export default function SuperadminDataBackupOperationsNotFound() {
  return (
    <div className="p-8 rounded-xl border border-border bg-card text-center space-y-4 max-w-md mx-auto my-12" data-testid="data_backup-not-found">
      <div className="p-3 rounded-full bg-pink-500/10 text-pink-400 w-fit mx-auto">
        <CalendarClock size={24} />
      </div>
      <div>
        <h2 className="text-base font-bold text-foreground">Backup Schedule Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1">
          The requested backup schedule or policy does not exist.
        </p>
      </div>
      <Link
        href={SUPERADMIN_DATA_BACKUP_OPERATIONS_ROUTES.root}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors"
      >
        <ArrowLeft size={13} />
        <span>Return to Backup Operations</span>
      </Link>
    </div>
  );
}
