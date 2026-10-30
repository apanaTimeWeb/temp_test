'use client';
import type { AdminMembersStudentsViewProps } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';

// RESPONSIBILITY: AdminMembersStudentsView component owned by admin_members_students; responsibility folder: admin_members_students_components_views.
'use client';
import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Toaster } from 'sonner';
import { Search, Armchair, CalendarDays, Clock, IndianRupee, MessageSquare, Phone, ShieldAlert, Users, X } from 'lucide-react';
import { ADMIN_STUDENTS_KPI_STATUSES, ADMIN_STUDENTS_STATUS_BADGE_CLASSES } from '@/app/frontend_admin/admin_members/members_students/config/admin_members_students.url_config';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { getAdminStudentsKpiSummary } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsListUtils';
import { formatAdminStudentsDate, formatAdminStudentsMoney } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsFormatUtils';
import useAdminMembersStudentsMain from '@/app/frontend_admin/admin_members/members_students/hooks/useAdminMembersStudentsMain';
import AdminMembersStudentsHeaderSection from '@/app/frontend_admin/admin_members/members_students/components/AdminMembersStudentsHeaderSection';

export default function AdminMembersStudentsView({ model }: AdminMembersStudentsViewProps) {
  const t = useTranslations('ADMIN_STUDENTS');
  const locale = useLocale();
  const { search, setSearch, statusFilter, setStatusFilter, students, selectedStudent, setSelectedStudent, selectedBranch, filtered, colDefs, statuses, isLoading, errorMessage, retryLoadStudents } = model;
  const getStatusLabel = (status: string) => status === 'All' ? t('FILTER_ALL') : status === 'Active' ? t('STATUS_ACTIVE') : status === 'Suspended' ? t('STATUS_SUSPENDED') : status === 'Blocked' ? t('STATUS_BLOCKED') : t('STATUS_UNKNOWN');
  const detailDialogRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-students-admin-students-table-section-1-page', 0);

  useEffect(() => {
    if (!selectedStudent) return;
    const dialog = detailDialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
    getFocusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setSelectedStudent(null); return; }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (!items.length) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === items[0] || !dialog?.contains(document.activeElement))) { event.preventDefault(); items[items.length - 1]?.focus(); }
      else if (!event.shiftKey && (document.activeElement === items[items.length - 1] || !dialog?.contains(document.activeElement))) { event.preventDefault(); items[0]?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus(); else searchInputRef.current?.focus(); };
  }, [selectedStudent, setSelectedStudent]);

  return (
    <div className="h-full flex flex-col pb-10 space-y-6">
      <Toaster position="bottom-right" />
      <AdminMembersStudentsHeaderSection selectedBranch={selectedBranch} students={filtered} />
      {isLoading && <p role="status" aria-live="polite" className="rounded-lg border border-border bg-card p-4 text-text-secondary">{t('LOADING')}</p>}
      {errorMessage && <div role="alert" className="rounded-lg border border-danger-text bg-danger-bg p-4"><p className="text-danger-text">{errorMessage}</p><button type="button" className="mt-2 min-h-11 rounded border border-border px-3 text-primary" onClick={() => { void retryLoadStudents(); }}>{t('RETRY_LOADING')}</button></div>}
      {!isLoading && !errorMessage && (() => {
        const summary = getAdminStudentsKpiSummary(students, selectedBranch);
        return <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3" aria-label={t('KPI_TOTAL')}>
          {[{ label: t('KPI_TOTAL'), value: summary.total, color: 'primary' }, ...ADMIN_STUDENTS_KPI_STATUSES.map((entry) => ({ label: getStatusLabel(entry.status), value: summary.byStatus[entry.status], color: entry.color })), { label: t('KPI_FEE_DUE'), value: summary.feeDue, color: 'danger' }].map((item) => <div key={item.label} className="rounded-xl border border-border bg-card px-4 py-3.5"><p className="mb-1 text-xs text-text-secondary">{item.label}</p><p className="text-2xl font-bold" data-admin-color={item.color}>{item.value}</p></div>)}
        </section>;
      })()}
      {!isLoading && !errorMessage && <section className="flex flex-wrap items-center gap-2.5" aria-label={t('SEARCH_LABEL')}>
        <div className="relative w-full max-w-sm flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2}/><input ref={searchInputRef} className="w-full rounded-lg border border-border bg-input py-2.5 pl-9 pr-3 text-sm text-text-primary focus-visible:border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('SEARCH_LABEL')} placeholder={t('SEARCH_PLACEHOLDER')} value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        {statuses.map((status) => <button data-testid={`admin_members_students-AdminMembersStudentsView-status-filter-${status.toLowerCase()}`} aria-pressed={statusFilter === status} key={status} onClick={() => setStatusFilter(status)} className={`min-h-11 min-w-11 rounded-full px-3.5 py-1.5 text-caption font-semibold ${statusFilter === status ? 'bg-primary text-on-primary' : 'bg-card text-text-secondary border border-border'}`}>{getStatusLabel(status)}</button>)}
      </section>}
      {!isLoading && !errorMessage && <section className="h-[500px] w-full overflow-hidden rounded-xl border border-border" aria-label={t('NO_STUDENTS')}>
        {filtered.length === 0 ? <AdminEmptyState showIcon={false} title={t('NO_STUDENTS')} description={t('NO_STUDENTS_DESCRIPTION')} /> : <DataGrid rowData={filtered} columnDefs={colDefs} rowHeight={58} onRowClicked={setSelectedStudent} page={urlTablePage0} onPageChange={setUrlTablePage0} />}
      </section>}
      {selectedStudent && <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-overlay-backdrop p-5 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedStudent(null); }}>
        <div ref={detailDialogRef} data-testid="admin_members_students-AdminMembersStudentsView-control-009" className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card shadow-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-student-detail-title" tabIndex={-1} onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5"><div className="flex items-center gap-3.5"><div className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-on-primary">{selectedStudent.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><h2 id="admin-student-detail-title" className="admin-shared-card-title">{selectedStudent.name}</h2><p className="m-0 text-xs text-text-secondary">{selectedStudent.id} · {selectedStudent.branch}</p></div></div><button type="button" aria-label={t('CLOSE_DETAILS')} data-testid="admin_members_students-AdminMembersStudentsView-control-010" onClick={() => setSelectedStudent(null)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-transparent p-2 text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X size={18} strokeWidth={2}/></button></div>
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-3"><span data-testid="admin_members_students-AdminMembersStudentsView-state-011" className={`admin-badge ${ADMIN_STUDENTS_STATUS_BADGE_CLASSES[selectedStudent.status as keyof typeof ADMIN_STUDENTS_STATUS_BADGE_CLASSES]}`}>{getStatusLabel(selectedStudent.status)}</span><span data-testid="admin_members_students-AdminMembersStudentsView-state-012" className={`admin-badge ${selectedStudent.feeStatus === 'Paid' ? 'bg-success-bg text-success-text' : selectedStudent.feeStatus === 'Due' ? 'bg-danger-bg text-danger-text' : 'bg-card text-text-secondary'}`}>{t('FEE_LABEL')}: {selectedStudent.feeStatus === 'Paid' ? t('FEE_PAID') : selectedStudent.feeStatus === 'Due' ? t('FEE_DUE') : t('FEE_UNKNOWN')}</span>{(selectedStudent.consecutiveAbsent || 0) >= 3 && <span className="inline-flex items-center gap-1 rounded-full bg-warning-bg px-3.5 py-1 text-xs font-bold text-warning-text"><ShieldAlert size={18} strokeWidth={2}/> {selectedStudent.consecutiveAbsent} {t('DAYS_ABSENT_SUFFIX')}</span>}</div>
          <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2 md:grid-cols-3">{[
            { icon: <Phone size={18} strokeWidth={2}/>, label: t('DETAIL_PHONE'), value: selectedStudent.phone },
            { icon: <Clock size={18} strokeWidth={2}/>, label: t('DETAIL_SHIFT'), value: selectedStudent.shift },
            { icon: <Armchair size={18} strokeWidth={2}/>, label: t('DETAIL_SEAT'), value: selectedStudent.seat },
            { icon: <Armchair size={18} strokeWidth={2}/>, label: t('DETAIL_LOCKER'), value: selectedStudent.locker || '—' },
            { icon: <CalendarDays size={18} strokeWidth={2}/>, label: t('DETAIL_JOINED'), value: formatAdminStudentsDate(selectedStudent.joinDate, locale) },
            { icon: <CalendarDays size={18} strokeWidth={2}/>, label: t('DETAIL_EXPIRES'), value: formatAdminStudentsDate(selectedStudent.expiryDate, locale) },
            { icon: <IndianRupee size={18} strokeWidth={2}/>, label: t('DETAIL_PLAN'), value: selectedStudent.plan },
            { icon: <IndianRupee size={18} strokeWidth={2}/>, label: t('DETAIL_TOTAL_PAID'), value: selectedStudent.totalPaidMinor !== undefined && selectedStudent.currencyCode ? formatAdminStudentsMoney(selectedStudent.totalPaidMinor, selectedStudent.currencyCode, locale) : '—' },
            { icon: <IndianRupee size={18} strokeWidth={2}/>, label: t('DETAIL_DUE_FEE'), value: selectedStudent.dueFeeMinor !== undefined && selectedStudent.currencyCode ? formatAdminStudentsMoney(selectedStudent.dueFeeMinor, selectedStudent.currencyCode, locale) : '—' },
            { icon: <Users size={18} strokeWidth={2}/>, label: t('DETAIL_BRANCH'), value: selectedStudent.branch },
          ].map((item) => <div key={item.label} className="rounded-lg bg-input px-3.5 py-3"><div className="mb-1 flex items-center gap-1.5 text-xs text-text-secondary">{item.icon} {item.label}</div><p className="m-0 text-sm font-semibold text-text-primary">{item.value}</p></div>)}</div>
          <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border px-6 py-4"><span className="mr-auto text-xs text-text-secondary">{t('ADMIN_ACTIONS')}</span><button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-013" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-success-text bg-success-bg px-4 py-2 text-sm font-semibold text-success-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" disabled title={t('TOAST_DETAIL_WHATSAPP_BLOCKED', { name: selectedStudent.name })}><MessageSquare size={18} strokeWidth={2}/> {t('ACTION_WHATSAPP')}</button>{selectedStudent.status === 'Active' && <button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-014" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-warning-text bg-warning-bg px-4 py-2 text-sm font-semibold text-warning-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" disabled title={t('TOAST_SUSPEND_BLOCKED', { name: selectedStudent.name })}>{t('ACTION_SUSPEND')}</button>}{selectedStudent.status !== 'Blocked' && <button type="button" data-testid="admin_members_students-AdminMembersStudentsView-control-015" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-danger-text bg-danger-bg px-4 py-2 text-sm font-semibold text-danger-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" disabled title={t('TOAST_BLOCK_BLOCKED', { name: selectedStudent.name })}>{t('ACTION_BLOCK')}</button>}</div>
        </div>
      </div>}
    </div>
  );
}


export type { AdminMembersStudentsViewProps };
