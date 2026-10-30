// DATA FLOW: members_enquiries route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getEnquiries } from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesPage';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import type { EnquiryStatus } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import type { AdminEnquiriesEnquiryDetail } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';

/** @description Loads one Admin CRM enquiry and owns only the detail resource state needed by the view-only screen. @dependencies Module-owned browser storage and CRM status mapping. @edge-case Invalid IDs produce a not-found state; unmount prevents stale state updates; absent optional detail fields receive documented display-safe defaults. */
export default function useAdminEnquiriesEnquiryDetailPage(params: Promise<{ id: string }>) {
  const { id } = use(params); const router = useRouter();
  const isDemoMode = isFrontendDemoModeEnabled();
  const t = useTranslations('ADMIN_ENQUIRIES');
  const [enquiry, setEnquiry] = useState<AdminEnquiriesEnquiryDetail | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    // Browser storage is demo-only; never read fixture records through a production detail route.
    if (!isDemoMode) { setEnquiry(null); setLoading(false); return () => { active = false; }; }
    const found = getEnquiries().find((item) => item.id === id);
    if (!active) return;
    if (found) setEnquiry({ ...found, source: found.source?.trim() ?? '', preferredBranch: found.preferredBranch?.trim() ?? '', enquiryDate: found.enquiryDate || found.addedDate, followUps: found.followUps || [], isOverdue: Boolean(found.isOverdue), isToday: Boolean(found.isToday), isUpcoming: Boolean(found.isUpcoming), handledBy: found.handledBy || 'Unassigned' });
    else setEnquiry(null);
    setLoading(false);
    return () => { active = false; };
  }, [id, isDemoMode]);
  const statusBadgeCls = enquiry ? ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE[enquiry.status] : ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE.New;
  const currentStatus: EnquiryStatus = enquiry?.status ?? 'New';
  const followUpDateClass = enquiry?.isOverdue ? 'font-medium text-danger-text' : enquiry?.isToday ? 'font-medium text-warning-text' : 'font-medium text-info-text';
  const followUpDateLabel = enquiry?.isOverdue ? t('FOLLOWUP_OVERDUE') : enquiry?.isToday ? t('FOLLOWUP_TODAY') : t('FOLLOWUP_UPCOMING');
  const timelineDotClass = () => '';
  return { id, router, enquiry, setEnquiry, loading, setLoading, currentStatus, statusBadgeCls, followUpDateClass, followUpDateLabel, timelineDotClass } as const;
}
