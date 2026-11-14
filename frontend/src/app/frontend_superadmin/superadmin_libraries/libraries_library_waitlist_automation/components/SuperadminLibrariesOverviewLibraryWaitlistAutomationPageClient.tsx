'use client';
/** Responsibility: Superadmin System Waitlist Automation Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSuperadminLibrariesWaitlistAutomationState } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/hooks/useSuperadminLibrariesWaitlistAutomationState';

import { SuperadminLibrariesOverviewLibraryWaitlistAutomationCard as Card } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationCard';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationCardHeader';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationCardTitle';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationCardDescription';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationCardContent';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationCardFooter';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationButton as Button } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationButton';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationInput as Input } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationInput';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationLabel as Label } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationLabel';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationSwitch as Switch } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationSwitch';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationTextarea as Textarea } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationTextarea';
import { SuperadminLibrariesOverviewLibraryWaitlistAutomationBadge as Badge } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationBadge';
import { ListOrdered, ChevronRight } from 'lucide-react';
import { SUPERADMIN_SYSTEM_WAITLIST_SAMPLE_QUEUE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/mocks/fixtures/SuperadminLibrariesOverviewLibraryWaitlistAutomationWaitlistMockFixtures';



/**
 * Renders the `superadmin_system` view owned by `SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient`.
 * Owns local UI state for `enabled`, `delay`, `template`.
 */
