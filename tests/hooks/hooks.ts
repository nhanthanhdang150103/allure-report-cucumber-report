import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium, Page } from '@playwright/test';
    import * as dotenv from 'dotenv';
    
    // Tải biến môi trường từ file .env
    dotenv.config();

let browser: Browser;
let page: Page;


BeforeAll(async () => {
      const headless = process.env.HEADLESS_MODE === 'true';
      const slowMo = process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0;
      browser = await chromium.launch({ headless, slowMo });
});

Before(async () => {
  page = await browser.newPage();
});

After(async () => {
  await page.close();
});

AfterAll(async () => {
  await browser.close();
});

export { page };