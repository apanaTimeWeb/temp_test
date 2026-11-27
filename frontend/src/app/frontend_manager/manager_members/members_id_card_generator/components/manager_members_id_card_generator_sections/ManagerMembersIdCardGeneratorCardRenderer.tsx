'use client';

import StudentIdCard, { type IdCardData, type IdCardSide } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCard';
import { ManagerMembersIdCardGeneratorStudentIdCardBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardBack';
import ManagerMembersIdCardGeneratorStudentIdCardFullYear from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardFullYear';
import { ManagerMembersIdCardGeneratorStudentIdCardFullYearBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardFullYearBack';
import ManagerMembersIdCardGeneratorStudentIdCardHalfYearly from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardHalfYearly';
import { ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack';
import ManagerMembersIdCardGeneratorStudentIdCardQuarterly from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardQuarterly';
import { ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack';

export type IdCardPlanTheme = 'monthly' | 'quarterly' | 'half-yearly' | 'full-year';

export function resolveIdCardPlanTheme(plan?: string): IdCardPlanTheme {
  if (!plan) return 'monthly';
  const p = plan.trim().toLowerCase();
  if (p.includes('quarter') || p === 'qtr') return 'quarterly';
  if (p.includes('half')) return 'half-yearly';
  if (p.includes('annual') || p.includes('year') || p.includes('full')) return 'full-year';
  return 'monthly';
}

export function ManagerMembersIdCardThemedCard({
  theme,
  data,
  side,
  scale,
  onSideChange,
  forceSide,
}: {
  theme: IdCardPlanTheme;
  data: IdCardData;
  side?: IdCardSide;
  scale?: '100' | '133' | '150';
  onSideChange?: (s: IdCardSide) => void;
  forceSide: 'front' | 'back' | 'interactive';
}) {
  if (forceSide === 'back') {
    if (theme === 'quarterly') return <ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack data={data} />;
    if (theme === 'half-yearly') return <ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack data={data} />;
    if (theme === 'full-year') return <ManagerMembersIdCardGeneratorStudentIdCardFullYearBack data={data} />;
    return <ManagerMembersIdCardGeneratorStudentIdCardBack data={data} />;
  }
  const resolvedSide = forceSide === 'front' ? 'front' : side;
  if (theme === 'quarterly') return <ManagerMembersIdCardGeneratorStudentIdCardQuarterly data={data} side={resolvedSide} scale={scale} onSideChange={onSideChange} />;
  if (theme === 'half-yearly') return <ManagerMembersIdCardGeneratorStudentIdCardHalfYearly data={data} side={resolvedSide} scale={scale} onSideChange={onSideChange} />;
  if (theme === 'full-year') return <ManagerMembersIdCardGeneratorStudentIdCardFullYear data={data} side={resolvedSide} scale={scale} onSideChange={onSideChange} />;
  return <StudentIdCard data={data} side={resolvedSide} scale={scale} onSideChange={onSideChange} />;
}

export function ManagerMembersIdCardPaginationBar({
  effectivePage,
  pageSize,
  totalFiltered,
  totalPages,
  onPrev,
  onNext,
}: {
  effectivePage: number;
  pageSize: number;
  totalFiltered: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalFiltered <= pageSize) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 mt-3 text-xs text-secondary">
      <span>{effectivePage * pageSize + 1}–{Math.min((effectivePage + 1) * pageSize, totalFiltered)} of {totalFiltered}</span>
      <div className="flex items-center gap-1.5">
        <button type="button" disabled={effectivePage <= 0} onClick={onPrev} className="px-2 py-1 rounded border border-border bg-surface text-secondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
        <span className="px-1 font-medium text-primary">{effectivePage + 1}/{totalPages}</span>
        <button type="button" disabled={effectivePage >= totalPages - 1} onClick={onNext} className="px-2 py-1 rounded border border-border bg-surface text-secondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}
