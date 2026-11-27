import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function SecurityAuditLogsNotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-card my-12 space-y-4" role="status">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle border border-border text-primary mx-auto shadow-card">
        <ShieldAlert size={28} />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-primary">Audit Log View Not Found</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-secondary max-w-md mx-auto">
          The requested audit log route could not be found. Return to Security Overview.
        </p>
      </div>
      <div>
        <Link
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-xs sm:text-sm shadow-card motion-safe:transition-all motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          href="/superadmin/superadmin_security/security_overview"
        >
          <ArrowLeft size={16} />
          <span>Back to Security Overview</span>
        </Link>
      </div>
    </section>
  );
}
