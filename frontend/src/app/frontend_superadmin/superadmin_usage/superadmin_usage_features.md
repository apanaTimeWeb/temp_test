---
feature: "superadmin_usage"
owner_role: "superadmin"
module_version: 1
api_contract_source: "normative-rules"
last_verified_date: "2026-11-21"
last_verified_commit: "head"
documentation_status: "current"
portability_score: "8/8"
---

# SuperAdmin Usage & Limit Monitoring — Domain Architecture Map

## 1. Scope and System Context
The SuperAdmin Usage domain (`src/app/frontend_superadmin/superadmin_usage/`) provides multi-tenant resource consumption tracking and quota governance across all registered library accounts.
It enables SuperAdmins to:
1. Track Allowed vs Current capacity across **12 distinct resource metrics** (Branches, Admins, Staff, Members, Cloud Storage, File Uploads, SMS Credits, WhatsApp Credits, Email Sending Statistics, API Rate Requests, Export Activity, Backup Snapshots).
2. Enforce the **Zero Silent Extra Billing Guarantee**: Hard stops trigger when limits are reached with transparent overage warnings rather than unapproved background charges.
3. Review and process **Quota & Branch Expansion Requests**: When a library admin hits plan ceilings (e.g. 3/3 branches used and attempts to create a 4th branch), SuperAdmin can approve or reject the request with double-confirmation and customized allocation notes.

### Sub-Module Hierarchy (Tier 3 -> Tier 4)
- `usage_overview/` — Comprehensive 12-resource quota monitoring, high-utilization alerts, library usage table, and detailed resource inspection drawer.
- `usage_quota_requests/` — SuperAdmin approval/rejection queue for branch and resource upgrade requests.

## 2. Universal 12-Resource Metric Matrix
| Metric # | Resource Name | Tracking Unit | Policy Behavior at Cap |
|---|---|---|---|
| 1 | Branch Usage | Branches Allowed vs Active | Hard Block on (Limit + 1) creation; Upgrade/Request CTA |
| 2 | Admin Usage | Admin Accounts Allowed vs Active | Hard Block; requires seat upgrade or SuperAdmin grant |
| 3 | Staff Usage | Staff Seats Allowed vs Active | Warning at 90%, Hard Block at 100% |
| 4 | Member Usage | Active Enrolled Students vs Cap | Notification banner; student registration blocked |
| 5 | Storage Usage | Used GB vs Plan Limit (GB) | Block media upload when cap reached |
| 6 | File Uploads | Total Count & Size in MB/GB | File size limit validation + total volume cap |
| 7 | SMS Usage | Consumed Credits vs Plan Cap | Gateway pause; auto-topup request option |
| 8 | WhatsApp Usage | Consumed Messages vs Cap | Session messaging queue pause |
| 9 | Email Usage | Sent Count vs Limit + Delivery/Bounce % | Rate limiting; reputation safeguard |
| 10 | API Requests | Monthly Requests vs Plan Quota | 429 Too Many Requests response at cap |
| 11 | Export Usage | Export Count & Data Volume (MB) | Rate-limited bulk export operations |
| 12 | Backup Usage | Snapshot Storage (GB) & Status | Automated daily verification & snapshot limits |

## 3. Overage Policy & No-Silent-Billing Mandate
- **Explicit Hard Block:** When a library hits 100% of its quota (e.g., 3 out of 3 branches), further creation of that entity is blocked.
- **Zero Surprise Charges:** No automatic extra debit occurs. The user sees clear upgrade options and can submit an add-on request.
- **SuperAdmin Approval:** SuperAdmin reviews the request in `usage_quota_requests`, and upon approval, updates the library's active quota.
