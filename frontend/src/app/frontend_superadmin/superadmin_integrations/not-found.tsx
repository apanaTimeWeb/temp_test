import Link from 'next/link';
import { Cable, ArrowLeft } from 'lucide-react';

export default function SuperadminIntegrationsRootNotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-card my-12 space-y-4" role="status">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle border border-primary/20 text-primary mx-auto shadow-sm">
        <Cable size={28} />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Integration Route Not Found</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-secondary max-w-md mx-auto">
          The requested integrations route could not be found. Return to Integrations Overview.
        </p>
      </div>
      <div>
        <Link
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-xs sm:text-sm shadow-sm transition-all motion-safe:active:scale-95 cursor-pointer"
          href="/superadmin/superadmin_integrations/integrations_overview"
        >
          <ArrowLeft size={16} />
          <span>Back to Integrations Overview</span>
        </Link>
      </div>
    </section>
  );
}
