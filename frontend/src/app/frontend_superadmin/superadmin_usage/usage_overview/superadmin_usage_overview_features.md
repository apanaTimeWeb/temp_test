# Superadmin Usage Overview Features

## Purpose
Provides high-altitude and granular 12-resource utilization monitoring across all registered library accounts with a Zero Silent Extra Billing guarantee.

## 12 Tracked Resources
1. **Branch Usage**: Allowed vs Current active branches. Hard block on N+1 branch creation.
2. **Admin Accounts**: Allowed vs Current provisioned administrative accounts.
3. **Staff Accounts**: Allowed vs Current branch staff operators.
4. **Member Accounts**: Registered library members vs maximum plan threshold.
5. **Storage Usage**: Consumed cloud document and image storage (GB) vs plan ceiling.
6. **File Uploads**: Total files uploaded count & individual file size constraints.
7. **SMS Credits**: Consumed SMS transactional units vs monthly allocated package.
8. **WhatsApp Messages**: WhatsApp Business API outbound messages vs package limit.
9. **Email Usage**: Monthly sending volume, delivery rates, and bounce rates.
10. **API Requests**: Daily/monthly REST & webhook calls with rate limiting (calls/min).
11. **Export Usage**: Frequency of CSV/Excel/PDF exports and total export data payload (MB).
12. **Backup Usage**: Automated snapshot sizes (GB), frequency, and backup status (HEALTHY/WARNING/FAILED).

## Key Workflows
- **Overage Detection**: Flags accounts reaching >=80% (Warning), >=90% (Critical), or 100% (Exceeded).
- **12-Resource Inspection Drawer**: Granular slide-over inspector displaying all metrics per library.
- **Quota Request Forwarding**: Direct routing to `/superadmin/superadmin_usage/usage_quota_requests` for pending expansion reviews.
