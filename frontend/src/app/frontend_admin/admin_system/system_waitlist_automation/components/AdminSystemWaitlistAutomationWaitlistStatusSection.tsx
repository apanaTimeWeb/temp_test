// RESPONSIBILITY: AdminSystemWaitlistStatusSection component owned by admin_system; responsibility folder: admin_system_waitlist_page_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemSwitch } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveSwitch';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import type { AdminSystemWaitlistStatusSectionProps } from '@/app/frontend_admin/admin_system/system_waitlist_automation/types/AdminSystemWaitlistAutomationComponentTypes';


export default function AdminSystemWaitlistStatusSection({ enabled, onEnabledChange }: AdminSystemWaitlistStatusSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_WAITLIST');
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${enabled ? 'bg-success-bg' : 'bg-card'}`}>{t('LIST_ICON')}</div><div><p className="text-base font-semibold text-text-primary">{t('AUTO_NOTIFICATION')}</p><p className="mt-0.5 text-sm text-text-secondary">{enabled ? t('AUTO_ON_DESCRIPTION') : t('AUTO_OFF_DESCRIPTION')}</p></div></div>
          <div className="flex items-center gap-3"><AdminSystemBadge variant={enabled ? 'success' : 'outline'}>{enabled ? t('ACTIVE') : t('INACTIVE')}</AdminSystemBadge><AdminSystemSwitch id="waitlist-auto-toggle" aria-label={t('AUTO_NOTIFICATION_ARIA')} checked={enabled} onCheckedChange={onEnabledChange} /></div>
        </div>
      </CardContent>
    </Card>
  );
}


export type { AdminSystemWaitlistStatusSectionProps };
