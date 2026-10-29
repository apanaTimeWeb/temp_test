# Members — Domain Contract

## Purpose

This directory is a quarantined Manager Library domain root. It owns the domain layout, a redirect-only root page, and this documentation trio. Feature behavior belongs to the terminal canonical leaf modules below.

## Frozen child modules

- `members_directory` — `/frontend_manager/manager_members/members_directory`
- `members_new_admission` — `/frontend_manager/manager_members/members_new_admission`
- `members_group_admission` — `/frontend_manager/manager_members/members_group_admission`
- `members_alumni` — `/frontend_manager/manager_members/members_alumni`
- `members_document_vault` — `/frontend_manager/manager_members/members_document_vault`
- `members_id_card_generator` — `/frontend_manager/manager_members/members_id_card_generator`
- `members_referral_bonus` — `/frontend_manager/manager_members/members_referral_bonus`
- `members_enquiries` — `/frontend_manager/manager_members/members_enquiries`

## Route ownership

- Root URL: `/frontend_manager/manager_members`.
- Default leaf: `/frontend_manager/manager_members/members_directory`.
- Root `page.tsx` redirects to that canonical leaf. It must not render aggregate feature views or retain legacy query-view routing.
- Each child owns `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, its URL config, implementation, tests, and the required leaf documentation trio.
- The shared role shell lives in `frontend_manager/manager_navigation/navigation/`; the domain root must not import sibling feature implementations.

## Change control

Only the frozen children listed above may be added under this domain. Any proposed submodule change must first update the frozen scope and audit ledger; do not create nested business modules or generic shared-business buckets.
