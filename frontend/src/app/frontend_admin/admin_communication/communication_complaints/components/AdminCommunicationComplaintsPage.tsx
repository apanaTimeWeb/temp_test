'use client';
// Responsibility: AdminCommunicationComplaintsPage component owned by admin_communication; responsibility folder: admin_communication_components_views.

import AdminCommunicationComplaintDetailModal from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintDetailModal';
import { AdminCommunicationComplaintsBranchBar } from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsBranchBar';
import AdminCommunicationComplaintAddModal from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsComplaintAddModal';
import { AdminCommunicationComplaintsKpiGrid } from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsKpiGrid';
import { AdminCommunicationComplaintsTable } from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsTable';
import { ADMIN_COMMUNICATION_DEMO_COMPLAINTS } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.demo_data';
import { ADMIN_COMMUNICATION_COMPLAINT_STATUS, getAdminCommunicationComplaintStatus } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import useAdminCommunicationComplaintsQuery from '@/app/frontend_admin/admin_communication/communication_complaints/hooks/useAdminCommunicationComplaintsQuery';
import { createAdminCommunicationComplaintSchema, type AdminCommunicationComplaintFormValues } from '@/app/frontend_admin/admin_communication/communication_complaints/schemas/AdminCommunicationComplaintsSchema';
import type { CStatus, Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import {
  exportComplaintsCsv,
  exportComplaintsExcel,
  printComplaintsReport,
} from '@/app/frontend_admin/admin_communication/communication_complaints/utils/adminCommunicationComplaintsExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isValid, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { MessageSquare, Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const TABS: (CStatus | 'All')[] = [
  'All',
  ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN,
  ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS,
  ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED,
];

export function AdminCommunicationComplaintsPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const locale = useLocale();
  const dateFnsLocale = locale === 'hi' ? hi : enUS;
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const formatComplaintDate = (value: string) => {
    if (!value || value === '—') return '—';
    const parsed = parseISO(value);
    return isValid(parsed) ? format(parsed, 'PP', { locale: dateFnsLocale }) : '—';
  };

  const isDemoMode = isFrontendDemoModeEnabled();
  const [tab, setTab] = useState<CStatus | 'All'>('All');
  const complaintsQuery = useAdminCommunicationComplaintsQuery(!isDemoMode);

  const apiComplaints = useMemo<Complaint[]>(() => (complaintsQuery.data ?? []).map((c) => ({
    id: String(c.id),
    title: c.subject,
    student: '—',
    description: c.description,
    status: getAdminCommunicationComplaintStatus(c.status),
    date: c.createdAt.slice(0, 10),
    resolvedBy: '—',
    resolvedDate: '—',
    resolvedNote: '',
    branchName: 'Downtown Central',
    isEscalatedToHq: c.status === 'Open',
  })), [complaintsQuery.data]);

  const [demoComplaints, setDemoComplaints] = useState<Complaint[]>(() =>
    isDemoMode ? [...ADMIN_COMMUNICATION_DEMO_COMPLAINTS] : []
  );

  const complaints = isDemoMode ? demoComplaints : apiComplaints;
  const [showAdd, setShowAdd] = useState(false);
  const [viewItem, setViewItem] = useState<Complaint | null>(null);
  const [resolveItem, setResolveItem] = useState<Complaint | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [search, setSearch] = useState('');

  const isLoading = !isDemoMode && complaintsQuery.isPending;
  const errorMessage = !isDemoMode && complaintsQuery.isError ? t('COMPLAINT_UNKNOWN_ERROR') : null;
  const [toast, setToast] = useState('');
  const toastTimeoutRef = useRef<number | null>(null);
  useEffect(() => () => { if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current); }, []);

  const complaintSchema = useMemo(() => createAdminCommunicationComplaintSchema({
    complaintTitleRequired: t('VALIDATION_COMPLAINT_TITLE_REQUIRED'),
    complaintDescriptionRequired: t('VALIDATION_COMPLAINT_DESCRIPTION_REQUIRED'),
  }), [t]);

  const complaintForm = useForm<AdminCommunicationComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { student: '', anonymous: false, title: '', description: '' },
    mode: 'onBlur',
  });

  const openAdd = () => {
    complaintForm.reset({ student: '', anonymous: false, title: '', description: '' });
    setShowAdd(true);
  };

  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => { setToast(''); toastTimeoutRef.current = null; }, 3000);
  };

  const branchFiltered = useMemo(() => {
    if (isAllBranches || !selectedBranch) return complaints;
    return complaints.filter((c) => !c.branchName || c.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase()));
  }, [isAllBranches, selectedBranch, complaints]);

  const filtered = useMemo(() => {
    let list = tab === 'All' ? branchFiltered : branchFiltered.filter((c) => c.status === tab);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((c) =>
        c.student.toLowerCase().includes(q) ||
        (c.seatNumber ? c.seatNumber.toLowerCase().includes(q) : false) ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.branchName ? c.branchName.toLowerCase().includes(q) : false)
      );
    }
    return list;
  }, [tab, branchFiltered, search]);

  const handleAdd = (values: AdminCommunicationComplaintFormValues) => {
    if (!isDemoMode) { showToast(t('COMPLAINT_SUBMISSION_BLOCKED')); return; }
    const complaint: Complaint = {
      id: `CMP-DEMO-${Date.now()}`,
      title: values.title.trim(),
      student: values.anonymous ? t('COMPLAINT_ANONYMOUS') : values.student.trim() || t('COMPLAINT_UNKNOWN_STUDENT'),
      description: values.description.trim(),
      status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN,
      date: format(new Date(), 'yyyy-MM-dd'),
      branchName: selectedBranch?.name ?? 'Downtown Central',
      isEscalatedToHq: true,
      resolvedBy: '—',
      resolvedDate: '—',
      resolvedNote: '',
    };
    setDemoComplaints((current) => [complaint, ...current]);
    setShowAdd(false);
    complaintForm.reset({ student: '', anonymous: false, title: '', description: '' });
    showToast(t('COMPLAINT_DEMO_CREATED', { title: complaint.title }));
  };

  const markInProgress = (id: string) => {
    if (!isDemoMode) { showToast(t('COMPLAINT_STATUS_UPDATE_BLOCKED')); return; }
    setDemoComplaints((current) => current.map((complaint) => complaint.id === id ? { ...complaint, status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS } : complaint));
    showToast(t('COMPLAINT_DEMO_STATUS_UPDATED'));
  };

  const handleResolve = () => {
    if (!resolveItem || !resolveNote.trim()) return;
    if (!isDemoMode) { showToast(t('COMPLAINT_RESOLUTION_BLOCKED')); return; }
    const resolvedDate = format(new Date(), 'yyyy-MM-dd');
    setDemoComplaints((current) => current.map((complaint) => complaint.id === resolveItem.id ? { ...complaint, status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED, resolvedBy: t('DEMO_AUTHOR'), resolvedDate, resolvedNote: resolveNote.trim() } : complaint));
    showToast(t('COMPLAINT_DEMO_RESOLVED', { title: resolveItem.title }));
    setResolveItem(null);
    setResolveNote('');
  };

  const statusBadge = (s: CStatus) => {
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN) return <span data-testid="admin_communication-page-state-001" className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-danger bg-danger-bg px-2.5 py-0.5 text-xs font-semibold text-danger-text whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-danger motion-safe:animate-pulse" />{t('COMPLAINT_STATUS_OPEN')}</span>;
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS) return <span data-testid="admin_communication-page-state-002" className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-warning bg-warning-bg px-2.5 py-0.5 text-xs font-semibold text-warning-text whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-warning" />{t('COMPLAINT_STATUS_IN_PROGRESS')}</span>;
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED) return <span data-testid="admin_communication-page-state-003" className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success-text whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-success" />{t('COMPLAINT_STATUS_RESOLVED')}</span>;
    return <span className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-transparent text-text-secondary border-border">{t('COMPLAINT_STATUS_UNKNOWN')}</span>;
  };

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      <p role="status" className="sr-only">{isDemoMode ? t('COMPLAINT_DEMO_BANNER') : t('COMPLAINT_ADD_API_UNAVAILABLE')}</p>
      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card px-4 py-3 text-ui font-semibold text-text-primary shadow-toast" role="status" aria-live="polite" aria-atomic="true">{toast}</div>}

      {showAdd && <AdminCommunicationComplaintAddModal form={complaintForm} onClose={() => setShowAdd(false)} onSubmit={handleAdd} isDemoMode={isDemoMode} />}

      <AdminCommunicationComplaintDetailModal
        viewItem={viewItem}
        resolveItem={resolveItem}
        resolveNote={resolveNote}
        isDemoMode={isDemoMode}
        onCloseView={() => setViewItem(null)}
        onCloseResolve={() => setResolveItem(null)}
        onChangeResolveNote={setResolveNote}
        onConfirmResolve={handleResolve}
        statusBadge={statusBadge}
        formatComplaintDate={formatComplaintDate}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary">
            <MessageSquare className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Student Support Desk</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('COMPLAINTS_TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('COMPLAINTS_SUBTITLE')}</p>
        </div>
        <button
          type="button"
          data-testid="admin_communication-page-control-014"
          onClick={openAdd}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors shadow-card"
        >
          <Plus size={18} strokeWidth={2} aria-hidden="true" /> {t('COMPLAINTS_ADD_BUTTON')}
        </button>
      </div>

      <AdminCommunicationComplaintsKpiGrid complaints={branchFiltered} />

      <AdminCommunicationComplaintsBranchBar
        selectedBranch={selectedBranch}
        isAllBranches={isAllBranches}
        complaints={complaints}
        tab={tab}
        setTab={setTab}
        tabs={TABS}
        search={search}
        onSearchChange={setSearch}
        onExportCsv={() => { exportComplaintsCsv(filtered); showToast(`Exported ${filtered.length} complaints to CSV`); }}
        onExportExcel={() => { exportComplaintsExcel(filtered); showToast(`Exported ${filtered.length} complaints to Excel (.xls)`); }}
        onPrint={() => printComplaintsReport(filtered, isAllBranches ? 'All Branches' : (selectedBranch?.name ?? 'Downtown Central'))}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden p-0">
        <AdminCommunicationComplaintsTable
          complaints={filtered}
          isLoading={isLoading}
          errorMessage={errorMessage}
          tab={tab}
          isDemoMode={isDemoMode}
          onView={setViewItem}
          onMarkInProgress={markInProgress}
          onResolve={setResolveItem}
          statusBadge={statusBadge}
          formatComplaintDate={formatComplaintDate}
          onRetry={() => { void complaintsQuery.refetch(); }}
        />
      </div>
    </div>
  );
}
export default AdminCommunicationComplaintsPage;
