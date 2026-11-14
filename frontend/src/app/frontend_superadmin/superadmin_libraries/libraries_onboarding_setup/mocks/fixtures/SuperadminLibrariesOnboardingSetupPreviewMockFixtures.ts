// RESPONSIBILITY: Define local sample fixtures for libraries onboarding setup; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_onboarding_setup/mocks/fixtures/SuperadminLibrariesOnboardingSetupPreviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { BranchDetailsData, PlansData, SeatsData, ShiftsData } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupTypes';

/** Synthetic examples for the source-only setup preview; none of these values represent a real branch. */
export const SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA = {
  libraryName: 'Example Reading Hub',
  address: '123 Example Street',
  city: 'Example City',
  gst: '',
  shifts: [
    { name: 'Morning', start: '06:00', end: '12:00' },
    { name: 'Afternoon', start: '12:00', end: '18:00' },
    { name: 'Evening', start: '18:00', end: '22:00' },
  ],
  seatCount: 60,
  seatPrefix: 'EX-',
  plans: [
    { name: 'Example Monthly', days: 30, price: 1000 },
    { name: 'Example Quarterly', days: 90, price: 2800 },
  ],
} as const;

export const SUPERADMIN_SETUP_WIZARD_PREVIEW_FORM_DEFAULTS: {
  branch: BranchDetailsData;
  shifts: ShiftsData;
  seats: SeatsData;
  plans: PlansData;
} = {
  branch: {
    name: SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA.libraryName,
    address: SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA.address,
    city: SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA.city,
    gst: SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA.gst,
  },
  shifts: { shifts: SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA.shifts.map((shift) => ({ ...shift })) },
  seats: { count: SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA.seatCount, prefix: SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA.seatPrefix },
  plans: { plans: SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA.plans.map((plan) => ({ ...plan })) },
};
