import { describe, expect, it } from 'vitest';
import { ADMIN_RENEWALS_ROOT } from '@/app/frontend_admin/admin_finance/finance_renewals/config/admin_finance_renewals_renewals_url_config_source_routes';

describe('admin_renewals canonical URL contract', () => {
  it('exports a stable route owned by this module', () => {
    expect(ADMIN_RENEWALS_ROOT).toBe('/admin/admin_finance/finance_renewals');
  });
});
