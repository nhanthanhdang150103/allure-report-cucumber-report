import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(path: string, timeout?: number) {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error('BASE_URL is not defined in environment variables.');
    }
    await this.page.goto(`${baseUrl}${path}`, { timeout: timeout || parseInt(process.env.DEFAULT_TIMEOUT || '60000', 10) });
  }

  async fillElement(selector: string, value: string, timeout?: number) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout: timeout || 10000 });
    await this.page.fill(selector, value);
  }

  async clickElement(selector: string, options?: { timeout?: number }) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout: options?.timeout || 10000 });
    await this.page.click(selector, options);
  }

  async getElementText(selector: string, options?: { state?: 'visible' | 'hidden' | 'attached' | 'detached', timeout?: number }): Promise<string | null> {
    await this.page.waitForSelector(selector, { state: options?.state || 'visible', timeout: options?.timeout || 10000 });
    return await this.page.textContent(selector);
  }

  async waitForElementVisible(selector: string, timeout: number = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async waitForTimeout(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds);
  }

  // Thêm các phương thức dùng chung khác nếu cần
}