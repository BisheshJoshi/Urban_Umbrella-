import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import ErrorBoundary from "./ErrorBoundary";

function Boom(): never {
  throw new Error("boom");
}

test("renders fallback UI on render error", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>,
  );

  expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument();
  expect(screen.getByText(/boom/i)).toBeInTheDocument();
  spy.mockRestore();
});
