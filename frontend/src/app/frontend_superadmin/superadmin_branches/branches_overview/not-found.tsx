import Link from 'next/link';
import { Store, ArrowLeft } from 'lucide-react';

export default function SuperadminBranchesNotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-indigo-500/20 bg-card/90 backdrop-blur-md p-8 text-center shadow-xl shadow-black/20 my-12 space-y-4" role="status">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mx-auto shadow-md">
        <Store size={28} />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Branch Page Not Found</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          The requested branch or operational route could not be found. Return to Branch Overview.
        </p>
      </div>
      <div>
        <Link
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
          href="/superadmin/superadmin_branches/branches_overview"
        >
          <ArrowLeft size={16} />
          <span>Back to Branches Overview</span>
        </Link>
      </div>
    </section>
  );
}
