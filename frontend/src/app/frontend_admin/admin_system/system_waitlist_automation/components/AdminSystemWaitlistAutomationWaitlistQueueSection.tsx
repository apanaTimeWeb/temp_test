// RESPONSIBILITY: AdminSystemWaitlistQueueSection component owned by admin_system; responsibility folder: admin_system_waitlist_page_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { ADMIN_SYSTEM_WAITLIST_PREVIEW_FIXTURES as QUEUE } from '@/app/frontend_admin/admin_system/system_waitlist_automation/mocks/scenarios/admin_system_waitlist_automation.scenarios';

export default function AdminSystemWaitlistQueueSection() {
  const t = useTranslations('ADMIN_SYSTEM_WAITLIST');
  return (
    <Card>
      <CardHeader><CardTitle>{t('QUEUE_TITLE')}</CardTitle><CardDescription>{t('QUEUE_DESCRIPTION')}</CardDescription></CardHeader>
      <CardContent><div className="space-y-3">{QUEUE.map((student) => <article key={student.position} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:gap-4 motion-safe:transition-colors motion-safe:duration-base">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-bold text-primary">#{student.position}</div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-highlight text-sm font-bold text-primary" aria-hidden="true">{student.avatar}</div>
        <div className="min-w-0 flex-1"><p className="text-sm font-medium text-text-primary">{student.name}</p><p className="text-xs text-text-secondary">{t('JOINED_WAITLIST')} {student.joined}</p></div>
        <AdminSystemBadge variant="outline">{student.shift}</AdminSystemBadge>
      </article>)}</div></CardContent>
    </Card>
  );
}
