'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';

export interface BranchHoliday {
  id: string;
  holidayName: string;
  date: string;
  branchScope: string;
  operatingTiming: string;
}

interface AdminSettingsBranchesHolidayDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHoliday: (holiday: BranchHoliday) => void;
}

export function AdminSettingsBranchesHolidayDialog({
  isOpen,
  onOpenChange,
  onAddHoliday,
}: AdminSettingsBranchesHolidayDialogProps) {
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayScope, setHolidayScope] = useState('All Branches');
  const [holidayTiming, setHolidayTiming] = useState('Reduced Hours (8:00 AM - 2:00 PM)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHoliday: BranchHoliday = {
      id: `hol-${Date.now()}`,
      holidayName: holidayName.trim(),
      date: holidayDate,
      branchScope: holidayScope,
      operatingTiming: holidayTiming,
    };
    onAddHoliday(newHoliday);
    onOpenChange(false);
    setHolidayName('');
    setHolidayDate('');
    toast.success('Branch holiday & operating timing rule scheduled.', {
      id: `holiday-add-${newHoliday.id}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              Schedule Holiday
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminSettingsBranchesHolidayDialog;

