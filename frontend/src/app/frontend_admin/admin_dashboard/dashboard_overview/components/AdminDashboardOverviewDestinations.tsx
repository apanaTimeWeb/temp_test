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
    <section aria-label={sectionLabel} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {destinations.map(({ key, Icon, href }) => (
        <article
          key={key}
          className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card transition-all hover:border-indigo-500/40 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-xs">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-3.5 text-base font-bold text-white">
              {getTitle(key)}
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              {getUnavailable(key)}
            </p>
          </div>
          <Link
            href={href}
            className="mt-5 inline-flex min-h-10 items-center justify-between rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
          >
            <span>{openLabel}</span>
            <ArrowRight size={14} className="text-indigo-400" />
          </Link>
        </article>
      ))}
    </section>
  );
}

export default AdminDashboardOverviewDestinations;
