// RESPONSIBILITY: AdminSystemSmartIdSequenceSection component owned by admin_system; responsibility folder: admin_system_smart_id_page_sections.
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { ADMIN_SYSTEM_SMART_ID_ACTIVE_IDS as ACTIVE_IDS, ADMIN_SYSTEM_SMART_ID_ALL_IDS as ALL_IDS, ADMIN_SYSTEM_SMART_ID_GAP_IDS as GAP_IDS } from '@/app/frontend_admin/admin_system/system_smart_id/config/admin_system_smart_id_constants';

export default function AdminSystemSmartIdSequenceSection() {
  const t = useTranslations('ADMIN_SYSTEM_SMART_ID');
  return (
    <Card className="mb-6">
      <CardHeader><CardTitle>{t('CURRENT_SEQUENCE')}</CardTitle><CardDescription>{t('SEQUENCE_DESCRIPTION')}</CardDescription></CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">{ALL_IDS.map((id) => {
          const isGap = GAP_IDS.includes(id);
          return <span key={id} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold motion-safe:transition-all motion-safe:duration-base ${isGap ? 'border-border bg-surface-highlight text-text-secondary' : 'border-border bg-primary-subtle text-primary'}`} title={isGap ? t('GAP_ID_TITLE', { id }) : t('ACTIVE_ID_TITLE', { id })}>{id}</span>;
        })}</div>
        <div className="flex flex-wrap items-center gap-6 text-xs text-text-secondary"><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-border bg-primary" />{t('ACTIVE')} ({ACTIVE_IDS.length})</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-border bg-surface-highlight" />{t('GAPS_ONLY')} {GAP_IDS.length}{t('GAPS_UNVERIFIED_SUFFIX')}</span></div>
      </CardContent>
    </Card>
  );
}
