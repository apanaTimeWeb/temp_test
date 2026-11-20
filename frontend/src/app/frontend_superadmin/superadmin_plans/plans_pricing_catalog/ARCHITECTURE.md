# Architecture: Plans Pricing Catalog

## Boundaries & Constraints
- Maximum file size: `< 300 lines`
- Zero barrel files (`index.ts` re-exports forbidden)
- Zero native browser dialogs
- Preview & Local State: Modifying plans updates local state with schema validation. Durable persistent mutations occur via platform API gateway when connected.

## Data Flow
```
page.tsx -> SuperadminPlansPricingCatalogPageClient
  -> SuperadminPlansPricingCatalogHeaderKpis (KPIs & Cadence)
  -> SuperadminPlansPricingCatalogTierCards (Tier cards & entitlements)
  -> SuperadminPlansPricingCatalogModal (Creation & Editing)
    -> SuperadminPlansPricingCatalogModalLimits
    -> SuperadminPlansPricingCatalogModalFeatures
```
