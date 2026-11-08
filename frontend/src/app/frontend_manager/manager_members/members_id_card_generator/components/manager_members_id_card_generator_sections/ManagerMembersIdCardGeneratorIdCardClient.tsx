'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, IdCard, MessageSquare, Printer, Search } from 'lucide-react';
import { toast } from 'sonner';
import StudentIdCard, { type IdCardData } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCard';
import { useManagerIdCardGeneratorFormatting } from '@/app/frontend_manager/manager_members/members_id_card_generator/hooks/useManagerMembersIdCardGeneratorFormatting';
import { useManagerIdCardGenerator } from '@/app/frontend_manager/manager_members/members_id_card_generator/hooks/useManagerMembersIdCardGenerator';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorTypes';
import { MANAGER_STUDENT_STATUS_ACTIVE, MANAGER_STUDENT_STATUS_SUSPENDED, MANAGER_STUDENT_STATUSES, MANAGER_STUDENT_SHIFTS, MANAGER_MEMBERS_ID_CARD_GENERATOR_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_members/members_id_card_generator/constants/ManagerMembersIdCardGeneratorConstants';
import { MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.url_config';
import { ManagerMembersIdCardGeneratorEmptyState } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_empty_states/ManagerMembersIdCardGeneratorEmptyState';
import { ManagerMembersIdCardBulkDispatchModal } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardBulkDispatchModal';

export function ManagerMembersIdCardGeneratorIdCardClient() {
  const tManagerUi = useTranslations('manager.manager_id_card_generator.ui');
  const { formatDate } = useManagerIdCardGeneratorFormatting();
  const { data: students = [], isPending, isError, isFetching, refetch } = useManagerIdCardGenerator();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id')?.trim() ?? '';
  const [selectedId, setSelectedId] = useState(requestedId);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  useEffect(() => {
    if (requestedId) setSelectedId(requestedId);
    else if (students.length > 0) setSelectedId((current) => current || students[0].smartId);
  }, [requestedId, students]);
  const selectStudent = (smartId: string) => {
    setSelectedId(smartId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('id', smartId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [shiftFilter, setShiftFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const pageSize = 6;

  // Dependency rationale: debounce the member lookup text (300ms) and cancel stale timers before recalculating the filtered card candidates.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const shiftLabels: Record<string, string> = useMemo(() => ({
    Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day'),
  }), [tManagerUi]);

  const filtered = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !value ||
        student.name.toLowerCase().includes(value) ||
        student.smartId.toLowerCase().includes(value) ||
        student.phone.toLowerCase().includes(value);

      const matchesShift =
        shiftFilter === 'All' ||
        student.shift === shiftFilter ||
        (student.shift && student.shift.includes(shiftFilter));

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && student.status === MANAGER_STUDENT_STATUS_ACTIVE) ||
        (statusFilter === 'Suspended' && student.status === MANAGER_STUDENT_STATUS_SUSPENDED) ||
        (statusFilter === 'Expired' && student.status !== MANAGER_STUDENT_STATUS_ACTIVE && student.status !== MANAGER_STUDENT_STATUS_SUSPENDED);

      return matchesSearch && matchesShift && matchesStatus;
    });
  }, [students, debouncedSearch, shiftFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const effectivePage = Math.min(page, totalPages - 1);
  const paginatedStudents = useMemo(() => filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize), [filtered, effectivePage, pageSize]);
  const selected = useMemo(() => students.find((student) => student.smartId === selectedId), [students, selectedId]);
  const bulkStudents = useMemo(() => students.filter((s) => bulkSelectedIds.includes(s.smartId)), [students, bulkSelectedIds]);

  const toggleSelectOne = (smartId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBulkSelectedIds((prev) => prev.includes(smartId) ? prev.filter((id) => id !== smartId) : [...prev, smartId]);
  };

  const toggleSelectAll = () => {
    if (bulkSelectedIds.length === filtered.length) setBulkSelectedIds([]);
    else setBulkSelectedIds(filtered.map((s) => s.smartId));
  };
  const cardData: IdCardData | null = useMemo(() => {
    if (!selected) return null;
    return {
      name: selected.name, smartId: selected.smartId, phone: selected.phone, shift: selected.shift, seat: selected.seat,
      locker: (selected as any).locker || '', plan: selected.plan, status: selected.status, joinDate: formatDate(selected.joined),
      expiryDate: (selected as any).expiryDate, branch: selected.branch || 'Central Library', college: (selected as unknown as { college?: string }).college,
    };
  }, [selected, formatDate]);

  const handleShareWhatsApp = () => {
    if (!selected) return;
    const digits = selected.phone.replace(/\D/g, '');
    const clean10 = digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits;
    const targetPhone = digits.length === 10 ? `91${digits}` : digits;
    const msg = encodeURIComponent(
      `Hello ${selected.name},\nYour Library Smart ID Card is ready!\n\nSmart ID: ${selected.smartId}\nShift: ${selected.shift}\nAssigned Seat: ${selected.seat}\nPlan: ${selected.plan}\n\nPlease keep this card details handy while visiting the library.\n— Central Library Management`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank');
    if (popup) popup.opener = null;
    toast.success(`Smart ID card WhatsApp link opened for ${selected.name} (+91 ${clean10})`);
  };

  if (isError) return <div className="mgr-page"><div className="mgr-state-card mgr-state-card-error" role="alert"><p className="mgr-state-title">{tManagerUi('unable_to_load_students')}</p><p className="mgr-state-description">{tManagerUi('please_retry_from_the_students_directory')}</p><button type="button" className="mgr-btn-primary mgr-btn-sm mt-3" onClick={() => { void refetch(); }} disabled={isFetching}>{isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}</button></div></div>;

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <Link href={MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.LIST} className="mgr-back-link">
            <ArrowLeft size={18} strokeWidth={2} /> {tManagerUi('back_to_students_6de7b0')}
          </Link>
          <h1 className="mgr-page-title">{tManagerUi('id_card_generator')}</h1>
          <p className="mgr-page-subtitle">{tManagerUi('search_select_preview_only_until_authoritative_card_contract_is_supplied')}</p>
        </div>
      </div>
      <div className="mgr-idcard-page-layout">
        <div>
          <div className="mgr-card">
            <div className="mgr-card-header flex items-center justify-between">
              <h2 className="mgr-section-title"><IdCard size={18} strokeWidth={2} /> {tManagerUi('select_student')}</h2>
              <div className="flex items-center gap-2">
                {bulkSelectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(true)}
                    data-testid="manager-id-card-bulk-whatsapp-btn"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                    title="Send selected ID cards via WhatsApp"
                  >
                    <MessageSquare size={13} />
                    <span>Bulk WhatsApp ({bulkSelectedIds.length})</span>
                  </button>
                )}
                {selected && <span className="mgr-badge mgr-badge--success"><CheckCircle2 size={18} strokeWidth={2} /> {selected.name}</span>}
              </div>
            </div>
            <div className="mgr-card-body">
              <div className="flex items-center gap-2 mb-2">
                <div className="mgr-input-icon-wrap flex-1">
                  <Search size={16} strokeWidth={2} className="mgr-input-icon" />
                  <label className="sr-only" htmlFor="manager-id-card-search">{tManagerUi('search_students')}</label>
                  <input id="manager-id-card-search" className="mgr-input mgr-input-with-icon text-xs py-1.5" placeholder={tManagerUi('search_name_smart_id_phone')} value={search} onChange={(event) => setSearch(event.target.value)} />
                </div>
                {filtered.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border bg-surface hover:bg-surface-hover text-secondary whitespace-nowrap transition-colors"
                  >
                    {bulkSelectedIds.length === filtered.length ? 'Deselect All' : `Select All (${filtered.length})`}
                  </button>
                )}
              </div>

              {/* Multi-Dimensional Filter Bar: Shift & Status */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <select
                  aria-label="Filter by Shift"
                  data-testid="manager-id-card-shift-filter"
                  value={shiftFilter}
                  onChange={(e) => { setShiftFilter(e.target.value); setPage(0); }}
                  className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-primary font-medium"
                >
                  <option value="All">{tManagerUi('all_shifts')}</option>
                  {MANAGER_STUDENT_SHIFTS.map((shift) => (
                    <option key={shift} value={shift}>{shiftLabels[shift] ?? shift}</option>
                  ))}
                </select>

                <select
                  aria-label="Filter by Status"
                  data-testid="manager-id-card-status-filter"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                  className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-primary font-medium"
                >
                  <option value="All">{tManagerUi('all_status')}</option>
                  {MANAGER_STUDENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status === MANAGER_STUDENT_STATUS_ACTIVE ? tManagerUi('status_active') : status === MANAGER_STUDENT_STATUS_SUSPENDED ? tManagerUi('status_suspended') : tManagerUi('status_expired')}
                    </option>
                  ))}
                </select>
              </div>

              {requestedId && !isPending && !selected && <p className="mgr-input-hint" role="alert" data-testid="manager-student-id-card-request-not-found">{tManagerUi('no_loaded_student_matches_the_requested_smart_id')}{requestedId}{tManagerUi('no_other_student_s_card_has_been_selected')}</p>}
              <div className="mgr-idcard-student-list">
                {isPending ? <div className="mgr-loading-state">{tManagerUi('loading_students_522ba5')}</div> : filtered.length === 0 ? <ManagerMembersIdCardGeneratorEmptyState className="mgr-empty-state"><div className="mgr-empty-icon"><Search size={36} strokeWidth={2} /></div><p className="mgr-empty-title">{tManagerUi('no_students_found')}</p></ManagerMembersIdCardGeneratorEmptyState> : paginatedStudents.map((student: ManagerStudent) => {
                  const initials = student.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
                  const statusLabel = student.status === MANAGER_STUDENT_STATUS_ACTIVE ? tManagerUi('status_active') : student.status === MANAGER_STUDENT_STATUS_SUSPENDED ? tManagerUi('status_suspended') : tManagerUi('status_expired');
                  const isChecked = bulkSelectedIds.includes(student.smartId);
                  return (
                    <div
                      key={student.smartId}
                      onClick={() => selectStudent(student.smartId)}
                      className={`mgr-idcard-student-row flex items-center gap-2 cursor-pointer${student.smartId === selectedId ? ' mgr-idcard-student-row--active' : ''}${isChecked ? ' bg-primary-subtle' : ''}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={student.smartId === selectedId}
                      onKeyDown={(e) => {
                        if ((e.target as HTMLElement).tagName === 'INPUT') return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectStudent(student.smartId);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleSelectOne(student.smartId, e as unknown as React.MouseEvent)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 shrink-0"
                        aria-label={`Select ${student.name} for bulk ID card dispatch`}
                      />
                      <div className="mgr-avatar-sm shrink-0">{initials}</div>
                      <div className="mgr-idcard-student-info flex-1 min-w-0">
                        <p className="mgr-cell-name truncate">{student.name}</p>
                        <p className="mgr-cell-sub truncate">{student.smartId} · {shiftLabels[student.shift] ?? student.shift} · {student.seat}</p>
                      </div>
                      <span className={`shrink-0 ${student.status === MANAGER_STUDENT_STATUS_ACTIVE ? 'mgr-badge mgr-badge--success' : student.status === MANAGER_STUDENT_STATUS_SUSPENDED ? 'mgr-badge mgr-badge--warning' : 'mgr-badge mgr-badge--danger'}`}>{statusLabel}</span>
                    </div>
                  );
                })}
              </div>

              {/* ID Card List Pagination Footer */}
              {filtered.length > pageSize && (
                <div className="flex items-center justify-between border-t border-border pt-3 mt-3 text-xs text-secondary">
                  <span>
                    {effectivePage * pageSize + 1}–{Math.min((effectivePage + 1) * pageSize, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={effectivePage <= 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      className="px-2 py-1 rounded border border-border bg-surface text-secondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    <span className="px-1 font-medium text-primary">
                      {effectivePage + 1}/{totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={effectivePage >= totalPages - 1}
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      className="px-2 py-1 rounded border border-border bg-surface text-secondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {selected && cardData && <div className="mgr-card mgr-idcard-actions-card"><div className="mgr-card-header"><h2 className="mgr-section-title">{tManagerUi('actions')}</h2></div><div className="mgr-card-body mgr-idcard-actions-body"><p className="mgr-input-hint" role="status" data-testid="manager-students-id-card-output-contract-warning">{tManagerUi('id_card_preview_only_contract_warning')}</p><button type="button" onClick={handleShareWhatsApp} data-testid="manager-students-id-card-whatsapp-share" title="Share ID Card via WhatsApp" aria-label="Share ID Card via WhatsApp" className="mgr-btn-whatsapp cursor-pointer flex items-center justify-center gap-2"><MessageSquare size={18} strokeWidth={2} /> <span>Share via WhatsApp</span></button><button type="button" onClick={() => window.print()} title={tManagerUi('print_id_card')} aria-label={tManagerUi('print_id_card')} className="mgr-btn-ghost mgr-btn-full" data-testid="manager-students-id-card-print"><Printer size={18} strokeWidth={2} /> {tManagerUi('print_id_card')}</button></div></div>}
        </div>
        <div className="mgr-idcard-preview-panel">
          {cardData ? <><p className="mgr-page-subtitle mgr-idcard-preview-label">{tManagerUi('preview')} {selected?.name}</p><StudentIdCard data={cardData} /><p className="mgr-cell-sub mgr-idcard-preview-hint">{tManagerUi('use_preview_only_until_validity_and_verification_contract_is_supplied')}</p></> : <div className="mgr-card mgr-idcard-empty-card"><div className="mgr-empty-state"><div className="mgr-empty-icon"><IdCard size={40} strokeWidth={2} /></div><p className="mgr-empty-title">{tManagerUi('no_student_selected')}</p><p className="mgr-empty-sub">{tManagerUi('search_and_select_a_student_to_preview_the_id_card')}</p></div></div>}
        </div>
      </div>

      <ManagerMembersIdCardBulkDispatchModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        students={bulkStudents}
        onComplete={() => {
          setIsBulkModalOpen(false);
          setBulkSelectedIds([]);
        }}
      />
    </div>
  );
}
