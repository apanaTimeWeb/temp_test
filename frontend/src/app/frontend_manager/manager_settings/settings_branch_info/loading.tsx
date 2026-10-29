
import { useTranslations } from 'next-intl';
export default function ManagerSettingsBranchInfoLoading() {
  const tManagerUi = useTranslations('manager.manager_branch_info.ui');
  return (
    <main className="min-h-screen bg-page p-6" aria-busy="true" aria-label={tManagerUi('loading_branch_info')}>
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="h-7 w-56 motion-safe:animate-pulse rounded-md bg-surface-highlight" />
        <div className="h-4 w-80 motion-safe:animate-pulse rounded-md bg-surface-highlight" />
        <div className="h-72 w-full motion-safe:animate-pulse rounded-xl bg-card border border-border" />
      </div>
    </main>
  );
}
