// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/not-found.tsx
import Link from 'next/link';
import { Database, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="p-3 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 mb-4">
        <Database className="w-8 h-8" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        Snapshot or Restore Resource Not Found
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
        The requested snapshot record or restore drill does not exist or has exceeded retention.
      </p>
      <Link
        href="/superadmin/superadmin_data/data_restore_operations"
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Snapshot Catalog
      </Link>
    </div>
  );
}
