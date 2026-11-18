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
    <section aria-label={sectionLabel} className="sr-only">
      {destinations.map(({ key, Icon, href }) => (
        <article key={key}>
          <div>
            <Icon className="h-5 w-5" aria-hidden="true" />
            <h2>{getTitle(key)}</h2>
            <p>{getUnavailable(key)}</p>
          </div>
          <Link href={href}>
            <span>{openLabel}</span>
            <ArrowRight size={14} />
          </Link>
        </article>
      ))}
    </section>
  );
}

export default AdminDashboardOverviewDestinations;
