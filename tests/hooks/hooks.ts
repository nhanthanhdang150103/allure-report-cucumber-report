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
      // Đọc HEADLESS_MODE từ biến môi trường. Mặc định là true (chạy headless).
      // Nếu HEADLESS_MODE được đặt thành 'false', trình duyệt sẽ chạy ở chế độ headed.
      const headless = process.env.HEADLESS_MODE !== 'false';
      // Đọc SLOW_MO từ biến môi trường. Mặc định là 0.
      const slowMo = process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0;
      browser = await chromium.launch({ headless, slowMo });
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