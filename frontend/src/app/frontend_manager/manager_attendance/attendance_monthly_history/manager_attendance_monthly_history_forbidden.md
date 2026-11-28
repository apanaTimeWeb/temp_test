# manager_attendance_monthly_history — Forbidden Rules

- Do not import runtime components, hooks, stores, fixtures, or utilities from sibling attendance submodules (`attendance_daily`, `attendance_absentee_report`, `attendance_qr_scanner`).
- Do not nest sub-submodules inside `attendance_monthly_history/`.
- Do not infer or call unverified backend write endpoints; all preview metrics derive locally until host contracts are supplied.
