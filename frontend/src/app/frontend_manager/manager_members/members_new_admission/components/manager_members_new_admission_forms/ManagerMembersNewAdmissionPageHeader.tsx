'use client';

import {
  ManagerMembersNewAdmissionSuccessBanner,
  type AdmittedStudentInfo,
} from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionSuccessBanner';
import { MANAGER_MEMBERS_NEW_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_new_admission/config/manager_members_new_admission.url_config';
import { ArrowLeft, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  tManagerUi: (key: string) => string;
  admittedStudent: AdmittedStudentInfo | null;
  onResetAdmission: () => void;
  draftFeedback: string | null;
  conversionOrigin: { enquiryId: string; name: string } | null;
  onDismissConversionOrigin: () => void;
}

export function ManagerMembersNewAdmissionPageHeader({
  tManagerUi,
  admittedStudent,
  onResetAdmission,
  draftFeedback,
  conversionOrigin,
  onDismissConversionOrigin,
}: PageHeaderProps) {
  return (
    <div className="mgr-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 w-full max-w-full min-w-0">
      <div className="min-w-0 flex-1">
        <Link href={MANAGER_MEMBERS_NEW_ADMISSION_ROUTES.LIST} className="mgr-back-link inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 motion-safe:transition-colors mb-2">
          <ArrowLeft size={16} strokeWidth={2} />
          <span>{tManagerUi('back_to_students_6de7b0')}</span>
        </Link>
        <h1 className="mgr-page-title text-xl sm:text-2xl font-black text-primary tracking-tight truncate">{tManagerUi('new_student_admission')}</h1>
        <p className="mgr-page-subtitle text-xs sm:text-sm text-secondary mt-1">{tManagerUi('fill_all_mandatory_fields_accurately_smart_id_is_auto_ge_026bb4')}</p>
        {admittedStudent && <ManagerMembersNewAdmissionSuccessBanner student={admittedStudent} onReset={onResetAdmission} />}
        {draftFeedback && <p className="mt-3 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" aria-live="polite" data-testid="manager-students-admission-draft-feedback">{draftFeedback}</p>}
        {conversionOrigin && (
          <div className="mt-3 p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-between text-xs text-indigo-300">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400 shrink-0" />
              <span>Converted from Enquiry <strong>#{conversionOrigin.enquiryId}</strong>: Information pre-filled for <strong>{conversionOrigin.name}</strong>.</span>
            </div>
            <button type="button" onClick={onDismissConversionOrigin} className="text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer p-1" aria-label="Dismiss banner">
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      <div className="mgr-smartid-badge self-start sm:self-auto shrink-0 flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-xs">
        <span className="mgr-smartid-label text-xs text-secondary font-medium uppercase tracking-wider">{tManagerUi('smart_id')}</span>
        <span className="mgr-smartid-value font-mono text-sm font-bold text-primary">{tManagerUi('lib_new')}</span>
        <span className="mgr-badge mgr-badge--info text-[11px] font-semibold px-2 py-0.5 rounded-full bg-info-bg text-info border border-border">{tManagerUi('smart_id_preview_only')}</span>
      </div>
    </div>
  );
}
