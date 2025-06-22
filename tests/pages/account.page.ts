import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginPage } from './login.page';
import { accountselector } from '../selectors/account.selector';

export class AccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToAccountSettingsPage() {
    // Đảm bảo người dùng đã đăng nhập trước khi điều hướng đến cài đặt tài khoản
    const loginPage = new LoginPage(this.page);
    await loginPage.navigate(); // Điều hướng đến trang đăng nhập
    const username = process.env.LOGIN_USERNAME;
    const password = process.env.LOGIN_PASSWORD;
    if (!username || !password) {
      throw new Error('LOGIN_USERNAME or LOGIN_PASSWORD is not defined in environment variables.');
    }
    await loginPage.login(username, password); // Thực hiện đăng nhập, sẽ đưa đến trang dashboard/home

    // Sau khi đăng nhập, click vào link cài đặt tài khoản để đến trang cài đặt thực tế
    await this.clickElement(accountselector.clickaccountsetting, { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async clickSaveButton() {
    await this.clickElement(accountselector.clicksave);
  }

  async getSuccessMessage() {
    // Selector này khá chung chung, nếu có nhiều thông báo toast, cần tinh chỉnh thêm.
    return await this.getElementText(accountselector.sucessmessenger);
  }
}