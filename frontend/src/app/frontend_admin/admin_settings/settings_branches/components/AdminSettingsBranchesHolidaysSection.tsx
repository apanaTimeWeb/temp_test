// components/AdminSettingsBranchesHolidaysSection.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import {
  AdminSettingsBranchesNoticeDialog,
  type BranchNotice,
} from './AdminSettingsBranchesNoticeDialog';
import {
  AdminSettingsBranchesHolidayDialog,
  type BranchHoliday,
} from './AdminSettingsBranchesHolidayDialog';
import { AdminSettingsBranchesNoticesCard } from './AdminSettingsBranchesNoticesCard';
import { AdminSettingsBranchesHolidaysCard } from './AdminSettingsBranchesHolidaysCard';

export type { BranchNotice, BranchHoliday };

const INITIAL_NOTICES: BranchNotice[] = [
  {
    id: 'ntc-001',
    title: 'Diwali Festival Operating Schedule',
    message: 'All library branches will operate 8:00 AM to 2:00 PM only on Diwali. 24/7 night shift resumes next morning at 6:00 AM.',
    targetBranch: 'All Branches (Network)',
    priority: 'ANNOUNCEMENT',
    effectiveDate: '2026-11-01',
    publishedBy: 'SuperAdmin Satyam',
  },
  {
    id: 'ntc-002',
    title: 'Water Tank Deep Cleaning & Sanitation',
    message: 'Laxmi Nagar Hub will be temporarily closed from 12:00 PM to 5:00 PM this Sunday for municipal water tank cleaning. Students can use Karol Bagh branch if needed.',
    targetBranch: 'Laxmi Nagar Hub',
    priority: 'MAINTENANCE',
    effectiveDate: '2026-11-08',
    publishedBy: 'SuperAdmin Satyam',
  },
  {
    id: 'ntc-003',
    title: 'UPSC Prelims Mock Test Weekend: 100% Silence Zone',
    message: 'Strict silence zone enforcement in all reading halls. Any mobile conversation will result in immediate seat cancellation.',
    targetBranch: 'All Branches (Network)',
    priority: 'URGENT',
    effectiveDate: '2026-11-14',
    publishedBy: 'SuperAdmin Satyam',
  },
];

const INITIAL_HOLIDAYS: BranchHoliday[] = [
  {
    id: 'hol-001',
    holidayName: 'Diwali (Deepawali)',
    date: '2026-11-01',
    branchScope: 'All Branches',
    operatingTiming: 'Reduced Hours (8:00 AM - 2:00 PM)',
  },
  {
    id: 'hol-002',
    holidayName: 'Guru Nanak Jayanti',
    date: '2026-11-24',
    branchScope: 'All Branches',
    operatingTiming: 'Normal 24/7 Hours',
  },
  {
    id: 'hol-003',
    holidayName: 'Republic Day',
    date: '2027-01-26',
    branchScope: 'All Branches',
    operatingTiming: 'Reduced Hours (8:00 AM - 2:00 PM)',
  },
  {
    id: 'hol-004',
    holidayName: 'Municipal Maintenance Shutdown',
    date: '2026-11-08',
    branchScope: 'Laxmi Nagar Hub Only',
    operatingTiming: 'Closed (12:00 PM - 5:00 PM)',
  },
];

interface Props {
  isDemoMode: boolean;
}

export function AdminSettingsBranchesHolidaysSection({ isDemoMode: _isDemoMode }: Props) {
  const t = useTranslations('ADMIN_BRANCHES');
  const [notices, setNotices] = useState<BranchNotice[]>(INITIAL_NOTICES);
  const [holidays, setHolidays] = useState<BranchHoliday[]>(INITIAL_HOLIDAYS);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* SuperAdmin Authority Banner */}
      <div className="rounded-lg border border-border bg-primary-subtle p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-semibold text-foreground">
            {t('HOLIDAYS_AUTHORITY_TITLE')}
          </p>
          <p className="text-muted-foreground mt-0.5">
            {t('HOLIDAYS_AUTHORITY_DESCRIPTION')}
          </p>
        </div>
      </div>

      {/* Digital Notice Board Broadcasts */}
      <AdminSettingsBranchesNoticesCard
        notices={notices}
        onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
      />

      {/* Central Branch Holiday Master */}
      <AdminSettingsBranchesHolidaysCard
        holidays={holidays}
        onOpenHolidayModal={() => setIsHolidayModalOpen(true)}
      />

      {/* Publish Notice Modal */}
      <AdminSettingsBranchesNoticeDialog
        isOpen={isNoticeModalOpen}
        onOpenChange={setIsNoticeModalOpen}
        onAddNotice={(newNotice) => setNotices((prev) => [newNotice, ...prev])}
      />

      {/* Add Holiday Modal */}
      <AdminSettingsBranchesHolidayDialog
        isOpen={isHolidayModalOpen}
        onOpenChange={setIsHolidayModalOpen}
        onAddHoliday={(newHoliday) => setHolidays((prev) => [...prev, newHoliday])}
      />
    </div>
  );
}

export default AdminSettingsBranchesHolidaysSection;
