import { test, expect } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
const SCREENSHOTS_DIR = resolve(process.cwd(), "docs/screenshots");
const TEST_USER = {
  email: "admin@admin.com",
  password: "Password@123",
};
async function loginAs(page: any) {
  await page.goto("/auth/login", { waitUntil: "networkidle" });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1000);

  await page.locator('input[type="text"]').waitFor({ state: "visible" });
  await page.fill('input[type="text"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);

  await Promise.all([
    page.waitForResponse((resp: any) => resp.url().includes("/auth/login"), {
      timeout: 10000,
    }),
    page.locator("button.w-full").click(),
  ]);

  // Wait for redirect to home page (confirms login succeeded)
  await page.waitForURL("/", { timeout: 10000 });
  await page.waitForLoadState("networkidle");
}
test.describe("Generate README Screenshots", () => {
  test.beforeAll(() => {
    if (!existsSync(SCREENSHOTS_DIR)) {
      mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
  });
  test("capture login page", async ({ page }) => {
    await page.goto("/auth/login", { waitUntil: "networkidle" });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1500);
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, "login.png"),
      fullPage: true,
    });
  });
  test("capture dashboard page", async ({ page }) => {
    await loginAs(page);
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, "dashboard.png"),
      fullPage: true,
    });
  });
  test("capture quiz selection page", async ({ page }) => {
    await loginAs(page);
    await page.goto("/quiz-selection", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, "quiz-selection.png"),
      fullPage: true,
    });
  });
  test("capture create quiz page", async ({ page }) => {
    await loginAs(page);
    await page.goto("/create-quiz", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, "create-quiz.png"),
      fullPage: true,
    });
  });
});
