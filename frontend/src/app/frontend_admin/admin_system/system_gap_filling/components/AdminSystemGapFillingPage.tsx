// Responsibility: AdminSystemGapFillingPage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Input } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveInput';
import { Label } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveLabel';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import Select from '@/app/frontend_admin/components/ui/select/Select';
import SelectTrigger from '@/app/frontend_admin/components/ui/select/SelectTrigger';
import SelectValue from '@/app/frontend_admin/components/ui/select/SelectValue';
import SelectContent from '@/app/frontend_admin/components/ui/select/SelectContent';
import SelectItem from '@/app/frontend_admin/components/ui/select/SelectItem';
import { GitBranch, ChevronRight, Zap } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { toast } from 'sonner';
import { ADMIN_SYSTEM_GAP_FILLING_FIXTURES as SEAT_GAPS } from '@/app/frontend_admin/admin_system/system_gap_filling/mocks/AdminSystemGapFillingFixtures';

export function AdminSystemGapFillingPage() {
  const t = useTranslations('ADMIN_SYSTEM_GAP_FILLING');

  const isDemoMode = isFrontendDemoModeEnabled();
  const [analyzed, setAnalyzed] = useState(false);
  const [assigned, setAssigned] = useState<string[]>([]);

  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-page-title font-bold text-text-primary">{t('LIVE_UNAVAILABLE_TITLE')}</h1><p role="status" className="text-warning-text">{t('LIVE_UNAVAILABLE_DESCRIPTION')}</p></section>;

  return (
    <div>
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_NOTICE')}</p>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BREADCRUMB_GAP_FILLING')}</span>
        </div>
        <h1 className="text-page-title font-bold text-text-primary flex items-center gap-3">
          <GitBranch size={18} strokeWidth={2} className="text-primary" />
          {t('TITLE')}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">{t('SUBTITLE')}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('ANALYSIS_CONTROLS')}</CardTitle>
          <CardDescription>{t('ANALYSIS_DESCRIPTION')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="gap-from-date">{t('FROM_DATE')}</Label>
              <Input id="gap-from-date" type="date" value="2026-04-11" disabled className="w-44" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gap-to-date">{t('TO_DATE')}</Label>
              <Input id="gap-to-date" type="date" value="2026-04-18" disabled className="w-44" />
            </div>
            <div className="space-y-2 w-44">
              <Label htmlFor="gap-shift-select">{t('SHIFT')}</Label>
              <Select value="all" disabled>
                <SelectTrigger id="gap-shift-select"><SelectValue placeholder={t('ALL_SHIFTS_PLACEHOLDER')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('ALL_SHIFTS')}</SelectItem>
                  <SelectItem value="morning">{t('MORNING_SHIFT')}</SelectItem>
                  <SelectItem value="afternoon">{t('AFTERNOON_SHIFT')}</SelectItem>
                  <SelectItem value="evening">{t('EVENING_SHIFT')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button data-testid="admin_system-page-control-001" id="run-gap-analysis-btn" onClick={() => setAnalyzed(true)} variant="primary" size="md">
              {t('PREVIEW_SAMPLE_GAPS')}
            </Button>
          </div>
          <p id="gap-filter-contract-note" role="status" className="mt-3 text-sm text-text-secondary">{t('FILTERS_UNAVAILABLE')}</p>
        </CardContent>
      </Card>

      {analyzed ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-text-primary">{t('RESULTS')}</h2>
            <AdminSystemBadge variant="primary">{SEAT_GAPS.length} {t('SEATS_ANALYZED')}</AdminSystemBadge>
          </div>
          {SEAT_GAPS.map(seat => (
            <Card key={seat.seat}>
              <CardContent>
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="w-full sm:w-14 sm:shrink-0">
                    <span className="text-sm font-mono font-bold text-primary">{seat.seat}</span>
                  </div>
                  {/* Time bar — left/width are computed values, style is correct here */}
                  <div className="relative h-8 min-w-0 w-full flex-1 rounded-lg overflow-hidden bg-card">
                    {seat.booked.map((b) => (
                      <div key={`${seat.seat}-${b.start}-${b.end}`} className={`absolute top-0 h-full bg-primary flex items-center justify-center admin-dynamic-left-${Math.min(100, Math.max(0, Math.round(b.start)))} admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(b.end - b.start)))}`}>
                        <span className="text-micro text-on-primary font-medium truncate px-1">{t('BOOKED')}</span>
                      </div>
                    ))}
                    <div className={`absolute top-0 h-full bg-surface-highlight border border-dashed border-border flex items-center justify-center motion-safe:animate-pulse admin-dynamic-left-${Math.min(100, Math.max(0, Math.round(seat.gap.start)))} admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(seat.gap.end - seat.gap.start)))}`}>
                      <span className="text-micro text-text-secondary font-medium truncate px-1">{t('GAP')}</span>
                    </div>
                  </div>
                  <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-64 sm:shrink-0">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-text-primary">{seat.gap.label}</p>
                      <p className="text-xs text-text-secondary">{t('BULB')} {seat.gap.hours}{t('HOURS_AVAILABLE')}</p>
                    </div>
                    {assigned.includes(seat.seat) ? (
                      <AdminSystemBadge variant="success">{t('ASSIGNED_DEMO')}</AdminSystemBadge>
                    ) : (
                      <Button data-testid={`admin_system-gap-filling-quick-assign-${seat.seat}`} id={`quick-assign-${seat.seat}`} variant="secondary" size="sm"
                        onClick={() => { setAssigned(p => [...p, seat.seat]); toast.info(t('ASSIGN_DEMO_TOAST'), { id: `admin-system-gap-assign-${seat.seat}` }); }}>
                        <Zap size={18} strokeWidth={2} /> {t('QUICK_ASSIGN')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <div className="text-5xl">{t('SEARCH_ICON')}</div>
            <p className="text-text-primary font-medium">{t('EMPTY_TITLE')}</p>
            <p className="text-sm text-text-secondary">{t('EMPTY_DESCRIPTION')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
