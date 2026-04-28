import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

import App from "./App";

test("renders app shell and primary hero content", () => {
  render(<App />);
  expect(screen.getAllByText(/urban umbrella/i).length).toBeGreaterThan(0);
  expect(screen.getByRole("heading", { name: /is your dapp actually safe\?/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /connect wallet/i })).toBeInTheDocument();
});

test("navigates to URL scanner route from navbar", async () => {
  const user = userEvent.setup();

  render(<App />);
  await user.click(screen.getByRole("link", { name: /url check/i }));
  expect(await screen.findByRole("heading", { name: /url safety checker/i })).toBeInTheDocument();
});
