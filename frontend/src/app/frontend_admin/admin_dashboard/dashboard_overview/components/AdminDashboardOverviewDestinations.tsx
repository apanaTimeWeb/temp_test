'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ElementType } from 'react';

export interface AdminDashboardDestinationItem {
  key: string;
  Icon: ElementType;
  href: string;
}

interface AdminDashboardOverviewDestinationsProps {
  destinations: readonly AdminDashboardDestinationItem[];
  sectionLabel: string;
  openLabel: string;
  getTitle: (key: string) => string;
  getUnavailable: (key: string) => string;
}

export function AdminDashboardOverviewDestinations({
  destinations,
  sectionLabel,
  openLabel,
  getTitle,
  getUnavailable,
}: AdminDashboardOverviewDestinationsProps) {
  return (
    <section aria-label={sectionLabel} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map(({ key, Icon, href }) => (
        <article
          key={key}
          className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-border flex items-center justify-center">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-3 text-base font-bold text-text-primary">
              {getTitle(key)}
            </h2>
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
              {getUnavailable(key)}
            </p>
          </div>
          <Link
            href={href}
            className="mt-4 inline-flex min-h-10 items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>{openLabel}</span>
            <ArrowRight size={13} className="text-text-secondary" />
          </Link>
        </article>
      ))}
    </section>
  );
}

export default AdminDashboardOverviewDestinations;

