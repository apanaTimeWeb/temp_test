import { describe, it, expect } from 'vitest';
import { managerAssetsRegisterAssetFormSchema } from '../schemas/ManagerAssetsRegisterAssetFormSchema';

describe('managerAssetsRegisterAssetFormSchema', () => {
  it('validates a complete, valid asset registration payload', () => {
    const validData = {
      name: 'Ergonomic Mesh Chair Model X',
      category: 'Furniture',
      purchaseValue: '4500',
      location: 'Reading Hall A',
      purchaseDate: '2026-05-10',
      status: 'active',
    };

    const result = managerAssetsRegisterAssetFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Ergonomic Mesh Chair Model X');
      expect(result.data.purchaseValue).toBe(4500);
      expect(result.data.category).toBe('Furniture');
    }
  });

  it('fails when asset name is shorter than 2 characters', () => {
    const invalidData = {
      name: 'A',
      category: 'Furniture',
      purchaseValue: '1000',
      location: 'Hall',
      purchaseDate: '2026-05-10',
    };

    const result = managerAssetsRegisterAssetFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it('fails when purchase cost is zero or negative', () => {
    const zeroCostData = {
      name: 'Daikin AC',
      category: 'Appliance',
      purchaseValue: '0',
      location: 'Hall',
      purchaseDate: '2026-05-10',
    };

    const resultZero = managerAssetsRegisterAssetFormSchema.safeParse(zeroCostData);
    expect(resultZero.success).toBe(false);

    const negCostData = {
      name: 'Daikin AC',
      category: 'Appliance',
      purchaseValue: '-500',
      location: 'Hall',
      purchaseDate: '2026-05-10',
    };

    const resultNeg = managerAssetsRegisterAssetFormSchema.safeParse(negCostData);
    expect(resultNeg.success).toBe(false);
  });

  it('allows all 3 statuses: active, maintenance, and disposed', () => {
    ['active', 'maintenance', 'disposed'].forEach((status) => {
      const data = {
        name: 'Old Laser Printer',
        category: 'Electronics',
        purchaseValue: '8000',
        location: 'Storage',
        purchaseDate: '2026-01-01',
        status,
      };
      const result = managerAssetsRegisterAssetFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

