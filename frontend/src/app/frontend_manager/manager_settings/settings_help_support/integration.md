# Backend Integration Specification — Help & Support Desk

## 1. Overview
The Help & Support module (`manager_settings/settings_help_support`) provides a unified technical assistance portal for branch managers. It integrates a searchable knowledge base of SOPs and guides, a support ticket tracking portal with escalation priorities (`Low`, `Medium`, `High`, `Urgent`), live platform status indicators, and emergency helpline contacts.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/support/articles` | `query`, `category` (`All`, `Billing`, `Hardware`, `Seats`, `Account`) | Search documentation and help guides | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/support/tickets` | `status` (`Open`, `In Progress`, `Resolved`, `Closed`), `page`, `limit` | Paginated listing of submitted support tickets | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/support/tickets` | Zod schema: `ManagerSettingsHelpSupportTicketDraft` | Submit a new help desk support ticket | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/support/system-status` | None | Real-time health metrics of Library OS services | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/support/tickets?status=Open HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_help_support_01
```

### 2.2. Response Payload (`ManagerSettingsHelpSupportTicket[]`)
```json
{
  "success": true,
  "message": "Support tickets loaded successfully",
  "data": [
    {
      "id": "TCK-8812",
      "ticketNumber": "TCK-8812",
      "subject": "Biometric Machine Synchronization Lag",
      "category": "Hardware",
      "priority": "High",
      "status": "In Progress",
      "createdAt": "2026-04-12T08:30:00Z",
      "updatedAt": "2026-04-12T10:15:00Z",
      "lastResponseBy": "Library OS Engineering",
      "messageCount": 3
    },
    {
      "id": "TCK-8790",
      "ticketNumber": "TCK-8790",
      "subject": "GST Tax Invoice Generation Query",
      "category": "Billing",
      "priority": "Medium",
      "status": "Resolved",
      "createdAt": "2026-04-10T14:20:00Z",
      "updatedAt": "2026-04-11T11:00:00Z",
      "lastResponseBy": "Accounts Support",
      "messageCount": 2
    }
  ],
  "meta": {
    "totalTickets": 12,
    "openTickets": 1,
    "inProgressTickets": 1,
    "resolvedTickets": 10
  },
  "requestId": "req_help_support_01"
}
```

### 2.3. Submit Ticket Payload (`POST /api/v1/manager/support/tickets`)
```json
{
  "subject": "Thermal Printer Paper Jam Error on Counter 1",
  "category": "Hardware",
  "priority": "Medium",
  "description": "Receipts are printing halfway through with a red LED blink.",
  "attachments": []
}
```

## 3. Frontend Architecture
- **Views**: `ManagerSettingsHelpSupportPage.tsx` with `ManagerSettingsHelpSupportTabs.tsx`, `ManagerSettingsHelpSupportHelpCenterSection.tsx`, `ManagerSettingsHelpSupportSystemStatusSection.tsx`, and `ManagerSettingsHelpSupportTicketForm.tsx`.
- **Search Debounce**: 300ms debounce on documentation lookup with automatic timer cleanup.
- **Unsaved Changes Guard**: Uses accessible modal dialog via `useManagerSettingsHelpSupportConfirm` to guard unsaved ticket drafts against accidental tab switches or navigation.
- **Offline / Standalone Fallback**: Fixture data sourced from `MANAGER_HELP_SUPPORT_SAMPLE_TICKETS` in `ManagerSettingsHelpSupportDemoRepository.ts`.

