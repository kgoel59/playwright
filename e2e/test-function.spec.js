const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const math = require('mathjs');

const testCasesDir = path.join(__dirname, '../test_cases');
const testFiles = fs.readdirSync(testCasesDir).filter(file => /^plot_\(.+\)\.html$/.test(file));

const extractFunctionFromFileName = (filename) => {
  const match = filename.match(/^plot_\((.+)\)\.html$/);
  return match ? match[1] : null;
};

for (const file of testFiles) {
  const funcExpr = extractFunctionFromFileName(file);
  if (!funcExpr) continue;

  test(`Function plot validation for ${file}`, async ({ page }) => {
    const filePath = path.join(testCasesDir, file);
    const fileUrl = `file://${filePath}`;

    await page.goto(fileUrl);

    const svg = await page.locator('svg').first();
    await expect(svg).toBeVisible();

    // Extract JSON data from script tag

    const data = await page.evaluate(() => {
        return window.mpld3.figures[0].data
    });
    
    expect(data).not.toBeNull();

    const parsedFunc = math.parse(funcExpr);
    const compiledFunc = parsedFunc.compile();

    // Ensure we are working with an array of labels
    expect(Array.isArray(data.data01)).toBe(true);

    for (const label of data.data01) {
      const x = label[0]
      const expectedY = label[1] 
      const calculatedY = compiledFunc.evaluate({ x });

      // Allow small error tolerance (1e-2 or 0.01)
      expect(Math.abs(calculatedY - expectedY)).toBeLessThan(0.01);
    }
  });
}
