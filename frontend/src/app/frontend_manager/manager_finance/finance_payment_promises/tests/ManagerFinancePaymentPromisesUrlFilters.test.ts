import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useManagerPaymentPromisesUrlFilters } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/useManagerFinancePaymentPromisesUrlFilters';

let mockSearchParamMap = new Map<string, string>();
const mockReplace = vi.fn((url: string) => {
  const queryPart = url.split('?')[1];
  mockSearchParamMap.clear();
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    params.forEach((v, k) => mockSearchParamMap.set(k, v));
  }
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/frontend_manager/manager_finance/finance_payment_promises',
  useSearchParams: () => ({
    get: (key: string) => mockSearchParamMap.get(key) ?? null,
    toString: () => {
      const p = new URLSearchParams();
      mockSearchParamMap.forEach((v, k) => p.set(k, v));
      return p.toString();
    },
  }),
}));

describe('useManagerPaymentPromisesUrlFilters', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParamMap.clear();
  });

  const filterConfig = {
    status: {
      defaultValue: 'all',
      allowedValues: ['all', 'pending', 'fulfilled', 'overdue'] as const,
    },
  };

  it('reads default values when searchParams are empty', () => {
    const { result } = renderHook(() => useManagerPaymentPromisesUrlFilters(filterConfig));
    expect(result.current.values.status).toBe('all');
  });

  it('reads candidate from URL if within allowed values', () => {
    mockSearchParamMap.set('status', 'overdue');
    const { result } = renderHook(() => useManagerPaymentPromisesUrlFilters(filterConfig));
    expect(result.current.values.status).toBe('overdue');
  });

  it('falls back to default if candidate is not allowed', () => {
    mockSearchParamMap.set('status', 'malicious_input');
    const { result } = renderHook(() => useManagerPaymentPromisesUrlFilters(filterConfig));
    expect(result.current.values.status).toBe('all');
  });

  it('updates state and pushes new URL on setValue', () => {
    const { result } = renderHook(() => useManagerPaymentPromisesUrlFilters(filterConfig));
    act(() => {
      result.current.setValue('status', 'pending');
    });
    expect(result.current.values.status).toBe('pending');
    expect(mockReplace).toHaveBeenCalledWith(
      '/frontend_manager/manager_finance/finance_payment_promises?status=pending',
      { scroll: false }
    );
  });
});
