import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';
const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => document.querySelector('#count').textContent === '6 requests');
  await mkdir('screenshots', { recursive: true });
  await page.screenshot({ path: 'screenshots/desktop.png', fullPage: true });
  await page.getByLabel('Search requests', {exact:true}).fill('api');
  await page.getByLabel('Status', {exact:true}).selectOption('Done');
  await page.getByRole('button', {name:'Apply filters',exact:true}).click();
  await page.waitForFunction(() => document.querySelector('#count').textContent === '1 request');
  assert.equal(await page.locator('.card').count(), 1);
  assert.match(await page.locator('.card').innerText(), /Document API pagination/);
  await page.screenshot({ path: 'screenshots/filtered.png', fullPage: true });
  await page.getByLabel('Search requests', {exact:true}).fill('no-such-request');
  await page.getByRole('button', {name:'Apply filters',exact:true}).click();
  await page.waitForFunction(() => document.querySelector('#count').textContent === '0 requests');
  assert.equal(await page.locator('.card').count(), 0);
  await page.getByRole('button', {name:'Clear',exact:true}).click();
  await page.waitForFunction(() => document.querySelector('#count').textContent === '6 requests');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });
  assert.deepEqual(errors, []);
  console.log('UI verified: initial load, combined filters, empty results, clear, mobile overflow, no JS errors.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
