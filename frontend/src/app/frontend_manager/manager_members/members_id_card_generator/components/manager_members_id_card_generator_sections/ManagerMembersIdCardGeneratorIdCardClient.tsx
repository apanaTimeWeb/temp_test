'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  CreditCard,
  Grid,
  IdCard,
  Layers,
  Maximize2,
  MessageSquare,
  Printer,
  RotateCw,
  Scissors,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import StudentIdCard, {
  type IdCardData,
  type IdCardSide,
  type IdCardPrintLayout,
} from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCard';
import { ManagerMembersIdCardGeneratorStudentIdCardBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardBack';
import { useManagerIdCardGeneratorFormatting } from '@/app/frontend_manager/manager_members/members_id_card_generator/hooks/useManagerMembersIdCardGeneratorFormatting';
import { useManagerIdCardGenerator } from '@/app/frontend_manager/manager_members/members_id_card_generator/hooks/useManagerMembersIdCardGenerator';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorTypes';
import { MANAGER_STUDENT_STATUS_ACTIVE, MANAGER_STUDENT_STATUS_SUSPENDED, MANAGER_STUDENT_STATUSES, MANAGER_STUDENT_SHIFTS, MANAGER_MEMBERS_ID_CARD_GENERATOR_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_members/members_id_card_generator/constants/ManagerMembersIdCardGeneratorConstants';
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
  const [printLayout, setPrintLayout] = useState<IdCardPrintLayout>('pvc_single');
  const [cardSide, setCardSide] = useState<IdCardSide>('front');
  const [tileAllSlots, setTileAllSlots] = useState(true);
  const [isPopPreviewOpen, setIsPopPreviewOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState<'100' | '133' | '150'>('133');
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
  const getStudentCardData = useMemo(() => {
    return (s: ManagerStudent): IdCardData => ({
      name: s.name,
      smartId: s.smartId,
      phone: s.phone,
      shift: s.shift,
      seat: s.seat,
      locker: s.locker || '',
      plan: s.plan,
      status: s.status,
      joinDate: formatDate(s.joined),
      expiryDate: (s as any).expiryDate,
      branch: s.branch || 'Central Library',
      college: (s as unknown as { college?: string }).college,
      wifiSsid: 'Central_Library_5G',
      wifiPassword: 'Study@Silent2026',
      emergencyPhone: '+91 98765 00000',
      helpdeskPhone: '+91 98765 43210',
    });
  }, [formatDate]);

  const cardData: IdCardData | null = useMemo(() => {
    if (!selected) return null;
    return getStudentCardData(selected);
  }, [selected, getStudentCardData]);

  const a4Capacity = printLayout === 'a4_sheet_8' ? 8 : 10;
  const a4Cards: IdCardData[] = useMemo(() => {
    if (bulkStudents.length > 0) {
      return bulkStudents.slice(0, a4Capacity).map(getStudentCardData);
    }
    if (!cardData) return [];
    if (tileAllSlots) {
      return Array.from({ length: a4Capacity }, () => cardData);
    }
    return [cardData];
  }, [bulkStudents, a4Capacity, cardData, tileAllSlots, getStudentCardData]);

  const handleShareWhatsApp = () => {
    if (!selected) return;
    let digits = selected.phone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    const clean10 = digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits;
    const targetPhone = digits.length === 10 ? `91${digits}` : digits;
    const msg = encodeURIComponent(
      `Hello ${selected.name},\nYour Library Smart ID Card is ready!\n\nSmart ID: ${selected.smartId}\nShift: ${selected.shift}\nAssigned Seat: ${selected.seat}\nPlan: ${selected.plan}\n\nPlease keep this card details handy while visiting the library.\n— Central Library Management`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`Smart ID card WhatsApp link opened for ${selected.name} (+91 ${clean10})`);
  };

  if (isError) return <div className="mgr-page"><div className="mgr-state-card mgr-state-card-error" role="alert"><p className="mgr-state-title">{tManagerUi('unable_to_load_students')}</p><p className="mgr-state-description">{tManagerUi('please_retry_from_the_students_directory')}</p><button type="button" className="mgr-btn-primary mgr-btn-sm mt-3" onClick={() => { void refetch(); }} disabled={isFetching}>{isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}</button></div></div>;

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
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
          {selected && cardData && (
            <div className="mgr-card mgr-idcard-actions-card">
              <div className="mgr-card-header">
                <h2 className="mgr-section-title">{tManagerUi('actions')}</h2>
              </div>
              <div className="mgr-card-body mgr-idcard-actions-body">
                <p className="mgr-input-hint" role="status" data-testid="manager-students-id-card-output-contract-warning">
                  {tManagerUi('id_card_preview_only_contract_warning')}
                </p>

                {/* Print Layout Selector */}
                <div className="space-y-1.5 p-3 rounded-xl bg-surface border border-border">
                  <label
                    htmlFor="manager-id-card-layout-select"
                    className="text-xs font-bold text-foreground flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers size={13} className="text-primary" />
                      <span>Print Format / Layout</span>
                    </span>
                    <span className="text-[10px] text-primary font-mono font-bold uppercase">
                      {printLayout === 'pvc_single' ? 'CR-80 Thermal' : printLayout === 'a4_sheet_8' ? 'A4 (2x4 Grid)' : 'A4 (2x5 Grid)'}
                    </span>
                  </label>
                  <select
                    id="manager-id-card-layout-select"
                    data-testid="manager-id-card-layout-select"
                    value={printLayout}
                    onChange={(e) => setPrintLayout(e.target.value as IdCardPrintLayout)}
                    className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-border bg-card text-foreground font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="pvc_single">Single PVC Card (CR-80 / Thermal)</option>
                    <option value="a4_sheet_8">A4 Paper Sheet (8 Cards - 2×4 Grid)</option>
                    <option value="a4_sheet_10">A4 Paper Sheet (10 Cards - 2×5 Grid)</option>
                  </select>
                  <p className="text-[10px] text-secondary leading-tight">
                    {printLayout === 'pvc_single'
                      ? 'Calibrated for CR-80 PVC thermal card printers (85.6mm × 54mm).'
                      : printLayout === 'a4_sheet_8'
                      ? 'Standard A4 sheet with 8 card slots (2×4) & scissor cut guides for lamination.'
                      : 'Compact A4 sheet with 10 card slots (2×5) & scissor cut guides.'}
                  </p>
                </div>

                {/* Card Side to Print Selector */}
                <div className="space-y-1.5 p-3 rounded-xl bg-surface border border-border">
                  <label
                    className="text-xs font-bold text-foreground flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <RotateCw size={13} className="text-primary" />
                      <span>Card Side to Print</span>
                    </span>
                    <span className="text-[10px] text-secondary font-semibold capitalize">
                      {cardSide === 'both' ? 'Both (Duplex)' : `${cardSide} only`}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-card border border-border text-xs" data-testid="manager-id-card-side-select">
                    <button
                      type="button"
                      onClick={() => setCardSide('front')}
                      data-testid="manager-id-card-side-front-btn"
                      className={`py-1 px-1.5 rounded-md font-semibold text-[11px] transition-colors cursor-pointer text-center ${
                        cardSide === 'front' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'
                      }`}
                    >
                      Front
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardSide('back')}
                      data-testid="manager-id-card-side-back-btn"
                      className={`py-1 px-1.5 rounded-md font-semibold text-[11px] transition-colors cursor-pointer text-center ${
                        cardSide === 'back' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'
                      }`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardSide('both')}
                      data-testid="manager-id-card-side-both-btn"
                      className={`py-1 px-1.5 rounded-md font-semibold text-[11px] transition-colors cursor-pointer text-center ${
                        cardSide === 'both' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'
                      }`}
                    >
                      Both
                    </button>
                  </div>
                </div>

                {/* WhatsApp Share Button */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  data-testid="manager-students-id-card-whatsapp-share"
                  title="Share ID Card via WhatsApp"
                  aria-label="Share ID Card via WhatsApp"
                  className="mgr-btn-whatsapp cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} strokeWidth={2} /> <span>Share via WhatsApp</span>
                </button>

                {/* Pop-up Preview Button */}
                <button
                  type="button"
                  onClick={() => setIsPopPreviewOpen(true)}
                  data-testid="manager-students-id-card-popup-preview"
                  title="Open Pop-up Preview (85.60 mm × 53.98 mm)"
                  aria-label="Open Pop-up Preview"
                  className="mgr-btn-ghost mgr-btn-full flex items-center justify-center gap-2 font-bold cursor-pointer text-xs py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-foreground transition-colors"
                >
                  <Maximize2 size={16} strokeWidth={2} />
                  <span>Pop-up Preview (CR-80)</span>
                </button>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  title={tManagerUi('print_id_card')}
                  aria-label={tManagerUi('print_id_card')}
                  className="mgr-btn-ghost mgr-btn-full flex items-center justify-center gap-2 font-bold cursor-pointer"
                  data-testid="manager-students-id-card-print"
                >
                  <Printer size={18} strokeWidth={2} />
                  <span>
                    {bulkSelectedIds.length > 1
                      ? `Print ${bulkSelectedIds.length} Selected Cards`
                      : printLayout === 'pvc_single'
                      ? `${tManagerUi('print_id_card')} (PVC)`
                      : `Print A4 Sheet (${printLayout === 'a4_sheet_8' ? '8' : '10'} Cards)`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mgr-idcard-preview-panel">
          {cardData ? (
            <>
              <div className="flex items-center justify-between w-full no-print bg-surface p-2.5 rounded-xl border border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="mgr-page-subtitle mgr-idcard-preview-label mb-0 font-bold">{tManagerUi('preview')} {selected?.name}</p>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    85.60 mm × 53.98 mm (8.56 cm × 5.4 cm)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Zoom Scale Selector */}
                  {printLayout === 'pvc_single' && (
                    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-card border border-border text-[10px] font-semibold text-secondary">
                      <button
                        type="button"
                        onClick={() => setPreviewScale('100')}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                          previewScale === '100' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'hover:text-foreground'
                        }`}
                        title="100% 1:1 Physical Print Size (85.60 mm × 53.98 mm)"
                      >
                        100%
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewScale('133')}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                          previewScale === '133' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'hover:text-foreground'
                        }`}
                        title="133% HD Studio Size"
                      >
                        HD
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewScale('150')}
                        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                          previewScale === '150' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'hover:text-foreground'
                        }`}
                        title="150% Studio Ultra Size"
                      >
                        150%
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsPopPreviewOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-surface hover:bg-surface-hover text-foreground transition-colors cursor-pointer shadow-2xs"
                    title="Pop-up Full Card Preview"
                  >
                    <Maximize2 size={13} />
                    <span>Pop-up Preview</span>
                  </button>
                  <span className="text-[11px] font-bold text-secondary bg-surface px-2.5 py-1 rounded-full border border-border">
                    {printLayout === 'pvc_single' ? 'PVC CR-80' : `A4 Sheet (${a4Capacity} Cards)`}
                  </span>
                </div>
              </div>

              {printLayout === 'pvc_single' ? (
                <div className="w-full">
                  <div className="mgr-idcard-workbench">
                    <StudentIdCard data={cardData} side={cardSide} scale={previewScale} onSideChange={setCardSide} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-secondary mt-2 px-1 no-print">
                    <span className="flex items-center gap-1.5">
                      <span>Standard ISO/IEC 7810 ID-1 PVC Format</span>
                      <span>·</span>
                      <span className="font-mono font-medium text-foreground">85.60 mm × 53.98 mm (8.56 cm × 5.4 cm)</span>
                    </span>
                    <span className="text-secondary/80">Corner Radius: 3.18 mm</span>
                  </div>
                </div>
              ) : (
                /* A4 Sheet Grid Preview */
                <div className="w-full space-y-4">
                  <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2 no-print">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Grid size={15} className="text-primary" />
                        <span>A4 Paper Sheet Layout Preview</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {a4Capacity} Cards (2×{a4Capacity / 2})
                        </span>
                      </div>
                      <span className="text-[11px] text-secondary">210mm × 297mm Standard A4</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border/60 text-xs">
                      <div className="flex items-center gap-1.5 text-secondary text-[11px]">
                        <Scissors size={13} className="text-amber-500 shrink-0" />
                        <span>Dashed lines indicate cut guides for paper trimming & lamination.</span>
                      </div>
                      {bulkStudents.length === 0 && (
                        <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={tileAllSlots}
                            onChange={(e) => setTileAllSlots(e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <span>Tile all {a4Capacity} slots</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Screen Sheet Representation */}
                  <div className="mgr-a4-preview-sheet space-y-6">
                    {/* Sheet 1: Front Sides or Selected Single Side */}
                    {(cardSide === 'front' || cardSide === 'both') && (
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-xs text-slate-700">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                            <span>Front Sides Sheet (Cut & Laminate)</span>
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">{a4Cards.length} Cards Loaded</span>
                        </div>
                        <div
                          className={`grid grid-cols-2 gap-3 justify-center ${
                            printLayout === 'a4_sheet_8' ? 'mgr-a4-sheet-grid-8' : 'mgr-a4-sheet-grid-10'
                          }`}
                        >
                          {a4Cards.map((card, idx) => (
                            <div
                              key={`front-slot-${idx}-${card.smartId}`}
                              className="mgr-a4-sheet-cell-preview relative p-1 rounded-xl"
                            >
                              <div className="mgr-a4-cut-tag flex items-center gap-0.5">
                                <Scissors size={9} />
                                <span>Cut #{idx + 1}</span>
                              </div>
                              <div className="flex items-center justify-center p-1">
                                <StudentIdCard data={card} side="front" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sheet 2: Back Sides (Rules, Wi-Fi, Contacts) */}
                    {(cardSide === 'back' || cardSide === 'both') && (
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-xs text-slate-700">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">{cardSide === 'both' ? '2' : '1'}</span>
                            <span>Back Sides Sheet (Rules, Wi-Fi & Contacts)</span>
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">Duplex Alignment Mirror</span>
                        </div>
                        <div
                          className={`grid grid-cols-2 gap-3 justify-center ${
                            printLayout === 'a4_sheet_8' ? 'mgr-a4-sheet-grid-8' : 'mgr-a4-sheet-grid-10'
                          }`}
                        >
                          {a4Cards.map((card, idx) => (
                            <div
                              key={`back-slot-${idx}-${card.smartId}`}
                              className="mgr-a4-sheet-cell-preview relative p-1 rounded-xl"
                            >
                              <div className="mgr-a4-cut-tag flex items-center gap-0.5">
                                <Scissors size={9} />
                                <span>Back #{idx + 1}</span>
                              </div>
                              <div className="flex items-center justify-center p-1">
                                <ManagerMembersIdCardGeneratorStudentIdCardBack data={card} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden on screen, visible on print container with calibrated print media styles */}
              <div className={`hidden print:block mgr-print-container print-mode-${printLayout}`}>
                {printLayout === 'pvc_single' ? (
                  <div>
                    {(cardSide === 'front' || cardSide === 'both') && (
                      <div className="break-after-page">
                        <StudentIdCard data={cardData} side="front" />
                      </div>
                    )}
                    {(cardSide === 'back' || cardSide === 'both') && (
                      <div className="break-after-page">
                        <ManagerMembersIdCardGeneratorStudentIdCardBack data={cardData} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {(cardSide === 'front' || cardSide === 'both') && (
                      <div className="break-after-page">
                        <div className="mgr-a4-sheet-grid">
                          {a4Cards.map((card, idx) => (
                            <div key={`print-front-${idx}`} className="mgr-a4-print-cell">
                              <StudentIdCard data={card} side="front" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(cardSide === 'back' || cardSide === 'both') && (
                      <div className="break-after-page">
                        <div className="mgr-a4-sheet-grid">
                          {a4Cards.map((card, idx) => (
                            <div key={`print-back-${idx}`} className="mgr-a4-print-cell">
                              <ManagerMembersIdCardGeneratorStudentIdCardBack data={card} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="mgr-cell-sub mgr-idcard-preview-hint no-print">
                {tManagerUi('use_preview_only_until_validity_and_verification_contract_is_supplied')}
              </p>
            </>
          ) : (
            <div className="mgr-card mgr-idcard-empty-card">
              <div className="mgr-empty-state">
                <div className="mgr-empty-icon"><IdCard size={40} strokeWidth={2} /></div>
                <p className="mgr-empty-title">{tManagerUi('no_student_selected')}</p>
                <p className="mgr-empty-sub">{tManagerUi('search_and_select_a_student_to_preview_the_id_card')}</p>
              </div>
            </div>
          )}
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

      {/* Dedicated Pop-up Preview Modal (CR-80: 85.60 mm × 53.98 mm) */}
      {isPopPreviewOpen && cardData && (
        <div
          className="mgr-idcard-modal-overlay no-print"
          onClick={() => setIsPopPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
          data-testid="idcard-popup-preview-modal"
        >
          <div className="mgr-idcard-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-foreground">Smart ID Card Pop-up Preview</h3>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    CR-80: 85.60 mm × 53.98 mm (8.56 cm × 5.4 cm)
                  </span>
                </div>
                <p className="text-xs text-secondary mt-0.5">
                  Standard ISO/IEC 7810 ID-1 PVC format · {selected?.name} (#{selected?.smartId})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print ID Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPopPreviewOpen(false)}
                  className="p-1.5 rounded-lg border border-border hover:bg-surface text-secondary hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close Preview"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Pop-up Card Presentation */}
            <div className="py-4 flex justify-center w-full">
              <div className="mgr-idcard-workbench">
                <StudentIdCard data={cardData} side={cardSide} scale={previewScale} onSideChange={setCardSide} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-border text-xs text-secondary">
              <span className="flex items-center gap-1.5 font-medium">
                <span>Calibrated standard CR-80 card dimensions: 85.60 mm × 53.98 mm (8.56 cm × 5.4 cm)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPopPreviewOpen(false)}
                className="px-3 py-1 text-xs rounded-md border border-border bg-surface text-foreground font-semibold hover:bg-surface-hover cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