export default function SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const { enabled, setEnabled, form } = useSuperadminLibrariesWaitlistAutomationState(tCopy('COPY.DEFAULT_WAITLIST_TEMPLATE'));
  const { register, handleSubmit, formState: { errors } } = form;
  const [previewValidated, setPreviewValidated] = useState(false);
  const delayErrorKey = errors.delay?.message === 'COPY.NOTIFICATION_DELAY_REQUIRED'
    ? 'COPY.NOTIFICATION_DELAY_REQUIRED'
    : errors.delay?.message === 'COPY.NOTIFICATION_DELAY_NON_NEGATIVE'
      ? 'COPY.NOTIFICATION_DELAY_NON_NEGATIVE'
      : errors.delay ? 'COPY.NOTIFICATION_DELAY_INTEGER' : undefined;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span>
          <ChevronRight size={12} />
          <span>{tCopy("COPY.WAITLIST_AUTOMATION")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <ListOrdered size={28} className="text-primary" />
          {tCopy("COPY.WAITLIST_AUTOMATION")}</h1>
        <p className="text-secondary mt-1 text-sm">{tCopy("COPY.AUTOMATICALLY_NOTIFY_THE_NEXT_STUDENT_IN_QUEUE_WHEN_A_SEAT_BECOMES_AVAILABLE")}</p>
        <p id="waitlist-preview-disclosure" className="mt-3 rounded-lg border border-border bg-info-bg p-3 text-sm text-info" role="status">{tCopy("COPY.PREVIEW_ONLY_DISCLOSURE")}</p>
      </div>

      {/* Status Toggle Card */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl ${enabled ? 'bg-success text-on-success' : 'bg-card'}`}>
                📋
              </div>
              <div>
                <p className="text-base font-semibold text-primary">{tCopy("COPY.WAITLIST_AUTO_NOTIFICATION")}</p>
                <p className="text-sm text-secondary mt-0.5">
                  {enabled
                    ? tCopy('COPY.WAITLIST_AUTO_WHATSAPP_ON')
                    : tCopy('COPY.WAITLIST_AUTO_WHATSAPP_OFF')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{tCopy('COPY.PREVIEW_ONLY_STATUS_LABEL')}</Badge>
              <Switch id="waitlist-auto-toggle" checked={enabled} onCheckedChange={setEnabled} disabled title={tCopy("COPY.UNAVAILABLE_NO_WAITLIST_CONFIGURATION_API_CONTRACT_IS_SUPPLIED")} aria-describedby="waitlist-preview-disclosure" aria-label={tCopy("COPY.WAITLIST_AUTO_NOTIFICATION")} data-testid="superadmin-system-library_waitlist_automation-switch-1"/>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Config */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{tCopy("COPY.NOTIFICATION_CONFIGURATION")}</CardTitle>
          <CardDescription>{tCopy("COPY.CUSTOMIZE_MESSAGE_TEMPLATE_AND_NOTIFICATION_TIMING")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form id="waitlist-settings-preview-form" noValidate onSubmit={handleSubmit(() => setPreviewValidated(true), () => setPreviewValidated(false))} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="waitlist-template">{tCopy("COPY.NOTIFICATION_MESSAGE_TEMPLATE")}</Label>
              <Textarea
                id="waitlist-template"
                rows={4}
                {...register('template', { onChange: () => setPreviewValidated(false) })}
                aria-invalid={Boolean(errors.template)}
                aria-describedby={errors.template ? 'waitlist-template-hint waitlist-template-error' : 'waitlist-template-hint'}
                data-testid="superadmin_libraries_library_waitlist_automation-waitlist-template"/>
              <p id="waitlist-template-hint" className="text-xs text-secondary">{tCopy("COPY.AVAILABLE_VARIABLES")}<code className="text-primary">{'{name}'}</code>, <code className="text-primary">{'{shift}'}</code>, <code className="text-primary">{'{seat}'}</code></p>
              {errors.template && <p id="waitlist-template-error" className="text-sm text-danger" role="alert">{tCopy('COPY.MESSAGE_TEMPLATE_REQUIRED')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitlist-delay">{tCopy("COPY.NOTIFICATION_DELAY")}</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="waitlist-delay"
                  type="number"
                  {...register('delay', { valueAsNumber: true, onChange: () => setPreviewValidated(false) })}
                  className="w-28"
                  min={0}
                  step={1}
                  required
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.delay)}
                  aria-describedby={delayErrorKey ? 'waitlist-delay-error' : 'waitlist-delay-hint'}
                  data-testid="superadmin_libraries_library_waitlist_automation-waitlist-delay"/>
                <span id="waitlist-delay-hint" className="text-sm text-secondary">{tCopy("COPY.MINUTES_AFTER_SEAT_BECOMES_AVAILABLE")}</span>
              </div>
              {delayErrorKey && <p id="waitlist-delay-error" className="text-sm text-danger" role="alert">{tCopy(delayErrorKey)}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="secondary" data-testid="waitlist-validate-preview-btn">{tCopy('COPY.VALIDATE_PREVIEW')}</Button>
              {previewValidated && <p role="status" className="text-sm text-success">{tCopy('COPY.WAITLIST_SETTINGS_VALIDATED_LOCALLY')}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button id="save-waitlist-config-btn" variant="primary" disabled title={tCopy("COPY.UNAVAILABLE_NO_WAITLIST_CONFIGURATION_API_CONTRACT_IS_SUPPLIED")} data-testid="superadmin_libraries_library_waitlist_automation-save-waitlist-config-btn">{tCopy("COPY.SAVE_CONFIG")}</Button>
        </CardFooter>
      </Card>

      {/* Queue Preview */}
      <Card>
        <CardHeader>
          <CardTitle>{tCopy("COPY.CURRENT_WAITLIST_QUEUE")}</CardTitle>
          <CardDescription>{tCopy("COPY.FIRST_5_STUDENTS_AWAITING_SEAT_ASSIGNMENT")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SUPERADMIN_SYSTEM_WAITLIST_SAMPLE_QUEUE.map((student) => (
              <div
                key={student.position}
                className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:border-border motion-safe:transition-colors motion-reduce:transition-none"
              >
                {/* Position */}
                <div className="h-8 w-8 rounded-full bg-primary-subtle flex items-center justify-center text-primary text-sm font-bold shrink-0">
                  #{student.position}
                </div>
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-primary-subtle flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {student.avatar}
                </div>
                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">{student.name}</p>
                  <p className="text-xs text-secondary">{tCopy("COPY.JOINED_WAITLIST")}{student.joined}</p>
                </div>
                <Badge variant="outline">{student.shift}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
