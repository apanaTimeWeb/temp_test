import type { ManagerDashboardReportsData } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';

function escapeReportCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const isFiniteNumber = typeof value === 'number' && Number.isFinite(value);
  const safeText = !isFiniteNumber && /^[\u0000-\u0020]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

/** Exports branch performance report tables and executive KPIs as CSV. */
export function exportManagerDashboardReportsCsv(
  data: ManagerDashboardReportsData,
  activeDateScope: string
): void {
  const generatedOn = new Date().toLocaleString('en-IN');
  const sections: string[] = [];

  sections.push(`"CENTRAL LIBRARY MANAGEMENT — BRANCH PERFORMANCE REPORT"`);
  sections.push(`${escapeReportCsvCell('Report Date Scope')},${escapeReportCsvCell(activeDateScope)}`);
  sections.push(`${escapeReportCsvCell('Report Generated At')},${escapeReportCsvCell(generatedOn)}`);
  sections.push(``);

  sections.push(`"--- 1. EXECUTIVE KPI SUMMARY ---"`);
  sections.push(`"Metric","Value","Trend / Trajectory"`);
  data.kpiCards.forEach((c) => {
    sections.push([c.title, c.value, c.trend || 'N/A'].map(escapeReportCsvCell).join(','));
  });
  sections.push(``);

  if (data.shiftProfitabilityRows && data.shiftProfitabilityRows.length > 0) {
    sections.push(`"--- 2. SHIFT-WISE REVENUE & PROFITABILITY BREAKDOWN ---"`);
    sections.push(`"Shift Name","Hours","Enrolled Students","Monthly Fee Rate (INR)","Gross Revenue (INR)","Collection Rate","Profitability Margin"`);
    let totalRev = 0;
    let totalStudents = 0;
    data.shiftProfitabilityRows.forEach((r) => {
      totalRev += r.grossRevenue;
      totalStudents += r.studentsCount;
      sections.push([r.shift, r.timing, r.studentsCount, r.monthlyRate, r.grossRevenue, r.collectionRate, r.marginRating].map(escapeReportCsvCell).join(','));
    });
    sections.push(['TOTAL SUMMARY', 'All Shifts', totalStudents, '—', totalRev, '—', 'High'].map(escapeReportCsvCell).join(','));
    sections.push(``);
  }

  sections.push(`"--- 3. SHIFT OCCUPANCY UTILIZATION ---"`);
  sections.push(`"Shift","Occupancy Rate"`);
  data.occupancyData.forEach((s) => {
    sections.push([s.name, `${s.value}%`].map(escapeReportCsvCell).join(','));
  });
  sections.push(``);

  sections.push(`"--- 4. DAILY ATTENDANCE AVERAGE ---"`);
  sections.push(`"Day","Average Attendance %"`);
  data.attendanceData.forEach((a) => {
    sections.push([a.day, `${a.avg}%`].map(escapeReportCsvCell).join(','));
  });
  sections.push(``);

  sections.push(`"--- 5. STUDENT ABSENTEE DETAILS ---"`);
  sections.push(`"Student Name","Smart ID","Shift","Days Absent","Last Present Date"`);
  data.absenteeRows.forEach((ab) => {
    sections.push([ab.name, ab.smartId, ab.shift, ab.daysAbsent, ab.lastPresent].map(escapeReportCsvCell).join(','));
  });
  sections.push(``);

  sections.push(`"--- 6. LOCKER UTILIZATION ---"`);
  sections.push(`"Locker Type","Occupied","Total","Occupancy %"`);
  data.lockerRows.forEach((l) => {
    sections.push([l.type, l.occupied, l.total, l.pct].map(escapeReportCsvCell).join(','));
  });

  const csvContent = `\uFEFF${sections.join('\r\n')}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `library_owner_report_${activeDateScope.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.hidden = true;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
