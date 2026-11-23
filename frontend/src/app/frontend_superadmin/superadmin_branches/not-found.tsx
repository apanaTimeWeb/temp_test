import Link from 'next/link';

export default function SuperadminBranchesRootNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
        <h2 className="text-xl font-bold text-slate-200">Branches View Not Found</h2>
        <p className="mt-2 text-sm text-slate-400">
          The requested Branches view or configuration could not be located.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/superadmin/superadmin_branches/branches_overview"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Back to Branches Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
