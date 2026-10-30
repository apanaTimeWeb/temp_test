'use client';
import { useTranslations } from 'next-intl';

export default function AdminAssetsRegisterLoading() {
  const t = useTranslations('ADMIN_ACCOUNTING.ASSETS');
  return <div role="status" aria-label={t('LOADING_ACCESSIBLE_LABEL')} aria-live="polite" aria-busy="true" className="min-h-64 space-y-4 p-4"><div className="motion-safe:animate-pulse space-y-4"><div className="h-8 w-1/3 rounded bg-surface-highlight" /><div className="h-24 rounded-xl bg-surface-highlight" /><div className="h-64 rounded-xl bg-surface-highlight" /></div></div>;
}
