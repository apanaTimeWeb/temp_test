// RESPONSIBILITY: AdminSystemSmartIdFlowSection component owned by admin_system; responsibility folder: admin_system_smart_id_page_sections.
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { ADMIN_SYSTEM_SMART_ID_FLOW_STEPS as FLOW_STEPS } from '@/app/frontend_admin/admin_system/system_smart_id/config/admin_system_smart_id_constants';

export default function AdminSystemSmartIdFlowSection() {
  const t = useTranslations('ADMIN_SYSTEM_SMART_ID');
  return (
    <Card className="mb-6">
      <CardHeader><CardTitle>{t('HOW_IT_WORKS')}</CardTitle><CardDescription>{t('HOW_DESCRIPTION')}</CardDescription></CardHeader>
      <CardContent><div className="flex flex-col items-center gap-4 md:flex-row">
        {FLOW_STEPS.map((step, index) => <div key={step.step} className="flex flex-1 items-center gap-4">
          <div className="flex flex-1 flex-col items-center gap-2"><div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-primary-subtle text-2xl">{step.icon}</div><div className="text-center"><p className="text-xs font-semibold uppercase tracking-wider text-text-primary">{t('STEP')} {step.step}</p><p className="mt-0.5 text-sm font-medium text-text-primary">{t(step.titleKey)}</p><p className="mt-1 max-w-40 text-xs text-text-secondary">{t(step.descKey)}</p></div></div>
          {index < FLOW_STEPS.length - 1 && <ArrowRight size={18} strokeWidth={2} className="hidden shrink-0 text-text-disabled md:block" />}
        </div>)}
      </div></CardContent>
    </Card>
  );
}
