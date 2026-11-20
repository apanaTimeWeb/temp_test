# SuperAdmin Integrations Overview — Theme Contract

This document declares all semantic CSS tokens and theme variables consumed by `integrations_overview`:

## Core Surface & Layout Tokens
- `--bg-page`: Page background
- `--bg-card`: Card and panel surface
- `--border`: Standard border color
- `--border-focus`: Primary focus ring color
- `--shadow-card`: Card elevation shadow
- `--shadow-dialog`: Modal overlay shadow

## Semantic Status & Action Tokens
- `--primary` & `--text-on-primary`: Primary call to action buttons (Save, Generate)
- `--success-bg` & `--success-text`: Live connected status badges, success indicators
- `--warning-bg` & `--warning-text`: Sandbox/Test mode badges, 504 timeout warnings, failed retry alerts
- `--danger` & `--text-on-danger`: Critical destructive button actions (Revoke Key, Delete Webhook)
- `--danger-bg` & `--danger-text`: Error badges and server failure alerts
- `--purple-bg` & `--purple-text`: Integration icon badges and domain category highlights
- `--skeleton-base` & `--skeleton-highlight`: Pulse skeleton loading components

## Typography Tokens
- `--text-primary` (`text-foreground`): Primary headings and titles
- `--text-secondary` (`text-muted-foreground`): Subtitles, helper text, and timestamps
