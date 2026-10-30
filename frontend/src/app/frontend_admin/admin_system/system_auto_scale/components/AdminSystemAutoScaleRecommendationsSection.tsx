// RESPONSIBILITY: AdminSystemAutoScaleRecommendationsSection component owned by admin_system; responsibility folder: admin_system_auto_scale_page_sections.
import { useTranslations } from 'next-intl';
import { Zap, ArrowRight } from 'lucide-react';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import type { AdminSystemAutoScaleRecommendation, AdminSystemAutoScaleRecommendationsSectionProps } from '@/app/frontend_admin/admin_system/system_auto_scale/types/AdminSystemAutoScaleComponentTypes';


export default function AdminSystemAutoScaleRecommendationsSection({ recommendations, onNavigate }: AdminSystemAutoScaleRecommendationsSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_AUTO_SCALE');
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Zap size={18} strokeWidth={2} className="text-primary" />{t('RECOMMENDATIONS')}</CardTitle><CardDescription>{t('RECOMMENDATIONS_DESCRIPTION')}</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <article key={recommendation.id} data-testid={`admin_system-recommendation-${recommendation.id}`} className={`rounded-xl border p-4 ${recommendation.variant === 'danger' ? 'border-danger bg-danger-bg' : recommendation.variant === 'warning' ? 'border-border bg-surface-highlight' : 'border-success-text bg-success-bg'}`}>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-start gap-3"><AdminSystemBadge variant={recommendation.variant}>{recommendation.label}</AdminSystemBadge><p className="text-sm text-text-primary">{recommendation.message}</p></div>
              {recommendation.action && recommendation.route && <Button type="button" variant="secondary" size="sm" onClick={() => onNavigate(recommendation.route!)}>{recommendation.action}<ArrowRight size={18} strokeWidth={2} /></Button>}
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}


export type { AdminSystemAutoScaleRecommendation, AdminSystemAutoScaleRecommendationsSectionProps };
