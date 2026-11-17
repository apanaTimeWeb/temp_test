// RESPONSIBILITY: Render the Subscriptions Overview Member Auto Suspend Policy Error Fallback UI unit for subscriptions member auto suspend policy; it does not own host routing or unsupported backend writes.
// FLOW: Feature screen/page client -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/components/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyErrorFallback.tsx -> typed props and local state -> rendered accessible UI.
/**
 * Feature-local retry fallback; hides raw exception details and never implies a mutation succeeded.
 */
'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

type SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyErrorFallbackProps = { onRetry: () => void };

export default function SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyErrorFallback({ onRetry }: SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-rose-500/30 bg-[#0c0f28]/95 p-6 sm:p-8 text-center shadow-xl backdrop-blur-md flex flex-col items-center justify-center" role="alert" data-testid="superadmin_subscriptions-subscriptions_member_auto_suspend_policy-error-fallback">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-slate-100">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button
        type="button"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
        onClick={onRetry}
        data-testid="superadmin_subscriptions-subscriptions_member_auto_suspend_policy-error-retry"
      >
        <RefreshCcw className="h-4 w-4" />
        <span>{t('COPY.RETRY_MODULE_ROUTE')}</span>
      </button>
    </section>
  );
}
