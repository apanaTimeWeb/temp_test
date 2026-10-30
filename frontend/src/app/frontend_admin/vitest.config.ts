import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const frontendRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/app\/frontend_admin\//, replacement: frontendRoot },
      { find: /^@\/components\//, replacement: `${frontendRoot}components/` },
      { find: /^@\/lib\//, replacement: `${frontendRoot}lib/` },
      { find: /^@\//, replacement: frontendRoot },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/mswServer'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    clearMocks: true,
    restoreMocks: true,
  },
});
