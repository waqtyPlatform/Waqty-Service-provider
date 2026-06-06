import { test, expect } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3000';

test.describe('Dark Mode', () => {
    test.setTimeout(30000);

    test.beforeEach(async ({ page }) => {
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
    });

    test('toggles dark mode via theme button', async ({ page }) => {
        // Click theme toggle button
        const themeBtn = page.locator('button[aria-label="Toggle theme"]');
        await expect(themeBtn).toBeVisible();

        // Should start in light mode
        const htmlTheme = await page.getAttribute('html', 'data-theme');
        const isLight = !htmlTheme || htmlTheme === 'light';
        expect(isLight).toBeTruthy();

        // Toggle to dark
        await themeBtn.click();
        await page.waitForTimeout(300);

        const darkTheme = await page.getAttribute('html', 'data-theme');
        expect(darkTheme).toBe('dark');
    });

    test('persists dark mode across page navigations', async ({ page }) => {
        // Enable dark mode
        const themeBtn = page.locator('button[aria-label="Toggle theme"]');
        await themeBtn.click();
        await page.waitForTimeout(300);

        // Navigate to another page
        await page.goto(`${baseURL}/employees`);
        await page.waitForTimeout(1000);

        // Should still be dark
        const theme = await page.getAttribute('html', 'data-theme');
        expect(theme).toBe('dark');
    });
});
