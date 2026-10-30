'use client';
// RESPONSIBILITY: Preserves a legacy system-settings view while linking to its canonical owning module.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminSystemSettingsCanonicalDestinationCardProps } from '@/app/frontend_admin/admin_system/system_settings/types/AdminSystemSettingsComponentTypes';


export default function AdminSystemSettingsCanonicalDestinationCard({ title, href }: AdminSystemSettingsCanonicalDestinationCardProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="admin-system-settings-canonical-destination-title">
      <h2 id="admin-system-settings-canonical-destination-title" className="text-section-title font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-text-secondary">{t('CANONICAL_MODULE_DESCRIPTION')}</p>
      <div className="mt-4">
        <Link href={href} className="admin-btn-primary inline-flex min-h-11 items-center gap-2">
          {t('OPEN_CANONICAL_MODULE')} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
