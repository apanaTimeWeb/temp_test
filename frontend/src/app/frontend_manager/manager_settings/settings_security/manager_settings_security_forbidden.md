# Settings Security — Forbidden Behaviors

- **No Mixing of Branch Facility Data**: Do not store physical branch facility information (address, seat counts, library hours, Wi-Fi credentials) in this security module. That belongs exclusively to `settings_branch_info`.
- **No Hardcoded Plaintext Passwords in Store**: Real credentials must not be stored in plaintext.
- **No Unsafe Session Termination**: Terminating the "Current Device" session without explicit warning is forbidden.
- **No Bypass of Password Policies**: Passwords must strictly enforce the length, symbol, casing, and number requirements.
- **No Direct Mutation of Parent State**: Child panels must notify parent via explicit updater callbacks.
- **No Inline Styles**: Visual UI must adhere to semantic Tailwind classes and design tokens.
