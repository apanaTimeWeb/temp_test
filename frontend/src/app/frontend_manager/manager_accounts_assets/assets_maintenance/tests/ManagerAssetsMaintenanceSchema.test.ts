import { describe, it, expect } from 'vitest';
import { managerAssetsMaintenanceOrderSchema } from '../schemas/ManagerAssetsMaintenanceSchema';

describe('managerAssetsMaintenanceOrderSchema', () => {
  it('validates a correct maintenance order payload', () => {
    const validData = {
      assetName: 'AC Unit 1.5 Ton Inverter',
      issue: 'Compressor tripping after 10 mins',
      vendor: 'Daikin Care',
      cost: '1500',
      scheduledDate: '2026-05-15',
    };

    const result = managerAssetsMaintenanceOrderSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.assetName).toBe('AC Unit 1.5 Ton Inverter');
      expect(result.data.cost).toBe(1500);
    }
  });

  it('fails when assetName is empty', () => {
    const invalidData = {
      assetName: '   ',
      issue: 'Routine servicing',
      scheduledDate: '2026-05-15',
    };

    const result = managerAssetsMaintenanceOrderSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.assetName).toBeDefined();
    }
  });

  it('fails when issue description is too short', () => {
    const invalidData = {
      assetName: 'Water Purifier',
      issue: 'No',
      scheduledDate: '2026-05-15',
    };

    const result = managerAssetsMaintenanceOrderSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.issue).toBeDefined();
    }
  });

  it('rejects negative or invalid cost', () => {
    const negativeData = {
      assetName: 'CCTV Camera',
      issue: 'Lens blurred',
      cost: '-500',
      scheduledDate: '2026-05-15',
    };

    const resultNegative = managerAssetsMaintenanceOrderSchema.safeParse(negativeData);
    expect(resultNegative.success).toBe(false);

    const nonNumberData = {
      assetName: 'CCTV Camera',
      issue: 'Lens blurred',
      cost: 'abc',
      scheduledDate: '2026-05-15',
    };

    const resultNonNum = managerAssetsMaintenanceOrderSchema.safeParse(nonNumberData);
    expect(resultNonNum.success).toBe(false);
  });

  it('defaults cost to 0 when omitted or empty string', () => {
    const emptyCostData = {
      assetName: 'Ergonomic Chair',
      issue: 'Hydraulic wheel loose',
      cost: '',
      scheduledDate: '2026-05-15',
    };

    const result = managerAssetsMaintenanceOrderSchema.safeParse(emptyCostData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cost).toBe(0);
    }
  });
});

