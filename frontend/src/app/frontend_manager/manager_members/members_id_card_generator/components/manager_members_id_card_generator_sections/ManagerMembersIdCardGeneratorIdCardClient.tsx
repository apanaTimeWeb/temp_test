'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  IdCard,
  MessageSquare,
  Printer,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';
import StudentIdCard, {
  type IdCardData,
  type IdCardSide,
} from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCard';
import { ManagerMembersIdCardGeneratorStudentIdCardBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardBack';
import ManagerMembersIdCardGeneratorStudentIdCardQuarterly from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardQuarterly';
import { ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack';
import ManagerMembersIdCardGeneratorStudentIdCardHalfYearly from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardHalfYearly';
import { ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack';
import ManagerMembersIdCardGeneratorStudentIdCardFullYear from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardFullYear';
import { ManagerMembersIdCardGeneratorStudentIdCardFullYearBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardFullYearBack';
import { useManagerIdCardGeneratorFormatting } from '@/app/frontend_manager/manager_members/members_id_card_generator/hooks/useManagerMembersIdCardGeneratorFormatting';
import { useManagerIdCardGenerator } from '@/app/frontend_manager/manager_members/members_id_card_generator/hooks/useManagerMembersIdCardGenerator';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorTypes';
import { MANAGER_STUDENT_STATUS_ACTIVE, MANAGER_STUDENT_STATUS_SUSPENDED, MANAGER_STUDENT_STATUSES, MANAGER_STUDENT_SHIFTS, MANAGER_MEMBERS_ID_CARD_GENERATOR_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_members/members_id_card_generator/constants/ManagerMembersIdCardGeneratorConstants';
import { ManagerMembersIdCardGeneratorEmptyState } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_empty_states/ManagerMembersIdCardGeneratorEmptyState';
import { ManagerMembersIdCardBulkDispatchModal } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardBulkDispatchModal';

export type IdCardPlanTheme = 'monthly' | 'quarterly' | 'half-yearly' | 'full-year';

export function getIdCardPlanTheme(plan?: string): IdCardPlanTheme {
  if (!plan) return 'monthly';
  const p = plan.trim().toLowerCase();
  if (p.includes('quarter') || p === 'qtr') return 'quarterly';
  if (p.includes('half')) return 'half-yearly';
  if (p.includes('annual') || p.includes('year') || p.includes('full')) return 'full-year';
  return 'monthly';
}

function isQuarterlyPlan(plan?: string): boolean {
  return getIdCardPlanTheme(plan) === 'quarterly';
}

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
  const [cardSide, setCardSide] = useState<IdCardSide>('front');
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

  if (isError) return <div className="mgr-page mgr-students-theme"><div className="mgr-state-card mgr-state-card-error" role="alert"><p className="mgr-state-title">{tManagerUi('unable_to_load_students')}</p><p className="mgr-state-description">{tManagerUi('please_retry_from_the_students_directory')}</p><button type="button" className="mgr-btn-primary mgr-btn-sm mt-3" onClick={() => { void refetch(); }} disabled={isFetching}>{isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}</button></div></div>;

  return (
    <div className="mgr-page mgr-students-theme">
      <div className="mgr-page-header">
        <div>
          <h1 className="mgr-page-title">{tManagerUi('id_card_generator')}</h1>
          <p className="mgr-page-subtitle">{tManagerUi('search_select_preview_only_until_authoritative_card_contract_is_supplied')}</p>
        </div>
      </div>
      <div className="mgr-idcard-page-layout">
        <div>
          <div className="mgr-card">
            <div className="mgr-card-header flex flex-wrap items-center justify-between gap-2">
              <h2 className="mgr-section-title"><IdCard size={18} strokeWidth={2} /> {tManagerUi('select_student')}</h2>
              <div className="flex flex-wrap items-center gap-2">
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2">
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
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mb-3">
                <select
                  aria-label="Filter by Shift"
                  data-testid="manager-id-card-shift-filter"
                  value={shiftFilter}
                  onChange={(e) => { setShiftFilter(e.target.value); setPage(0); }}
                  className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-primary font-medium"
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
                  className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-primary font-medium"
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
                {isPending ? (
                  <div className="mgr-loading-state flex flex-col items-center justify-center p-6 gap-2" role="status">
                    <LibraryLoader size="sm" icon="user" label={tManagerUi('loading_students_522ba5')} />
                    <span className="text-xs text-secondary font-medium">{tManagerUi('loading_students_522ba5')}</span>
                  </div>
                ) : filtered.length === 0 ? <ManagerMembersIdCardGeneratorEmptyState className="mgr-empty-state"><div className="mgr-empty-icon"><Search size={36} strokeWidth={2} /></div><p className="mgr-empty-title">{tManagerUi('no_students_found')}</p></ManagerMembersIdCardGeneratorEmptyState> : paginatedStudents.map((student: ManagerStudent) => {
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
                        <p className="mgr-cell-sub truncate">{student.smartId} · {student.plan} · {shiftLabels[student.shift] ?? student.shift} · {student.seat}</p>
                      </div>
                      <span className={`shrink-0 ${student.status === MANAGER_STUDENT_STATUS_ACTIVE ? 'mgr-badge mgr-badge--success' : student.status === MANAGER_STUDENT_STATUS_SUSPENDED ? 'mgr-badge mgr-badge--warning' : 'mgr-badge mgr-badge--danger'} hidden xs:inline-flex`}>{statusLabel}</span>
                    </div>
                  );
                })}
              </div>

              {/* ID Card List Pagination Footer */}
              {filtered.length > pageSize && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 mt-3 text-xs text-secondary">
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
        </div>
        <div className="mgr-idcard-preview-panel">
          {cardData ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 w-full no-print bg-surface p-2.5 rounded-xl border border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="mgr-page-subtitle mgr-idcard-preview-label mb-0 font-bold">{tManagerUi('preview')} {selected?.name}</p>
                  {(() => {
                    const theme = getIdCardPlanTheme(cardData.plan);
                    let badgeClass = 'bg-primary/10 text-primary border border-primary/20';
                    if (theme === 'quarterly') {
                      badgeClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
                    } else if (theme === 'half-yearly') {
                      badgeClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                    } else if (theme === 'full-year') {
                      badgeClass = 'bg-slate-200/20 text-slate-100 border border-slate-300/40 shadow-xs';
                    }
                    return (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                        {cardData.plan || 'Monthly'}
                      </span>
                    );
                  })()}
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    85.60 mm × 53.98 mm (8.56 cm × 5.4 cm)
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Zoom Scale Selector */}
                  <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-card border border-border text-[10px] font-semibold text-secondary">
                    <button
                      type="button"
                      onClick={() => setPreviewScale('100')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${previewScale === '100' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'hover:text-foreground'
                        }`}
                      title="100% 1:1 Physical Print Size (85.60 mm × 53.98 mm)"
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewScale('133')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${previewScale === '133' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'hover:text-foreground'
                        }`}
                      title="133% HD Studio Size"
                    >
                      HD
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewScale('150')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${previewScale === '150' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'hover:text-foreground'
                        }`}
                      title="150% Studio Ultra Size"
                    >
                      150%
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-secondary bg-surface px-2.5 py-1 rounded-full border border-border">
                    PVC CR-80
                  </span>
                </div>
              </div>

              <div className="w-full">
                <div className="mgr-idcard-workbench">
                  {(() => {
                    const theme = getIdCardPlanTheme(cardData.plan);
                    if (theme === 'quarterly') {
                      return (
                        <ManagerMembersIdCardGeneratorStudentIdCardQuarterly
                          data={cardData}
                          side={cardSide}
                          scale={previewScale}
                          onSideChange={setCardSide}
                        />
                      );
                    }
                    if (theme === 'half-yearly') {
                      return (
                        <ManagerMembersIdCardGeneratorStudentIdCardHalfYearly
                          data={cardData}
                          side={cardSide}
                          scale={previewScale}
                          onSideChange={setCardSide}
                        />
                      );
                    }
                    if (theme === 'full-year') {
                      return (
                        <ManagerMembersIdCardGeneratorStudentIdCardFullYear
                          data={cardData}
                          side={cardSide}
                          scale={previewScale}
                          onSideChange={setCardSide}
                        />
                      );
                    }
                    return (
                      <StudentIdCard
                        data={cardData}
                        side={cardSide}
                        scale={previewScale}
                        onSideChange={setCardSide}
                      />
                    );
                  })()}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-secondary mt-2 px-1 no-print">
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>Standard ISO/IEC 7810 ID-1 PVC Format</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="font-mono font-medium text-foreground">85.60 mm × 53.98 mm (8.56 cm × 5.4 cm)</span>
                  </span>
                  <span className="text-secondary/80 hidden sm:inline">Corner Radius: 3.18 mm</span>
                </div>
              </div>


              {/* Actions Bar merged directly below card preview - compact standard buttons */}
              <div className="w-full no-print mt-3 flex items-center justify-center sm:justify-end gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  data-testid="manager-students-id-card-whatsapp-share"
                  title="Share ID Card via WhatsApp"
                  aria-label="Share ID Card via WhatsApp"
                  className="mgr-btn-compact-wa"
                >
                  <MessageSquare size={13} strokeWidth={2} />
                  <span>Share via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  title={tManagerUi('print_id_card')}
                  aria-label={tManagerUi('print_id_card')}
                  className="mgr-btn-compact-print"
                  data-testid="manager-students-id-card-print"
                >
                  <Printer size={13} strokeWidth={2} />
                  <span>
                    {bulkSelectedIds.length > 1
                      ? `Print ${bulkSelectedIds.length} Cards`
                      : `${tManagerUi('print_id_card')} (PVC)`}
                  </span>
                </button>
              </div>

              {/* Hidden on screen, visible on print container with calibrated print media styles (Always duplex: Front and Back) */}
              <div className="hidden print:block mgr-print-container print-mode-pvc_single">
                <div>
                  {bulkStudents.length > 0 ? (
                    bulkStudents.map((student) => {
                      const data = getStudentCardData(student);
                      const theme = getIdCardPlanTheme(data.plan);
                      return (
                        <Fragment key={`print-duplex-${student.smartId}`}>
                          <div className="break-after-page">
                            {theme === 'quarterly' && <ManagerMembersIdCardGeneratorStudentIdCardQuarterly data={data} side="front" />}
                            {theme === 'half-yearly' && <ManagerMembersIdCardGeneratorStudentIdCardHalfYearly data={data} side="front" />}
                            {theme === 'full-year' && <ManagerMembersIdCardGeneratorStudentIdCardFullYear data={data} side="front" />}
                            {theme === 'monthly' && <StudentIdCard data={data} side="front" />}
                          </div>
                          <div className="break-after-page">
                            {theme === 'quarterly' && <ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack data={data} />}
                            {theme === 'half-yearly' && <ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack data={data} />}
                            {theme === 'full-year' && <ManagerMembersIdCardGeneratorStudentIdCardFullYearBack data={data} />}
                            {theme === 'monthly' && <ManagerMembersIdCardGeneratorStudentIdCardBack data={data} />}
                          </div>
                        </Fragment>
                      );
                    })
                  ) : (
                    (() => {
                      const theme = getIdCardPlanTheme(cardData.plan);
                      return (
                        <>
                          <div className="break-after-page">
                            {theme === 'quarterly' && <ManagerMembersIdCardGeneratorStudentIdCardQuarterly data={cardData} side="front" />}
                            {theme === 'half-yearly' && <ManagerMembersIdCardGeneratorStudentIdCardHalfYearly data={cardData} side="front" />}
                            {theme === 'full-year' && <ManagerMembersIdCardGeneratorStudentIdCardFullYear data={cardData} side="front" />}
                            {theme === 'monthly' && <StudentIdCard data={cardData} side="front" />}
                          </div>
                          <div className="break-after-page">
                            {theme === 'quarterly' && <ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack data={cardData} />}
                            {theme === 'half-yearly' && <ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack data={cardData} />}
                            {theme === 'full-year' && <ManagerMembersIdCardGeneratorStudentIdCardFullYearBack data={cardData} />}
                            {theme === 'monthly' && <ManagerMembersIdCardGeneratorStudentIdCardBack data={cardData} />}
                          </div>
                        </>
                      );
                    })()
                  )}
                </div>
              </div>
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
    </div>
  );
}