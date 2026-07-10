import { test, expect } from "@playwright/test";

test.describe("Contact Page E2E Tests", () => {
  test("should render the contact page with all fields", async ({ page }) => {
    await page.goto("/contact");

    // Check header
    await expect(page.locator("h1")).toContainText("Work Together");

    // Check form fields
    await expect(page.locator("input[id='name']")).toBeVisible();
    await expect(page.locator("input[id='email']")).toBeVisible();
    await expect(page.locator("input[id='subject']")).toBeVisible();
    await expect(page.locator("textarea[id='message']")).toBeVisible();

    // Check Turnstile container is rendered
    await expect(page.locator("#turnstile-container")).toBeVisible();

    // Check submit button is present
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("should show validation errors on empty blur", async ({ page }) => {
    await page.goto("/contact");

    const nameInput = page.locator("input[id='name']");
    await nameInput.focus();
    await nameInput.blur();

    // Should show validation error
    await expect(page.locator("text=Name is required")).toBeVisible();
  });
});
