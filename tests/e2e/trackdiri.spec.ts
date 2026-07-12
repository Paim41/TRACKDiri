import { expect, test } from "@playwright/test";

test("landing page exposes TRACKDiri brand and auth links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Take Control of Your Daily Health" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create Account" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Login" }).first()).toBeVisible();
});

test("login form includes Google entry point", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue with Google" })).toBeVisible();
});
