// mocks/fixtures/admin_assets_register.fixtures.ts
import type {
  AdminAssetRecord,
  AdminAssetsRegisterKpiSummary,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';

export const ADMIN_ASSET_REGISTER_FIXTURES: AdminAssetRecord[] = [
  {
    id: 'ast-kb-ac-01',
    assetCode: 'KB-AC-DAIKIN-01',
    name: 'Daikin 1.5T 5-Star Inverter Split AC',
    category: 'AC_HVAC',
    branchId: 'br-karol-bagh',
    branchName: 'Karol Bagh Central',
    locationWithinBranch: 'Floor 1 — Silent Study Hall A',
    purchaseDate: '2025-11-15',
    purchaseCost: 4800000, // ₹48,000.00
    currentBookValue: 3840000, // ₹38,400.00
    vendorName: 'Daikin Airconditioning India',
    vendorContact: '+91 98110 22334',
    warrantyExpiryDate: '2026-11-15', // Expiring in 14 days!
    amcStatus: 'UNDER_WARRANTY',
    amcVendorName: 'Daikin Direct Care',
    amcVendorContact: '1800-102-4455',
    amcExpiryDate: '2026-11-15',
    lastServiceDate: '2026-08-10',
    nextScheduledServiceDate: '2026-11-10',
    status: 'OPERATIONAL',
    serialNumber: 'FTKF50TV16U-9921',
    notes: 'Warranty expires Nov 15! Owner must schedule free 4th quarter preventative service before expiry.',
  },
  {
    id: 'ast-lx-inv-01',
    assetCode: 'LX-UPS-MICROTEK-01',
    name: 'Microtek 10kVA Online Heavy-Duty UPS System (16 Batteries)',
    category: 'INVERTER_POWER',
    branchId: 'br-laxmi-nagar',
    branchName: 'Laxmi Nagar Hub',
    locationWithinBranch: 'Basement Power Room',
    purchaseDate: '2025-06-10',
    purchaseCost: 16500000, // ₹1,65,000.00
    currentBookValue: 14000000, // ₹1,40,000.00
    vendorName: 'Microtek Power Systems',
    vendorContact: '+91 98991 44552',
    warrantyExpiryDate: '2027-06-10',
    amcStatus: 'ACTIVE_AMC',
    amcVendorName: 'Microtek Enterprise Care',
    amcVendorContact: '+91 11 4110 9988',
    amcExpiryDate: '2027-06-10',
    lastServiceDate: '2026-09-15',
    nextScheduledServiceDate: '2026-12-15',
    status: 'OPERATIONAL',
    serialNumber: 'MT-MAX-10K-8812',
    notes: 'Comprehensive AMC covers quarterly distilled water top-up and battery gravity check.',
  },
  {
    id: 'ast-kb-ro-01',
    assetCode: 'KB-RO-KENT-50L',
    name: 'Kent Commercial RO 50 LPH + 100L Stainless Steel Water Chiller',
    category: 'WATER_PURIFIER',
    branchId: 'br-karol-bagh',
    branchName: 'Karol Bagh Central',
    locationWithinBranch: 'Pantry / Refreshment Area',
    purchaseDate: '2024-08-01',
    purchaseCost: 3200000, // ₹32,000.00
    currentBookValue: 1920000, // ₹19,200.00
    vendorName: 'Kent RO Systems Ltd',
    vendorContact: '+91 98711 00223',
    warrantyExpiryDate: '2025-08-01',
    amcStatus: 'EXPIRED_NO_AMC',
    amcVendorName: null,
    amcVendorContact: null,
    amcExpiryDate: null,
    lastServiceDate: '2026-04-12',
    nextScheduledServiceDate: '2026-10-15',
    status: 'MAINTENANCE_REQUIRED',
    serialNumber: 'KENT-COMM-50-771',
    notes: 'AMC expired. Membrane TDS reading 280 ppm. Needs new AMC contract before students complain.',
  },
  {
    id: 'ast-noida-chair-01',
    assetCode: 'N62-FURN-CHAIR-80',
    name: 'Featherlite Ergonomic High-Back Mesh Chairs (Lot of 80)',
    category: 'FURNITURE',
    branchId: 'br-noida-62',
    branchName: 'Noida Sector 62',
    locationWithinBranch: 'Cubicle Hall 1 & 2',
    purchaseDate: '2025-02-20',
    purchaseCost: 24000000, // ₹2,40,000.00
    currentBookValue: 21600000, // ₹2,16,000.00
    vendorName: 'Featherlite Furniture Noida',
    vendorContact: '+91 120 455 8899',
    warrantyExpiryDate: '2028-02-20',
    amcStatus: 'NOT_APPLICABLE',
    amcVendorName: null,
    amcVendorContact: null,
    amcExpiryDate: null,
    lastServiceDate: null,
    nextScheduledServiceDate: null,
    status: 'OPERATIONAL',
    serialNumber: 'FL-OPT-MESH-2025-80',
    notes: '3-year comprehensive frame and hydraulic warranty.',
  },
  {
    id: 'ast-mn-cctv-01',
    assetCode: 'MN-CCTV-HIK-16CH',
    name: 'Hikvision 16-Channel 5MP IP Camera System with 4TB NVR',
    category: 'CCTV_SECURITY',
    branchId: 'br-mukherjee-nagar',
    branchName: 'Mukherjee Nagar Study Center',
    locationWithinBranch: 'Reception Rack & All Halls',
    purchaseDate: '2025-04-10',
    purchaseCost: 5500000, // ₹55,000.00
    currentBookValue: 4400000, // ₹44,000.00
    vendorName: 'SafeEye Security Solutions',
    vendorContact: '+91 99100 88214',
    warrantyExpiryDate: '2027-04-10',
    amcStatus: 'ACTIVE_AMC',
    amcVendorName: 'SafeEye Security Solutions',
    amcVendorContact: '+91 99100 88214',
    amcExpiryDate: '2027-04-10',
    lastServiceDate: '2026-07-20',
    nextScheduledServiceDate: '2026-11-20',
    status: 'UNDER_REPAIR',
    serialNumber: 'HIK-NVR7616-4K-01',
    notes: 'Camera #3 (Night hall corner) IR night vision sensor flickering. Technician visit scheduled.',
  },
];

export const ADMIN_ASSET_REGISTER_KPI_FIXTURES: AdminAssetsRegisterKpiSummary = {
  totalAssetsCount: 5,
  totalCapExValue: 54000000, // ₹5,40,000.00
  activeAmcCount: 2,
  warrantyExpiringSoonCount: 1, // Daikin AC expiring in 14 days
  underRepairCount: 2, // 1 Maintenance Required + 1 Under Repair
};

