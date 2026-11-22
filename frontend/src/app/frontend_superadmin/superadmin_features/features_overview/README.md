# SuperAdmin Feature & Module Control (`features_overview`)

## Overview
This module gives SuperAdmin granular 3-tier governance over all 16 library modules for every tenant library and branch across the Edulibra platform, coupled with backend API Guard denial simulation.

## 3 Governance Hierarchy Levels
1. **Level 1: Platform Default (System-Wide Killswitch)**
   - Controls whether a feature exists on the platform at all.
   - If Platform Default = OFF, no tenant or branch can access it under any circumstances.
2. **Level 2: Plan Entitlement (Starter / Professional / Enterprise)**
   - Controls which features are included in base subscription tiers.
3. **Level 3: Account / Branch Override (Custom Exception)**
   - SuperAdmin can set `Force_Enabled` or `Force_Disabled` with mandatory audit justifications and optional expiration dates.

## Backend API Denial Enforcement
Disabling a feature does NOT merely hide a button on the UI sidebar. The API middleware rejects incoming requests for that module with **HTTP 403 Forbidden** and a `{ success: false, errorCode: "FEATURE_DISABLED" }` payload. The built-in API Guard simulator lets SuperAdmin execute live probe requests against endpoints to inspect this behavior.

## Directory Structure
- `api/`: API contract abstractions.
- `components/`: Modular UI pieces (each strictly < 300 lines).
- `config/`: URL and endpoint routes configuration.
- `constants/`: Complete registry of all 16 library modules.
- `contracts/`: Host stub ambient type definitions.
- `hooks/`: State orchestration and confirmation dialog hooks.
- `locales/`: Internationalization catalogs (English and Hindi).
- `mocks/`: Mock tenant fixtures and initial states.
- `schemas/`: Zod schemas for override forms and toggles.
- `tests/`: Automated unit and integration Vitest suites.
- `types/`: Complete TypeScript interface definitions.
- `utils/`: 3-level resolution engine and API guard simulator.
