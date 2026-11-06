'use client';

import { useTranslations } from 'next-intl';
import { Megaphone, PlusCircle } from 'lucide-react';
import type { BranchNotice } from './AdminSettingsBranchesNoticeDialog';

interface AdminSettingsBranchesNoticesCardProps {
  notices: BranchNotice[];
  onOpenNoticeModal: () => void;
}

export function AdminSettingsBranchesNoticesCard({
  notices,
  onOpenNoticeModal,
}: AdminSettingsBranchesNoticesCardProps) {
  const t = useTranslations('ADMIN_BRANCHES');

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-base font-bold text-foreground">
              {t('NOTICES_TITLE')}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t('NOTICES_SUBTITLE')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenNoticeModal}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start sm:self-auto motion-safe:transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t('PUBLISH_NOTICE')}</span>
        </button>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <article
            key={n.id}
            className="rounded-lg border border-border bg-muted p-4 space-y-2 hover:bg-muted-hover motion-safe:transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    n.priority === 'URGENT'
                      ? 'bg-destructive-bg text-destructive'
                      : n.priority === 'MAINTENANCE'
                      ? 'bg-warning-bg text-warning-text'
                      : 'bg-primary-subtle text-primary'
                  }`}
                >
                  {n.priority}
                </span>
                <h3 className="font-semibold text-foreground text-sm">{n.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{n.targetBranch}</span>
                <span>·</span>
                <span>{n.effectiveDate}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
            <p className="text-[11px] text-muted-foreground italic">Published by: {n.publishedBy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminSettingsBranchesNoticesCard;

