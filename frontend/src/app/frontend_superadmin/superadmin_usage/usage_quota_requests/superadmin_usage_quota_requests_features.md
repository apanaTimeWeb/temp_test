# Superadmin Usage Quota Requests Features

## Purpose
Enables SuperAdmin to review, approve, and reject branch expansion requests (e.g. 4th branch attempts when a 3-branch plan limit is reached) and resource limit extension requests across all libraries.

## Workflows
1. **Branch Expansion Gate**:
   - When a library hits its plan ceiling (e.g., Nalanda Digital 3/3 branches), 4th branch creation is strictly blocked.
   - Library Admin submits an expansion request with business justification.
   - SuperAdmin reviews the request, verifies tenant legitimacy, and either approves (increasing quota to 4 branches + assigning optional add-on fee) or rejects (with a mandatory justification note).
2. **Resource Quota Management**:
   - Covers all 12 tracked resources: Storage, SMS Credits, WhatsApp, Admin Accounts, Staff Accounts, and Member Capacities.
3. **Audit Trail & Zero Silent Extra Billing Guarantee**:
   - Every approval and rejection is recorded with the reviewer's session stamp.
   - Never charges libraries silently without explicit plan upgrades or add-on consent.
