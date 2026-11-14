import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useManagerTrustScoresUrlFilters } from '@/app/frontend_manager/manager_finance/finance_trust_scores/hooks/useManagerFinanceTrustScoresUrlFilters';

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
  usePathname: () => '/frontend_manager/manager_finance/finance_trust_scores',
  useSearchParams: () => ({
    get: (key: string) => mockSearchParamMap.get(key) ?? null,
    toString: () => {
      const p = new URLSearchParams();
      mockSearchParamMap.forEach((v, k) => p.set(k, v));
      return p.toString();
    },
  }),
}));

describe('useManagerTrustScoresUrlFilters', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParamMap.clear();
  });

  const filterConfig = {
    level: {
      defaultValue: 'all',
      allowedValues: ['all', 'reliable', 'moderate', 'low'] as const,
    },
  };

  it('reads default values when searchParams are empty', () => {
    const { result } = renderHook(() => useManagerTrustScoresUrlFilters(filterConfig));
    expect(result.current.values.level).toBe('all');
  });

  it('reads candidate from URL if within allowed values', () => {
    mockSearchParamMap.set('level', 'reliable');
    const { result } = renderHook(() => useManagerTrustScoresUrlFilters(filterConfig));
    expect(result.current.values.level).toBe('reliable');
  });

  it('falls back to default if candidate is not in allowed values', () => {
    mockSearchParamMap.set('level', 'invalid_level_attack');
    const { result } = renderHook(() => useManagerTrustScoresUrlFilters(filterConfig));
    expect(result.current.values.level).toBe('all');
  });

  it('updates state and pushes new URL on setValue', () => {
    const { result } = renderHook(() => useManagerTrustScoresUrlFilters(filterConfig));
    act(() => {
      result.current.setValue('level', 'moderate');
    });
    expect(result.current.values.level).toBe('moderate');
    expect(mockReplace).toHaveBeenCalledWith(
      '/frontend_manager/manager_finance/finance_trust_scores?level=moderate',
      { scroll: false }
    );
  });
});

