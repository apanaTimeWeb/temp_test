import assert from 'node:assert/strict';
import { findUnguardedMotionUtilities } from './check-motion-safety.mjs';

const violations = findUnguardedMotionUtilities('<button className="transition-colors motion-safe:duration-base">Save</button>');
assert.equal(violations.length, 1, 'unguarded transition utility must be detected');
assert.equal(violations[0].token, 'transition-colors');
assert.equal(findUnguardedMotionUtilities('<button className="motion-safe:transition-colors motion-safe:duration-base">Save</button>').length, 0, 'motion-safe transition must pass');
assert.equal(findUnguardedMotionUtilities('<span className="motion-safe:animate-spin motion-reduce:hidden" />').length, 0, 'motion-safe animation with reduced-motion alternative must pass');
process.stdout.write('Reduced-motion negative regression tests passed: unguarded transition utilities are rejected; variant-scoped transition/animation utilities pass.\n');
