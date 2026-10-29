/** Registration harness bootstrap contract. Host test runner supplies jsdom, React Testing Library, Vitest, next-intl and Next navigation mocks. */
export const PUBLIC_AUTH_REGISTRATION_HARNESS = { environment: 'jsdom', required: ['vitest', '@testing-library/react', '@testing-library/jest-dom/vitest'] as const };
