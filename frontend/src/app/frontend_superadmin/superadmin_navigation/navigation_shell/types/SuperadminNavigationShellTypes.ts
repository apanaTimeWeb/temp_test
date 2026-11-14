// FLOW: Feature source -> superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Shell Types; defines module-owned type contracts for the named data boundary. */
import type { SuperadminNavigationDensity } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/utils/SuperadminNavigationShellDensityStorage';

/**
 * Defines the public SuperadminNavigationHeaderProps contract for the Superadmin navigation shell. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property onMenuClick Callback for the corresponding user interaction. Declared type: () => void.
 * @property menuExpanded Value defined by the existing feature-local contract. Declared type: boolean.
 * @property density Value defined by the existing feature-local contract. Declared type: SuperadminNavigationDensity.
 * @property onDensityChange Callback for the corresponding user interaction. Declared type: (density: SuperadminNavigationDensity) => void.
 */
export interface SuperadminNavigationHeaderProps {
  onMenuClick?: () => void;
  menuExpanded: boolean;
  density: SuperadminNavigationDensity;
  onDensityChange: (density: SuperadminNavigationDensity) => void;
}

/**
 * Defines the public SuperadminNavigationSidebarProps contract for the Superadmin navigation shell. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property open Value defined by the existing feature-local contract. Declared type: boolean.
 */
export interface SuperadminNavigationSidebarProps {
  open?: boolean;
  mobileViewport?: boolean;
}
