# Backend Integration Specification — Omnichannel Notification Center

## 1. Overview
The Notification Center module (`manager_communication/communication_notification_center`) serves as the central hub for dispatching mass alerts, targeted fee reminders, subscription expiry notices, and operational bulletins across WhatsApp, SMS, and In-App Push notifications.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/manager/communication/broadcast` | `{ channels: string[], targetGroup: string, templateId?: string, message: string, scheduledFor?: string }` | Dispatch mass notification campaign | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/communication/history` | `channel`, `status`, `page`, `limit` | Past broadcast campaign history with delivery statistics | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/communication/audience-estimate` | `targetGroup` (`all`, `active`, `due_soon`, `expired`, `morning_shift`) | Real-time member count for target audience selection | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
POST /api/v1/manager/communication/broadcast HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_broadcast_01
```

### 2.2. Broadcast Request Payload
```json
{
  "channels": ["whatsapp", "sms"],
  "targetGroup": "due_soon",
  "templateId": "fee_reminder_friendly",
  "variables": {
    "branchName": "Green Valley Library",
    "dueDate": "2026-04-15"
  },
  "message": "Dear student, your library membership at Green Valley Library is due for renewal on 2026-04-15. Please renew at the desk or online to retain your assigned seat.",
  "scheduledFor": null
}
```

### 2.3. Response Payload
```json
{
  "success": true,
  "message": "Broadcast campaign initiated successfully",
  "data": {
    "campaignId": "CMP-20260412-0941",
    "targetCount": 24,
    "queued": 24,
    "sent": 0,
    "estimatedCostInCents": 1200,
    "channels": ["whatsapp", "sms"]
  },
  "requestId": "req_broadcast_01"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerCommunicationNotificationCenterPage.tsx` with draft form `ManagerCommunicationNotificationCenterNotificationDraftForm.tsx` and past campaign history `ManagerCommunicationNotificationCenterNotificationHistorySection.tsx`.
- **Validation**: Schema-driven character counting and placeholder validation.
- **Standalone Fallback**: Hydrates with `MANAGERNOTIFICATIONCENTERNOTIFICATIONCENTER_CONTRACT_GAP_MOCK` when running standalone without live gateway credentials.
- **Fail-Safe**: Warns before firing broadcasts with confirmation modals.

