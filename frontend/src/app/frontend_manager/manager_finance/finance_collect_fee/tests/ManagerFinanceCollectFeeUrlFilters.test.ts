import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useManagerCollectFeeUrlFilters } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/useManagerFinanceCollectFeeUrlFilters';

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
  usePathname: () => '/frontend_manager/manager_finance/finance_collect_fee',
  useSearchParams: () => ({
    get: (key: string) => mockSearchParamMap.get(key) ?? null,
    toString: () => {
      const p = new URLSearchParams();
      mockSearchParamMap.forEach((v, k) => p.set(k, v));
      return p.toString();
    },
  }),
}));

describe('useManagerCollectFeeUrlFilters', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParamMap.clear();
  });

  const filterConfig = {
    mode: {
      defaultValue: 'cash',
      allowedValues: ['cash', 'upi', 'card', 'bank'] as const,
    },
  };

  it('reads default values when searchParams are empty', () => {
    const { result } = renderHook(() => useManagerCollectFeeUrlFilters(filterConfig));
    expect(result.current.values.mode).toBe('cash');
  });

  it('reads candidate from URL if within allowed values', () => {
    mockSearchParamMap.set('mode', 'upi');
    const { result } = renderHook(() => useManagerCollectFeeUrlFilters(filterConfig));
    expect(result.current.values.mode).toBe('upi');
  });

  it('falls back to default if candidate is not allowed', () => {
    mockSearchParamMap.set('mode', 'crypto_unsupported');
    const { result } = renderHook(() => useManagerCollectFeeUrlFilters(filterConfig));
    expect(result.current.values.mode).toBe('cash');
  });

  it('updates state and pushes new URL on setValue', () => {
    const { result } = renderHook(() => useManagerCollectFeeUrlFilters(filterConfig));
    act(() => {
      result.current.setValue('mode', 'bank');
    });
    expect(result.current.values.mode).toBe('bank');
    expect(mockReplace).toHaveBeenCalledWith(
      '/frontend_manager/manager_finance/finance_collect_fee?mode=bank',
      { scroll: false }
    );
  });
});

