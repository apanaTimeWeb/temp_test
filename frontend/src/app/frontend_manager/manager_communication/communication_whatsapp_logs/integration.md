# Backend Integration Specification — WhatsApp Message Audit Logs

## 1. Overview
The WhatsApp Logs module (`manager_communication/communication_whatsapp_logs`) audits all outgoing automated and manual WhatsApp messages (welcome onboarding, payment receipts, fee reminders, admission notices, subscription renewals). It tracks real-time gateway delivery webhooks (`Pending`, `Sent`, `Delivered`, `Failed`) with error diagnostics for undelivered messages.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/communication/whatsapp/logs` | `type`, `status`, `dateFrom`, `dateTo`, `search`, `page`, `limit` | Paginated listing of WhatsApp dispatch logs | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/communication/whatsapp/retry/:id` | None | Re-queue and retry a failed message transmission | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/communication/whatsapp/stats` | `date` | Summary of delivery rates, failed counts, and gateway latency | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/communication/whatsapp/logs?status=Delivered HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_wa_logs_01
```

### 2.2. Response Payload (`WaLog[]`)
```json
{
  "success": true,
  "message": "WhatsApp logs retrieved successfully",
  "data": [
    {
      "id": "WA-1001",
      "studentName": "Rahul Sharma",
      "phone": "+91 98••••1234",
      "type": "receipt",
      "message": "Dear Rahul, payment of ₹1,500 for Monthly Plan (Receipt #REC-2026-081) was successful. Thank you!",
      "sentAt": "2026-04-12 10:14 AM",
      "status": "Delivered",
      "errorReason": null
    },
    {
      "id": "WA-1002",
      "studentName": "Priya Verma",
      "phone": "+91 97••••5678",
      "type": "fee_reminder",
      "message": "Dear Priya, your library plan expires in 3 days. Renew now to retain Seat S-14.",
      "sentAt": "2026-04-12 09:30 AM",
      "status": "Failed",
      "errorReason": "Recipient phone not registered on WhatsApp"
    }
  ],
  "meta": {
    "totalLogs": 240,
    "deliveredCount": 232,
    "failedCount": 8,
    "page": 1,
    "limit": 20
  },
  "requestId": "req_wa_logs_01"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerCommunicationWhatsappLogsPage.tsx` using `ManagerCommunicationWhatsappLogsNativeTable.tsx`.
- **Search Debounce**: 300ms live debounce on student search query with timer cleanup on unmount.
- **Privacy Masking**: PII phone numbers are masked using `maskManagerMemberPhone`.
- **Offline / Standalone Fallback**: Backed by `MANAGER_COMMUNICATION_WHATSAPP_LOGS_SAMPLE_RECORDS` in `ManagerCommunicationWhatsappLogsDemoRepository.ts`.

