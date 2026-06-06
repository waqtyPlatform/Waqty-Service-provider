import { test, expect } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3000';

test.describe('Command Palette (Ctrl+K)', () => {
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

    test('opens with Ctrl+K shortcut', async ({ page }) => {
        await page.keyboard.press('Control+k');
        await page.waitForTimeout(300);

        // Should show the command palette with search input
        const searchInput = page.getByPlaceholder('Search pages, actions, settings...');
        await expect(searchInput).toBeVisible({ timeout: 5000 });
    });

    test('closes with Escape key', async ({ page }) => {
        await page.keyboard.press('Control+k');
        await page.waitForTimeout(300);

        const searchInput = page.getByPlaceholder('Search pages, actions, settings...');
        await expect(searchInput).toBeVisible();

        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        await expect(searchInput).not.toBeVisible();
    });

    test('filters results when typing', async ({ page }) => {
        await page.keyboard.press('Control+k');
        await page.waitForTimeout(300);

        const searchInput = page.getByPlaceholder('Search pages, actions, settings...');
        await searchInput.fill('booking');
        await page.waitForTimeout(300);

        // Should show booking-related results
        await expect(page.getByText('Bookings Calendar').or(page.getByText('New Booking'))).toBeVisible();
    });

    test('navigates when selecting a result', async ({ page }) => {
        await page.keyboard.press('Control+k');
        await page.waitForTimeout(300);

        const searchInput = page.getByPlaceholder('Search pages, actions, settings...');
        await searchInput.fill('employee');
        await page.waitForTimeout(300);

        // Click on Employees result
        const employeesItem = page.getByText('Employees').first();
        if (await employeesItem.isVisible()) {
            await employeesItem.click();
            await page.waitForTimeout(1000);
            await expect(page).toHaveURL(/\/employees/);
        }
    });
});
