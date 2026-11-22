# Backend Integration Specification — Branch Information & Facilities Configuration

## 1. Overview
The Branch Information module (`manager_settings/settings_branch_info`) stores and manages the operational profile of the library branch. It configures the branch identity (name, code, contact phone/email), physical address, seating capacity metrics, operating amenities (High-Speed Fiber Wi-Fi, HVAC Climate Control, RO Drinking Water, UPS Power Backup, CCTV Surveillance, Smart Lockers), and shift schedules.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/settings/branch` | None | Fetch branch profile, amenities, and operational settings | `manager`, `branch_admin` |
| `PUT` | `/api/v1/manager/settings/branch` | Zod schema: `ManagerSettingsBranchInfoSchema` | Update branch profile and amenity settings | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/settings/branch/logo` | `multipart/form-data` | Upload custom branch logo / header banner | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/settings/branch HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_branch_info_01
```

### 2.2. Response Payload (`ManagerSettingsBranchInfo`)
```json
{
  "success": true,
  "message": "Branch profile loaded successfully",
  "data": {
    "branchId": "BR-DEL-001",
    "branchCode": "DEL-NORTH-01",
    "name": "Green Valley Study Hub & Library",
    "phone": "+91 98765 43210",
    "email": "contact@greenvalleylibrary.in",
    "address": {
      "line1": "Plot 42, Commercial Complex, GTB Nagar",
      "city": "New Delhi",
      "state": "Delhi",
      "pincode": "110009"
    },
    "totalSeats": 120,
    "totalLockers": 40,
    "amenities": [
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "RO Water Dispenser",
      "Power Backup (DG)",
      "24/7 CCTV Surveillance",
      "Private Study Cubicles"
    ],
    "operatingHours": {
      "openingTime": "06:00",
      "closingTime": "00:00"
    }
  },
  "requestId": "req_branch_info_01"
}
```

### 2.3. Update Profile Payload (`PUT /api/v1/manager/settings/branch`)
```json
{
  "name": "Green Valley Study Hub & Library",
  "phone": "+91 98765 43210",
  "email": "contact@greenvalleylibrary.in",
  "address": {
    "line1": "Plot 42, Commercial Complex, GTB Nagar",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110009"
  },
  "totalSeats": 120,
  "totalLockers": 40,
  "amenities": [
    "High-Speed Wi-Fi",
    "Air Conditioning",
    "RO Water Dispenser",
    "Power Backup (DG)",
    "24/7 CCTV Surveillance",
    "Private Study Cubicles"
  ]
}
```

## 3. Frontend Architecture
- **Views**: `ManagerSettingsBranchInfoPage.tsx` with section cards for Branch Identity, Address, Capacity, and Amenities.
- **Validation**: Schema-validated using `managerSettingsBranchInfoSchema.ts`.
- **Offline / Standalone Fallback**: Default values hydrate seamlessly from `MANAGER_SETTINGS_BRANCH_INFO_DEFAULTS` without network latency.
- **Form Guard**: Dirty form detection prompts managers before accidental navigation.

