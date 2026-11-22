# Superadmin Data, Backup & Disaster Recovery — Master Domain Theme Contract

## 1. Required Design System CSS Variables
The Superadmin Data domain relies on the following semantic theme tokens mapped via `@theme inline` in `globals.css`:

### Surface & Layout
- `--bg-page`: Main background canvas
- `--bg-card`: Card, panel, and table background
- `--border`: Card and divider borders
- `--text-primary`: Primary headings and content text
- `--text-secondary`: Subtitles and table metadata
- `--text-disabled`: Disabled buttons and hint labels

### Semantic Status Colors
- `--success`, `--success-bg`, `--success-text`: Verified snapshots, successful restore drills, completed exports
- `--warning`, `--warning-bg`, `--warning-text`: In-progress backup operations, expiring archives, pending jobs
- `--danger`, `--danger-bg`, `--danger-text`: Failed restore drills, storage limit warnings, destructive actions
- `--info`, `--info-bg`, `--info-text`: Platform replication telemetry, WAL archiving stream

### Domain Accents
- `--pink-400`, `--pink-500`, `--pink-600`: Superadmin Data domain signature accent
- `--border-focus`, `--focus-ring`: Accessible keyboard focus rings

## 2. Invariant Rules
- Zero inline hex colors (`#...`) in JSX.
- Zero raw opacity modifiers on semantic tokens (e.g., `bg-success/10` is strictly forbidden; use `bg-success-bg`).
- Minimum contrast ratio ≥ 4.5:1 against card surfaces in both Light and Dark modes.
