'use client';

import { ManagerSettingsBranchInfoWifiModal } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_modals/ManagerSettingsBranchInfoWifiModal';
import '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_styles/ManagerSettingsBranchInfoStyles.css';
import { ManagerSettingsBranchInfoContactsAndAudit } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_views/ManagerSettingsBranchInfoContactsAndAudit';
import { ManagerSettingsBranchInfoFacilityCard } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_views/ManagerSettingsBranchInfoFacilityCard';
import { ManagerSettingsBranchInfoHero } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_views/ManagerSettingsBranchInfoHero';
import { ManagerSettingsBranchInfoKpis } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_views/ManagerSettingsBranchInfoKpis';
import { ManagerSettingsBranchInfoWifiCard } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_views/ManagerSettingsBranchInfoWifiCard';
import { useManagerBranchInfoForm } from '@/app/frontend_manager/manager_settings/settings_branch_info/hooks/useManagerSettingsBranchInfoForm';
import {
  formatWifiQrPayload,
  generateQrMatrix,
  generateQrSvgPath,
} from '@/app/frontend_manager/manager_settings/settings_branch_info/utils/ManagerSettingsBranchInfoWifiQr';
import { Building2, Share2, Wifi } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function ManagerSettingsBranchInfoPage() {
  const tManagerUi = useTranslations('manager.manager_branch_info.ui');
  const { branchData } = useManagerBranchInfoForm();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
  }, []);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [showPagePassword, setShowPagePassword] = useState(false);
  const [wifiConfig, setWifiConfig] = useState<{
    ssid: string;
    password: string;
    security: 'WPA' | 'WEP' | 'nopass';
  }>({
    ssid: branchData.wifiSsid || 'SmartLibrary_Student_5G',
    password: branchData.wifiPassword || 'StudyHub@2026',
    security: (branchData.wifiSecurity || 'WPA') as 'WPA' | 'WEP' | 'nopass',
  });

  const pageQrSvg = useMemo(() => {
    const payload = formatWifiQrPayload({
      ssid: wifiConfig.ssid,
      password: wifiConfig.password,
      security: wifiConfig.security,
    });
    return generateQrSvgPath(generateQrMatrix(payload, 'M'), 2);
  }, [wifiConfig]);

  const t = (key: string, fallback: string): string => {
    try {
      const val = tManagerUi(key);
      if (!val || val.startsWith('manager.manager_branch_info')) return fallback;
      return val;
    } catch {
      return fallback;
    }
  };

  const copyToClipboard = (text: string, label: string, key: string) => {
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    toast.success(`${label} copied!`, { id: `copy-${key}` });
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => {
      copyTimerRef.current = null;
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 1800);
  };

  const copyAllBranchDetails = () => {
    const fullSummary = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏛️ ${branchData.branchName} [${branchData.branchCode}]`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `• Type: ${branchData.libraryType || 'Private Facility'}`,
      `• Capacity: ${branchData.totalSeatingCapacity} | Floors: ${branchData.totalFloors}`,
      `• Shifts: ${branchData.totalShifts}`,
      `• Schedule: ${branchData.workingHours}`,
      `• Address: ${branchData.address}`,
      `• Desk Phone: ${branchData.phone}`,
      `• Helpline Phone: ${branchData.supportPhone}`,
      `• Support Email: ${branchData.supportEmail}`,
      `• Student Wi-Fi (SSID): ${wifiConfig.ssid}`,
      `• Wi-Fi Password: ${wifiConfig.password}`,
      `• Manager: ${branchData.managerName}`,
      `• Established: ${branchData.establishmentDate}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(fullSummary);
    }
    toast.success('Complete branch summary copied!', { id: 'copy-all-branch-summary' });
  };

  return (
    <div className="mgr-page-animate relative pb-8 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <Building2 className="text-amber-400 shrink-0" size={24} />
            <span>{t('branch_information', 'Branch Information')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('branch_info_subtitle', 'View branch details, seating capacity, operating shifts, and contact information.')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsWifiModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 motion-safe:transition-all cursor-pointer shadow-xs"
            title="Open Student Wi-Fi Front Desk Standee"
          >
            <Wifi size={13} className="text-amber-400" />
            <span>Wi-Fi Standee QR</span>
          </button>

          <button
            type="button"
            onClick={copyAllBranchDetails}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 motion-safe:transition-all cursor-pointer shadow-xs"
            title="Copy complete branch profile to clipboard"
          >
            <Share2 size={13} className="text-amber-400" />
            <span>Share Profile</span>
          </button>
        </div>
      </div>

      <ManagerSettingsBranchInfoHero
        branchData={branchData}
        copiedKey={copiedKey}
        onCopy={copyToClipboard}
        onOpenWifiModal={() => setIsWifiModalOpen(true)}
      />

      <ManagerSettingsBranchInfoKpis branchData={branchData} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <ManagerSettingsBranchInfoFacilityCard
          branchData={branchData}
          copiedKey={copiedKey}
          onCopy={copyToClipboard}
        />

        <div className="lg:col-span-5 space-y-4">
          <ManagerSettingsBranchInfoWifiCard
            wifiConfig={wifiConfig}
            pageQrSvg={pageQrSvg}
            showPagePassword={showPagePassword}
            setShowPagePassword={setShowPagePassword}
            copiedKey={copiedKey}
            onCopy={copyToClipboard}
            onOpenModal={() => setIsWifiModalOpen(true)}
            t={t}
          />
          <ManagerSettingsBranchInfoContactsAndAudit branchData={branchData} />
        </div>
      </div>

      <ManagerSettingsBranchInfoWifiModal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        branchName={branchData.branchName}
        branchCode={branchData.branchCode}
        managerName={branchData.managerName}
        managerPhone={branchData.phone}
        initialSsid={wifiConfig.ssid}
        initialPassword={wifiConfig.password}
        initialSecurity={wifiConfig.security}
        initialFrequency={branchData.wifiFrequency || 'Dual-Band 5 GHz / 2.4 GHz High-Speed'}
        onUpdateWifi={(updated) => setWifiConfig(updated)}
      />
    </div>
  );
}
