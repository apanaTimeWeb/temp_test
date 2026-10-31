'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, IdCard, MessageSquare, Printer, Search } from 'lucide-react';
import StudentIdCard, { type IdCardData } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCard';
import { useManagerIdCardGeneratorFormatting } from '@/app/frontend_manager/manager_members/members_id_card_generator/hooks/useManagerMembersIdCardGeneratorFormatting';
import { useManagerIdCardGenerator } from '@/app/frontend_manager/manager_members/members_id_card_generator/hooks/useManagerMembersIdCardGenerator';
import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorTypes';
import {MANAGER_STUDENT_STATUS_ACTIVE, MANAGER_STUDENT_STATUS_SUSPENDED, MANAGER_MEMBERS_ID_CARD_GENERATOR_SEARCH_DEBOUNCE_MS} from '@/app/frontend_manager/manager_members/members_id_card_generator/constants/ManagerMembersIdCardGeneratorConstants';
import { MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.url_config';
import { ManagerMembersIdCardGeneratorEmptyState } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_empty_states/ManagerMembersIdCardGeneratorEmptyState';

export function ManagerMembersIdCardGeneratorIdCardClient() {
  const tManagerUi = useTranslations('manager.manager_id_card_generator.ui');
  const { formatDate } = useManagerIdCardGeneratorFormatting();
  const { data: students = [], isPending, isError, isFetching, refetch } = useManagerIdCardGenerator();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id')?.trim() ?? '';
  const [selectedId, setSelectedId] = useState(requestedId);
  // Dependency rationale: the URL id is canonical, so external URL changes must refresh the selected card.
  useEffect(() => {
    if (requestedId) {
      setSelectedId(requestedId);
    } else if (students.length > 0 && !selectedId) {
      setSelectedId(students[0].smartId);
    }
  }, [requestedId, students, selectedId]);
  const selectStudent = (smartId: string) => {
    setSelectedId(smartId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('id', smartId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  // Dependency rationale: debounce the member lookup text (300ms) and cancel stale timers before recalculating the filtered card candidates.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);
  const filtered = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();
    return students.filter((student) => !value || student.name.toLowerCase().includes(value) || student.smartId.toLowerCase().includes(value) || student.phone.toLowerCase().includes(value));
  }, [students, debouncedSearch]);
  const selected = useMemo(() => students.find((student) => student.smartId === selectedId), [students, selectedId]);
  const cardData: IdCardData | null = useMemo(() => {
    if (!selected) return null;
    return {
      name: selected.name,
      smartId: selected.smartId,
      phone: selected.phone,
      shift: selected.shift,
      seat: selected.seat,
      locker: '',
      plan: selected.plan,
      joinDate: formatDate(selected.joined),
      // The supplied read schema has no authoritative expiry date. Never infer it from a plan label.
      branch: selected.branch,
    };
  }, [selected, formatDate]);

  if (isError) return <div className="mgr-page"><div className="mgr-state-card mgr-state-card-error" role="alert"><p className="mgr-state-title">{tManagerUi('unable_to_load_students')}</p><p className="mgr-state-description">{tManagerUi('please_retry_from_the_students_directory')}</p><button type="button" className="mgr-btn-primary mgr-btn-sm mt-3" onClick={() => { void refetch(); }} disabled={isFetching}>{isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}</button></div></div>;

  return (
    <div className="mgr-page">
      <div className="mgr-page-header"><div><Link href={MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.LIST} className="mgr-back-link"><ArrowLeft size={18} strokeWidth={2} /> {tManagerUi('back_to_students_6de7b0')}</Link><h1 className="mgr-page-title">{tManagerUi('id_card_generator')}</h1><p className="mgr-page-subtitle">{tManagerUi('search_select_preview_only_until_authoritative_card_contract_is_supplied')}</p></div><div className="mgr-page-actions"><Link href={MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.ADMISSION_PREVIEW} className="mgr-btn-ghost" title={tManagerUi('admission_unavailable_host_contract_not_supplied')}>{tManagerUi('new_student_admission')}</Link></div></div>
      <div className="mgr-idcard-page-layout">
        <div>
          <div className="mgr-card">
            <div className="mgr-card-header"><h2 className="mgr-section-title"><IdCard size={18} strokeWidth={2} /> {tManagerUi('select_student')}</h2>{selected && <span className="mgr-badge mgr-badge--success"><CheckCircle2 size={18} strokeWidth={2} /> {selected.name}</span>}</div>
            <div className="mgr-card-body">
              <div className="mgr-input-icon-wrap mgr-input-spacing"><Search size={18} strokeWidth={2} className="mgr-input-icon" /><label className="sr-only" htmlFor="manager-id-card-search">{tManagerUi('search_students')}</label><input id="manager-id-card-search" className="mgr-input mgr-input-with-icon" placeholder={tManagerUi('search_name_smart_id_phone')} value={search} onChange={(event) => setSearch(event.target.value)} /></div>
              {requestedId && !isPending && !selected && <p className="mgr-input-hint" role="alert" data-testid="manager-student-id-card-request-not-found">{tManagerUi('no_loaded_student_matches_the_requested_smart_id')}{requestedId}{tManagerUi('no_other_student_s_card_has_been_selected')}</p>}
              <div className="mgr-idcard-student-list">
                {isPending ? <div className="mgr-loading-state">{tManagerUi('loading_students_522ba5')}</div> : filtered.length === 0 ? <ManagerMembersIdCardGeneratorEmptyState className="mgr-empty-state"><div className="mgr-empty-icon"><Search size={36} strokeWidth={2} /></div><p className="mgr-empty-title">{tManagerUi('no_students_found')}</p></ManagerMembersIdCardGeneratorEmptyState> : filtered.map((student: ManagerStudent) => {
                  const initials = student.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
                  const statusLabel = student.status === MANAGER_STUDENT_STATUS_ACTIVE ? tManagerUi('status_active') : student.status === MANAGER_STUDENT_STATUS_SUSPENDED ? tManagerUi('status_suspended') : tManagerUi('status_expired');
                  const shiftLabels: Record<string, string> = { Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day') };
                  return <button type="button" key={student.smartId} onClick={() => selectStudent(student.smartId)} className={`mgr-idcard-student-row${student.smartId === selectedId ? ' mgr-idcard-student-row--active' : ''}`} aria-pressed={student.smartId === selectedId}><div className="mgr-avatar-sm">{initials}</div><div className="mgr-idcard-student-info"><p className="mgr-cell-name">{student.name}</p><p className="mgr-cell-sub">{student.smartId} · {shiftLabels[student.shift] ?? student.shift} · {student.seat}</p></div><span className={student.status === MANAGER_STUDENT_STATUS_ACTIVE ? 'mgr-badge mgr-badge--success' : student.status === MANAGER_STUDENT_STATUS_SUSPENDED ? 'mgr-badge mgr-badge--warning' : 'mgr-badge mgr-badge--danger'}>{statusLabel}</span></button>;
                })}
              </div>
            </div>
          </div>
          {selected && cardData && <div className="mgr-card mgr-idcard-actions-card"><div className="mgr-card-header"><h2 className="mgr-section-title">{tManagerUi('actions')}</h2></div><div className="mgr-card-body mgr-idcard-actions-body"><p className="mgr-input-hint" role="status" data-testid="manager-students-id-card-output-contract-warning">{tManagerUi('id_card_preview_only_contract_warning')}</p><button type="button" disabled title={tManagerUi('messaging_is_unavailable_until_authoritative_card_detail_7bcb52')} className="mgr-btn-whatsapp cursor-not-allowed" data-testid="manager-students-id-card-message-disabled"><MessageSquare size={18} strokeWidth={2} /> {tManagerUi('whatsapp_message_unavailable')}</button><button type="button" onClick={() => window.print()} title={tManagerUi('print_id_card')} className="mgr-btn-ghost mgr-btn-full" data-testid="manager-students-id-card-print"><Printer size={18} strokeWidth={2} /> {tManagerUi('print_id_card')}</button></div></div>}
        </div>
        <div className="mgr-idcard-preview-panel">
          {cardData ? <><p className="mgr-page-subtitle mgr-idcard-preview-label">{tManagerUi('preview')} {selected?.name}</p><StudentIdCard data={cardData} /><p className="mgr-cell-sub mgr-idcard-preview-hint">{tManagerUi('use_preview_only_until_validity_and_verification_contract_is_supplied')}</p></> : <div className="mgr-card mgr-idcard-empty-card"><div className="mgr-empty-state"><div className="mgr-empty-icon"><IdCard size={40} strokeWidth={2} /></div><p className="mgr-empty-title">{tManagerUi('no_student_selected')}</p><p className="mgr-empty-sub">{tManagerUi('search_and_select_a_student_to_preview_the_id_card')}</p></div></div>}
        </div>
      </div>
    </div>
  );
}
