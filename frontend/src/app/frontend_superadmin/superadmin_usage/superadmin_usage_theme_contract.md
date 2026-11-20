# Superadmin Usage — Domain Theme Contract

This domain consumes semantic theme tokens defined in `globals.css` via Tailwind CSS:

## Consumed Design Tokens
- `--primary`: Core accent color for primary gauges and CTAs
- `--bg-page`: Page background
- `--bg-card`: Card container background
- `--border`: Card and table border lines
- `--text-primary`: Primary headings
- `--text-secondary`: Subtitles and labels
- `--success`, `--success-bg`, `--success-text`: Safe quota consumption (<80%)
- `--warning`, `--warning-bg`, `--warning-text`: High utilization quota (80%-95%)
- `--danger`, `--danger-bg`, `--danger-text`: Exceeded or critical quota (>=95%)
- `--chart-primary`, `--chart-success`, `--chart-warning`, `--chart-info`: Gauge visual meters
