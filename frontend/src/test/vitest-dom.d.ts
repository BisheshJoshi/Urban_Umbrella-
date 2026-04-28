import "vitest";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

/* Augment Vitest's Assertion interface with jest-dom matchers */
declare module "vitest" {
  interface Assertion<T = unknown> extends TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown, void> {}
}
