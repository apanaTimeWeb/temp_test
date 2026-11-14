// FLOW: Feature source -> superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Libraries Types; defines module-owned type contracts for the named data boundary. */
import type { SuperadminLibrariesPlan, SuperadminLibrariesStatus } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/constants/SuperadminLibrariesOverviewConstants';

/**
 * Defines the public SuperadminLibrariesLibrary contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property name Display label for the owning feature. Declared type: string.
 * @property location Value defined by the existing feature-local contract. Declared type: string.
 * @property branches Value defined by the existing feature-local contract. Declared type: number.
 * @property students Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminLibrariesStatus.
 * @property plan Value defined by the existing feature-local contract. Declared type: SuperadminLibrariesPlan.
 * @property owner Value defined by the existing feature-local contract. Declared type: string.
 * @property email Value defined by the existing feature-local contract. Declared type: string.
 * @property phone Value defined by the existing feature-local contract. Declared type: string.
 * @property gstNumber Value defined by the existing feature-local contract. Declared type: string.
 * @property revenue Value defined by the existing feature-local contract. Declared type: number.
 * @property joinedAt Value defined by the existing feature-local contract. Declared type: string.
 * @property nextRenewal Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminLibrariesLibrary {
  id: string;
  name: string;
  location: string;
  branches: number;
  students: number;
  status: SuperadminLibrariesStatus;
  plan: SuperadminLibrariesPlan;
  owner: string;
  email: string;
  phone: string;
  gstNumber: string;
  revenue: number;
  joinedAt: string;
  nextRenewal: string;
}

/**
 * Defines the public SuperadminLibrariesPanelMode contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminLibrariesPanelMode = 'view' | 'edit';

/**
 * Defines the public SuperadminLibrariesPanelProps contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property lib Value defined by the existing feature-local contract. Declared type: SuperadminLibrariesLibrary.
 * @property mode Value defined by the existing feature-local contract. Declared type: SuperadminLibrariesPanelMode.
 * @property onClose Callback for the corresponding user interaction. Declared type: () => void.
 * @property onSave Callback for the corresponding user interaction. Declared type: (updated: SuperadminLibrariesLibrary) => Promise<void>.
 * @property onSuspend Callback for the corresponding user interaction. Declared type: (id: string) => Promise<void>.
 */
export interface SuperadminLibrariesPanelProps {
  lib: SuperadminLibrariesLibrary;
  mode: SuperadminLibrariesPanelMode;
  onClose: () => void;
  onSave: (updated: SuperadminLibrariesLibrary) => Promise<void>;
  onSuspend: (id: string) => Promise<void>;
}
