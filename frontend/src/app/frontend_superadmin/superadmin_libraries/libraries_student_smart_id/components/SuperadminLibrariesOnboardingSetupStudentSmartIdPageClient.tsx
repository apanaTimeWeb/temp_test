'use client';
/** Responsibility: Superadmin System Smart Id Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import { SuperadminLibrariesOnboardingSetupStudentSmartIdCard as Card } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/components/SuperadminLibrariesOnboardingSetupStudentSmartIdCard';
import { SuperadminLibrariesOnboardingSetupStudentSmartIdCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/components/SuperadminLibrariesOnboardingSetupStudentSmartIdCardHeader';
import { SuperadminLibrariesOnboardingSetupStudentSmartIdCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/components/SuperadminLibrariesOnboardingSetupStudentSmartIdCardTitle';
import { SuperadminLibrariesOnboardingSetupStudentSmartIdCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/components/SuperadminLibrariesOnboardingSetupStudentSmartIdCardDescription';
import { SuperadminLibrariesOnboardingSetupStudentSmartIdCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/components/SuperadminLibrariesOnboardingSetupStudentSmartIdCardContent';
import { SuperadminLibrariesOnboardingSetupStudentSmartIdButton as Button } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/components/SuperadminLibrariesOnboardingSetupStudentSmartIdButton';
import { Hash, ChevronRight, ArrowRight, AlertTriangle } from 'lucide-react';
import { SUPERADMIN_SYSTEM_ACTIVE_SMART_IDS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/mocks/fixtures/SuperadminLibrariesOnboardingSetupStudentSmartIdMockFixtures';
import { SUPERADMIN_SYSTEM_SMART_ID_FLOW_STEPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/constants/SuperadminLibrariesOnboardingSetupStudentSmartIdConstants';


const ALL_IDS = Array.from({ length: 20 }, (_, i) => i + 1);
const activeSmartIdSet = new Set<number>(SUPERADMIN_SYSTEM_ACTIVE_SMART_IDS);
const GAP_IDS = ALL_IDS.filter(id => !activeSmartIdSet.has(id));



/**
 * Renders the `superadmin_system` view owned by `SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span>
          <ChevronRight size={12} />
          <span>{tCopy("COPY.SMART_ID")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Hash size={28} className="text-primary" />
          {tCopy("COPY.SMART_ID_AUTO_FILL")}</h1>
        <p className="text-secondary mt-1 text-sm">{tCopy("COPY.INTELLIGENT_ID_GAP_DETECTION_KEEPS_STUDENT_RECORDS_COMPACT_AND_SERIAL")}</p>
      </div>

      {/* Algorithm Explanation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{tCopy("COPY.HOW_SMART_ID_GAP_FILL_WORKS")}</CardTitle>
          <CardDescription>{tCopy("COPY.WHEN_A_STUDENT_EXITS_THEIR_ID_IS_RECLAIMED_FOR_THE_NEXT_ADMISSION__509AD36F")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {SUPERADMIN_SYSTEM_SMART_ID_FLOW_STEPS.map((step, i) => (
              <div key={step.step} className="flex items-center gap-4 flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="h-14 w-14 rounded-2xl bg-primary-subtle border border-focus flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">{tCopy("COPY.STEP")}{step.step}</p>
                    <p className="text-sm font-medium text-primary mt-0.5">{tCopy(step.titleKey)}</p>
                    <p className="text-xs text-secondary mt-1 max-w-40">{tCopy(step.descKey)}</p>
                  </div>
                </div>
                {i < SUPERADMIN_SYSTEM_SMART_ID_FLOW_STEPS.length - 1 && (
                  <ArrowRight size={20} className="text-secondary shrink-0 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ID Sequence Viewer */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {tCopy("COPY.SAMPLE_ID_SEQUENCE")}</CardTitle>
          <CardDescription>
            {tCopy("COPY.ILLUSTRATIVE_IDS_ONLY_ACTUAL_ACTIVE_GAP_ASSIGNMENTS_CANNOT_BE_VERI_A99C7ABB")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_IDS.map((id) => {
              const isGap = GAP_IDS.includes(id);
              return (
                <span
                  key={id}
                  className={`inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-bold border motion-safe:transition-all motion-reduce:transition-none ${
                    isGap
                      ? 'bg-info-bg text-info border-border'
                      : 'bg-primary-subtle text-primary border-focus'
                  }`}
                  title={isGap ? `Gap ID #${id}` : `Active ID #${id}`}
                >
                  {id}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-6 text-xs text-secondary">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-primary-subtle border border-focus" />
              {tCopy("COPY.ACTIVE")}{SUPERADMIN_SYSTEM_ACTIVE_SMART_IDS.length})
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-info-bg border border-border" />
              {tCopy("COPY.GAP_AVAILABLE_FOR_REASSIGNMENT")}{GAP_IDS.length})
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Override remains unavailable until an authoritative, audited ID-rewrite contract exists. */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle size={18} className="text-warning" /> {tCopy("COPY.MANUAL_OVERRIDE")}</CardTitle>
          <CardDescription>{tCopy("COPY.REGENERATION_CAN_AFFECT_RECORDS_AND_FOREIGN_REFERENCES_THIS_SOURCE_68341B45")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.UNAVAILABLE_NO_SERVER_SIDE_SMART_ID_REGENERATION_CONTRACT_OR_TRANS_4340784B")}</p>
          <Button id="force-regenerate-btn" variant="destructive" disabled title={tCopy("COPY.UNAVAILABLE_APPROVED_BACKEND_CONTRACT_AND_EXPLICIT_TRANSACTION_REC_B2B6719E")} data-testid="superadmin_libraries_student_smart_id-force-regenerate-btn">{tCopy("COPY.FORCE_REGENERATION_UNAVAILABLE")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
