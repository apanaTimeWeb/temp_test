// components/AdminSettingsBranchesHolidaysSection.tsx
'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  BellRing,
  CalendarCheck,
  Megaphone,
  ShieldCheck,
  PlusCircle,
  Clock,
  Building2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';

export interface BranchNotice {
  id: string;
  title: string;
  message: string;
  targetBranch: string;
  priority: 'URGENT' | 'ANNOUNCEMENT' | 'MAINTENANCE';
  effectiveDate: string;
  publishedBy: string;
}

export interface BranchHoliday {
  id: string;
  holidayName: string;
  date: string;
  branchScope: string;
  operatingTiming: string; // e.g. "Closed All Day" | "Reduced Hours (8 AM - 2 PM)"
}

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

export function AdminSettingsBranchesHolidaysSection({ isDemoMode }: Props) {
  const t = useTranslations('ADMIN_BRANCHES');
  const [notices, setNotices] = useState<BranchNotice[]>(INITIAL_NOTICES);
  const [holidays, setHolidays] = useState<BranchHoliday[]>(INITIAL_HOLIDAYS);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  // New Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeBranch, setNoticeBranch] = useState('All Branches (Network)');
  const [noticePriority, setNoticePriority] = useState<BranchNotice['priority']>('ANNOUNCEMENT');

  // New Holiday Form State
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayScope, setHolidayScope] = useState('All Branches');
  const [holidayTiming, setHolidayTiming] = useState('Reduced Hours (8:00 AM - 2:00 PM)');

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: BranchNotice = {
      id: `ntc-${Date.now()}`,
      title: noticeTitle.trim(),
      message: noticeMessage.trim(),
      targetBranch: noticeBranch,
      priority: noticePriority,
      effectiveDate: new Date().toISOString().slice(0, 10),
      publishedBy: 'SuperAdmin (Central)',
    };
    setNotices((prev) => [newNotice, ...prev]);
    setIsNoticeModalOpen(false);
    setNoticeTitle('');
    setNoticeMessage('');
    toast.success('Central digital notice broadcasted successfully across branches.', {
      id: `notice-broadcast-${newNotice.id}`,
    });
  };

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    const newHoliday: BranchHoliday = {
      id: `hol-${Date.now()}`,
      holidayName: holidayName.trim(),
      date: holidayDate,
      branchScope: holidayScope,
      operatingTiming: holidayTiming,
    };
    setHolidays((prev) => [...prev, newHoliday]);
    setIsHolidayModalOpen(false);
    setHolidayName('');
    setHolidayDate('');
    toast.success('Branch holiday & operating timing rule scheduled.', {
      id: `holiday-add-${newHoliday.id}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* SuperAdmin Authority Banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
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
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t('NOTICES_TITLE')}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t('NOTICES_SUBTITLE')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNoticeModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start sm:self-auto motion-safe:transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t('PUBLISH_NOTICE')}</span>
          </button>
        </div>

        <div className="space-y-3">
          {notices.map((n) => (
            <article
              key={n.id}
              className="rounded-lg border border-border bg-muted/20 p-4 space-y-2 hover:bg-muted/30 motion-safe:transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      n.priority === 'URGENT'
                        ? 'bg-destructive/15 text-destructive'
                        : n.priority === 'MAINTENANCE'
                        ? 'bg-warning/15 text-warning-text'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {n.priority}
                  </span>
                  <h3 className="font-semibold text-foreground text-sm">{n.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{n.targetBranch}</span>
                  <span>·</span>
                  <span>{n.effectiveDate}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
              <p className="text-[11px] text-muted-foreground italic">Published by: {n.publishedBy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Central Branch Holiday Master */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-success" />
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t('HOLIDAY_MASTER_TITLE')}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t('HOLIDAY_MASTER_SUBTITLE')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsHolidayModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start sm:self-auto motion-safe:transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t('ADD_HOLIDAY')}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" aria-label="Branch Holiday Schedule">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">{t('HOLIDAY_NAME')}</th>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">{t('HOLIDAY_DATE')}</th>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">{t('HOLIDAY_SCOPE')}</th>
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">{t('HOLIDAY_TIMING')}</th>
                <th scope="col" className="px-3.5 py-3 text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {holidays.map((h) => (
                <tr key={h.id} className="hover:bg-muted/20 motion-safe:transition-colors">
                  <td className="px-3.5 py-3 font-semibold text-foreground whitespace-nowrap">
                    {h.holidayName}
                  </td>
                  <td className="px-3.5 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {h.date}
                  </td>
                  <td className="px-3.5 py-3 text-xs font-medium text-foreground whitespace-nowrap">
                    {h.branchScope}
                  </td>
                  <td className="px-3.5 py-3 text-xs text-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-medium">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{h.operatingTiming}</span>
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Enforced</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Publish Notice Modal */}
      <Dialog open={isNoticeModalOpen} onOpenChange={setIsNoticeModalOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreateNotice} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t('MODAL_NOTICE_TITLE')}</DialogTitle>
              <DialogDescription>{t('MODAL_NOTICE_DESC')}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label htmlFor="notice-title" className="font-semibold text-foreground">
                  Notice Headline *
                </label>
                <input
                  id="notice-title"
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Diwali Operating Hours Notice"
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label htmlFor="notice-target" className="font-semibold text-foreground">
                    Target Branch Scope *
                  </label>
                  <select
                    id="notice-target"
                    value={noticeBranch}
                    onChange={(e) => setNoticeBranch(e.target.value)}
                    className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                  >
                    <option value="All Branches (Network)">All Branches (Network)</option>
                    <option value="Karol Bagh Central">Karol Bagh Central</option>
                    <option value="Laxmi Nagar Hub">Laxmi Nagar Hub</option>
                    <option value="Noida Sector 62">Noida Sector 62</option>
                    <option value="Mukherjee Nagar">Mukherjee Nagar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="notice-priority" className="font-semibold text-foreground">
                    Priority / Category *
                  </label>
                  <select
                    id="notice-priority"
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as BranchNotice['priority'])}
                    className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                  >
                    <option value="ANNOUNCEMENT">Announcement / Festival</option>
                    <option value="MAINTENANCE">Maintenance Alert</option>
                    <option value="URGENT">Urgent Notice</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="notice-message" className="font-semibold text-foreground">
                  Broadcast Message *
                </label>
                <textarea
                  id="notice-message"
                  rows={3}
                  required
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Enter notice message visible to managers and students..."
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNoticeModalOpen(false)}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Broadcast Notice
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Holiday Modal */}
      <Dialog open={isHolidayModalOpen} onOpenChange={setIsHolidayModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateHoliday} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Branch Holiday / Operating Hours</DialogTitle>
              <DialogDescription>
                Define special operating timing or branch closure enforced centrally across library branches.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label htmlFor="holiday-name" className="font-semibold text-foreground">
                  Holiday / Event Name *
                </label>
                <input
                  id="holiday-name"
                  type="text"
                  required
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  placeholder="e.g. Holi / Independence Day"
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="holiday-date" className="font-semibold text-foreground">
                  Date *
                </label>
                <input
                  id="holiday-date"
                  type="date"
                  required
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="holiday-scope" className="font-semibold text-foreground">
                  Applicable Branch *
                </label>
                <select
                  id="holiday-scope"
                  value={holidayScope}
                  onChange={(e) => setHolidayScope(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                >
                  <option value="All Branches">All Branches</option>
                  <option value="Karol Bagh Central">Karol Bagh Central</option>
                  <option value="Laxmi Nagar Hub">Laxmi Nagar Hub</option>
                  <option value="Noida Sector 62">Noida Sector 62</option>
                  <option value="Mukherjee Nagar">Mukherjee Nagar</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="holiday-timing" className="font-semibold text-foreground">
                  Operating Timing Policy *
                </label>
                <select
                  id="holiday-timing"
                  value={holidayTiming}
                  onChange={(e) => setHolidayTiming(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                >
                  <option value="Reduced Hours (8:00 AM - 2:00 PM)">Reduced Hours (8:00 AM - 2:00 PM)</option>
                  <option value="Closed All Day">Closed All Day</option>
                  <option value="Night Shift Suspended (6 AM - 10 PM Open)">Night Shift Suspended (6 AM - 10 PM Open)</option>
                  <option value="Normal 24/7 Hours">Normal 24/7 Hours</option>
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsHolidayModalOpen(false)}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Schedule Holiday
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminSettingsBranchesHolidaysSection;

