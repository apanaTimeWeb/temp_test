import { describe, expect, it } from 'vitest';
import { getManagerReportsTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/utils/ManagerDashboardReportsTrendTone';

describe('getManagerReportsTrendTone', () => {
  it('uses down tone only for explicitly negative values', () => expect(getManagerReportsTrendTone('-4.2%')).toBe('down'));
  it('uses up tone only for explicitly positive values', () => expect(getManagerReportsTrendTone('+4.2%')).toBe('up'));
  it('keeps unsigned or descriptive values neutral', () => {
    expect(getManagerReportsTrendTone('4.2%')).toBe('neutral');
    expect(getManagerReportsTrendTone('steady')).toBe('neutral');
  });
});
