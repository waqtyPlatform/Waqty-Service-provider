import { test, expect } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3000';

test.describe('Error & Not Found Pages', () => {
    test.setTimeout(30000);

    test.beforeEach(async ({ page }) => {
        // Set up mock auth to bypass login redirect
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
    });

    test('shows 404 page for non-existent routes', async ({ page }) => {
        await page.goto(`${baseURL}/this-page-does-not-exist`);
        // Should show 404 content
        await expect(page.getByText('404').or(page.getByText('not found'))).toBeVisible({ timeout: 10000 });
    });

    test('404 page has navigation options', async ({ page }) => {
        await page.goto(`${baseURL}/this-page-does-not-exist`);
        // Should have a way to go back or go to dashboard
        const dashboardLink = page.getByText('Dashboard').or(page.getByText('Go back'));
        await expect(dashboardLink.first()).toBeVisible({ timeout: 10000 });
    });
});
