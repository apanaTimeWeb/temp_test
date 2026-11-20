# SaaS Subscriptions Overview

## Overview
Owns tenant SaaS subscription lifecycle, billing MRR, tier upgrades/downgrades, auto-renewal toggles, and grace period buffer controls for SuperAdmin.

## Features
- **7 Lifecycle Statuses:** `Active`, `Trial`, `Past Due`, `Grace Period`, `Suspended`, `Cancelled`, `Expired`.
- **Zero Data Loss Guarantee:** Overdue subscriptions transition to 7-day Grace Period, then Restricted Read-Only mode. Data export and platform billing portals remain accessible 24/7.
- **Audit History:** Full chronological timeline of subscription adjustments.
