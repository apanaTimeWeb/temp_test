'use client';
/** Responsibility: render synthetic capacity-gap examples without implying that an unavailable calculation contract exists. */
import { useTranslations } from 'next-intl';
import { ChevronRight, GitBranch, Lightbulb, Zap } from 'lucide-react';
import { SuperadminLibrariesOverviewLibraryCapacityGapFillingCard as Card } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/components/SuperadminLibrariesOverviewLibraryCapacityGapFillingCard';
import { SuperadminLibrariesOverviewLibraryCapacityGapFillingCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/components/SuperadminLibrariesOverviewLibraryCapacityGapFillingCardContent';
import { SuperadminLibrariesOverviewLibraryCapacityGapFillingButton as Button } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/components/SuperadminLibrariesOverviewLibraryCapacityGapFillingButton';
import { SuperadminLibrariesOverviewLibraryCapacityGapFillingBadge as Badge } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/components/SuperadminLibrariesOverviewLibraryCapacityGapFillingBadge';
import { SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/mocks/fixtures/SuperadminLibrariesOverviewLibraryCapacityGapFillingMockFixtures';

/** Renders only the supplied sample timelines; no date/shift filtering, calculation, or assignment is performed. */
export default function SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <div className="w-full rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#120a28]/95 to-[#1e1038]/80 p-5 sm:p-6 shadow-md">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400">
            <span>{tCopy('COPY.SYSTEM')}</span>
            <ChevronRight aria-hidden="true" size={12} strokeWidth={2} />
            <span className="text-purple-400">{tCopy('COPY.GAP_FILLING')}</span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shrink-0">
              <GitBranch aria-hidden="true" size={22} strokeWidth={2} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{tCopy('COPY.GAP_FILLING_ALGORITHM')}</h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">{tCopy('COPY.VISUALIZE_EMPTY_TIME_SLOTS_AND_MONETIZE_UNUSED_SEAT_CAPACITY')}</p>
          <p className="mt-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs text-purple-300" role="status">{tCopy('COPY.PREVIEW_ONLY_DISCLOSURE')}</p>
          <p className="mt-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300" role="status">{tCopy('COPY.STATIC_SAMPLE_NO_FILTER_CONTRACT')}</p>
        </div>
      </header>

      <section aria-labelledby="capacity-gap-samples-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="capacity-gap-samples-heading" className="text-lg font-semibold text-primary">{tCopy('COPY.SAMPLE_AVAILABILITY_TIMELINES')}</h2>
            <p className="text-sm text-secondary">{tCopy('COPY.RUN_AN_ANALYSIS_TO_SEE_SEAT_GAPS')}</p>
          </div>
          <Badge variant="primary">{tCopy('COPY.SAMPLE_SEAT_COUNT', { count: SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS.length })}</Badge>
        </div>

        {SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS.map((seat) => (
          <Card key={seat.seat}>
            <CardContent>
              <div className="flex min-w-0 flex-wrap items-center gap-4">
                <div className="w-14 shrink-0">
                  <span className="font-mono text-sm font-bold text-primary">{seat.seat}</span>
                </div>
                <svg className="sa-gap-timeline min-w-[12rem] flex-1" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={tCopy('COPY.SEAT_BOOKED_PERIODS_AND_GAP_ARIA_LABEL', { seat: seat.seat })}>
                  {seat.booked.map((block) => (
                    <g key={`booked-${block.start}-${block.end}`}>
                      <rect x={block.start} y="0" width={block.end - block.start} height="100" className="text-primary" fill="currentColor" opacity="0.72" />
                      {(block.end - block.start) >= 18 && <text x={block.start + (block.end - block.start) / 2} y="58" textAnchor="middle" className="sa-gap-timeline-label">{tCopy('COPY.BOOKED')}</text>}
                    </g>
                  ))}
                  <g>
                    <rect x={seat.gap.start} y="0" width={seat.gap.end - seat.gap.start} height="100" className="text-warning" fill="currentColor" opacity="0.22" stroke="currentColor" strokeDasharray="4 3" />
                    {(seat.gap.end - seat.gap.start) >= 18 && <text x={seat.gap.start + (seat.gap.end - seat.gap.start) / 2} y="58" textAnchor="middle" className="sa-gap-timeline-label sa-gap-timeline-label--warning">{tCopy('COPY.GAP')}</text>}
                  </g>
                </svg>
                <div className="flex w-64 shrink-0 items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-primary">{tCopy(seat.gap.labelKey)}</p>
                    <p className="flex items-center gap-1 text-xs text-secondary"><Lightbulb aria-hidden="true" size={18} strokeWidth={2} /> {seat.gap.hours}{tCopy('COPY.HRS_AVAILABLE')}</p>
                  </div>
                  <Button id={`superadmin_libraries_library_capacity_gap_filling-quick-assign-${seat.seat}`} variant="secondary" size="sm" disabled title={tCopy('COPY.UNAVAILABLE_NO_CAPACITY_ASSIGNMENT_API_CONTRACT_IS_SUPPLIED')} aria-disabled="true" data-testid={`superadmin_libraries_library_capacity_gap_filling-quick-assign-${seat.seat}`}>
                    <Zap aria-hidden="true" size={18} strokeWidth={2} /> {tCopy('COPY.QUICK_ASSIGN')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
