'use client';

// RESPONSIBILITY: AdminSystemAutoScaleThresholdsSection owns the guarded auto-scale threshold draft.
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { AdminSystemSwitch } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveSwitch';
import useAdminSystemAutoScaleUnsavedChangesGuard from '@/app/frontend_admin/admin_system/system_auto_scale/hooks/useAdminSystemAutoScaleUnsavedChangesGuard';
import type { AdminSystemAutoScaleThresholdsSectionProps } from '@/app/frontend_admin/admin_system/system_auto_scale/types/AdminSystemAutoScaleComponentTypes';

export default function AdminSystemAutoScaleThresholdsSection({ form }: AdminSystemAutoScaleThresholdsSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_AUTO_SCALE');
  const router = useRouter();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminSystemAutoScaleUnsavedChangesGuard(form.formState.isDirty, handleBlockedNavigation, form.formState.isSubmitting);
  const discardDraft = () => { const destination = pendingHref; form.reset(); setPendingHref(null); setShowDiscardDialog(false); if (destination) router.push(destination); };
  const values = form.watch();
  return (
    <>
    <form onSubmit={(event) => event.preventDefault()}>
      <Card className="mb-6">
        <CardHeader><CardTitle>{t('ALERT_THRESHOLDS')}</CardTitle><CardDescription>{t('ALERT_DESCRIPTION')}</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="seat-alert-threshold" className="text-sm font-medium text-text-secondary">{t('SEAT_THRESHOLD')}</label>
              <div className="flex items-center gap-2"><input id="seat-alert-threshold" type="number" min={50} max={99} aria-invalid={Boolean(form.formState.errors.seatThreshold)} aria-describedby={form.formState.errors.seatThreshold ? 'seat-alert-threshold-error' : undefined} className="min-h-11 w-28 rounded-md border border-border bg-input px-3 py-2 text-text-primary" {...form.register('seatThreshold', { valueAsNumber: true })} /><span className="text-sm text-text-secondary">{t('SEAT_THRESHOLD_HELP')}</span></div>
              {form.formState.errors.seatThreshold && <p id="seat-alert-threshold-error" role="alert" className="text-caption text-danger-text">{form.formState.errors.seatThreshold.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="locker-alert-threshold" className="text-sm font-medium text-text-secondary">{t('LOCKER_THRESHOLD')}</label>
              <div className="flex items-center gap-2"><input id="locker-alert-threshold" type="number" min={50} max={99} aria-invalid={Boolean(form.formState.errors.lockerThreshold)} aria-describedby={form.formState.errors.lockerThreshold ? 'locker-alert-threshold-error' : undefined} className="min-h-11 w-28 rounded-md border border-border bg-input px-3 py-2 text-text-primary" {...form.register('lockerThreshold', { valueAsNumber: true })} /><span className="text-sm text-text-secondary">{t('LOCKER_THRESHOLD_HELP')}</span></div>
              {form.formState.errors.lockerThreshold && <p id="locker-alert-threshold-error" role="alert" className="text-caption text-danger-text">{form.formState.errors.lockerThreshold.message}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div><p className="text-sm font-medium text-text-primary">{t('ALERT_TOGGLE')}</p><p className="text-xs text-text-secondary">{t('ALERT_TOGGLE_HELP')}</p></div>
            <AdminSystemSwitch id="auto-scale-alert-toggle" aria-label={t('ALERT_TOGGLE')} checked={values.alertEnabled} onCheckedChange={(next) => form.setValue('alertEnabled', next, { shouldDirty: true, shouldValidate: true })} />
          </div>
        </CardContent>
        <CardFooter><Button type="submit" id="save-autoscale-thresholds-btn" variant="primary" disabled title={t('SAVE_BLOCKED')}>{t('SAVE_THRESHOLDS_DEMO')}</Button></CardFooter>
      </Card>
</form>
      <Dialog open={showDiscardDialog} onOpenChange={(open) => { if (!open) { setShowDiscardDialog(false); setPendingHref(null); } }}>
        <DialogContent className="space-y-4">
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('UNSAVED_CHANGES_STAY')}</button>
            <button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardDraft}>{t('UNSAVED_CHANGES_LEAVE')}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


export type { AdminSystemAutoScaleThresholdsSectionProps };
