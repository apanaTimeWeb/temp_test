'use client';

import React from 'react';
import {
  IndianRupee, Building, Users, Mail, Phone, UserCheck, MapPin
} from 'lucide-react';
import type { SuperadminLibrariesLibrary } from '../types/SuperadminLibrariesOverviewTypes';
import { SuperadminLibrariesFormatMajorPreviewCurrency } from '../utils/SuperadminLibrariesOverviewFormattingUtilities';
import { useTranslations, useLocale } from 'next-intl';

interface SuperadminLibrariesOverviewPanelViewContentProps {
  lib: SuperadminLibrariesLibrary;
}

export default function SuperadminLibrariesOverviewPanelViewContent({
  lib,
}: SuperadminLibrariesOverviewPanelViewContentProps) {
  const t = useTranslations('SUPERADMIN_LIBRARIES');
  const locale = useLocale();

  return (
    <div className="space-y-4">
      {/* Lifetime Revenue & Renewal Banner */}
      <div className="p-4 rounded-xl border border-emerald-500/35 bg-[#06241a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
            {t('COPY.LIFETIME_REVENUE_SAMPLE')}
          </p>
          <p className="text-2xl font-black text-emerald-400 flex items-center gap-1">
            <IndianRupee size={22} />
            <span>{SuperadminLibrariesFormatMajorPreviewCurrency(lib.revenue, 'INR', locale)}</span>
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('COPY.NEXT_RENEWAL')}
          </p>
          <span className="inline-block text-xs font-bold text-white bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
            {lib.nextRenewal}
          </span>
        </div>
      </div>

      {/* 4 KPI Quick Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-indigo-500/25 bg-[#111936]">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
            <Building size={13} className="text-indigo-400" />
            <span>{t('COPY.ACTIVE_BRANCHES')}</span>
          </div>
          <p className="text-lg font-bold text-white">{lib.branches}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-sky-500/25 bg-[#0c2238]">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
            <Users size={13} className="text-sky-400" />
            <span>{t('COPY.ACTIVE_STUDENTS')}</span>
          </div>
          <p className="text-lg font-bold text-white">{lib.students?.toLocaleString() ?? 0}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-purple-500/25 bg-[#221338]">
          <div className="text-xs text-slate-300 mb-1">{t('COPY.PLAN_TYPE')}</div>
          <p className="text-sm font-bold text-purple-300">{lib.plan}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-700 bg-[#161c2e]">
          <div className="text-xs text-slate-300 mb-1">{t('COPY.SAMPLE_GST_IDENTIFIER')}</div>
          <p className="text-xs font-mono font-bold text-slate-300 truncate">{lib.gstNumber}</p>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="space-y-2.5 border-t border-slate-800 pt-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('COPY.CONTACT_INFORMATION')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/25 bg-[#111936]">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/35 shrink-0">
              <Mail size={15} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400">{t('COPY.EMAIL_ADDRESS')}</p>
              <p className="text-xs font-semibold text-white truncate">{lib.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/25 bg-[#0a231b]">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 shrink-0">
              <Phone size={15} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400">{t('COPY.PHONE_NUMBER')}</p>
              <p className="text-xs font-semibold text-white truncate">{lib.phone}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-[#131d38]">
          <div className="p-2 rounded-lg bg-slate-800 text-indigo-300 border border-slate-700 shrink-0">
            <UserCheck size={15} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400">Library Primary Administrator</p>
            <p className="text-xs font-semibold text-white">{lib.owner}</p>
          </div>
        </div>
      </div>

      {/* Multi-Branch Infrastructure Breakdown (1 Admin -> N Branches) */}
      <div className="space-y-2.5 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Building size={13} className="text-indigo-400" />
            <span>Managed Branches ({lib.branches})</span>
          </h3>
          <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/35 px-2 py-0.5 rounded-full">
            Multi-Branch Network
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {Array.from({ length: lib.branches }, (_, idx) => {
            const branchName = idx === 0 ? `${lib.name} - Central Campus` : `${lib.name} - Branch #${idx + 1}`;
            const branchCity = idx === 0 ? lib.location : `${lib.location} Zone ${idx + 1}`;
            const branchSeats = Math.round(lib.students / Math.max(1, lib.branches)) || 120;
            const managerName = idx === 0 ? `${lib.owner} (Owner)` : `Branch Manager #${idx + 1}`;
            return (
              <div key={`br-${lib.id}-${idx}`} className="p-3 rounded-xl border border-slate-800 bg-[#111827] flex items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{branchName}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-indigo-400" /> {branchCity}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users size={10} className="text-sky-400" /> {branchSeats} Seats
                    </span>
                    <span>•</span>
                    <span className="text-[10px] text-slate-500">{managerName}</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Active
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
