# ManagerHolidayCalendar Store Folder Contract

This module-owned folder is present to satisfy the canonical module structure. No module-wide store implementation is currently justified by the supplied source; state that is private to a component or hook remains local. Do not add an empty Zustand store or duplicate server state. Add a store only when a documented cross-component state requirement exists, with module-prefixed files and tests.
