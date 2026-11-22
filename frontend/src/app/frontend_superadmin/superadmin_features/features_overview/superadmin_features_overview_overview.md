# Feature & Module Control - High-Level Overview

## Purpose
In a multi-tenant library management SaaS platform, different libraries operate on varying subscription tiers, operational scales, and business models. SuperAdmin must have granular, instant control over which modules each library account and branch can utilize.

## Key Capabilities
- **16 Core Modules Supported:** Dashboard, Books, Members, Seats, Circulation (Issue & Return), Finance, Accounts, Communication, Staff, Reports, Export/Import, Advanced Analytics, WhatsApp, SMS, Barcode/QR, and API Access.
- **3 Governance Levels:** Platform Defaults (Killswitch), Plan Entitlements (Starter/Pro/Enterprise), and Account/Branch Overrides.
- **Zero Frontend Illusion:** Feature toggles enforce real backend HTTP 403 API blocking.
