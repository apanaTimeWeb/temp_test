'use client';
// Responsibility: AdminCommunicationComplaintsPage component owned by admin_communication; responsibility folder: admin_communication_components_views.
import AdminCommunicationComplaintDetailModal from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintDetailModal';
import { AdminCommunicationComplaintsBranchBar } from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsBranchBar';
import AdminCommunicationComplaintAddModal from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsComplaintAddModal';
import { AdminCommunicationComplaintsTable } from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsTable';
import { ADMIN_COMMUNICATION_COMPLAINT_STATUS,getAdminCommunicationComplaintStatus } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import useAdminCommunicationComplaintsQuery from '@/app/frontend_admin/admin_communication/communication_complaints/hooks/useAdminCommunicationComplaintsQuery';
import { createAdminCommunicationComplaintSchema,type AdminCommunicationComplaintFormValues } from '@/app/frontend_admin/admin_communication/communication_complaints/schemas/AdminCommunicationComplaintsSchema';
import type { CStatus,Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { zodResolver } from '@hookform/resolvers/zod';
import { format,isValid,parseISO } from 'date-fns';
import { enUS,hi } from 'date-fns/locale';
import { AlertTriangle,CheckCircle,MessageSquare,Plus,RefreshCw } from 'lucide-react';
import { useLocale,useTranslations } from 'next-intl';
import { useEffect,useMemo,useRef,useState } from 'react';
import { useForm } from 'react-hook-form';

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
            category: 'HVAC & Cooling',
            priority: 'URGENT',
            seatNumber: 'Seat B-14',
            studentPhone: '+91 98110 22334',
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
            category: 'Network & Wi-Fi',
            priority: 'HIGH',
            seatNumber: 'Seat A-08',
            studentPhone: '+91 98220 44556',
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
            category: 'Facility & Lockers',
            priority: 'MEDIUM',
            seatNumber: 'Locker L-14',
            studentPhone: '+91 98330 66778',
          },
          {
            id: 'CMP-DEMO-004',
            title: 'Flickering LED tube light directly above study pod 4',
            student: 'Sneha Kulkarni',
            description: 'The overhead luminaire above Desk Pod 04 has an intermittent flicker ballast issue causing eye strain during late night study shifts.',
            status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN,
            date: '2026-11-03',
            branchName: 'Downtown Central',
            isEscalatedToHq: false,
            resolvedBy: '—',
            resolvedDate: '—',
            resolvedNote: '',
            category: 'Electrical & Power',
            priority: 'MEDIUM',
            seatNumber: 'Pod-04',
            studentPhone: '+91 98440 88990',
          },
          {
            id: 'CMP-DEMO-005',
            title: 'Frequent group whispering in designated Silence Zone',
            student: 'Vikram Singh',
            description: 'Repeated discussions and whispering near row 3 during 2 PM - 5 PM shift despite silence zone signage.',
            status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED,
            date: '2026-10-30',
            branchName: 'Westside Branch',
            isEscalatedToHq: false,
            resolvedBy: 'Branch Manager',
            resolvedDate: '2026-10-31',
            resolvedNote: 'Floor proctor deployed during afternoon shift and reminder broadcast sent to all members.',
            category: 'Discipline & Quiet',
            priority: 'LOW',
            seatNumber: 'Seat C-02',
            studentPhone: '+91 98550 11223',
          },
        ]
      : []
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
    return complaints.filter((c) => {
      if (!c.branchName) return true;
      return c.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase());
    });
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

  const handleExportCsv = () => {
    const headers = [
      'Ticket ID',
      'Title / Grievance Subject',
      'Category',
      'Priority',
      'Complainant Student',
      'Phone',
      'Seat / Room',
      'Branch',
      'Status',
      'Date Logged',
      'Resolved Date',
      'Resolved By',
      'Resolution Notes',
    ];
    const rows = filtered.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category ?? 'General'}"`,
      c.priority ?? 'MEDIUM',
      `"${c.student.replace(/"/g, '""')}"`,
      `"${c.studentPhone ?? ''}"`,
      `"${c.seatNumber ?? ''}"`,
      `"${c.branchName ?? ''}"`,
      c.status,
      c.date,
      c.resolvedDate !== '—' ? c.resolvedDate : '',
      `"${c.resolvedBy !== '—' ? c.resolvedBy.replace(/"/g, '""') : ''}"`,
      `"${(c.resolvedNote ?? '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-complaints-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Exported ${filtered.length} complaints to CSV`);
  };

  const handleExportExcel = () => {
    const headers = [
      'Ticket ID',
      'Subject',
      'Category',
      'Priority',
      'Student',
      'Phone',
      'Seat/Room',
      'Branch',
      'Status',
      'Date Logged',
      'Resolved Date',
      'Resolved By',
      'Resolution Notes',
    ];
    const rows = filtered.map((c) => [
      c.id,
      c.title,
      c.category ?? 'General',
      c.priority ?? 'MEDIUM',
      c.student,
      c.studentPhone ?? '-',
      c.seatNumber ?? '-',
      c.branchName ?? 'Downtown Central',
      c.status,
      c.date,
      c.resolvedDate,
      c.resolvedBy,
      c.resolvedNote || '-',
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Complaints</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #e11d48; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #be123c; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #fff1f2; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `.trim();
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-complaints-report-${new Date().toISOString().slice(0, 10)}.xls`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Exported ${filtered.length} complaints to Excel (.xls)`);
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) return;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Complaints Audit Report</title>
        <style>
          body { font-family: -apple-system, sans-serif; padding: 24px; color: #1e293b; font-size: 12px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e11d48; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 18px; font-weight: bold; color: #e11d48; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 11px; }
          th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background: #f8fafc; }
          .badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; }
          .open { background: #fee2e2; color: #b91c1c; }
          .in-prog { background: #fef3c7; color: #b45309; }
          .resolved { background: #dcfce7; color: #15803d; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">SMART LIBRARY NETWORK - GRIEVANCES REPORT</div>
            <div>Branch: ${isAllBranches ? 'All Branches' : (selectedBranch?.name ?? 'Downtown Central')}</div>
          </div>
          <div style="text-align: right;">
            <div>Date: ${new Date().toLocaleDateString('en-IN')}</div>
            <div>Total Tickets: ${filtered.length}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Student Name</th>
              <th>Seat/Room</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date Logged</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((c) => `
              <tr>
                <td><strong>${c.id}</strong></td>
                <td>${c.student}</td>
                <td>${c.seatNumber ?? '-'}</td>
                <td>${c.title}</td>
                <td>${c.category ?? 'General'}</td>
                <td><span class="badge ${c.status === 'Open' ? 'open' : c.status === 'In Progress' ? 'in-prog' : 'resolved'}">${c.status}</span></td>
                <td>${c.date}</td>
                <td>${c.status === 'Resolved' ? `${c.resolvedNote} (By ${c.resolvedBy})` : 'Pending'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

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
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN) return <span data-testid="admin_communication-page-state-001" className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-400 whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />{t('COMPLAINT_STATUS_OPEN')}</span>;
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS) return <span data-testid="admin_communication-page-state-002" className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400 whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{t('COMPLAINT_STATUS_IN_PROGRESS')}</span>;
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED) return <span data-testid="admin_communication-page-state-003" className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{t('COMPLAINT_STATUS_RESOLVED')}</span>;
    return <span className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-transparent text-text-secondary border-border">{t('COMPLAINT_STATUS_UNKNOWN')}</span>;
  };

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      <p role="status" className="sr-only">{isDemoMode ? t('COMPLAINT_DEMO_BANNER') : t('COMPLAINT_ADD_API_UNAVAILABLE')}</p>
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
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-text-secondary backdrop-blur-md">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>Student Support Desk</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('COMPLAINTS_TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('COMPLAINTS_SUBTITLE')}</p>
        </div>
        <button data-testid="admin_communication-page-control-014" onClick={openAdd} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base shadow-sm">
          <Plus size={18} strokeWidth={2}/> {t('COMPLAINTS_ADD_BUTTON')}
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Tickets - Cyan */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Total Tickets</span>
            <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <MessageSquare size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{branchFiltered.length}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Total grievances recorded</p>
        </div>

        {/* Open & Escalated - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Open & Escalated</span>
            <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <AlertTriangle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-rose-400 tabular-nums">
            {branchFiltered.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN).length}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Unresolved complaints</p>
        </div>

        {/* In Progress - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">In Progress</span>
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <RefreshCw size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-400 tabular-nums">
            {branchFiltered.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS).length}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Active investigation</p>
        </div>

        {/* Resolved - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Resolved</span>
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <CheckCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 tabular-nums">
            {branchFiltered.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED).length}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Successfully closed</p>
        </div>
      </div>

      {/* Complaint Status Filter Tabs, Search Bar & Export Controls (Branch filtering is governed solely via the global Admin Shell Header) */}
      <AdminCommunicationComplaintsBranchBar
        selectedBranch={selectedBranch}
        isAllBranches={isAllBranches}
        complaints={complaints}
        tab={tab}
        setTab={setTab}
        tabs={TABS}
        search={search}
        onSearchChange={setSearch}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
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
