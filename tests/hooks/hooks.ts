import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, Page } from '@playwright/test';
    import * as dotenv from 'dotenv';
    
    // Tải biến môi trường từ file .env
    dotenv.config();

let browser: Browser;
let page: Page;
// Tăng timeout mặc định cho các step của Cucumber (ví dụ: 100 giây)
// Giá trị này nên lớn hơn page.setDefaultNavigationTimeout()
setDefaultTimeout(300 * 1000);

BeforeAll(async () => {
  const headlessEnv = process.env.HEADLESS_MODE;
  // Mặc định headless là true nếu không có biến môi trường, hoặc nếu biến môi trường là 'true'
  const headless = headlessEnv !== undefined ? headlessEnv.toLowerCase() === 'true' : true;
  // slowMo chỉ được đặt nếu biến môi trường SLOW_MO được cung cấp và là một số hợp lệ
  const slowMoEnv = process.env.SLOW_MO;
  const slowMo = slowMoEnv ? parseInt(slowMoEnv, 10) : undefined;

  browser = await chromium.launch({
    headless: headless,
    slowMo: slowMo,
  });
});

Before(async () => {
  page = await browser.newPage();
  // Thiết lập timeout mặc định trực tiếp cho page
  page.setDefaultTimeout(600000); // 600 giây cho các action (ví dụ: click, fill, waitForSelector)
  page.setDefaultNavigationTimeout(90000); // 90 giây cho navigation (ví dụ: page.goto)
});

After(async () => {
  await page.close();
});

AfterAll(async () => {
  await browser.close();
});

export { page };