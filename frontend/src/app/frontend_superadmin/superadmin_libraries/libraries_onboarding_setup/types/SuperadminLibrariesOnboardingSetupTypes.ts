// FLOW: Feature source -> superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Setup Wizard Types; defines module-owned type contracts for the named data boundary. */
import type { z } from 'zod';
import type { branchDetailsSchema, shiftsSchema, seatsSchema, plansSchema } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/schemas/SuperadminLibrariesOnboardingSetupSchema';

/**
 * Defines the public BranchDetailsData contract for libraries onboarding setup. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type BranchDetailsData = z.infer<typeof branchDetailsSchema>;
/**
 * Defines the public ShiftsData contract for libraries onboarding setup. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type ShiftsData = z.infer<typeof shiftsSchema>;
/**
 * Defines the public SeatsData contract for libraries onboarding setup. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SeatsData = z.infer<typeof seatsSchema>;
/**
 * Defines the public PlansData contract for libraries onboarding setup. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type PlansData = z.infer<typeof plansSchema>;
