// data_backup_operations/error.tsx
'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/logger';

export default function SuperadminDataBackupOperationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('DataBackupOperationsRouteError', error);
  }, [error]);

  return (
    <div className="p-8 rounded-xl border border-rose-500/30 bg-card text-center space-y-4 max-w-lg mx-auto my-12" data-testid="data_backup-route-error">
      <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 w-fit mx-auto">
        <AlertCircle size={28} />
      </div>
      <div>
        <h2 className="text-base font-bold text-foreground">Backup Operations Module Error</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Unable to establish communication with the backup scheduler daemon.
        </p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors cursor-pointer"
      >
        <RefreshCw size={13} />
        <span>Retry Connection</span>
      </button>
    </div>
  );
}
