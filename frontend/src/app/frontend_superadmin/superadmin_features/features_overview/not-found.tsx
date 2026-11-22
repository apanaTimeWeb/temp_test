// RESPONSIBILITY: Route-level not-found boundary for features overview.
import Link from 'next/link';
import { ArrowLeft, Sliders } from 'lucide-react';

export default function SuperadminFeaturesOverviewNotFound() {
  return (
    <div className="p-8 rounded-2xl border border-border bg-card/60 text-center max-w-md mx-auto my-12 space-y-4">
      <div className="p-3 rounded-full bg-teal-500/10 text-teal-400 inline-block">
        <Sliders size={28} />
      </div>
      <div>
        <h2 className="text-base font-bold text-white">Feature Route Not Found</h2>
        <p className="text-xs text-neutral-400 mt-1">
          The requested feature governance route could not be found.
        </p>
      </div>
      <Link
        href="/superadmin/superadmin_features/features_overview"
        className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Return to Feature Control</span>
      </Link>
    </div>
  );
}
