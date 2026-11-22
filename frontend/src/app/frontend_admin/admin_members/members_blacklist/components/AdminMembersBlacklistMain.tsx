'use client';
import AdminBlacklistRecordsSection from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistRecordsSection';
import { ADMIN_BLACKLIST_EMPTY_FORM } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import useAdminMembersBlacklistState from '@/app/frontend_admin/admin_members/members_blacklist/hooks/useAdminMembersBlacklistState';
import useAdminMembersBlacklistUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_blacklist/hooks/useAdminMembersBlacklistUnsavedChangesGuard';
import type { AdminBlacklistFormDialogProps,AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { type DataGridCellParams,type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { format,isValid,parseISO } from 'date-fns';
import { enIN,hi } from 'date-fns/locale';
import { AlertOctagon,AlertTriangle,Download,FileSpreadsheet,Lock,MessageSquare,Printer,RotateCcw,Save,ShieldAlert,ShieldCheck,UserX,Users,X } from 'lucide-react';
import { useLocale,useTranslations } from 'next-intl';
import { useCallback,useEffect,useMemo,useState } from 'react';
import { Toaster,toast } from 'sonner';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createAdminBlacklistFormSchema,type AdminBlacklistFormSchemaType,type AdminBlacklistValidationKey } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';



// RESPONSIBILITY: AdminMembersBlacklistMain component owned by admin_blacklist; responsibility folder: admin_blacklist_components_tables.



















/** Safe date-only formatting for the displayed blacklist history. */
export function formatAdminBlacklistDate(value: string | undefined, locale: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '—';
  const parsed = parseISO(value);
  if (!isValid(parsed) || format(parsed, 'yyyy-MM-dd') !== value) return '—';
  return format(parsed, 'd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}

/** Renders blacklist records and dialogs; query and mutation orchestration belongs to the module hook. */
export default function AdminMembersBlacklistMain() {
  const t = useTranslations('ADMIN_BLACKLIST');
  const locale = useLocale();
  const { isDemoMode, recordsQuery, records, showForm, setShowForm, removeId, setRemoveId, selectedRecord, setSelectedRecord, submit, pardonStudent, confirmRemove } = useAdminMembersBlacklistState();
  const [pardonTarget, setPardonTarget] = useState<AdminBlacklistRecord | null>(null);
  const [pardonReason, setPardonReason] = useState('');

  const printDisciplinaryMemo = (record: AdminBlacklistRecord) => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) { window.print(); return; }
    const isNetwork = record.banScope === 'NETWORK_WIDE' || !record.banScope;
    const catLabels: Record<string, string> = {
      THEFT_STOLEN_PROPERTY: 'Theft / Stolen Property (चोरी)',
      INDISCIPLINE_MISCONDUCT: 'Gross Indiscipline & Misconduct (अनुशासनहीनता)',
      PHYSICAL_ALTERCATION: 'Physical Altercation & Threat (मारपीट/अभद्र व्यवहार)',
      PROPERTY_VANDALISM: 'Property Damage & Vandalism (संपत्ति तोड़फोड़)',
      UNAUTHORIZED_OCCUPANCY: 'Unauthorized Seat Occupancy (अवैध कब्जा)',
      FEE_DEFAULT_FRAUD: 'Severe Fee Fraud & Default (फीस धोखाधड़ी)',
      OTHER: 'Disciplinary Policy Violation',
    };
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>DISCIPLINARY EXPULSION ORDER - ${record.name}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; line-height: 1.5; }
            .header { text-align: center; border-bottom: 3px double #be123c; padding-bottom: 12px; margin-bottom: 20px; }
            .logo { font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #9f1239; text-transform: uppercase; }
            .subtitle { font-size: 12px; color: #475569; margin-top: 4px; }
            .badge-order { display: inline-block; background: #ffe4e6; color: #9f1239; font-weight: 700; font-size: 13px; padding: 4px 14px; border-radius: 999px; margin-top: 8px; border: 1px solid #fecdd3; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-bottom: 20px; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; }
            .meta-item { display: flex; flex-direction: column; }
            .meta-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
            .meta-val { font-size: 12px; font-weight: 600; color: #1e293b; margin-top: 2px; }
            .section-title { font-size: 13px; font-weight: 700; color: #9f1239; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px; }
            .desc-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 12px; font-size: 12px; color: #881337; margin-bottom: 14px; }
            .action-list { list-style: none; padding-left: 0; font-size: 12px; margin: 0; }
            .action-list li { padding: 4px 0; display: flex; align-items: center; gap: 6px; }
            .action-list li::before { content: "✖"; color: #e11d48; font-weight: bold; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 12px; }
            .sig-box { text-align: center; min-width: 180px; }
            .sig-line { border-top: 1px solid #0f172a; margin-top: 40px; padding-top: 4px; font-weight: 600; font-size: 11px; }
            .watermark { position: fixed; top: 40%; left: 20%; font-size: 60px; font-weight: 900; color: rgba(225, 29, 72, 0.06); transform: rotate(-30deg); text-transform: uppercase; pointer-events: none; }
          </style>
        </head>
        <body>
          <div class="watermark">BLACKLISTED</div>
          <div class="header">
            <div class="logo">Smart Library Network · Disciplinary Council</div>
            <div class="subtitle">Central Governance & Security Administration</div>
            <div class="badge-order">FORMAL EXPULSION & DISCIPLINARY ORDER</div>
          </div>
          <div class="meta-grid">
            <div class="meta-item"><span class="meta-label">Member Name</span><span class="meta-val">${record.name}</span></div>
            <div class="meta-item"><span class="meta-label">Registered Phone</span><span class="meta-val">${record.phone || '—'}</span></div>
            <div class="meta-item"><span class="meta-label">Incident Reference ID</span><span class="meta-val">${record.id}</span></div>
            <div class="meta-item"><span class="meta-label">Ban Scope</span><span class="meta-val" style="color: #e11d48;">${isNetwork ? 'NETWORK-WIDE (All Branches Barred)' : (record.branch || 'Single Branch')}</span></div>
            <div class="meta-item"><span class="meta-label">Disciplinary Category</span><span class="meta-val">${catLabels[record.category || ''] || record.category || 'INDISCIPLINE_MISCONDUCT'}</span></div>
            <div class="meta-item"><span class="meta-label">Effective Date</span><span class="meta-val">${record.blacklistedOn || '—'}</span></div>
            <div class="meta-item"><span class="meta-label">Previous Seat / Hall</span><span class="meta-val">${record.previousSeat || '—'}</span></div>
            <div class="meta-item"><span class="meta-label">Sanctioning Authority</span><span class="meta-val">${record.blacklistedBy || 'Chief Administrator'}</span></div>
          </div>

          <div class="section-title">Record of Violation & Disciplinary Findings</div>
          <div class="desc-box">
            <strong>Incident Report:</strong> ${record.reason}
            ${record.firRefNo ? `<div style="margin-top: 6px;"><strong>Police / Legal Reference:</strong> ${record.firRefNo}</div>` : ''}
            ${record.incidentLocation ? `<div><strong>Location:</strong> ${record.incidentLocation}</div>` : ''}
          </div>

          <div class="section-title">Enforced Administrative Sanctions</div>
          <ul class="action-list">
            <li><strong>Seat & Locker Revocation:</strong> Assigned seat (${record.previousSeat || 'Active Desk'}) and locker immediately reclaimed and vacated.</li>
            <li><strong>Biometric / RFID Bar:</strong> Turnstile QR and biometric entry immediately invalidated across ${isNetwork ? 'all network branches' : 'this branch'}.</li>
            <li><strong>Premises Restriction:</strong> The named individual is strictly barred from entering library premises or disturbing silent study zones.</li>
            <li><strong>Financial Compliance:</strong> Security caution deposit confiscated or retained against damages/settlement.</li>
          </ul>

          <div class="signatures">
            <div class="sig-box">
              <div class="sig-line">Branch Supervisor / Security In-charge</div>
            </div>
            <div class="sig-box">
              <div class="sig-line">Chief Administrative Officer</div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const notifyStudentWhatsApp = (record: AdminBlacklistRecord) => {
    const phone = (record.phone || '').replace(/\D/g, '');
    const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
    const isNetwork = record.banScope === 'NETWORK_WIDE' || !record.banScope;
    const scopeText = isNetwork ? 'ऑल ब्रांचेज नेटवर्क-वाइड (All Branches)' : `${record.branch || 'ब्रांच'}`;
    const message = `*आधिकारिक निष्कासन एवं ब्लैकलिस्ट सूचना (SMART LIBRARY)*\n\nप्रिय ${record.name},\nआपको सूचित किया जाता है कि अनुशासनहीनता / पुस्तकालय नियमों के उल्लंघन के कारण आपको तत्काल प्रभाव से ब्लैकलिस्ट व निष्कासित कर दिया गया है।\n\n• *कारण:* ${record.reason}\n• *प्रतिबंध का दायरा:* ${scopeText}\n• *सीट आवंटन:* तत्काल निरस्त (Vacated)\n• *बायोमेट्रिक प्रवेश:* ब्लॉक कर दिया गया है\n\nकिसी भी अनधिकृत प्रवेश का प्रयास कानूनी उल्लंघन माना जाएगा। किसी भी औपचारिक अपील के लिए केंद्रीय प्रशासन कार्यालय से संपर्क करें।\n- मुख्य सुरक्षा प्रशासक`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const columns = useMemo<readonly DataGridColumn<AdminBlacklistRecord>[]>(() => [
    { field: 'name', headerName: t('TABLE_STUDENT'), flex: 1.8, minWidth: 170, sortable: true },
    {
      field: 'banScope',
      headerName: 'Ban Scope',
      flex: 1.3,
      minWidth: 130,
      sortable: true,
      cellRenderer: ({ data }: DataGridCellParams<AdminBlacklistRecord>) => {
        const isNetwork = data.banScope === 'NETWORK_WIDE' || !data.banScope;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${isNetwork ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
            {isNetwork ? '🌐 Network-Wide' : `🏢 ${data.branch || 'Branch'}`}
          </span>
        );
      },
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1.4,
      minWidth: 140,
      sortable: true,
      cellRenderer: ({ data }: DataGridCellParams<AdminBlacklistRecord>) => {
        const cat = data.category || 'INDISCIPLINE_MISCONDUCT';
        const labels: Record<string, string> = {
          THEFT_STOLEN_PROPERTY: '🚨 Theft / Chori',
          INDISCIPLINE_MISCONDUCT: '⚡ Indiscipline',
          PHYSICAL_ALTERCATION: '⚠️ Altercation',
          PROPERTY_VANDALISM: '🔨 Vandalism',
          UNAUTHORIZED_OCCUPANCY: '🚫 Illegal Seat',
          FEE_DEFAULT_FRAUD: '💳 Fee Default',
          OTHER: '⚠️ Disciplinary',
        };
        return <span className="text-xs font-semibold text-slate-300">{labels[cat] || cat}</span>;
      },
    },
    { field: 'reason', headerName: t('TABLE_REASON'), flex: 2.2, minWidth: 200, sortable: true },
    { field: 'blacklistedOn', headerName: t('TABLE_DATE'), flex: 1, minWidth: 110, sortable: true, cellRenderer: ({ value }: DataGridCellParams<AdminBlacklistRecord>) => formatAdminBlacklistDate(typeof value === 'string' ? value : undefined, locale) },
    { field: 'previousSeat', headerName: t('TABLE_PREVIOUS_SEAT'), flex: 0.8, minWidth: 90, sortable: true },
    {
      field: 'status',
      headerName: t('TABLE_STATUS'),
      flex: 1,
      minWidth: 110,
      sortable: true,
      cellRenderer: ({ value }: DataGridCellParams<AdminBlacklistRecord>) => {
        if (value === 'Pardoned') {
          return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Pardoned</span>;
        }
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">{t('STATUS_BLACKLISTED')}</span>;
      },
    },
    {
      headerName: t('TABLE_ACTIONS'),
      minWidth: 110,
      sortable: false,
      cellRenderer: ({ data }: DataGridCellParams<AdminBlacklistRecord>) => (
        <button
          type="button"
          disabled={!isDemoMode}
          className="admin-btn-icon min-h-11 min-w-11 disabled:cursor-not-allowed disabled:opacity-50 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
          aria-label={t('REMOVE_ARIA', { name: data.name })}
          title={!isDemoMode ? t('LIVE_UNAVAILABLE') : undefined}
          onClick={() => setRemoveId(data.id)}
        >
          <X size={18} strokeWidth={2} />
        </button>
      ),
    },
  ], [isDemoMode, t, locale]);

  const errorMessage = recordsQuery.isError ? t('LOAD_ERROR') : null;
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const visibleRecords = useMemo(() => {
    if (isAllBranches || !selectedBranch) return records;
    return records.filter((r) =>
      !r.branch || r.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(r.branch.toLowerCase())
    );
  }, [records, isAllBranches, selectedBranch]);

  const selectedRecordDetails = selectedRecord ? [
    [t('TABLE_STUDENT'), selectedRecord.name],
    [t('PHONE_LABEL'), selectedRecord.phone],
    [t('TABLE_REASON'), selectedRecord.reason],
    [t('TABLE_BLACKLISTED_BY'), selectedRecord.blacklistedBy],
    [t('TABLE_DATE'), formatAdminBlacklistDate(selectedRecord.blacklistedOn, locale)],
    [t('TABLE_PREVIOUS_SEAT'), selectedRecord.previousSeat],
    [t('TABLE_STATUS'), selectedRecord.status],
  ] : [];

  const downloadBlacklistCsv = () => {
    const headers = ['Record ID', 'Student Name', 'Phone', 'Reason', 'Blacklisted By', 'Incident Date', 'Previous Seat', 'Branch', 'Status'];
    const rows = visibleRecords.map((r) => [
      `"${r.id}"`,
      `"${(r.name || '').replaceAll('"', '""')}"`,
      `"${r.phone || ''}"`,
      `"${(r.reason || '').replaceAll('"', '""')}"`,
      `"${(r.blacklistedBy || 'Admin Operations').replaceAll('"', '""')}"`,
      `"${r.blacklistedOn || ''}"`,
      `"${(r.previousSeat || '').replaceAll('"', '""')}"`,
      `"${(r.branch || 'Main Branch').replaceAll('"', '""')}"`,
      `"${r.status || 'Blacklisted'}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart-library-blacklist-report.csv';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${visibleRecords.length} blacklisted student records to CSV`);
  };

  const downloadBlacklistExcel = () => {
    const headers = ['Record ID', 'Student Name', 'Phone', 'Reason', 'Blacklisted By', 'Incident Date', 'Previous Seat', 'Branch', 'Status'];
    const rows = visibleRecords.map((r) => [
      r.id,
      r.name,
      r.phone || '—',
      r.reason,
      r.blacklistedBy || 'Admin Operations',
      r.blacklistedOn || '—',
      r.previousSeat || '—',
      r.branch || 'Main Branch',
      r.status || 'Blacklisted',
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Blacklist</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #881337; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #9f1239; text-align: left; }
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
    link.download = 'smart-library-blacklist-report.xls';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${visibleRecords.length} blacklist records to Excel (.xls)`);
  };

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="w-full space-y-6 text-text-primary pb-10">
        {!isDemoMode && <p role="status" className="rounded-xl border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
        
        {/* EXECUTIVE HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 shadow-lg shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{t('TITLE')}</h1>
              <p className="text-xs sm:text-sm text-slate-400">{t('SUBTITLE')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={downloadBlacklistCsv}
                disabled={visibleRecords.length === 0}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                title="Export Blacklist to CSV"
              >
                <Download size={14} className="text-rose-400" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={downloadBlacklistExcel}
                disabled={visibleRecords.length === 0}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                title="Export Blacklist to Excel"
              >
                <FileSpreadsheet size={14} className="text-emerald-400" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-rose-700 transition-all disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => { if (isDemoMode) setShowForm(true); }}
                disabled={!isDemoMode}
                title={!isDemoMode ? t('LIVE_UNAVAILABLE') : undefined}
              >
                <AlertOctagon size={16} strokeWidth={2} />
                <span>{t('ADD_ACTION')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Blacklisted',
              value: visibleRecords.length,
              icon: ShieldAlert,
              cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
              iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
              strokeColor: '#f87171',
              badgeBg: 'border-rose-500/30 bg-rose-500/15 text-rose-400',
              trend: 'Strict Restriction',
            },
            {
              label: 'Active Blocks',
              value: visibleRecords.filter((r) => r.status === 'Blacklisted' || !r.status).length,
              icon: UserX,
              cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
              iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
              strokeColor: '#fbbf24',
              badgeBg: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
              trend: 'Admission Prohibited',
            },
            {
              label: 'Revoked Seats',
              value: visibleRecords.filter((r) => r.previousSeat).length,
              icon: Lock,
              cardBorderBg: 'border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 shadow-purple-950/30',
              iconBox: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
              strokeColor: '#c084fc',
              badgeBg: 'border-purple-500/30 bg-purple-500/15 text-purple-400',
              trend: 'Recovered Desks',
            },
            {
              label: 'Scope Coverage',
              value: selectedBranch ? selectedBranch.code : 'All Branches',
              icon: Users,
              cardBorderBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30',
              iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
              strokeColor: '#22d3ee',
              badgeBg: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-400',
              trend: 'Policy Enforced',
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${kpi.cardBorderBg}`}
            >
              <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
                <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={kpi.strokeColor} strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="relative z-10 flex items-start justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{kpi.label}</span>
                <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${kpi.iconBox}`}>
                  <kpi.icon size={18} strokeWidth={2.2} />
                </div>
              </div>
              <div className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{kpi.value}</div>
              <div className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 flex items-center gap-1.5">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-xs ${kpi.badgeBg}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <AdminBlacklistRecordsSection
          records={visibleRecords}
          columns={columns}
          isLoading={recordsQuery.isPending}
          isError={recordsQuery.isError}
          errorMessage={errorMessage}
          onRetry={() => { void recordsQuery.refetch(); }}
          onRowClicked={setSelectedRecord}
        />

        {selectedRecord && (
          <section className="rounded-2xl border border-rose-500/30 bg-slate-900/80 backdrop-blur-xl p-5 md:p-6 shadow-2xl space-y-4" aria-labelledby="admin-blacklist-record-detail-title" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 id="admin-blacklist-record-detail-title" className="text-lg font-bold text-white tracking-tight">
                    {selectedRecord.name}
                  </h2>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${selectedRecord.status === 'Pardoned' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'}`}>
                    {selectedRecord.status === 'Pardoned' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                    {selectedRecord.status || 'Blacklisted'}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${(selectedRecord.banScope === 'NETWORK_WIDE' || !selectedRecord.banScope) ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
                    {(selectedRecord.banScope === 'NETWORK_WIDE' || !selectedRecord.banScope) ? '🌐 Network-Wide Bar' : `🏢 ${selectedRecord.branch || 'Branch Only'}`}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
                    {selectedRecord.category || 'INDISCIPLINE_MISCONDUCT'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Phone: {selectedRecord.phone} · Record Ref: {selectedRecord.id} · Logged: {formatAdminBlacklistDate(selectedRecord.blacklistedOn, locale)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => printDisciplinaryMemo(selectedRecord)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:text-white hover:bg-sky-500/20 transition-all shadow-sm"
                  title="Print Formal Disciplinary Memo"
                >
                  <Printer size={14} className="text-sky-400" />
                  <span>Print Expulsion Notice</span>
                </button>

                <button
                  type="button"
                  onClick={() => notifyStudentWhatsApp(selectedRecord)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all shadow-sm"
                  title="Send Notice via WhatsApp"
                >
                  <MessageSquare size={14} className="text-emerald-400" />
                  <span>WhatsApp Alert</span>
                </button>

                {selectedRecord.status !== 'Pardoned' && (
                  <button
                    type="button"
                    disabled={!isDemoMode}
                    onClick={() => { setPardonTarget(selectedRecord); setPardonReason(''); }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-500/20 transition-all shadow-sm disabled:opacity-40"
                    title="Pardon student and revoke ban"
                  >
                    <RotateCcw size={14} className="text-amber-400" />
                    <span>Pardon / Lift Ban</span>
                  </button>
                )}

                <button
                  type="button"
                  className="min-h-8 rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  onClick={() => setSelectedRecord(null)}
                >
                  {t('DETAILS_CLOSE')}
                </button>
              </div>
            </div>

            {/* Scope Alert Banner */}
            <div className={`rounded-xl border p-3.5 text-xs flex items-start gap-3 ${(selectedRecord.banScope === 'NETWORK_WIDE' || !selectedRecord.banScope) ? 'border-rose-500/40 bg-rose-950/30 text-rose-300' : 'border-amber-500/40 bg-amber-950/30 text-amber-300'}`}>
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">
                  {(selectedRecord.banScope === 'NETWORK_WIDE' || !selectedRecord.banScope) ? '🌐 Network-Wide Bar Enforced' : '🏢 Branch Bar Enforced'}
                </strong>
                <span>
                  {(selectedRecord.banScope === 'NETWORK_WIDE' || !selectedRecord.banScope)
                    ? 'Student is strictly prohibited from admission, seat reservation, or turnstile entry across ALL smart library network branches.'
                    : `Student is prohibited from entering ${selectedRecord.branch || 'this branch'}.`}
                </span>
              </div>
            </div>

            {/* Disciplinary Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Sanctioning Officer</span>
                <span className="text-xs font-semibold text-white mt-1 block">{selectedRecord.blacklistedBy || 'Admin'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Vacated Seat</span>
                <span className="text-xs font-semibold text-white mt-1 block">{selectedRecord.previousSeat || 'None / Not Allocated'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Turnstile & QR Entry</span>
                <span className="text-xs font-semibold text-rose-400 mt-1 block flex items-center gap-1">
                  <Lock size={12} /> Permanently Blocked
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Ban Duration</span>
                <span className="text-xs font-semibold text-amber-400 mt-1 block">{selectedRecord.banDuration || 'Permanent'}</span>
              </div>
            </div>

            {/* Violation Details */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">Incident Description & Findings</span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedRecord.reason}</p>
              {selectedRecord.firRefNo && (
                <div className="pt-2 text-xs text-rose-400 font-mono">
                  <strong>Police / FIR Reference:</strong> {selectedRecord.firRefNo}
                </div>
              )}
              {selectedRecord.pardonReason && (
                <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300">
                  <strong>Reinstatement / Pardon Record:</strong> {selectedRecord.pardonReason}
                  <span className="block mt-1 text-[11px] text-emerald-400/80">Approved by {selectedRecord.pardonedBy} on {selectedRecord.pardonDate}</span>
                </div>
              )}
            </div>
          </section>
        )}

        <>
          <AdminBlacklistFormDialog open={showForm} onOpenChange={setShowForm} onSubmit={(values: AdminBlacklistFormSchemaType) => submit(values)} isDemoMode={isDemoMode} />
          
          {/* Discard Dialog for Remove Confirmation */}
          <Dialog open={removeId !== null} onOpenChange={(open) => { if (!open) setRemoveId(null); }}>
            <DialogContent className="rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-6 text-white shadow-2xl">
              <DialogTitle className="text-base font-bold text-white tracking-tight">{t('REMOVE_TITLE')}</DialogTitle>
              <DialogDescription className="mt-2 text-xs text-slate-400">{t(isDemoMode ? 'REMOVE_DEMO_DESCRIPTION' : 'REMOVE_DESCRIPTION')}</DialogDescription>
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  onClick={() => setRemoveId(null)}
                >
                  {t('CANCEL')}
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!isDemoMode}
                  onClick={confirmRemove}
                >
                  {t('CONFIRM')}
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Pardon Student Modal */}
          <Dialog open={pardonTarget !== null} onOpenChange={(open) => { if (!open) setPardonTarget(null); }}>
            <DialogContent className="rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-6 text-white shadow-2xl max-w-md">
              <DialogTitle className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <RotateCcw size={18} className="text-emerald-400" />
                <span>Revoke Ban & Pardon Student</span>
              </DialogTitle>
              <DialogDescription className="mt-2 text-xs text-slate-300">
                Lifting the ban will reinstate member access and restore turnstile permissions for <strong>{pardonTarget?.name}</strong>.
              </DialogDescription>
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="admin-blacklist-pardon-reason" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                    Pardon Justification & Undertaking Note
                  </label>
                  <textarea maxLength={1000}
                    id="admin-blacklist-pardon-reason"
                    rows={3}
                    value={pardonReason}
                    onChange={(e) => setPardonReason(e.target.value)}
                    placeholder="e.g. Unconditional written apology submitted, full damages compensated, signed parent undertaking..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                  onClick={() => { setPardonTarget(null); setPardonReason(''); }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
                  disabled={!pardonReason.trim()}
                  onClick={() => {
                    if (pardonTarget) {
                      pardonStudent(pardonTarget.id, pardonReason);
                      setPardonTarget(null);
                      setPardonReason('');
                    }
                  }}
                >
                  Confirm & Reinstate Access
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      </div>
    </>
  );
}

// RESPONSIBILITY: AdminBlacklistFormDialog component owned by admin_blacklist; responsibility folder: admin_blacklist_form_dialog.

















/** Owns localized blacklist form state and accessible validation; does not perform persistence. */
export function AdminBlacklistFormDialog({ open, onOpenChange, onSubmit, isDemoMode }: AdminBlacklistFormDialogProps) {
  const t = useTranslations('ADMIN_BLACKLIST');
  const router = useRouter();
  const schema = useMemo(() => createAdminBlacklistFormSchema((key: AdminBlacklistValidationKey) => t(key)), [t]);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<AdminBlacklistFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: ADMIN_BLACKLIST_EMPTY_FORM,
  });

  useEffect(() => {
    if (!open) reset(ADMIN_BLACKLIST_EMPTY_FORM);
  }, [open, reset]);

  const handleBlockedNavigation = useCallback((href: string) => { setPendingNavigation(href); setConfirmDiscard(true); }, []);
  useAdminMembersBlacklistUnsavedChangesGuard(isDirty && open, isSubmitting, handleBlockedNavigation);

  const requestClose = () => {
    if (isDirty) { setConfirmDiscard(true); return; }
    onOpenChange(false);
  };
  const discardDraft = () => { setConfirmDiscard(false); reset(ADMIN_BLACKLIST_EMPTY_FORM); const destination = pendingNavigation; setPendingNavigation(null); onOpenChange(false); if (destination) router.push(destination); };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (nextOpen) onOpenChange(true); else requestClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert size={20} />
            </div>
            <div>
              <DialogTitle className="text-section-title font-semibold text-text-primary">{t('FORM_TITLE')}</DialogTitle>
              <p className="text-xs text-text-secondary mt-0.5">Network-Wide Disciplinary Expulsion & Blacklist Record</p>
            </div>
          </div>
          <button type="button" className="admin-btn-icon min-h-11 min-w-11" aria-label={t('CLOSE_FORM')} onClick={requestClose}><X size={18} strokeWidth={2} /></button>
        </div>
        <DialogDescription className="mt-2 text-xs text-text-secondary">{t('FORM_DESCRIPTION')}</DialogDescription>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-blacklist-name" className="admin-label">{t('NAME_LABEL')}</label>
              <input maxLength={30} id="admin-blacklist-name" {...register('name')} placeholder="Student Full Name" className="admin-input" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'admin-blacklist-name-error' : undefined} required autoComplete="name" />
              {errors.name && <p id="admin-blacklist-name-error" className="admin-error" role="alert">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="admin-blacklist-phone" className="admin-label">{t('PHONE_LABEL')}</label>
              <input
                id="admin-blacklist-phone"
                {...register('phone', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  },
                })}
                maxLength={10}
                placeholder="10-digit mobile"
                className="admin-input font-mono"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'admin-blacklist-phone-error' : undefined}
                required
                inputMode="tel"
                autoComplete="tel"
              />
              {errors.phone && <p id="admin-blacklist-phone-error" className="admin-error" role="alert">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Violation Category & Ban Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-blacklist-category" className="admin-label">
                Disciplinary Violation Category <span className="text-rose-400">*</span>
              </label>
              <select
                id="admin-blacklist-category"
                {...register('category')}
                defaultValue="THEFT_STOLEN_PROPERTY"
                className="admin-input"
              >
                <option value="THEFT_STOLEN_PROPERTY">🚨 Theft / Stolen Property (चोरी)</option>
                <option value="INDISCIPLINE_MISCONDUCT">⚡ Gross Indiscipline & Misconduct (अनुशासनहीनता)</option>
                <option value="PHYSICAL_ALTERCATION">⚠️ Physical Altercation / Threat (मारपीट/धमकी)</option>
                <option value="PROPERTY_VANDALISM">🔨 Property Damage & Vandalism (तोड़फोड़)</option>
                <option value="UNAUTHORIZED_OCCUPANCY">🚫 Unauthorized Occupancy / Proxy Seating (अवैध कब्जा)</option>
                <option value="FEE_DEFAULT_FRAUD">💳 Severe Fee Fraud / Fake Receipt (धोखाधड़ी)</option>
                <option value="OTHER">⚠️ Other Disciplinary Violation</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-blacklist-scope" className="admin-label">
                Enforcement Scope (प्रतिबंध का दायरा) <span className="text-rose-400">*</span>
              </label>
              <select
                id="admin-blacklist-scope"
                {...register('banScope')}
                defaultValue="NETWORK_WIDE"
                className="admin-input"
              >
                <option value="NETWORK_WIDE">🌐 Network-Wide Bar (All Library Branches)</option>
                <option value="BRANCH_SPECIFIC">🏢 Branch Specific Only (Current Branch)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-blacklist-duration" className="admin-label">
                Ban Duration (प्रतिबंध अवधि)
              </label>
              <select
                id="admin-blacklist-duration"
                {...register('banDuration')}
                defaultValue="PERMANENT"
                className="admin-input"
              >
                <option value="PERMANENT">Permanent / Indefinite Bar (आजीवन निष्कासन)</option>
                <option value="TEMPORARY_30_DAYS">Temporary (30 Days Suspension)</option>
                <option value="TEMPORARY_90_DAYS">Temporary (90 Days / 3 Months)</option>
                <option value="TEMPORARY_180_DAYS">Temporary (180 Days / 6 Months)</option>
                <option value="TEMPORARY_1_YEAR">Temporary (1 Year Expulsion)</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-blacklist-seat" className="admin-label">
                {t('PREVIOUS_SEAT_LABEL')} <span className="text-caption font-normal text-text-secondary">(Optional)</span>
              </label>
              <input maxLength={30} id="admin-blacklist-seat" {...register('previousSeat')} placeholder="e.g. A-04 or Desk 12" className="admin-input" />
            </div>
          </div>

          {/* Automatic Disciplinary Sanctions */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">
              Immediate Disciplinary Enforcement Actions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked {...register('revokeSeat')} className="rounded border-rose-500/40 text-rose-600 focus:ring-rose-500" />
                <span>Revoke & vacate assigned seat immediately</span>
              </label>
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked {...register('revokeLocker')} className="rounded border-rose-500/40 text-rose-600 focus:ring-rose-500" />
                <span>Revoke & reclaim locker allocation</span>
              </label>
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input type="checkbox" defaultChecked {...register('blockBiometric')} className="rounded border-rose-500/40 text-rose-600 focus:ring-rose-500" />
                <span>Lock turnstiles & biometric access network-wide</span>
              </label>
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input type="checkbox" {...register('confiscateDeposit')} className="rounded border-rose-500/40 text-rose-600 focus:ring-rose-500" />
                <span>Forfeit caution money towards damages</span>
              </label>
            </div>
          </div>

          {/* Incident Details & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-blacklist-location" className="admin-label">Incident Hall / Location</label>
              <input maxLength={30} id="admin-blacklist-location" {...register('incidentLocation')} placeholder="e.g. Silent Study Hall A, 2nd Floor" className="admin-input" />
            </div>
            <div>
              <label htmlFor="admin-blacklist-fir" className="admin-label">Police Complaint / FIR Ref (Optional)</label>
              <input maxLength={30} id="admin-blacklist-fir" {...register('firRefNo')} placeholder="e.g. FIR-2026-SEC-092" className="admin-input" />
            </div>
          </div>

          <div>
            <label htmlFor="admin-blacklist-reason" className="admin-label">{t('REASON_LABEL')}</label>
            <textarea maxLength={1000} id="admin-blacklist-reason" {...register('reason')} placeholder="Describe the violation, evidence, or eyewitness reports..." className="admin-textarea" aria-invalid={Boolean(errors.reason)} aria-describedby={errors.reason ? 'admin-blacklist-reason-error' : undefined} rows={3} required />
            {errors.reason && <p id="admin-blacklist-reason-error" className="admin-error" role="alert">{errors.reason.message}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button type="button" className="admin-btn-ghost min-h-11" onClick={requestClose}>{t('CANCEL')}</button>
            <button type="submit" className="admin-btn-danger min-h-11 disabled:cursor-not-allowed disabled:opacity-50" disabled={isSubmitting || !isDemoMode}><Save size={18} strokeWidth={2} /> Enforce Blacklist & Expel</button>
          </div>
        </form>
        {confirmDiscard && <div role="alertdialog" aria-modal="true" aria-labelledby="admin-blacklist-discard-title" className="mt-4 rounded-lg border border-warning-bg bg-card p-4"><h3 id="admin-blacklist-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3><p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p><div className="mt-4 flex justify-end gap-2"><button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button><button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button></div></div>}
      </DialogContent>
    </Dialog>
  );
}


export type { AdminBlacklistFormDialogProps };
