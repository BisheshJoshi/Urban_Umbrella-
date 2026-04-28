import { test, expect } from "@playwright/test";

test("renders main UI", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /is your dapp actually safe/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /connect wallet/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /check a website now/i })).toBeVisible();
});
