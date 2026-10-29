/** Explicitly sample-only accounting asset rows. No live endpoint contract is supplied. */
export type ManagerAssetsRegisterAsset = {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  location: string;
  status: 'active' | 'maintenance' | 'disposed';
};

export const MANAGER_ACCOUNTING_SAMPLE_ASSETS: ManagerAssetsRegisterAsset[] = [
  { id: 1, name: 'AC Unit — Hall A',       category: 'Appliance',  purchaseDate: '2023-06-01', purchaseValue: 4500000, currentValue: 3200000, location: 'Ground Floor', status: 'active'      },
  { id: 2, name: 'CCTV Camera Set (8)',     category: 'Security',   purchaseDate: '2022-11-15', purchaseValue: 2800000, currentValue: 1800000, location: 'All Floors',   status: 'active'      },
  { id: 3, name: 'Water Purifier',          category: 'Appliance',  purchaseDate: '2024-01-10', purchaseValue: 1200000, currentValue: 1000000, location: 'Ground Floor', status: 'maintenance' },
  { id: 4, name: 'Study Tables (20)',       category: 'Furniture',  purchaseDate: '2021-08-20', purchaseValue: 6000000, currentValue: 3500000, location: 'First Floor',  status: 'active'      },
  { id: 5, name: 'Biometric Scanner',       category: 'Security',   purchaseDate: '2023-03-05', purchaseValue: 850000,  currentValue: 600000,  location: 'Entrance',     status: 'active'      },
  { id: 6, name: 'Old Printer',             category: 'Electronics',purchaseDate: '2020-05-12', purchaseValue: 1500000, currentValue: 0,     location: 'Store Room',   status: 'disposed'    },
];

