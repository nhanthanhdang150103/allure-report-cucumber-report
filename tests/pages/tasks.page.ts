import { Page } from '@playwright/test';
import { TasksSelectors } from '../selectors/tasks.selectors';
import { LoginPage } from './login.page';
import { BasePage } from './base.page';

export class TasksPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

async navigate() {
  // Đăng nhập trước
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  const username = process.env.LOGIN_USERNAME;
  const password = process.env.LOGIN_PASSWORD;
  if (!username || !password) {
    throw new Error('LOGIN_USERNAME or LOGIN_PASSWORD is not defined in environment variables.');
  }
  await loginPage.login(username, password);
  // Điều hướng đến trang Tasks
  await this.clickElement(TasksSelectors.tasksMenuLink, { timeout: 30000 });
  await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  // Mở form Add New
  await this.clickElement(TasksSelectors.addNewButton, { timeout: 10000 });
  // Đảm bảo form sẵn sàng, ví dụ: chờ một element trong form xuất hiện
  await this.waitForElementVisible(TasksSelectors.titleInput, 10000);
}

  async addTask(title: string, startDate: string, endDate: string, hours: string, project: string, summary: string, description: string) {
    await this.page.fill(TasksSelectors.titleInput, title);
    // Điền ngày bắt đầu bằng JavaScript execution
    await this.page.evaluate(({ selector, dateValue }) => {
      const element = document.querySelector(selector) as HTMLInputElement;
      if (element) {
        element.value = dateValue;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true })); // Kích hoạt sự kiện blur
      }
    }, { selector: TasksSelectors.startDateInput, dateValue: startDate }); // Giữ nguyên page.evaluate

    // Điền ngày kết thúc bằng JavaScript execution
    await this.page.evaluate(({ selector, dateValue }) => {
      const element = document.querySelector(selector) as HTMLInputElement;
      if (element) {
        element.value = dateValue;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true })); // Kích hoạt sự kiện blur
      }
    }, { selector: TasksSelectors.endDateInput, dateValue: endDate }); // Giữ nguyên page.evaluate

    await this.fillElement(TasksSelectors.estimatedHourInput, hours);

    // Chọn dự án
    await this.clickElement(TasksSelectors.projectSelect);
    // Lưu ý: TasksSelectors.projectOption ('li.select2-results__option.select2-results__option--highlighted')
    // có thể không ổn định. Cân nhắc dùng locator dựa trên text của project:
    // await this.page.locator('li.select2-results__option', { hasText: project }).click();
    await this.clickElement(TasksSelectors.projectOption); // Hoặc sử dụng locator ổn định hơn

    await this.fillElement(TasksSelectors.summaryTextarea, summary);

    // Điền mô tả bằng JavaScript execution (editor nằm trong iframe) - Giữ nguyên page.evaluate
    const editorIframeSelector = 'iframe[title="Editable area. Press F10 for toolbar."]';
    try {
      const editorFrame = this.page.frameLocator(editorIframeSelector);
      // Sử dụng locator bên trong frame để thực hiện evaluate
      await editorFrame.locator(TasksSelectors.descriptionEditor).evaluate((element, descValue) => {
        // element ở đây là body[contenteditable="true"] bên trong iframe
        element.focus();
        element.innerHTML = descValue; // Gán nội dung HTML
        element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); // Kích hoạt sự kiện input
        element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })); // Một số editor cần sự kiện change
        element.blur(); // Kích hoạt sự kiện blur
      }, description);
    } catch (error) {
      console.error(`Không thể tìm thấy hoặc tương tác với iframe editor: ${editorIframeSelector}. Lỗi: ${error}`);
      throw new Error(`Không thể điền Description do lỗi iframe: ${error}`);
    }

    await this.clickElement(TasksSelectors.saveButton);
  }

  async getSuccessMessage() {
    const message = await this.getElementText(TasksSelectors.successMessage);
    await this.waitForTimeout(2000); // Cân nhắc xóa hoặc làm tùy chọn
    return message;
  }

  async getErrorMessage() {
    const message = await this.getElementText(TasksSelectors.errorMessage);
    await this.waitForTimeout(2000); // Cân nhắc xóa hoặc làm tùy chọn
    return message;
  }
}