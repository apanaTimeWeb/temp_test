# Superadmin Features Domain - Theme Contract

## Surface & Hierarchy Tokens
- **Background**: `--bg-page: #050505` (Canonical dark page surface)
- **Card**: `--bg-card: #111111` (Feature card elevation)
- **Surface Elevated**: `--bg-surface-elevated: #1a1a1a` (Hover states and chip backgrounds)
- **Primary Accent**: `--primary: #FACC15` (Luxury Gold)
- **Border**: `--border: #222222`

## Status & Governance Level Badges
- **Platform Killswitch Active**: `bg-danger-bg text-danger border-danger-border`
- **Plan Entitled (Active)**: `bg-success-bg text-success border-success-border`
- **Custom Override (Force-Enabled)**: `bg-info-bg text-info border-info-border`
- **Custom Override (Force-Disabled)**: `bg-warning-bg text-warning border-warning-border`
- **Not Entitled**: `bg-surface text-muted border-border`

## Typography & Motion
- Font Scale: Body `text-xs` / `text-sm`, Headings `text-base` / `text-lg`
- Transitions: Strictly guarded with `motion-safe:` prefixes
