# Feature & Module Control - Feature Specifications

## Supported Modules (16 Modules Registry)
1. **Dashboard Overview (`mod_dashboard`)**: Multi-branch operational analytics and live occupancy metrics.
2. **Books & Catalogue (`mod_books`)**: ISBN lookup, cataloging, physical copy inventory.
3. **Members & Students (`mod_members`)**: Student enrollment, digital ID cards, KYC verification.
4. **Seat Management & Shifts (`mod_seats`)**: Interactive 2D/3D seat layout matrix, morning/evening shifts.
5. **Issue & Return (`mod_circulation`)**: Book checkout, return, late fines, circulation audit.
6. **Finance & Fee Collection (`mod_finance`)**: Student monthly dues, invoices, fee receipts.
7. **Accounts & Settlement (`mod_accounts`)**: Day-end cash drawer settlement, expense ledgers.
8. **Communication & Notices (`mod_communication`)**: Notice boards, broadcasts, automated reminders.
9. **Staff Management (`mod_staff`)**: Librarian permissions, duty rosters, biometric attendance.
10. **Reports & Audits (`mod_reports`)**: Historical analytics, branch comparison, register export.
11. **Export & Bulk Import (`mod_export_import`)**: CSV/Excel onboarding and system dumps.
12. **Advanced Analytics & AI (`mod_analytics`)**: Heatmaps, churn prediction, shift optimization.
13. **WhatsApp Integration (`mod_whatsapp`)**: Official WhatsApp Cloud API messages and alerts.
14. **SMS Integration (`mod_sms`)**: DLT-registered transactional SMS gateway.
15. **Barcode & QR Scanner (`mod_barcode_qr`)**: Barcode labels and student entry turnstile scanner.
16. **Public API & Webhooks (`mod_api_access`)**: REST API keys and external webhook integrations.

## 3 Governance Levels
- **Level 1 (Platform Default)**: Emergency platform-wide killswitch.
- **Level 2 (Plan Entitlement)**: Starter vs Professional vs Enterprise default inclusions.
- **Level 3 (Account / Branch Override)**: Custom exceptions with mandatory audit log reason.
