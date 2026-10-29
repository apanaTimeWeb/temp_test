# Members — Root Theme Contract

- This root is a routing/documentation boundary only; visual UI is owned by the terminal child modules.
- The root redirect page must not introduce feature styles or visual components.
- Child modules must consume semantic design tokens and approved utility classes from the supplied UI/UX design source.
- Hard-coded palette values are prohibited except documented third-party brand treatments required by the integration. The WhatsApp green exception is restricted to WhatsApp-branded controls and is documented in the owning leaf theme contract.
- Do not add inline styles, root-level CSS, duplicate theme providers, or feature-specific global tokens here.
- Visual/browser verification remains `DEFERRED_TO_HOST_RUNTIME` until executed in the complete host application.
