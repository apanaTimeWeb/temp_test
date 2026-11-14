// RESPONSIBILITY: Define local sample fixtures for libraries facility asset registry; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_facility_asset_registry/mocks/fixtures/SuperadminLibrariesOverviewFacilityAssetRegistryAssetMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAccountingAsset } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/types/SuperadminLibrariesOverviewFacilityAssetRegistryAssetTypes';

/** Synthetic accounting assets for local preview only. */
export const SUPERADMIN_ACCOUNTING_SAMPLE_ASSETS: readonly SuperadminAccountingAsset[] = [
  { id: 1, name: 'AC Unit — Hall A', category: 'Appliance', purchaseDate: '2023-06-01', purchaseValue: 45000, currentValue: 32000, location: 'Ground Floor', status: 'active' },
  { id: 2, name: 'CCTV Camera Set (8)', category: 'Security', purchaseDate: '2022-11-15', purchaseValue: 28000, currentValue: 18000, location: 'All Floors', status: 'active' },
  { id: 3, name: 'Water Purifier', category: 'Appliance', purchaseDate: '2024-01-10', purchaseValue: 12000, currentValue: 10000, location: 'Ground Floor', status: 'maintenance' },
  { id: 4, name: 'Study Tables (20)', category: 'Furniture', purchaseDate: '2021-08-20', purchaseValue: 60000, currentValue: 35000, location: 'First Floor', status: 'active' },
  { id: 5, name: 'Biometric Scanner', category: 'Security', purchaseDate: '2023-03-05', purchaseValue: 8500, currentValue: 6000, location: 'Entrance', status: 'active' },
  { id: 6, name: 'Sample Printer Asset', category: 'Electronics', purchaseDate: '2020-05-12', purchaseValue: 15000, currentValue: 0, location: 'Store Room', status: 'disposed' },
];
