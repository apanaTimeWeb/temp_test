'use client';
// RESPONSIBILITY: AdminMembersStudentsHeaderSection component owned by admin_members_students; responsibility folder: admin_members_students_components_views.
'use client';
import { useTranslations } from 'next-intl';
import { Download, Mail, MessageSquare, Printer, Send, Upload } from 'lucide-react';
import { serializeAdminStudentsCsv } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsCsvUtils';
import type { AdminStudentsStudent } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';

export default function AdminMembersStudentsHeaderSection({ selectedBranch, students = [] }: { selectedBranch: string; students?: readonly AdminStudentsStudent[] }) {
  const t = useTranslations('ADMIN_STUDENTS');
  const exportCsv = () => {
    const blob = new Blob([serializeAdminStudentsCsv(students)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-students-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <p className="text-xs text-text-secondary mb-1 tracking-widest uppercase font-medium">{t('BREADCRUMB')}</p>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">{selectedBranch} — {t('PAGE_TITLE')}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('PAGE_SUBTITLE')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-001" disabled title={t('TOAST_IMPORT_BLOCKED')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border text-primary hover:bg-primary-subtle motion-safe:transition-colors"><Upload size={18} strokeWidth={2}/> {t('ACTION_IMPORT')}</button>
        <button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-002" onClick={exportCsv} disabled={students.length === 0} title={students.length === 0 ? t('TOAST_EXPORT_BLOCKED') : undefined} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border text-primary hover:bg-primary-subtle motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-50"><Download size={18} strokeWidth={2}/> {t('ACTION_CSV')}</button>
        <button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-003" onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border text-primary hover:bg-primary-subtle motion-safe:transition-colors"><Printer size={18} strokeWidth={2}/> {t('ACTION_PRINT')}</button>
        <button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-004" disabled title={t('TOAST_WHATSAPP_BLOCKED')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border text-success-text hover:bg-success-bg motion-safe:transition-colors"><MessageSquare size={18} strokeWidth={2}/> {t('ACTION_WHATSAPP')}</button>
        <button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-005" disabled title={t('TOAST_TELEGRAM_BLOCKED')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border text-info-text hover:bg-info-bg motion-safe:transition-colors"><Send size={18} strokeWidth={2}/> {t('ACTION_TELEGRAM')}</button>
        <button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-006" disabled title={t('TOAST_EMAIL_BLOCKED')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border text-primary hover:bg-primary-subtle motion-safe:transition-colors"><Mail size={18} strokeWidth={2}/> {t('ACTION_EMAIL')}</button>
      </div>
    </header>
  );
}
