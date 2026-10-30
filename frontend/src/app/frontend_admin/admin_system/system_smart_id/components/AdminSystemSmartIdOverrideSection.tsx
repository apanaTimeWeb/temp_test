// RESPONSIBILITY: AdminSystemSmartIdOverrideSection component owned by admin_system; responsibility folder: admin_system_smart_id_page_sections.
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogTrigger from '@/app/frontend_admin/components/ui/dialog/DialogTrigger';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogClose from '@/app/frontend_admin/components/ui/dialog/DialogClose';

export default function AdminSystemSmartIdOverrideSection() {
  const t = useTranslations('ADMIN_SYSTEM_SMART_ID');
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle size={18} strokeWidth={2} className="text-text-secondary" />{t('MANUAL_OVERRIDE')}</CardTitle><CardDescription>{t('OVERRIDE_DESCRIPTION')}</CardDescription></CardHeader>
      <CardContent>
        <Dialog><DialogTrigger asChild><Button id="force-regenerate-btn" variant="destructive">{t('FORCE_REGENERATE')}</Button></DialogTrigger>
          <DialogContent className="admin-system-style-93acce9c64" ><DialogHeader><DialogTitle>{t('CONFIRM_REGENERATE')}</DialogTitle><DialogDescription>{t('CONFIRM_DESCRIPTION')}</DialogDescription></DialogHeader>
            <div data-testid="admin_system-page-state-001" className="mt-2 rounded-xl border border-danger bg-danger-bg p-4 text-sm text-danger-text">{t('NO_MUTATION_NOTICE')}</div>
            <div className="mt-4 flex justify-end gap-3"><DialogClose asChild><Button variant="ghost" size="sm">{t('CANCEL')}</Button></DialogClose><DialogClose asChild><Button data-testid="admin_system-page-control-002" id="confirm-regenerate-btn" variant="destructive" size="sm" disabled title={t('REGENERATE_BLOCKED_TOAST')}>{t('REGENERATE_BLOCKED')}</Button></DialogClose></div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
