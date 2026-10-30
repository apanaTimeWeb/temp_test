'use client';
import { useTranslations } from 'next-intl';
export default function FeatureLoading() { const t = useTranslations('ADMIN_NAVIGATION'); return <div role="status" aria-live="polite" aria-busy="true" className="space-y-4 p-4"><span className="sr-only">{t('LOADING_PAGE')}</span><div className="motion-safe:animate-pulse space-y-4"><div className="h-8 w-1/3 rounded bg-surface-highlight"/><div className="h-24 rounded-xl bg-surface-highlight"/><div className="h-64 rounded-xl bg-surface-highlight"/></div></div>; }
