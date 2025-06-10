import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Timeout toàn cục cho mỗi test case, bao gồm cả hooks.
  // Mặc định là 30000ms (30 giây).
  timeout: 60000, // Tăng lên 60 giây

  use: {
    // Timeout mặc định cho các action của Playwright (ví dụ: page.click(), page.fill()).
    // Mặc định là 0 (không có timeout riêng cho action, sẽ dùng timeout của test).
    // Chúng ta có thể đặt một giá trị cụ thể ở đây.
    actionTimeout: 30000, // Tăng lên 30 giây cho mỗi action

    // Timeout mặc định cho các navigation (ví dụ: page.goto()).
    // Mặc định là 0 (không có timeout riêng cho navigation, sẽ dùng timeout của test).
    navigationTimeout: 45000, // Tăng lên 45 giây cho navigation

    headless: process.env.HEADLESS_MODE === 'true',
    // slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0, // Bạn có thể đặt slowMo ở đây nếu muốn
  },

  // Cấu hình cho các project (nếu bạn chạy test trên nhiều trình duyệt)
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },
  // ],
});
