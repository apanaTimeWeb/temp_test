'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { Award, Search } from 'lucide-react';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';


const REFERRAL_RECORDS: ReferralRow[] = [];

export function ManagerMembersReferralBonusReferralsClient() {
  const tManagerUi = useTranslations('manager.manager_referral_bonus.ui');
  const visibleRows = REFERRAL_RECORDS;

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <div className="mgr-breadcrumb">{tManagerUi('students_referrals')}</div>
          <h1 className="mgr-page-title">{tManagerUi('referral_program')}</h1>
          <p className="mgr-page-subtitle">{tManagerUi('referral_rows_are_unavailable_until_an_authoritative_rea_64fa7c')}</p>
          <p className="mgr-input-hint" role="status" data-testid="manager-students-referrals-contract-warning">{tManagerUi('no_live_referral_data_or_referral_processing_api_is_supp_dbe5f2')}</p>
        </div>
        <div className="mgr-page-actions">
          <button type="button" className="mgr-btn-ghost" disabled title={tManagerUi('referral_creation_contract_is_not_supplied')}>
            <Award size={16} /> {tManagerUi('new_referral_unavailable')}
          </button>
        </div>
      </div>

      <div className="mgr-kpi-grid mgr-section-gap">
        {[
          { label: tManagerUi('total_referrals'), value: '—', icon: Award, iconClass: 'mgr-kpi-icon--primary' },
          { label: tManagerUi('pending_approvals'), value: '—', icon: Search, iconClass: 'mgr-kpi-icon--warning' },
          { label: tManagerUi('total_bonus_distributed'), value: '—', icon: Award, iconClass: 'mgr-kpi-icon--success' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="mgr-kpi-card">
              <div className="mgr-kpi-top-row">
                <div className={`mgr-kpi-icon ${k.iconClass}`}><Icon size={18} /></div>
              </div>
              <div>
                <p className="mgr-kpi-label">{k.label}</p>
                <p className="mgr-kpi-value">{k.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mgr-card">
        <div className="mgr-card-header">
          <div className="mgr-input-icon-wrap max-w-xs">
            <Search size={14} className="mgr-input-icon" />
            <input type="text" placeholder={tManagerUi('search_unavailable_until_live_referral_data_is_connected')} className="mgr-input mgr-input-with-icon" aria-label={tManagerUi('referral_search_unavailable')} disabled />
          </div>
          <button type="button" className="mgr-btn-ghost mgr-btn-sm" disabled title={tManagerUi('referral_filter_options_depend_on_the_unavailable_live_r_339c42')}>{tManagerUi('filters_unavailable')}</button>
        </div>
      </div>
    </div>
  );
}
