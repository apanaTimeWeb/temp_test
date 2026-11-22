// RESPONSIBILITY: Define compile-time types for plans promotions; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminPlansPromotionsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
