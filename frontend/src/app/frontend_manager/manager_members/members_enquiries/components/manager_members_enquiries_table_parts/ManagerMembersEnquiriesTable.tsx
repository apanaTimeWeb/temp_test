'use client';
import { useLocale, useTranslations } from 'next-intl';

import { ManagerMembersEnquiriesMobileCards } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_table_parts/ManagerMembersEnquiriesMobileCards';
import {
  ManagerMembersEnquiriesShiftBadge,
  ManagerMembersEnquiriesStatusBadge,
  ManagerMembersEnquiriesTablePagination,
} from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_table_parts/ManagerMembersEnquiriesTableBadges';
import { ManagerMembersEnquiriesLostReasonModal } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesLostReasonModal';
import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import type { ManagerMembersEnquiriesTableProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
import type { ManagerMembersEnquiriesEnquiry, ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { formatManagerEnquiriesDisplayDate, getManagerEnquiriesDemoPassWhatsAppUrl, maskManagerEnquiriesPhone } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { writeBrowserSessionStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Eye,
  MessageCircle,
  PhoneCall,
  Plus,
  User,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react';

export function ManagerMembersEnquiriesTable({
  filtered,
  selectedIds = [],
  onToggleSelectOne,
  onToggleSelectAll,
  onQuickWhatsApp,
  onMarkLost,
}: ManagerMembersEnquiriesTableProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const locale = useLocale();
  const router = useRouter();
  const statusLabels: Record<ManagerMembersEnquiriesEnquiryStatus, string> = {
    New: tManagerUi('new'),
    Visited: tManagerUi('visited'),
    Interested: tManagerUi('interested'),
    Converted: tManagerUi('converted'),
    Lost: tManagerUi('lost'),
  };
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('shift_morning'),
    Afternoon: tManagerUi('shift_afternoon'),
    Evening: tManagerUi('shift_evening'),
    Night: tManagerUi('shift_night'),
    'Full Day': tManagerUi('shift_full_day'),
    'Not specified': tManagerUi('not_specified'),
  };

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [lostModalEnquiry, setLostModalEnquiry] = useState<ManagerMembersEnquiriesEnquiry | null>(null);

  type EnqSortField = 'name' | 'phone' | 'shift' | 'status' | 'handledBy' | 'addedDate';
  const [sortField, setSortField] = useState<EnqSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: EnqSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEnquiries = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortField] ?? '');
      const bVal = String(b[sortField] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  if (filtered.length === 0) {
    return (
      <div className="menq-surface-card rounded-2xl border p-12 text-center shadow-xl">
        <PhoneCall size={44} className="text-indigo-400 mx-auto mb-4 opacity-80" />
        <p className="text-white font-bold text-lg mb-2">{tManagerUi('no_enquiries_found')}</p>
        <p className="text-slate-400 text-sm mb-6">{tManagerUi('try_a_different_search_or_status_filter')}</p>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-950/50 motion-safe:transition-all cursor-pointer"
          onClick={() => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADD)}
        >
          <Plus size={16} /> {tManagerUi('add_enquiry')}
        </button>
      </div>
    );
  }

  const totalRows = sortedEnquiries.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedEnquiries.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const renderSortableHeader = (field: EnqSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="p-3.5">
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 rounded px-1 -mx-1 motion-safe:transition-colors"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-indigo-400 font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-indigo-400 font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-indigo-400/40 group-hover:text-indigo-300 motion-safe:transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  const openDetails = (id: string) => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.DETAIL(id));

  const handleRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetails(id);
    }
  };

  const handleQuickConvert = (e: MouseEvent, enq?: ManagerMembersEnquiriesEnquiry) => {
    e.stopPropagation();
    if (enq) {
      try {
        const payload = JSON.stringify({
          enquiryId: enq.id,
          name: enq.name,
          phone: enq.phone,
          shift: enq.shift,
          source: enq.source,
          preferredBranch: enq.preferredBranch,
        });
        writeBrowserSessionStorageItem('manager_pending_enquiry_conversion', payload);
        writeBrowserSessionStorageItem('enquiry_conversion_prefill', payload);
        writeBrowserSessionStorageItem('new_admission_prefill', payload);
        writeBrowserStorageItem('manager_pending_enquiry_conversion', payload);
        writeBrowserStorageItem('enquiry_conversion_prefill', payload);
      } catch {
        // Storage fallback
      }
      router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADMISSION_CONVERSION(enq.id));
      return;
    }
    router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADMISSION_CONVERSION());
  };

  const handleSendWhatsApp = (e: MouseEvent, enq: ManagerMembersEnquiriesEnquiry) => {
    e.stopPropagation();
    if (onQuickWhatsApp) {
      onQuickWhatsApp(enq);
      return;
    }
    const url = getManagerEnquiriesDemoPassWhatsAppUrl(enq);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  const renderShiftBadge = (shift: string) => (
    <ManagerMembersEnquiriesShiftBadge shift={shift} shiftLabels={shiftLabels} />
  );

  const renderStatusBadge = (status: ManagerMembersEnquiriesEnquiryStatus, lostReason?: string) => (
    <span className="inline-flex items-center">
      <ManagerMembersEnquiriesStatusBadge status={status} statusLabels={statusLabels} lostReason={lostReason} />
      {status !== 'Lost' && lostReason && (
        <span className="sr-only">{lostReason}</span>
      )}
    </span>
  );

  return (
    <>
      <div className="menq-surface-card rounded-2xl border backdrop-blur-md overflow-hidden shadow-xl">
      {/* Mobile Card List View */}
      <ManagerMembersEnquiriesMobileCards
        paginated={paginated}
        effectivePage={effectivePage}
        pageSize={pageSize}
        selectedIds={selectedIds}
        onToggleSelectOne={onToggleSelectOne}
        onOpenDetails={openDetails}
        onQuickConvert={(e, enq) => handleQuickConvert(e, enq)}
        onSendWhatsApp={handleSendWhatsApp}
        onMarkLost={(enq) => setLostModalEnquiry(enq)}
        shiftLabels={shiftLabels}
        statusLabels={statusLabels}
        locale={locale}
      />

      {/* Desktop Responsive Table View */}
      <div className="crm-table-wrap overflow-x-auto">
        <table className="crm-table w-full text-left border-collapse">
          <thead>
            <tr className="menq-table-head-row border-b text-indigo-300 text-xs uppercase font-bold tracking-wider">
              <th className="p-3.5 w-14 text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                Sr. No.
              </th>
              {renderSortableHeader('name', tManagerUi('name'))}
              {renderSortableHeader('phone', tManagerUi('phone'))}
              {renderSortableHeader('shift', tManagerUi('shift'))}
              {renderSortableHeader('status', tManagerUi('status'))}
              {renderSortableHeader('handledBy', tManagerUi('handled_by'))}
              {renderSortableHeader('addedDate', tManagerUi('date_added'))}
              <th className="p-3.5 text-xs font-bold uppercase tracking-wider text-slate-300">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((enq, idx) => (
              <tr
                key={enq.id}
                onClick={() => openDetails(enq.id)}
                onKeyDown={(e) => handleRowKeyDown(e, enq.id)}
                tabIndex={0}
                role="link"
                aria-label={`${tManagerUi('view_details')}: ${enq.name}`}
                className="menq-table-body-row border-b last:border-0 h-14 cursor-pointer motion-safe:transition-colors text-slate-200"
              >
                <td className="p-3.5 text-slate-400 font-semibold text-xs">{effectivePage * pageSize + idx + 1}</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/35 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">{enq.avatar}</div>
                    <span className="font-semibold text-slate-100">{enq.name}</span>
                  </div>
                </td>
                <td className="p-3.5 font-mono text-sm text-slate-300">{maskManagerEnquiriesPhone(enq.phone)}</td>
                <td className="p-3.5">{renderShiftBadge(enq.shift)}</td>
                <td className="p-3.5">{renderStatusBadge(enq.status, enq.lostReason)}</td>
                <td className="p-3.5 text-slate-300 text-xs">
                  <div className="inline-flex items-center gap-1.5"><User size={13} className="text-indigo-400" /><span>{enq.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enq.handledBy}</span></div>
                </td>
                <td className="p-3.5 text-slate-300 text-xs">
                  <div className="inline-flex items-center gap-1.5"><Calendar size={13} className="text-slate-400" /><span>{formatManagerEnquiriesDisplayDate(enq.addedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}</span></div>
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 hover:border-emerald-400 hover:scale-105 active:scale-95 shadow-sm shadow-emerald-950/50 motion-safe:transition-all cursor-pointer" aria-label={`WhatsApp ${enq.name}`} title={`WhatsApp chat with ${enq.name}`} onClick={(e) => handleSendWhatsApp(e, enq)}><MessageCircle size={15} /></button>
                    <button type="button" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/35 hover:text-sky-200 hover:border-sky-400 hover:scale-105 active:scale-95 shadow-sm shadow-sky-950/50 motion-safe:transition-all cursor-pointer" aria-label={tManagerUi('view_details')} title={tManagerUi('view_details')} onClick={(e) => { e.stopPropagation(); router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.DETAIL(enq.id)); }}><Eye size={14} /></button>
                    <button type="button" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/35 hover:text-indigo-200 hover:border-indigo-400 hover:scale-105 active:scale-95 shadow-sm shadow-indigo-950/50 motion-safe:transition-all cursor-pointer" aria-label={tManagerUi('convert_to_admission')} title={tManagerUi('convert_to_admission')} onClick={(e) => handleQuickConvert(e, enq)}><CheckCircle size={14} /></button>
                    <button type="button" className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 motion-safe:transition-all shadow-sm shadow-rose-950/50 ${enq.status === 'Lost' ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-500/35 hover:text-rose-200 hover:border-rose-400 hover:scale-105 active:scale-95 cursor-pointer opacity-80 hover:opacity-100'}`} title={enq.status === 'Lost' ? tManagerUi('already_marked_lost') : 'Mark Enquiry as Lost'} aria-label={enq.status === 'Lost' ? tManagerUi('already_marked_lost') : 'Mark Enquiry as Lost'} disabled={enq.status === 'Lost'} onClick={(e) => { e.stopPropagation(); setLostModalEnquiry(enq); }}><XCircle size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ManagerMembersEnquiriesTablePagination
        startItem={startItem}
        endItem={endItem}
        totalRows={totalRows}
        pageSize={pageSize}
        effectivePage={effectivePage}
        pageCount={pageCount}
        onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
        onPageChange={setPage}
      />
    </div>

    {/* Lost Reason Modal (Rendered outside the overflow-hidden table container) */}
    <ManagerMembersEnquiriesLostReasonModal
        isOpen={Boolean(lostModalEnquiry)}
        onClose={() => setLostModalEnquiry(null)}
        enquiry={lostModalEnquiry}
        onConfirm={(reason, notes) => {
          if (lostModalEnquiry && onMarkLost) {
            onMarkLost(lostModalEnquiry.id, reason, notes);
          }
        }}
      />
    </>
  );
}
