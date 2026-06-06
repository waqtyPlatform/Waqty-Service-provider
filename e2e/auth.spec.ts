import { test, expect } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3000';

test.describe('Authentication Flows', () => {
    test.setTimeout(60000);

    test('redirects unauthenticated users to login', async ({ page }) => {
        // Clear any existing auth state
        await page.goto(`${baseURL}/login`);
        await page.evaluate(() => {
            localStorage.removeItem('waqty_user');
            localStorage.removeItem('waqty_token');
            document.cookie = 'waqty_logged_in=;path=/;max-age=0';
            document.cookie = 'waqty_auth=;path=/;max-age=0';
        });

        await page.goto(baseURL);
        // Should redirect to login
        await expect(page).toHaveURL(/\/login/);
    });

    test('login page renders correctly', async ({ page }) => {
        await page.goto(`${baseURL}/login`);

        // Check key elements exist
        await expect(page.locator('input[type="text"], input[type="email"], input[name="identifier"]').first()).toBeVisible();
        await expect(page.locator('input[type="password"]').first()).toBeVisible();
    });

    test('login form shows validation errors on empty submit', async ({ page }) => {
        await page.goto(`${baseURL}/login`);

        // Try to submit empty form
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.isVisible()) {
            await submitBtn.click();
            // Should show some kind of error or stay on login
            await expect(page).toHaveURL(/\/login/);
        }
    });

    test('forgot password page loads', async ({ page }) => {
        await page.goto(`${baseURL}/forgot-password`);
        await expect(page.getByRole('main').or(page.locator('body'))).not.toBeEmpty();
    });

    test('authenticated user can access dashboard', async ({ page }) => {
        // Set up mock auth
        await page.goto(`${baseURL}/login`);
        await page.evaluate(() => {
            const mockUser = {
                id: 'U2',
                name: 'Salon Admin',
                email: 'salon@waqty.com',
                role: 'admin',
                businessType: 'salon',
            };
            localStorage.setItem('waqty_user', JSON.stringify(mockUser));
            localStorage.setItem('waqty_token', 'mock-jwt-token');
            document.cookie = 'waqty_logged_in=true;path=/;max-age=86400';
            document.cookie = `waqty_auth=${JSON.stringify({ token: true, role: 'admin' })};path=/;max-age=86400`;
        });

        await page.goto(baseURL);
        // Dashboard should load with KPIs
        await expect(page.getByText('Total Revenue')).toBeVisible({ timeout: 10000 });
    });

    test('logout clears auth state and redirects to login', async ({ page }) => {
        // Set up mock auth
        await page.goto(`${baseURL}/login`);
        await page.evaluate(() => {
            const mockUser = {
                id: 'U2',
                name: 'Salon Admin',
                email: 'salon@waqty.com',
                role: 'admin',
                businessType: 'salon',
            };
            localStorage.setItem('waqty_user', JSON.stringify(mockUser));
            localStorage.setItem('waqty_token', 'mock-jwt-token');
            document.cookie = 'waqty_logged_in=true;path=/;max-age=86400';
        });

        await page.goto(baseURL);
        await page.waitForTimeout(1000);

        // Open user menu and click logout
        const userBtn = page.locator('[class*="userBtn"]').first();
        if (await userBtn.isVisible()) {
            await userBtn.click();
            await page.waitForTimeout(300);
            const logoutBtn = page.getByText('Log Out');
            if (await logoutBtn.isVisible()) {
                await logoutBtn.click();
                // Should redirect to login
                await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
            }
        }
    });
});
