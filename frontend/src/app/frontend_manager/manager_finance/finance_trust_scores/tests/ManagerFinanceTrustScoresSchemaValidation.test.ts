import { describe, it, expect } from 'vitest';
import {
  managerTrustScoreStudentSchema,
  managerTrustScoreResponseSchema,
} from '@/app/frontend_manager/manager_finance/finance_trust_scores/schemas/ManagerFinanceTrustScoresSchema';

describe('ManagerFinanceTrustScoresSchema validation', () => {
  it('validates a valid student trust score record', () => {
    const student = {
      rank: 1,
      studentName: 'Aarav Sharma',
      smartId: 'LIB-101',
      shift: 'Morning',
      trustScore: 95,
      totalPromises: 6,
      timesChanged: 0,
      fulfilledCount: 6,
      badge: 'reliable' as const,
    };
    const result = managerTrustScoreStudentSchema.safeParse(student);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.trustScore).toBe(95);
      expect(result.data.badge).toBe('reliable');
    }
  });

  it('rejects invalid badge value', () => {
    const invalid = {
      rank: 2,
      studentName: 'Priya Patel',
      smartId: 'LIB-102',
      shift: 'Evening',
      trustScore: 60,
      totalPromises: 3,
      timesChanged: 1,
      fulfilledCount: 2,
      badge: 'super_unreliable',
    };
    const result = managerTrustScoreStudentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects negative trust score or score > 100', () => {
    const invalidUnder = {
      rank: 3,
      studentName: 'Rohan Gupta',
      smartId: 'LIB-103',
      shift: 'Night',
      trustScore: -5,
      totalPromises: 2,
      timesChanged: 2,
      fulfilledCount: 0,
      badge: 'low' as const,
    };
    expect(managerTrustScoreStudentSchema.safeParse(invalidUnder).success).toBe(false);

    const invalidOver = {
      ...invalidUnder,
      trustScore: 105,
    };
    expect(managerTrustScoreStudentSchema.safeParse(invalidOver).success).toBe(false);
  });

  it('validates an array of trust score records', () => {
    const list = [
      {
        rank: 1,
        studentName: 'Student 1',
        smartId: 'S-1',
        shift: 'Morning',
        trustScore: 85,
        totalPromises: 4,
        timesChanged: 0,
        fulfilledCount: 4,
        badge: 'reliable' as const,
      },
    ];
    const result = managerTrustScoreResponseSchema.safeParse(list);
    expect(result.success).toBe(true);
  });
});

