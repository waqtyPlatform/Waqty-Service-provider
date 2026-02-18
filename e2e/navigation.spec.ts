import { test, expect } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3000';

test.describe('Navigation Verification', () => {
    test.setTimeout(60000);

    test('Dashboard loads', async ({ page }) => {
        console.log('Navigating to dashboard...');
        await page.goto(baseURL);
        console.log('Navigated. Title:', await page.title());
        await expect(page.getByText('Total Revenue')).toBeVisible();
    });

    test('Sales Packages', async ({ page }) => {
        await page.goto(baseURL);
        await page.getByRole('button', { name: 'Sales' }).click();
        await page.waitForTimeout(500);
        await page.getByRole('link', { name: 'Packages' }).click();
        await expect(page).toHaveURL(`${baseURL}/sales/packages`);
        await expect(page.getByText('New Package')).toBeVisible();
    });

    test('Transactions Navigation', async ({ page }) => {
        await page.goto(baseURL);
        await page.getByRole('button', { name: 'Transactions' }).click();
        await page.waitForTimeout(500);
        await page.getByRole('link', { name: 'Cash Sales' }).click();
        await expect(page).toHaveURL(`${baseURL}/transactions/cash-sales`);
        // Generic check that main content loaded (not 404)
        await expect(page.getByRole('main')).not.toBeEmpty();
    });

    test('Returns Navigation', async ({ page }) => {
        await page.goto(baseURL);
        await page.getByRole('button', { name: 'Returns' }).click();
        await page.waitForTimeout(500);
        await page.getByRole('link', { name: 'Cash Refund', exact: true }).click();
        await expect(page).toHaveURL(`${baseURL}/returns/cash-refund`);
        await expect(page.getByRole('main')).not.toBeEmpty();
    });

    test('Customers Navigation', async ({ page }) => {
        await page.goto(baseURL);
        await page.getByRole('button', { name: 'Customers' }).click();
        await page.waitForTimeout(500);
        await page.getByRole('link', { name: 'Client Groups' }).click();
        await expect(page).toHaveURL(`${baseURL}/customers/groups`);
        await expect(page.getByText('New Group')).toBeVisible(); // likely button
    });

    test('Employees Navigation', async ({ page }) => {
        await page.goto(baseURL);
        await page.getByRole('button', { name: 'Employees' }).click();
        await page.waitForTimeout(500);
        await page.getByRole('link', { name: 'Departments' }).click();
        await expect(page).toHaveURL(`${baseURL}/employees/departments`);
        await expect(page.getByText('New Department')).toBeVisible(); // likely button
    });

    test('Marketing Navigation', async ({ page }) => {
        await page.goto(baseURL);
        await page.getByRole('button', { name: 'Marketing' }).click();
        await page.waitForTimeout(500);
        await page.getByRole('link', { name: 'Offers' }).click();
        await expect(page).toHaveURL(`${baseURL}/marketing/offers`);
        await expect(page.getByText('New Offer')).toBeVisible(); // likely button
    });

    test('Settings Navigation', async ({ page }) => {
        await page.goto(baseURL);
        await page.getByRole('button', { name: 'Settings' }).click();
        await page.waitForTimeout(500);
        await page.getByRole('link', { name: 'Branches' }).click();
        await expect(page).toHaveURL(`${baseURL}/settings/branches`);
        await expect(page.getByText('Downtown Branch')).toBeVisible();
    });
});
