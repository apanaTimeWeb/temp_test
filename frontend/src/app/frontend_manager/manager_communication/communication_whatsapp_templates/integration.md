# Backend Integration Specification — WhatsApp Business Message Templates

## 1. Overview
The WhatsApp Templates module (`manager_communication/communication_whatsapp_templates`) manages WhatsApp Business Cloud API / Meta HSM pre-approved templates. It manages parameterized variables (`{{name}}`, `{{amount}}`, `{{dueDate}}`, `{{receiptNo}}`), template categories (`UTILITY`, `AUTHENTICATION`, `MARKETING`), and language variations (`en`, `hi`).

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/communication/whatsapp/templates` | `category`, `status` (`APPROVED`, `PENDING`, `REJECTED`), `language` | List all synced Meta templates | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/communication/whatsapp/templates` | `{ name: string, category: string, bodyText: string, variables: string[], language: string }` | Submit new template to Meta for approval | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/communication/whatsapp/templates/:id/sync` | None | Poll and sync latest approval status from Meta API | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/communication/whatsapp/templates?status=APPROVED HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_wa_templates_01
```

### 2.2. Response Payload (`ManagerCommunicationWhatsappTemplatesTemplateResponse[]`)
```json
{
  "success": true,
  "message": "Templates loaded successfully",
  "data": [
    {
      "id": "tpl_welcome_student_v2",
      "name": "welcome_new_admission",
      "category": "UTILITY",
      "language": "en",
      "status": "APPROVED",
      "bodyText": "Hello {{1}}, welcome to {{2}}! Your Smart ID is {{3}} and your assigned seat is {{4}}. Study peacefully!",
      "variables": ["studentName", "branchName", "smartId", "seatNumber"],
      "createdAt": "2026-01-10T11:00:00Z"
    },
    {
      "id": "tpl_fee_receipt_v1",
      "name": "fee_payment_receipt",
      "category": "UTILITY",
      "language": "en",
      "status": "APPROVED",
      "bodyText": "Dear {{1}}, we have received your payment of {{2}} for Receipt {{3}}. Your membership is now active until {{4}}.",
      "variables": ["studentName", "amount", "receiptNumber", "expiryDate"],
      "createdAt": "2026-01-15T09:30:00Z"
    }
  ],
  "meta": {
    "totalTemplates": 8,
    "approvedCount": 7,
    "pendingCount": 1
  },
  "requestId": "req_wa_templates_01"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerCommunicationWhatsappTemplatesPage.tsx` with template preview card and dynamic variable binding tester.
- **Validation**: Ensures placeholders in template body match defined variables (`{{1}}` corresponds to variable index).
- **Standalone Mode**: Populated by `MANAGERWHATSAPPTEMPLATESWHATSAPPTEMPLATES_CONTRACT_GAP_MOCK` when disconnected from live WhatsApp API gateways.
- **Fail-Safe**: Prevents dispatching unapproved templates with disabled trigger guards.

