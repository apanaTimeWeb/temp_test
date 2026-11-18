'use client';
// Responsibility: Own the Members Directory route's primary view and its cohesive screen-local child views.

import React, { useMemo, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Activity, AlertTriangle, Armchair, ArrowLeft, CalendarClock, CheckCircle, CreditCard, DownloadCloud, FileText, IndianRupee, MessageSquare, RotateCcw, ShieldAlert, UserPlus, UserRound, Users, Building2, TrendingUp, X } from 'lucide-react';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ALL_BRANCHES_ID } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import { toast } from 'sonner';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { ADMIN_MEMBERS_DOCUMENT_FIXTURES, ADMIN_MEMBERS_EXPORT_PLAN_OPTIONS, ADMIN_MEMBERS_EXPORT_STATUS_OPTIONS, ADMIN_MEMBERS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import { downloadAdminMembersDemoCsv, formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import AdminMembersDirectoryMemberForm from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberForm';
import AdminMembersMemberTable from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberTable';
import AdminMembersDirectoryBulkWhatsAppModal from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryBulkWhatsAppModal';
import AdminMembersDirectoryDataToolsView from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDataToolsView';
import AdminMembersDirectorySecondaryViews from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectorySecondaryViews';
import { AdminMembersDirectoryMemberDetailCard } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberDetailCard';
import type { AdminMembersDirectoryDataToolsViewProps, AdminMembersDirectoryViewProps, AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps, AdminMembersExportStatusFilter } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';

const TAB_ICON_COLORS: Record<string, string> = {
  all: 'text-sky-400',
  categories: 'text-purple-400',
  departments: 'text-indigo-400',
  active: 'text-emerald-400',
  expired: 'text-rose-400',
  suspended: 'text-amber-400',
  blocked: 'text-red-400',
  import: 'text-blue-400',
  export: 'text-teal-400',
  documents: 'text-fuchsia-400',
  plans: 'text-cyan-400',
  renewal: 'text-orange-400',
  profile: 'text-sky-400',
  attendance: 'text-emerald-400',
  membership: 'text-purple-400',
  renewalHistory: 'text-amber-400',
  paymentHistory: 'text-teal-400',
  lostHistory: 'text-rose-400',
  activityHistory: 'text-blue-400',
};

export default function AdminMembersDirectoryView({ model }: AdminMembersDirectoryViewProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const { activeTab, setActiveTab, viewingMember, setViewingMember, detailTab, setDetailTab, mainNav, detailNav, isDemoMode, dummyMembers, demoRenewals } = model;
  return (
    <div className="w-full space-y-6 text-text-primary">
      {!isDemoMode && <p role="status" className="mb-4 rounded-xl border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_RECORDS_UNAVAILABLE')}</p>}

      {/* EXECUTIVE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {viewingMember && (
            <button
              type="button"
              data-testid="admin_members-AdminMembersDirectoryView-control-001"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-850/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label={t('BACK_TO_LIST')}
              title={t('BACK_TO_LIST')}
              onClick={() => setViewingMember(null)}
            >
              <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {viewingMember ? t('MEMBER_DETAIL_TITLE', { name: viewingMember.name }) : t('PAGE_TITLE')}
              </h1>
              {!viewingMember && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Directory
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {viewingMember ? t('MEMBER_DETAIL_SUMMARY', { id: viewingMember.id, status: t(viewingMember.status === 'Active' ? 'STATUS_ACTIVE' : viewingMember.status === 'Expired' ? 'STATUS_EXPIRED' : viewingMember.status === 'Suspended' ? 'STATUS_SUSPENDED' : viewingMember.status === 'Blocked' ? 'STATUS_BLOCKED' : 'STATUS_UNKNOWN') }) : t('PAGE_SUBTITLE')}
            </p>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      {isDemoMode && !viewingMember && (
        <section aria-label={t('DEMO_METRICS_NOTICE')} className="space-y-2">
          <p className="sr-only" role="note">{t('DEMO_METRICS_NOTICE')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: t('KPI_TOTAL_MEMBERS'),
                value: String(dummyMembers.length),
                icon: Users,
                cardBorderBg: 'border-sky-500/25 bg-gradient-to-br from-[#0c1828]/95 via-[#0c1828]/90 to-[#122238]/80 shadow-sky-950/30',
                iconBox: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
                strokeColor: '#38bdf8',
                badgeBg: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
                trend: 'All Registered',
              },
              {
                label: t('KPI_ACTIVE_MEMBERS'),
                value: String(dummyMembers.filter((member) => member.status === 'Active').length),
                icon: CheckCircle,
                cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
                iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
                strokeColor: '#34d399',
                badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
                trend: 'In Good Standing',
              },
              {
                label: t('KPI_NEW_THIS_MONTH'),
                value: String(Math.max(1, Math.ceil(dummyMembers.length * 0.25))),
                icon: UserPlus,
                cardBorderBg: 'border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 shadow-purple-950/30',
                iconBox: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
                strokeColor: '#c084fc',
                badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
                trend: 'Current Cycle',
              },
              {
                label: t('KPI_PENDING_RENEWALS'),
                value: String(demoRenewals.filter((renewal) => !renewal.reminderRecorded).length),
                icon: AlertTriangle,
                cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
                iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
                strokeColor: '#f87171',
                badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
                trend: 'Action Required',
              }
            ].map((kpi) => (
              <div
                key={kpi.label}
                className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${kpi.cardBorderBg}`}
              >
                <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
                  <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={kpi.strokeColor} strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">{kpi.label}</span>
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
        </section>
      )}

      {/* TOP SCROLLABLE NAVIGATION TABS */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-1.5 flex gap-1.5 overflow-x-auto whitespace-nowrap shadow-inner">
        {!viewingMember ? (
          mainNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                type="button"
                data-testid={`admin_members-AdminMembersDirectoryView-main-tab-${item.id}`}
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                aria-pressed={isActive}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <item.icon size={16} aria-hidden="true" className={`${isActive ? 'text-white' : (TAB_ICON_COLORS[item.id] || 'text-indigo-400')} shrink-0 transition-transform group-hover:scale-110`} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })
        ) : (
          detailNav.map((item) => {
            const isActive = detailTab === item.id;
            return (
              <button
                type="button"
                data-testid={`admin_members-AdminMembersDirectoryView-detail-tab-${item.id}`}
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                aria-pressed={isActive}
                onClick={() => setDetailTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <item.icon size={16} aria-hidden="true" className={`${isActive ? 'text-white' : (TAB_ICON_COLORS[item.id] || 'text-indigo-400')} shrink-0 transition-transform group-hover:scale-110`} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })
        )}
      </div>

      {/* CONTENT AREA */}
      <AdminMembersDirectoryViewMAINDASHBOARDVIEWSSection model={model} />
    </div>
  );
}

export function AdminMembersDirectoryViewMAINDASHBOARDVIEWSSection({ model }: AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  const { activeTab, setActiveTab, viewingMember, dummyMembers, isDemoMode, handleAction, openMemberDetails } = model;
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);

  const branchFilteredMembers = useMemo(() => {
    if (isAllBranches || !selectedBranch) return dummyMembers;
    const branchNameLower = selectedBranch.name.toLowerCase().trim();
    return dummyMembers.filter((m) =>
      m.branch ? m.branch.toLowerCase().trim() === branchNameLower || m.branch.toLowerCase().includes(branchNameLower) : false
    );
  }, [isAllBranches, selectedBranch, dummyMembers]);

  const toggleSelectOne = (id: string) => {
    setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleSelectAll = () => {
    const allIds = branchFilteredMembers.map((m) => m.id);
    setSelectedMemberIds((prev) => (prev.length === allIds.length ? [] : allIds));
  };
  const clearSelection = () => setSelectedMemberIds([]);

  const memberListConfig = {
    all: { titleKey: 'NAV_ALL_MEMBERS', filterStatus: undefined },
    active: { titleKey: 'NAV_ACTIVE', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[0] },
    expired: { titleKey: 'NAV_EXPIRED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[1] },
    suspended: { titleKey: 'NAV_SUSPENDED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[2] },
    blocked: { titleKey: 'NAV_BLOCKED', filterStatus: ADMIN_MEMBERS_STATUS_VALUES[3] },
  }[activeTab as 'all' | 'active' | 'expired' | 'suspended' | 'blocked'];
  return (
    <div className="space-y-6">
      {/* -------------------- MAIN DASHBOARD VIEWS -------------------- */}
      {!viewingMember && memberListConfig && (
        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5 md:p-6 shadow-xl space-y-4" aria-labelledby="admin-members-list-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="admin-members-list-title" className="text-base sm:text-lg font-bold text-white tracking-tight">{t(memberListConfig.titleKey)}</h2>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkWhatsAppOpen(true)}
                disabled={branchFilteredMembers.length === 0}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-all disabled:opacity-40 shadow-sm shadow-emerald-500/10"
              >
                <MessageSquare size={14} className="text-emerald-400" /> Bulk WhatsApp
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-500/25 transition-colors shadow-sm shadow-amber-500/10"
                onClick={() => setActiveTab('renewal')}
              >
                <RotateCcw size={15} className="text-amber-400" aria-hidden="true" />
                <span>{t('NAV_RENEWAL')}</span>
              </button>
            </div>
          </div>

          <AdminMembersMemberTable
            members={branchFilteredMembers}
            filterStatus={memberListConfig.filterStatus}
            onSelectMember={openMemberDetails}
            onAction={handleAction}
            canMutate={isDemoMode}
            selectedIds={selectedMemberIds}
            onToggleSelectOne={toggleSelectOne}
            onToggleSelectAll={toggleSelectAll}
          />
        </section>
      )}

      {/* Bulk WhatsApp Modal */}
      <AdminMembersDirectoryBulkWhatsAppModal
        isOpen={isBulkWhatsAppOpen}
        onClose={() => setIsBulkWhatsAppOpen(false)}
        members={selectedMemberIds.length > 0 ? branchFilteredMembers.filter((m) => selectedMemberIds.includes(m.id)) : branchFilteredMembers}
      />

      {/* MEMBER EDIT MODAL */}
      <AdminMembersDirectoryMemberForm model={model} />

      {/* SECONDARY TAB VIEWS share the parent active-tab lifecycle. */}
      <AdminMembersDirectorySecondaryViews model={model} />
      {isDemoMode && !viewingMember && activeTab === 'export' && <AdminMembersDirectoryDataToolsView key={activeTab} mode="export" members={dummyMembers} />}
      {isDemoMode && !viewingMember && activeTab === 'documents' && <AdminMembersDirectoryDataToolsView key={activeTab} mode="documents" members={dummyMembers} />}

      {!isDemoMode && !viewingMember && ['categories', 'departments', 'renewal', 'import', 'export', 'documents'].includes(activeTab) && (
        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5" role="status">
          <h2 className="text-lg font-semibold text-white">{t('FEATURE_DATA_UNAVAILABLE')}</h2>
          <p className="mt-2 text-slate-400">{t('FEATURE_DATA_UNAVAILABLE_DESCRIPTION')}</p>
        </section>
      )}

      {/* -------------------- DETAILED MEMBER VIEW -------------------- */}
      {model.viewingMember && (
        <AdminMembersDirectoryMemberDetailCard
          member={model.viewingMember}
          detailTab={model.detailTab}
          isDemoMode={isDemoMode}
        />
      )}
    </div>
  );
}

export { AdminMembersDirectoryDataToolsView };
export type { AdminMembersDirectoryViewProps, AdminMembersDirectoryViewMAINDASHBOARDVIEWSSectionProps, AdminMembersDirectoryDataToolsViewProps };
