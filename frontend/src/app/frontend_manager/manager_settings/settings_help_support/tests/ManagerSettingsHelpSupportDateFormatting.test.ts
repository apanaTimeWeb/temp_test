import { describe, expect, it } from 'vitest';
import { formatManagerHelpSupportCalendarDate } from '@/app/frontend_manager/manager_settings/settings_help_support/utils/ManagerSettingsHelpSupportDateFormatting';

describe('formatManagerHelpSupportCalendarDate', () => {
  it('returns malformed or impossible calendar dates unchanged', () => {
    expect(formatManagerHelpSupportCalendarDate('2026-2-03', 'en')).toBe('2026-2-03');
    expect(formatManagerHelpSupportCalendarDate('2026-02-30', 'en')).toBe('2026-02-30');
  });
  it('formats a valid date-only value with a supported locale', () => {
    expect(formatManagerHelpSupportCalendarDate('2026-10-01', 'en')).not.toBe('2026-10-01');
    expect(formatManagerHelpSupportCalendarDate('2026-10-01', 'hi')).not.toBe('2026-10-01');
  });
});
