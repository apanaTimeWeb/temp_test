'use client';

import { formatAdminMembersPlansInr } from '@/app/frontend_admin/admin_members/members_plans/utils/formatAdminMembersPlansInr';
import { Building2, CheckCircle, Layers } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface AdminMembersPlansPreviewCardProps {
  name: string;
  price: string;
  durationDays: string;
  branchApplicability: string;
  parsedFeatures: string[];
}

export function AdminMembersPlansPreviewCard({
  name,
  price,
  durationDays,
  branchApplicability,
  parsedFeatures,
}: AdminMembersPlansPreviewCardProps) {
  const t = useTranslations('ADMIN_PLANS');
  const locale = useLocale();
  const numericPrice = price && !Number.isNaN(Number(price)) ? Number(price) : 0;
  return (
    <div className="rounded-xl border border-border-focus bg-primary-subtle p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Layers size={13} aria-hidden="true" /> {t('PREVIEW_LIVE_CATALOG')}
        </span>
        <span className="text-[10px] text-text-secondary">{t('PREVIEW_INTERFACE')}</span>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-text-primary">{name || t('PREVIEW_DEFAULT_NAME')}</h4>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold border border-success bg-success-bg text-success-text">
            {t('STATUS_ACTIVE')}
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-extrabold text-text-primary">
            {formatAdminMembersPlansInr(numericPrice, locale)}
          </span>
          <span className="text-xs text-text-secondary">{t('PREVIEW_DAYS_SUFFIX', { days: durationDays || '30' })}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-highlight px-2.5 py-0.5 text-[10px] font-medium text-text-secondary">
            <Building2 size={11} className="text-primary" aria-hidden="true" />
            {branchApplicability}
          </span>
        </div>
        {parsedFeatures.length > 0 && (
          <div className="mt-3 border-t border-border pt-2 flex flex-wrap gap-1.5">
            {parsedFeatures.slice(0, 3).map((f) => (
              <span key={f} className="inline-flex items-center gap-1 text-[10px] text-text-secondary bg-surface-highlight px-2 py-0.5 rounded">
                <CheckCircle size={10} className="text-success-text" aria-hidden="true" /> {f}
              </span>
            ))}
            {parsedFeatures.length > 3 && (
              <span className="text-[10px] text-text-secondary self-center">{t('PREVIEW_MORE_FEATURES', { count: parsedFeatures.length - 3 })}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
