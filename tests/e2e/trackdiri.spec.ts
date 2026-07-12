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

test("register form shows checked password requirements", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByText("Password requirements")).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("StrongPass1!");
  await page.getByLabel("Confirm password").fill("StrongPass1!");
  await expect(page.getByText("At least 8 characters")).toHaveClass(/text-track-success/);
  await expect(page.getByText("One uppercase letter")).toHaveClass(/text-track-success/);
  await expect(page.getByText("One lowercase letter")).toHaveClass(/text-track-success/);
  await expect(page.getByText("One number")).toHaveClass(/text-track-success/);
  await expect(page.getByText("One special character")).toHaveClass(/text-track-success/);
  await expect(page.getByText("Passwords match")).toHaveClass(/text-track-success/);
  await expect(page.getByRole("button", { name: "Create Account" })).toBeEnabled();
});

test("auth pages stay fixed to the viewport", async ({ page }) => {
  for (const path of ["/login", "/register", "/forgot-password"]) {
    await page.goto(path);
    const hasPageScroll = await page.evaluate(() => {
      const root = document.scrollingElement ?? document.documentElement;
      return root.scrollHeight > window.innerHeight + 2;
    });
    expect(hasPageScroll, `${path} should not create page-level scrolling`).toBe(false);
  }
  await page.goto("/register");
  await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
});

test("password character follows visibility state", async ({ page, isMobile }) => {
  test.skip(isMobile, "The side character is intentionally hidden on mobile.");
  await page.goto("/login");
  const character = page.getByTestId("auth-peek-character");
  await expect(character).toBeVisible();
  await expect(page.getByTestId("auth-peek-character-image")).toHaveAttribute("src", /trackdiri-character-closed/);
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByTestId("auth-peek-character-image")).toHaveAttribute("src", /trackdiri-character-open/);
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(page.getByTestId("auth-peek-character-image")).toHaveAttribute("src", /trackdiri-character-closed/);
});
