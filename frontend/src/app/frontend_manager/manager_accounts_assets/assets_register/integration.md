# Backend Integration Specification — Fixed Assets Register

## 1. Overview
The Assets Register module (`manager_accounts_assets/assets_register`) catalogues physical assets and facility infrastructure across the library branch. It records equipment categories (Furniture, Appliance, Security, Electronics), purchase dates, capital procurement cost (`purchaseValue`), calculated depreciated book value (`currentValue`), floor location, and operational condition (`active`, `maintenance`, `disposed`).

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/assets` | `category`, `status`, `location`, `page`, `limit` | Paginated listing of registered branch assets | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/assets` | `{ name: string, category: string, purchaseDate: string, purchaseValue: number, location: string, status?: string }` | Register a newly procured asset item | `manager`, `branch_admin` |
| `PUT` | `/api/v1/manager/assets/:id` | `{ name?: string, currentValue?: number, location?: string, status?: string }` | Update asset condition, location, or book value | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/assets/:id/dispose` | `{ disposalDate: string, disposalPrice?: number, reason: string }` | Retire or dispose an obsolete asset | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/assets?status=active HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_assets_register_01
```

### 2.2. Response Payload (`ManagerAssetsRegisterAsset[]`)
```json
{
  "success": true,
  "message": "Assets retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "AC Unit — Hall A",
      "category": "Appliance",
      "purchaseDate": "2023-06-01",
      "purchaseValue": 4500000,
      "currentValue": 3200000,
      "location": "Ground Floor",
      "status": "active"
    },
    {
      "id": 2,
      "name": "CCTV Camera Set (8)",
      "category": "Security",
      "purchaseDate": "2022-11-15",
      "purchaseValue": 2800000,
      "currentValue": 1800000,
      "location": "All Floors",
      "status": "active"
    },
    {
      "id": 3,
      "name": "Water Purifier",
      "category": "Appliance",
      "purchaseDate": "2024-01-10",
      "purchaseValue": 1200000,
      "currentValue": 1000000,
      "location": "Ground Floor",
      "status": "maintenance"
    }
  ],
  "meta": {
    "totalAssets": 6,
    "totalBookValueInCents": 10100000,
    "currency": "INR"
  },
  "requestId": "req_assets_register_01"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAssetsRegisterPage.tsx` using `ManagerAssetsRegisterNativeTable.tsx`.
- **Valuation Precision**: Stored in integer paise (e.g. `4500000` = ₹45,000.00).
- **Standalone Mode**: Backed by `MANAGER_ACCOUNTING_SAMPLE_ASSETS` in `ManagerAssetsRegisterAssetSampleFixtures.ts`.
- **Localization**: Asset category tags and statuses localized with `next-intl`.

