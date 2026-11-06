'use client';
// Responsibility: AdminCommunicationComplaintsPage component owned by admin_communication; responsibility folder: admin_communication_components_views.
import useAdminCommunicationComplaintsQuery from '@/app/frontend_admin/admin_communication/communication_complaints/hooks/useAdminCommunicationComplaintsQuery';
import { useEffect, useMemo, useRef, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Plus } from 'lucide-react';
import { getAdminCommunicationComplaintStatus, ADMIN_COMMUNICATION_COMPLAINT_STATUS } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import { createAdminCommunicationComplaintSchema, type AdminCommunicationComplaintFormValues } from '@/app/frontend_admin/admin_communication/communication_complaints/schemas/AdminCommunicationComplaintsSchema';
import AdminCommunicationComplaintAddModal from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsComplaintAddModal';
import AdminCommunicationComplaintDetailModal from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintDetailModal';
import { AdminCommunicationComplaintsTable } from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsTable';
import { AdminCommunicationComplaintsBranchBar } from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsBranchBar';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import type { CStatus, Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';

const TABS: (CStatus | 'All')[] = ['All', ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN, ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS, ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED];

export function AdminCommunicationComplaintsPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const locale = useLocale();
  const dateFnsLocale = locale === 'hi' ? hi : enUS;
  const { branches, selectedBranchId, selectedBranch, setSelectedBranchId, isAllBranches } = useAdminBranch();

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
    isDemoMode
      ? [
          {
            id: 'CMP-DEMO-001',
            title: 'AC cooling failure in Silent Study Hall B',
            student: 'Rahul Sharma',
            description: 'The 2-ton cassette AC has been blowing ambient warm air for over 48 hours. Temperature inside is 32°C. Multiple students unable to study.',
            status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN,
            date: '2026-11-01',
            branchName: 'Downtown Central',
            isEscalatedToHq: true,
            resolvedBy: '—',
            resolvedDate: '—',
            resolvedNote: '',
          },
          {
            id: 'CMP-DEMO-002',
            title: 'High ping and intermittent disconnects on 5GHz Wi-Fi',
            student: 'Priya Verma',
            description: 'Fiber line drop during evening batch (6 PM - 9 PM). Branch manager stated ISP ticket was raised yesterday.',
            status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS,
            date: '2026-11-02',
            branchName: 'Westside Branch',
            isEscalatedToHq: true,
            resolvedBy: '—',
            resolvedDate: '—',
            resolvedNote: '',
          },
          {
            id: 'CMP-DEMO-003',
            title: 'Locker key lock stuck after renewal',
            student: 'Amit Patel',
            description: 'Locker L-14 key cylinder stuck. Branch manager replaced key cylinder same day.',
            status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED,
            date: '2026-10-28',
            branchName: 'North Hub',
            isEscalatedToHq: false,
            resolvedBy: 'Downtown HQ Admin',
            resolvedDate: '2026-10-29',
            resolvedNote: 'Lock cylinder lubricated and spare master key provided to student.',
          },
        ]
      : []
  );

  const complaints = isDemoMode ? demoComplaints : apiComplaints;
  const [showAdd, setShowAdd] = useState(false);
  const [viewItem, setViewItem] = useState<Complaint | null>(null);
  const [resolveItem, setResolveItem] = useState<Complaint | null>(null);
  const [resolveNote, setResolveNote] = useState('');

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
    return complaints.filter((c) => {
      if (!c.branchName) return true;
      return c.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase());
    });
  }, [isAllBranches, selectedBranch, complaints]);

  const filtered = tab === 'All' ? branchFiltered : branchFiltered.filter(c => c.status === tab);

  const handleAdd = (values: AdminCommunicationComplaintFormValues) => {
    if (!isDemoMode) { showToast(t('COMPLAINT_SUBMISSION_BLOCKED')); return; }
    const now = format(new Date(), 'yyyy-MM-dd');
    const complaint: Complaint = {
      id: `CMP-DEMO-${Date.now()}`,
      title: values.title.trim(),
      student: values.anonymous ? t('COMPLAINT_ANONYMOUS') : values.student.trim() || t('COMPLAINT_UNKNOWN_STUDENT'),
      description: values.description.trim(),
      status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN,
      date: now,
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
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN) return <span data-testid="admin_communication-page-state-001" className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg">{t('COMPLAINT_STATUS_OPEN')}</span>;
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS) return <span data-testid="admin_communication-page-state-002" className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg">{t('COMPLAINT_STATUS_IN_PROGRESS')}</span>;
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED) return <span data-testid="admin_communication-page-state-003" className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-success-bg text-success-text border-success-bg">{t('COMPLAINT_STATUS_RESOLVED')}</span>;
    return <span className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-transparent text-text-secondary border-border">{t('COMPLAINT_STATUS_UNKNOWN')}</span>;
  };

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      <p role="status" className={`mb-4 rounded-md border p-3 text-sm ${isDemoMode ? 'border-info bg-info-bg text-info-text' : 'border-warning-bg bg-warning-bg text-warning-text'}`}>{isDemoMode ? t('COMPLAINT_DEMO_BANNER') : t('COMPLAINT_ADD_API_UNAVAILABLE')}</p>
      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card px-4 py-3 text-ui font-semibold text-text-primary shadow-toast" role="status" aria-live="polite" aria-atomic="true">{toast}</div>}

      {/* Complaint Entry Modal */}
      {showAdd && <AdminCommunicationComplaintAddModal form={complaintForm} onClose={() => setShowAdd(false)} onSubmit={handleAdd} isDemoMode={isDemoMode} />}

      {/* Detail / Resolve Modal Subcomponent */}
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

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">
            <span>{t('BREADCRUMB_COMMUNICATION')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('COMPLAINTS_TITLE')}</span>
          </div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-text-primary">💬 {t('COMPLAINTS_TITLE')}</h1>
          <p className="mt-1 text-ui text-text-secondary">{t('COMPLAINTS_SUBTITLE')}</p>
        </div>
        <button data-testid="admin_communication-page-control-014" onClick={openAdd} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-body font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base">
          <Plus size={18} strokeWidth={2}/> {t('COMPLAINTS_ADD_BUTTON')}
        </button>
      </div>

      {/* Multi-Branch Complaint Filter Pills & Status Filter Tabs */}
      <AdminCommunicationComplaintsBranchBar
        branches={branches}
        selectedBranchId={selectedBranchId}
        selectedBranch={selectedBranch}
        setSelectedBranchId={setSelectedBranchId}
        isAllBranches={isAllBranches}
        complaints={complaints}
        tab={tab}
        setTab={setTab}
        tabs={TABS}
      />

      {/* Table */}
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
