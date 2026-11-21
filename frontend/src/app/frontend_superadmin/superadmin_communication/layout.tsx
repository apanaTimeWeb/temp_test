'use client';
// RESPONSIBILITY: Render the Cyber-Luxury secondary navigation and domain boundary for Notifications & Notices.
// FLOW: Domain route -> superadmin_communication/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

const TAB_CONFIG = {
  notification_center: {
    icon: BellRing,
    label: 'Notification Center',
    activeColor: 'text-violet-400',
    border: 'border-violet-500',
    bg: 'bg-violet-500/15',
  },
  notices: {
    icon: Bell,
    label: 'Platform Notices',
    activeColor: 'text-sky-400',
    border: 'border-sky-500',
    bg: 'bg-sky-500/15',
  },
} as const;

export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const routes = [
    {
      key: 'notification_center',
      ...TAB_CONFIG.notification_center,
      href: SUPERADMIN_NAVIGATION_ROUTES.communication_notification_center,
      isActive: pathname.includes('communication_notification_center'),
    },
    {
      key: 'notices',
      ...TAB_CONFIG.notices,
      href: SUPERADMIN_NAVIGATION_ROUTES.communication_notices,
      isActive: pathname.includes('communication_notices'),
    },
  ];

  return (
    <div className="w-full max-w-full min-w-0 px-3 sm:px-5 lg:px-7 py-3 space-y-4">
      {/* Secondary Top Navigation Bar */}
      <nav
        aria-label="Notification & Notice Modules"
        className="relative overflow-x-auto pb-1"
        data-testid="superadmin_communication-secondary-navigation"
      >
        <ul
          className="flex min-w-max items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-indigo-500/20 backdrop-blur-md shadow-xl"
          role="list"
        >
          {routes.map((route) => {
            const Icon = route.icon;
            const active = route.isActive;
            return (
              <li key={route.key} className="min-w-0">
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? `${route.bg} ${route.activeColor} border ${route.border} shadow-lg shadow-indigo-500/10 font-bold`
                      : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`}
                  data-testid={`superadmin_communication-secondary-link-${route.key}`}
                >
                  <Icon size={16} className={active ? route.activeColor : 'text-slate-400'} />
                  <span>{route.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content View */}
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
