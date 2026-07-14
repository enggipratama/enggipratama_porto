import { test, expect } from "@playwright/test";

test.describe("Contact Page E2E Tests", () => {
  test("should render the contact page with all fields", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.locator("h2:has-text('Send a Message')")).toBeVisible();
    await expect(page.locator("label[for='name']")).toContainText("Full Name");
    await expect(page.locator("input[id='name']")).toBeVisible();
    await expect(page.locator("input[id='email']")).toBeVisible();
    await expect(page.locator("input[id='subject']")).toBeVisible();
    await expect(page.locator("textarea[id='message']")).toBeVisible();
    await expect(page.locator("#turnstile-container")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("should show validation errors on empty blur", async ({ page }) => {
    await page.goto("/contact");

    const nameInput = page.locator("input[id='name']");
    await nameInput.focus();
    await page.keyboard.press("Tab");

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(nameInput).toHaveClass(/border-red-500/);
  });
});