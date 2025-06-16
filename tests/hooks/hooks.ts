import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, Page } from '@playwright/test';
    import * as dotenv from 'dotenv';
    
    // Tải biến môi trường từ file .env
    dotenv.config();

let browser: Browser;
let page: Page;
// Tăng timeout mặc định cho các step của Cucumber (ví dụ: 100 giây)
// Giá trị này nên lớn hơn page.setDefaultNavigationTimeout()
setDefaultTimeout(100 * 1000);

BeforeAll(async () => {
      // const headless = process.env.HEADLESS_MODE === 'true'; // Đọc từ biến môi trường
      // const slowMo = process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0; // Đọc từ biến môi trường, mặc định là 0
      browser = await chromium.launch({ 
        
        headless: true, 
       });

});

Before(async () => {
  page = await browser.newPage();
  // Thiết lập timeout mặc định trực tiếp cho page
  page.setDefaultTimeout(60000); // 60 giây cho các action (ví dụ: click, fill, waitForSelector)
  page.setDefaultNavigationTimeout(90000); // 90 giây cho navigation (ví dụ: page.goto)
});

After(async () => {
  await page.close();
});

AfterAll(async () => {
  await browser.close();
});

export { page };