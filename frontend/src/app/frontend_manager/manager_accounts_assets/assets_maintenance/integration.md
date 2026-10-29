# Backend Integration Specification — Asset Maintenance & Servicing

## 1. Overview
The Asset Maintenance module (`manager_accounts_assets/assets_maintenance`) manages preventative service requests, repair tickets, Annual Maintenance Contracts (AMC), and vendor dispatches for library infrastructure (HVAC, CCTV, Inverters, Biometric Terminals, RO Purifiers). It tracks reported issues, scheduled technician visits, vendor servicing costs, and lifecycle resolution status (`pending`, `in-progress`, `completed`).

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/assets/maintenance` | `status`, `vendor`, `page`, `limit` | Paginated listing of asset maintenance service logs | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/assets/maintenance` | `{ assetName: string, issue: string, scheduledDate: string, vendor: string, estimatedCost?: number }` | Log a new maintenance repair request | `manager`, `branch_admin` |
| `PATCH` | `/api/v1/manager/assets/maintenance/:id/status` | `{ status: "pending" \| "in-progress" \| "completed", finalCost?: number, completionNotes?: string }` | Update repair status and finalize actual repair expense | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/assets/maintenance?status=in-progress HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_maintenance_01
```

### 2.2. Response Payload (`ManagerAssetsMaintenanceLog[]`)
```json
{
  "success": true,
  "message": "Maintenance logs retrieved successfully",
  "data": [
    {
      "id": 1,
      "assetName": "AC Unit — Hall A",
      "issue": "Gas refill & filter cleaning",
      "reportedDate": "2026-04-02",
      "scheduledDate": "2026-04-08",
      "vendor": "CoolTech Services",
      "cost": 180000,
      "status": "completed"
    },
    {
      "id": 2,
      "assetName": "Water Purifier",
      "issue": "Filter replacement",
      "reportedDate": "2026-04-05",
      "scheduledDate": "2026-04-10",
      "vendor": "AquaPure",
      "cost": 90000,
      "status": "in-progress"
    }
  ],
  "meta": {
    "totalTickets": 5,
    "completedTickets": 2,
    "activeServicingCostInCents": 990000,
    "currency": "INR"
  },
  "requestId": "req_maintenance_01"
}
```

### 2.3. Log Maintenance Request Payload (`POST /api/v1/manager/assets/maintenance`)
```json
{
  "assetName": "Study Table Lamp Circuit",
  "issue": "Short circuit trip on Hall B row 3",
  "scheduledDate": "2026-04-16",
  "vendor": "ElectroQuick Services",
  "estimatedCost": 60000
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAssetsMaintenancePage.tsx` using `ManagerAssetsMaintenanceNativeTable.tsx`.
- **Cost Calculations**: Costs handled in smallest currency units (cents/paise) and formatted via `useManagerAssetsMaintenanceCurrencyFormatter`.
- **Standalone Mode**: Populated by `MANAGER_ASSETS_MAINTENANCE_SAMPLE_LOGS` from `ManagerAssetsMaintenanceFixtures.ts`.
- **Null Safety**: Gracefully falls back to en-dash `—` when scheduled date or vendor details are missing.

