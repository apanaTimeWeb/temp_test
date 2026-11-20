// RESPONSIBILITY: Constants for SuperAdmin Plans & Pricing Catalog module.

export const SUPERADMIN_PLANS_PRICING_CATALOG_CONSTANTS = Object.freeze({
  DEFAULT_PAGE_SIZE: 10,
  CYCLE_DISCOUNTS: {
    HALF_YEARLY_PERCENT: 10,
    ANNUAL_PERCENT: 17,
  },
  DEFAULT_QUOTAS: {
    STARTER: {
      BRANCHES: 1,
      ADMINS: 1,
      STAFF: 3,
      MEMBERS: 250,
      STORAGE_GB: 5,
      SMS: 500,
      WHATSAPP: 200,
    },
    PRO: {
      BRANCHES: 3,
      ADMINS: 5,
      STAFF: 15,
      MEMBERS: 1500,
      STORAGE_GB: 35,
      SMS: 3500,
      WHATSAPP: 1500,
    },
    ENTERPRISE: {
      BRANCHES: 10,
      ADMINS: 20,
      STAFF: 50,
      MEMBERS: 5000,
      STORAGE_GB: 100,
      SMS: 10000,
      WHATSAPP: 5000,
    },
  },
});
