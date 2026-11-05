'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ManagerAttendanceDailyEmptyState } from '../manager_attendance_daily_empty_states/ManagerAttendanceDailyEmptyState';
import { ManagerAttendanceDailyStudentRow } from '../manager_attendance_daily_widgets/ManagerAttendanceDailyStudentRow';
import type {
  AttStatus,
  Student,
  ManagerAttendanceDailyTimeField,
} from '../../types/ManagerAttendanceDailyComponentTypes';

interface ManagerAttendanceDailyTableProps {
  filtered: Student[];
  paginatedStudents: Student[];
  shift: string;
  shiftLabel: (value: string) => string;
  dateLabel: string;
  totalRows: number;
  startItem: number;
  endItem: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
  effectivePage: number;
  onStatusChange: (id: string, status: AttStatus) => void;
  onFieldChange: (id: string, field: ManagerAttendanceDailyTimeField, val: string) => void;
  onSendAlert: (student: Student) => void;
}

export function ManagerAttendanceDailyTable({
  filtered,
  paginatedStudents,
  shift,
  shiftLabel,
  dateLabel,
  totalRows,
  startItem,
  endItem,
  pageSize,
  setPageSize,
  setPage,
  pageCount,
  effectivePage,
  onStatusChange,
  onFieldChange,
  onSendAlert,
}: ManagerAttendanceDailyTableProps) {
  const tManagerUi = useTranslations('manager.manager_attendance.ui');

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="divide-y divide-border">
        {filtered.length === 0 ? (
          <ManagerAttendanceDailyEmptyState className="py-12 text-center">
            <div className="text-3xl mb-2" aria-hidden="true">
              📅
            </div>
            <p className="font-semibold text-primary text-sm">
              No students found for {shiftLabel(shift)} shift on {dateLabel}.
            </p>
            <p className="text-xs text-secondary mt-1">
              {tManagerUi('try_selecting_a_different_shift_or_date')}
            </p>
          </ManagerAttendanceDailyEmptyState>
        ) : (
          paginatedStudents.map((student) => (
            <ManagerAttendanceDailyStudentRow
              key={student.id}
              student={student}
              onStatusChange={onStatusChange}
              onFieldChange={onFieldChange}
              onSendAlert={onSendAlert}
            />
          ))
        )}
      </div>

      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-secondary bg-muted/10">
          <span>
            Showing {startItem}–{endItem} of {totalRows} student records
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label htmlFor="daily-att-rows-per-page" className="text-xs text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="daily-att-rows-per-page"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-primary outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={effectivePage === 0}
                onClick={() => setPage(effectivePage - 1)}
                className="px-3 py-1 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-medium">
                Page {effectivePage + 1} of {pageCount}
              </span>
              <button
                type="button"
                disabled={effectivePage >= pageCount - 1}
                onClick={() => setPage(effectivePage + 1)}
                className="px-3 py-1 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

