import { Suspense } from 'react';
import SuperadminBranchesOverviewScreen from './components/SuperadminBranchesOverviewScreen';

export default function SuperadminBranchesOverviewPage() {
  return (
    <div className="min-w-0" data-feature-module="superadmin_branches" data-feature-route="branches_overview">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-neutral-400">Loading branch directory...</div>}>
        <SuperadminBranchesOverviewScreen />
      </Suspense>
    </div>
  );
}
