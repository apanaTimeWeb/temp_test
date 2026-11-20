// FLOW: Feature source -> superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Users Types; defines module-owned type contracts for the named data boundary. */
import type { SuperadminUsersRole, SuperadminUsersStatus } from '@/app/frontend_superadmin/superadmin_users/users_directory/constants/SuperadminUsersDirectoryConstants';
import type { SuperadminUsersFormValues } from '@/app/frontend_superadmin/superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema';
import type { SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes';

/**
 * Defines the public SuperadminUserData contract for users directory. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property name Display label for the owning feature. Declared type: string.
 * @property username Display label for the owning feature. Declared type: string.
 * @property email Value defined by the existing feature-local contract. Declared type: string.
 * @property role Value defined by the existing feature-local contract. Declared type: SuperadminUsersRole.
 * @property branch Value defined by the existing feature-local contract. Declared type: string.
 * @property twoFactor Value defined by the existing feature-local contract. Declared type: boolean.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminUsersStatus.
 * @property lastLogin Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminUserData extends SuperadminUsersFormValues {
  name: string;
  username: string;
  email: string;
  role: SuperadminUsersRole;
  branch: string;
  twoFactor: boolean;
  id: string;
  status: SuperadminUsersStatus;
  lastLogin: string;
  phone?: string;
}

/**
 * Defines the public SuperadminUserFormData contract for users directory. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminUserFormData = SuperadminUsersFormValues;
export type { SuperadminUsersRole, SuperadminUsersStatus };

/**
 * Defines the public SuperadminRolePermissionRow contract for users directory. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property module Value defined by the existing feature-local contract. Declared type: string.
 * @property superadmin Value defined by the existing feature-local contract. Declared type: boolean.
 * @property admin Value defined by the existing feature-local contract. Declared type: boolean.
 * @property manager Value defined by the existing feature-local contract. Declared type: boolean.
 */
export interface SuperadminRolePermissionRow {
  module: string;
  superadmin: boolean;
  admin: boolean;
  manager: boolean;
}

/**
 * Defines the public SuperadminUsersContentProps contract for users directory. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property activeTab Value defined by the existing feature-local contract. Declared type: 'All Users' | 'Roles & Permissions'.
 * @property users Value defined by the existing feature-local contract. Declared type: SuperadminUserData[].
 * @property userCols Value defined by the existing feature-local contract. Declared type: ColDef<SuperadminUserData>[].
 * @property rolePermissions Value defined by the existing feature-local contract. Declared type: SuperadminRolePermissionRow[].
 */
export interface SuperadminUsersContentProps {
  activeTab: 'All Users' | 'Roles & Permissions';
  users: SuperadminUserData[];
  userCols: ColDef<SuperadminUserData>[];
  rolePermissions: SuperadminRolePermissionRow[];
}

/**
 * Defines the public SuperadminUsersModalProps contract for users directory. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property showModal Value defined by the existing feature-local contract. Declared type: boolean.
 * @property editUser Value defined by the existing feature-local contract. Declared type: SuperadminUserData | null.
 * @property onClose Callback for the corresponding user interaction. Declared type: () => void.
 * @property handleSave Value defined by the existing feature-local contract. Declared type: (values: SuperadminUsersFormValues) => void.
 */
export interface SuperadminUsersModalProps {
  showModal: boolean;
  editUser: SuperadminUserData | null;
  onClose: () => void;
  handleSave: (values: SuperadminUsersFormValues) => void;
}
