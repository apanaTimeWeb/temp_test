'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarCheck, PlusCircle, Search, ArrowUpDown, ArrowUp, ArrowDown, Clock, CheckCircle2 } from 'lucide-react';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import type { BranchHoliday } from './AdminSettingsBranchesHolidayDialog';

interface AdminSettingsBranchesHolidaysCardProps {
  holidays: BranchHoliday[];
  onOpenHolidayModal: () => void;
}

type HolidaySortField = 'holidayName' | 'date' | 'branchScope' | 'operatingTiming';

export function AdminSettingsBranchesHolidaysCard({
  holidays,
  onOpenHolidayModal,
}: AdminSettingsBranchesHolidaysCardProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const [holidaySortField, setHolidaySortField] = useState<HolidaySortField | null>(null);
  const [holidaySortDirection, setHolidaySortDirection] = useState<'asc' | 'desc'>('asc');
  const [holidaySearch, setHolidaySearch] = useState('');
  const [holidayPage, setHolidayPage] = useState(0);
  const [holidayPageSize, setHolidayPageSize] = useState(10);

  const toggleHolidaySort = (field: HolidaySortField) => {
    setHolidayPage(0);
    if (holidaySortField === field) {
      setHolidaySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setHolidaySortField(field);
      setHolidaySortDirection('asc');
    }
  };

  const filteredHolidays = useMemo(() => {
    const q = holidaySearch.trim().toLowerCase();
    if (!q) return holidays;
    return holidays.filter(
      (h) =>
        h.holidayName.toLowerCase().includes(q) ||
        h.date.toLowerCase().includes(q) ||
        h.branchScope.toLowerCase().includes(q) ||
        h.operatingTiming.toLowerCase().includes(q)
    );
  }, [holidays, holidaySearch]);

  const sortedHolidays = useMemo(() => {
    if (!holidaySortField) return filteredHolidays;
    return [...filteredHolidays].sort((a, b) => {
      const aVal = a[holidaySortField];
      const bVal = b[holidaySortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return holidaySortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredHolidays, holidaySortField, holidaySortDirection]);

  const paginatedHolidays = useMemo(
    () => sortedHolidays.slice(holidayPage * holidayPageSize, (holidayPage + 1) * holidayPageSize),
    [sortedHolidays, holidayPage, holidayPageSize]
  );

  const renderHolidaySortableHeader = (field: HolidaySortField, label: string) => {
    const isActive = holidaySortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (holidaySortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="px-3.5 py-3 whitespace-nowrap"
      >
        <button
          type="button"
          onClick={() => toggleHolidaySort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (holidaySortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            holidaySortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
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
          onClick={onOpenHolidayModal}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start sm:self-auto motion-safe:transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t('ADD_HOLIDAY')}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={holidaySearch}
            onChange={(e) => {
              setHolidaySearch(e.target.value);
              setHolidayPage(0);
            }}
            placeholder="Search holidays by name, date, scope..."
            aria-label="Search holidays"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse" aria-label="Branch Holiday Schedule">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {renderHolidaySortableHeader('holidayName', t('HOLIDAY_NAME'))}
              {renderHolidaySortableHeader('date', t('HOLIDAY_DATE'))}
              {renderHolidaySortableHeader('branchScope', t('HOLIDAY_SCOPE'))}
              {renderHolidaySortableHeader('operatingTiming', t('HOLIDAY_TIMING'))}
              <th scope="col" className="px-3.5 py-3 text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y border-border">
            {filteredHolidays.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                  No holidays match your search criteria.
                </td>
              </tr>
            ) : (
              paginatedHolidays.map((h) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminTablePagination
        page={holidayPage}
        pageSize={holidayPageSize}
        totalRows={filteredHolidays.length}
        onPageChange={setHolidayPage}
        onPageSizeChange={(newPageSize) => {
          setHolidayPageSize(newPageSize);
          setHolidayPage(0);
        }}
      />
    </section>
  );
}

export default AdminSettingsBranchesHolidaysCard;

