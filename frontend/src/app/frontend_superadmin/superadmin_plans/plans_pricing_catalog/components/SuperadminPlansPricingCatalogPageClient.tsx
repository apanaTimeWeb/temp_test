'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminPlansPricingCatalogConfirm } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/hooks/useSuperadminPlansPricingCatalogConfirm';
import { useSuperadminPlansPricingCatalogValidationMessage } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/hooks/useSuperadminPlansPricingCatalogValidationMessage';
import type { SuperadminSubscriptionPlan, SuperadminSubscriptionPlanFormValues } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/mocks/fixtures/SuperadminPlansPricingCatalogMockFixtures';
import SuperadminPlansPricingCatalogHeaderKpis from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/components/SuperadminPlansPricingCatalogHeaderKpis';
import SuperadminPlansPricingCatalogTierCards from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/components/SuperadminPlansPricingCatalogTierCards';
import SuperadminPlansPricingCatalogModal from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/components/SuperadminPlansPricingCatalogModal';

/**
 * SuperadminPlansPricingCatalogPageClient:
 * Owns SaaS Pricing Plans catalog, branch quotas, user limits, and feature entitlements.
 */
export default function SuperadminPlansPricingCatalogPageClient() {
  const confirm = useSuperadminPlansPricingCatalogConfirm();
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');
  const translateValidationMessage = useSuperadminPlansPricingCatalogValidationMessage();

  // Active route branch contract: preserves activeTab and resolves COPY.ACTIVE_SUBSCRIBERS_TAB_LABEL and COPY.SAAS_PRICING_PLANS_TAB_LABEL
  const [activeTab] = useState<'pricing'>('pricing');
  const _activeSubscribersLabel = t('COPY.ACTIVE_SUBSCRIBERS_TAB_LABEL');
  const _saasPricingPlansLabel = t('COPY.SAAS_PRICING_PLANS_TAB_LABEL');

  const [plans, setPlans] = useState<SuperadminSubscriptionPlan[]>(() => [...SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS]);
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'half_yearly' | 'annual'>('monthly');
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState<SuperadminSubscriptionPlan | null>(null);
  const localPlanSequenceRef = useRef(0);

  const showToast = useCallback((msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_subscriptions:SuperadminPlansPricingCatalogPageClient:feedback' });
  }, []);

  const handleOpenAdd = useCallback(() => {
    setEditPlan(null);
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((plan: SuperadminSubscriptionPlan) => {
    setEditPlan(plan);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(async () => {
    setShowModal(false);
    setEditPlan(null);
  }, []);

  const handleSavePlan = useCallback((formValues: SuperadminSubscriptionPlanFormValues) => {
    const monthlyPrice = Number(formValues.price);
    const halfPrice = formValues.priceHalfYearly && Number(formValues.priceHalfYearly) > 0
      ? Number(formValues.priceHalfYearly)
      : Math.round(monthlyPrice * 6 * 0.9);
    const annualPrice = formValues.priceAnnual && Number(formValues.priceAnnual) > 0
      ? Number(formValues.priceAnnual)
      : Math.round(monthlyPrice * 10);

    const planValues: SuperadminSubscriptionPlan = {
      id: editPlan ? editPlan.id : `local-preview-plan-${++localPlanSequenceRef.current}`,
      name: formValues.name.trim(),
      price: monthlyPrice,
      priceHalfYearly: halfPrice,
      priceAnnual: annualPrice,
      branches: Number(formValues.branches),
      members: Number(formValues.members),
      storage: formValues.storage ?? '5 GB',
      isPopular: editPlan ? editPlan.isPopular : false,
      adminUsers: formValues.adminUsers ?? 1,
      staffUsers: formValues.staffUsers ?? 3,
      smsCredits: formValues.smsCredits ?? 500,
      whatsappCredits: formValues.whatsappCredits ?? 200,
      apiAccess: formValues.apiAccess ?? false,
      exportAccess: formValues.exportAccess ?? true,
      advancedReports: formValues.advancedReports ?? false,
      backupPolicy: formValues.backupPolicy ?? 'Daily',
      supportLevel: formValues.supportLevel ?? 'Standard',
      freeTrial: formValues.freeTrial ?? true,
      trialDays: formValues.trialDays ?? 14,
      tierType: formValues.tierType ?? 'Starter',
    };

    if (editPlan) {
      setPlans((currentPlans) => currentPlans.map((plan) => (plan.id === editPlan.id ? { ...plan, ...planValues } : plan)));
      showToast(t('COPY.PLAN_UPDATED_LOCALLY_PREVIEW_ONLY', { name: planValues.name }));
    } else {
      const nextPlan: SuperadminSubscriptionPlan = {
        ...planValues,
        id: `local-preview-plan-${++localPlanSequenceRef.current}`,
      };
      setPlans((currentPlans) => [...currentPlans, nextPlan]);
      showToast(t('COPY.PLAN_ADDED_LOCALLY_PREVIEW_ONLY', { name: planValues.name }));
    }

    setShowModal(false);
    setEditPlan(null);
  }, [editPlan, showToast, t]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <SuperadminPlansPricingCatalogHeaderKpis
        plans={plans}
        selectedCycle={selectedCycle}
        onCycleChange={setSelectedCycle}
        onOpenAdd={handleOpenAdd}
        locale={locale}
        t={t}
      />

      <SuperadminPlansPricingCatalogTierCards
        plans={plans}
        selectedCycle={selectedCycle}
        onOpenEdit={handleOpenEdit}
        locale={locale}
        t={t}
      />

      <SuperadminPlansPricingCatalogModal
        isOpen={showModal}
        editPlan={editPlan}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
        translateValidationMessage={translateValidationMessage}
        t={t}
      />
    </div>
  );
}
