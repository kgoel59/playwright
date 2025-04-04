const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Path to test_cases directory
const testCasesDir = path.join(__dirname, '../test_cases');

// Read all .html files that match the naming pattern
const testFiles = fs.readdirSync(testCasesDir).filter(file => /^plot_\(.+\)\.html$/.test(file));

// Dynamically generate a test for each HTML file
for (const file of testFiles) {
  test(`Graph renders correctly for ${file}`, async ({ page }) => {
    const filePath = path.join(testCasesDir, file);
    const fileUrl = `file://${filePath}`;

    // Load the local HTML file
    await page.goto(fileUrl);

    // Wait for the SVG inside mpld3 container (you can adjust selector based on your HTML)
    const svg = await page.locator('svg').first();
    await expect(svg).toBeVisible();

    // Check that axes labels exist
    const xAxisLabel = await page.locator('text').filter({ hasText: 'X-axis' }).first();
    const yAxisLabel = await page.locator('text').filter({ hasText: 'Y-axis' }).first();

    await expect(xAxisLabel).toBeVisible();
    await expect(yAxisLabel).toBeVisible();
  });
}
