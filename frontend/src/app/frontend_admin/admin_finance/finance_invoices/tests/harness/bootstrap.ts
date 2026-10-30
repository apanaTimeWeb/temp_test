/** Deterministic module-local Testing Library cleanup for standalone harness specs. */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
