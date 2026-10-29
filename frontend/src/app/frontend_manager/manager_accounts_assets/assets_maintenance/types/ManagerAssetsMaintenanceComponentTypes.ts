/** Module-local component props and UI/state types extracted from component files. */

// RESPONSIBILITY: Render the empty-state presentation for the assets maintenance feature. It does not own backend persistence or cross-feature business logic.
export interface ManagerAssetsMaintenanceEmptyStateProps { title: string; }

export type QueryValue = string | string[] | undefined;

export type ManagerAssetsMaintenancePageProps = { searchParams?: Promise<{ view?: QueryValue; id?: QueryValue }> };
