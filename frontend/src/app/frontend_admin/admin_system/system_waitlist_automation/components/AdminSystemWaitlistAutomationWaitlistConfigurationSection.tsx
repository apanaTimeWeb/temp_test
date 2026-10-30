// RESPONSIBILITY: AdminSystemWaitlistConfigurationSection component owned by admin_system; responsibility folder: admin_system_waitlist_page_sections.
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import useAdminSystemWaitlistAutomationUnsavedChangesGuard from '@/app/frontend_admin/admin_system/system_waitlist_automation/hooks/useAdminSystemWaitlistAutomationUnsavedChangesGuard';
import type { UseFormReturn } from 'react-hook-form';
import type { AdminSystemWaitlistPreviewFormValues } from '@/app/frontend_admin/admin_system/system_waitlist_automation/schemas/AdminSystemWaitlistAutomationWaitlistPreviewSchema';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Input } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveInput';
import { Label } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveLabel';
import { AdminSystemTextarea as Textarea } from '@/app/frontend_admin/admin_system/system_waitlist_automation/components/AdminSystemWaitlistAutomationTextarea';
import type { AdminSystemWaitlistConfigurationSectionProps } from '@/app/frontend_admin/admin_system/system_waitlist_automation/types/AdminSystemWaitlistAutomationComponentTypes';


export default function AdminSystemWaitlistConfigurationSection({ form }: AdminSystemWaitlistConfigurationSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_WAITLIST');
  const router = useRouter();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminSystemWaitlistAutomationUnsavedChangesGuard(form.formState.isDirty, handleBlockedNavigation, form.formState.isSubmitting);
  const discardDraft = () => { const destination = pendingHref; form.reset(); setPendingHref(null); setShowDiscardDialog(false); if (destination) router.push(destination); };
  return (
    <>
    <Card className="mb-6">
      <form onSubmit={(event) => event.preventDefault()}>
        <CardHeader><CardTitle>{t('CONFIG_TITLE')}</CardTitle><CardDescription>{t('CONFIG_DESCRIPTION')}</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label htmlFor="waitlist-template">{t('MESSAGE_TEMPLATE')}</Label><Textarea id="waitlist-template" rows={4} aria-invalid={Boolean(form.formState.errors.template)} aria-describedby={form.formState.errors.template ? 'waitlist-template-error' : undefined} {...form.register('template')} />{form.formState.errors.template && <p id="waitlist-template-error" role="alert" className="text-caption text-danger-text">{form.formState.errors.template.message}</p>}<p className="text-xs text-text-secondary">{t('AVAILABLE_VARIABLES')} <code className="text-primary">{'{name}'}</code>, <code className="text-primary">{'{shift}'}</code>, <code className="text-primary">{'{seat}'}</code></p></div>
          <div className="space-y-2"><Label htmlFor="waitlist-delay">{t('NOTIFICATION_DELAY')}</Label><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><Input id="waitlist-delay" type="number" aria-invalid={Boolean(form.formState.errors.delay)} aria-describedby={form.formState.errors.delay ? 'waitlist-delay-error' : undefined} {...form.register('delay', { valueAsNumber: true })} className="w-full sm:w-28" min={0} /><span className="text-sm text-text-secondary">{t('DELAY_HELP')}</span></div>{form.formState.errors.delay && <p id="waitlist-delay-error" role="alert" className="text-caption text-danger-text">{form.formState.errors.delay.message}</p>}</div>
        </CardContent>
        <CardFooter><Button id="save-waitlist-config-btn" variant="primary" disabled title={t('SAVE_BLOCKED')}>{t('SAVE_DEMO')}</Button></CardFooter>
      </form>
    </Card>
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


export type { AdminSystemWaitlistConfigurationSectionProps };
