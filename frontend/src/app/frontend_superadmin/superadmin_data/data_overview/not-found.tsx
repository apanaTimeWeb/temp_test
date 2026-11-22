// data_overview/not-found.tsx
import Link from 'next/link';
import { Database, ArrowLeft } from 'lucide-react';
import { SUPERADMIN_DATA_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_data/data_overview/config/superadmin_data_overview.url_config';

export default function SuperadminDataOverviewNotFound() {
  return (
    <div className="p-8 rounded-xl border border-border bg-card text-center space-y-4 max-w-md mx-auto my-12" data-testid="data_overview-not-found">
      <div className="p-3 rounded-full bg-pink-500/10 text-pink-400 w-fit mx-auto">
        <Database size={24} />
      </div>
      <div>
        <h2 className="text-base font-bold text-foreground">Disaster Recovery Resource Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1">
          The requested recovery snapshot or disaster recovery view does not exist.
        </p>
      </div>
      <Link
        href={SUPERADMIN_DATA_OVERVIEW_ROUTES.root}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors"
      >
        <ArrowLeft size={13} />
        <span>Return to DR Cockpit</span>
      </Link>
    </div>
  );
}
