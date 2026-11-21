'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
// RESPONSIBILITY: Render the navigation/layout boundary for the Communication domain; it does not own leaf business workflows.
// FLOW: Domain route -> superadmin_communication/layout.tsx -> role-level navigation registry and child route content.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Bell, BellRing, ScrollText, LayoutTemplate } from 'lucide-react';

const TAB_CONFIG = {
  communication_notices: { icon: Bell, activeColor: 'text-sky-400', border: 'border-sky-400', bg: 'bg-sky-500/10' },
  communication_notification_center: { icon: BellRing, activeColor: 'text-violet-400', border: 'border-violet-400', bg: 'bg-violet-500/10' },
  communication_whatsapp_logs: { icon: ScrollText, activeColor: 'text-teal-400', border: 'border-teal-400', bg: 'bg-teal-500/10' },
  communication_whatsapp_templates: { icon: LayoutTemplate, activeColor: 'text-amber-400', border: 'border-amber-400', bg: 'bg-amber-500/10' },
} as const;

export default function DomainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('SUPERADMIN_COMMUNICATION');
  const routes = [
    { key: 'communication_notices', label: t('COPY.NAV_COMMUNICATION_NOTICES'), href: SUPERADMIN_NAVIGATION_ROUTES.communication_notices },
    { key: 'communication_notification_center', label: t('COPY.NAV_COMMUNICATION_NOTIFICATION_CENTER'), href: SUPERADMIN_NAVIGATION_ROUTES.communication_notification_center },
    { key: 'communication_whatsapp_logs', label: t('COPY.NAV_COMMUNICATION_WHATSAPP_LOGS'), href: SUPERADMIN_NAVIGATION_ROUTES.communication_whatsapp_logs },
    { key: 'communication_whatsapp_templates', label: t('COPY.NAV_COMMUNICATION_WHATSAPP_TEMPLATES'), href: SUPERADMIN_NAVIGATION_ROUTES.communication_whatsapp_templates },
  ] as const;

  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-2">
      <nav aria-label={t('COPY.NAVIGATION_SECONDARY')} className="mb-6 border-b border-border/80" data-testid="superadmin_communication-secondary-navigation">
        <ul className="flex min-w-0 flex-wrap gap-2" role="list">
          {routes.map((route) => {
            const active = pathname === route.href || pathname.startsWith(route.href + '/');
            const cfg = TAB_CONFIG[route.key as keyof typeof TAB_CONFIG] ?? TAB_CONFIG.communication_notices;
            const Icon = cfg.icon;
            return (
              <li key={route.key} className="min-w-0">
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer ${
                    active
                      ? `${cfg.border} ${cfg.bg} ${cfg.activeColor} shadow-xs font-bold`
                      : 'border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                  data-testid={`superadmin_communication-secondary-link-${route.key}`}
                >
                  <Icon size={16} className={active ? cfg.activeColor : 'text-muted-foreground'} />
                  <span>{route.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="w-full max-w-full min-w-0">{children}</div>
    </div>
  );
}
