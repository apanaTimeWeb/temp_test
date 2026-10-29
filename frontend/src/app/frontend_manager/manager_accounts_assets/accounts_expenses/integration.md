# Backend Integration Specification — Expense Ledger

## 1. Overview
The Expense Ledger module (`manager_accounts_assets/accounts_expenses`) captures branch operating expenses, utility disbursements, facility upkeep outlays, and petty cash transactions. It includes category-wise aggregations (Electricity, Maintenance, Internet, Salary, Stationery, Cleaning), payment method tags (`cash`, `upi`, `bank`), and an audited expense logging drawer.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/accounts/expenses` | `category`, `startDate`, `endDate`, `mode`, `page`, `limit` | Paginated list of operating expenses | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/accounts/expenses` | Zod schema: `ManagerAccountsExpensesExpenseDraft` | Record a new verified branch expense | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/accounts/expenses/summary` | `month` (e.g. `2026-04`) | Aggregated monthly budget vs spent breakdown | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/accounts/expenses?category=Electricity HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_expenses_01
```

### 2.2. Response Payload (`ManagerAccountsExpensesExpenseSample[]`)
```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "data": [
    {
      "id": 1,
      "date": "2026-04-01",
      "category": "Electricity",
      "description": "Monthly electricity bill",
      "amount": 420000,
      "paidBy": "Manager",
      "mode": "bank"
    },
    {
      "id": 2,
      "date": "2026-04-03",
      "category": "Maintenance",
      "description": "AC servicing — Hall A",
      "amount": 180000,
      "paidBy": "Staff",
      "mode": "cash"
    }
  ],
  "meta": {
    "totalSpentInCents": 1007000,
    "currency": "INR",
    "page": 1,
    "limit": 20
  },
  "requestId": "req_expenses_01"
}
```

### 2.3. Create Expense Request Payload (`POST /api/v1/manager/accounts/expenses`)
```json
{
  "date": "2026-04-14",
  "category": "Stationery",
  "description": "Student register books & thermal paper rolls",
  "amount": 45000,
  "paidBy": "Manager",
  "mode": "upi"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAccountsExpensesPage.tsx` with `ManagerAccountsExpensesExpenseSummaryCards.tsx`, `ManagerAccountsExpensesExpenseCategoryFilter.tsx`, and `ManagerAccountsExpensesExpenseLedger.tsx`.
- **Currency Handling**: ISO 4217 standard (`INR`), stored in smallest currency unit (paise/cents) to avoid floating-point rounding errors.
- **Form Validation**: Evaluated against `managerAccountsExpensesExpenseDraftSchema.ts`.
- **Offline Mode**: Uses `MANAGER_ACCOUNTING_SAMPLE_EXPENSES` fixture from `ManagerAccountsExpensesExpenseSampleFixtures.ts`.

