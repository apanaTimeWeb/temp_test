import { afterEach, describe, expect, it, vi } from 'vitest';
import { openAdminFinanceWhatsApp } from '@/app/frontend_admin/admin_finance/finance_late_fees/utils/AdminFinanceLateFeesWhatsApp';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('openAdminFinanceWhatsApp', () => {
  it('normalizes the phone number and URL-encodes the message', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    openAdminFinanceWhatsApp('+91 (98765) 43210', 'Fee reminder & invoice #A-10');

    expect(openSpy).toHaveBeenCalledWith(
      'https://wa.me/%2B919876543210?text=Fee%20reminder%20%26%20invoice%20%23A-10',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
