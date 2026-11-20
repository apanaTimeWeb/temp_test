# SuperAdmin Feature & Module Governance - User Guide

## Step-by-Step Operator Guide

### 1. Managing System-Wide Platform Defaults (Level 1)
1. In the **Governance Scope** dropdown, ensure **🌐 Platform-Wide Defaults** is selected.
2. Toggle the switch next to any module (e.g. `Public API & Webhooks`).
3. If turning OFF a feature that is currently globally enabled, a confirmation prompt warns that this will immediately disable the feature and block API access across all libraries.

### 2. Granting a Custom Exception (Level 3 Override)
1. Select the target Library in the **Governance Scope** dropdown (e.g. *Patna Central Reading Rooms*).
2. Choose either **All Branches** or select a specific branch (e.g. *Kankarbagh Main Hall*).
3. Find the module you wish to modify (e.g. `WhatsApp Integration`).
4. Click **Set Override**.
5. Choose **Force Enable** (to grant access not in plan) or **Force Disable** (to restrict access).
6. Enter an **Audit Justification / Reason** (required, min 3 characters).
7. Optionally specify an **Expiry Date** for promotional trials.
8. Click **Save Custom Override**.

### 3. Testing Backend API Denial (API Guard Simulator)
1. Click **Test API Guard** on any module card or matrix row.
2. The modal displays the 3-level governance evaluation breakdown.
3. Select an endpoint (e.g. `POST /api/v1/library/integrations/whatsapp/send`).
4. Click **Send Request Probe**.
5. Observe the live HTTP response:
   - If denied: `HTTP 403 Forbidden` with `errorCode: "FEATURE_DISABLED"`.
   - If allowed: `HTTP 200 OK`.
6. Click **Copy Payload** to copy the JSON response for debugging or compliance logs.
