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
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-card via-card/95 to-indigo-950/20 p-5 sm:p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>{tCopy("COPY.SYSTEM")}</span>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-indigo-400">{tCopy("COPY.SMART_ID")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/10">
                <Hash size={24} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {tCopy("COPY.SMART_ID_AUTO_FILL")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {tCopy("COPY.INTELLIGENT_ID_GAP_DETECTION_KEEPS_STUDENT_RECORDS_COMPACT_AND_SERIAL")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Zero Fragmentation Active
            </span>
          </div>
        </div>
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
              <div key={step.step} className="flex items-center gap-4 flex-1 w-full">
                <div className="flex flex-col items-center gap-2.5 flex-1 p-4 rounded-xl border border-border/70 bg-background/50 text-center">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xl shadow-xs">
                    {step.icon}
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 mb-1">
                      {tCopy("COPY.STEP")} {step.step}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-100">{tCopy(step.titleKey)}</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-40">{tCopy(step.descKey)}</p>
                  </div>
                </div>
                {i < SUPERADMIN_SYSTEM_SMART_ID_FLOW_STEPS.length - 1 && (
                  <ArrowRight size={18} className="text-slate-600 shrink-0 hidden md:block" />
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
            {tCopy("COPY.SAMPLE_ID_SEQUENCE")}
          </CardTitle>
          <CardDescription>
            {tCopy("COPY.ILLUSTRATIVE_IDS_ONLY_ACTUAL_ACTIVE_GAP_ASSIGNMENTS_CANNOT_BE_VERI_A99C7ABB")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2.5 mb-5">
            {ALL_IDS.map((id) => {
              const isGap = GAP_IDS.includes(id);
              return (
                <span
                  key={id}
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-xl text-sm font-bold border transition-all ${
                    isGap
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-xs ring-2 ring-emerald-500/10 animate-pulse'
                      : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                  }`}
                  title={isGap ? `Gap ID #${id} (Available for next student)` : `Active ID #${id}`}
                >
                  {id}
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-border/60 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-indigo-500/30 border border-indigo-500/50" />
              <span className="font-semibold text-slate-300">{tCopy("COPY.ACTIVE")}</span> ({SUPERADMIN_SYSTEM_ACTIVE_SMART_IDS.length})
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-emerald-500/30 border border-emerald-500/50" />
              <span className="font-semibold text-emerald-300">{tCopy("COPY.GAP_AVAILABLE_FOR_REASSIGNMENT")}</span> ({GAP_IDS.length})
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Override */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {tCopy("COPY.MANUAL_OVERRIDE")}
              </CardTitle>
              <CardDescription>{tCopy("COPY.REGENERATION_CAN_AFFECT_RECORDS_AND_FOREIGN_REFERENCES_THIS_SOURCE_68341B45")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-200" role="status">
            {tCopy("COPY.UNAVAILABLE_NO_SERVER_SIDE_SMART_ID_REGENERATION_CONTRACT_OR_TRANS_4340784B")}
          </div>
          <Button
            id="force-regenerate-btn"
            variant="destructive"
            disabled
            title={tCopy("COPY.UNAVAILABLE_APPROVED_BACKEND_CONTRACT_AND_EXPLICIT_TRANSACTION_REC_B2B6719E")}
            data-testid="superadmin_libraries_student_smart_id-force-regenerate-btn"
          >
            <AlertTriangle size={15} />
            {tCopy("COPY.FORCE_REGENERATION_UNAVAILABLE")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
