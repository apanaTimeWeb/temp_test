import { describe, expect, it } from 'vitest';
import { applyAdminApplicationInfrastructureQueryMutation, parseAdminApplicationInfrastructureUrlValue, resolveAdminApplicationInfrastructureNextValue } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

describe('Admin application infrastructure URL query state parser', () => {
  it('uses the fallback when the query key is missing', () => {
    expect(parseAdminApplicationInfrastructureUrlValue(null, 'all', ['all', 'pending'])).toBe('all');
  });

  it('rejects unknown finite filter values', () => {
    expect(parseAdminApplicationInfrastructureUrlValue('unexpected', 'all', ['all', 'pending'])).toBe('all');
  });

  it('parses non-negative safe integer pagination values', () => {
    expect(parseAdminApplicationInfrastructureUrlValue('3', 0)).toBe(3);
    expect(parseAdminApplicationInfrastructureUrlValue('-1', 0)).toBe(0);
    expect(parseAdminApplicationInfrastructureUrlValue('not-a-number', 0)).toBe(0);
  });
});


describe('URL query mutation composition', () => {
  it('preserves unrelated parameters and sequential updates to separate keys', () => {
    const first = applyAdminApplicationInfrastructureQueryMutation('keep=1', 'status', 'active', 'all');
    const second = applyAdminApplicationInfrastructureQueryMutation(first, 'plan', 'Premium Plan', 'all');
    const params = new URLSearchParams(second);
    expect(params.get('keep')).toBe('1'); expect(params.get('status')).toBe('active'); expect(params.get('plan')).toBe('Premium Plan');
  });
  it('removes a default key without dropping other keys', () => {
    expect(applyAdminApplicationInfrastructureQueryMutation('status=active&keep=1', 'status', 'all', 'all')).toBe('keep=1');
  });
});


describe('functional URL state updates', () => {
  it('applies repeated updater functions against the latest value', () => {
    const first = resolveAdminApplicationInfrastructureNextValue(1, (current) => current + 1);
    const second = resolveAdminApplicationInfrastructureNextValue(first, (current) => current + 1);
    expect(second).toBe(3);
  });
});
