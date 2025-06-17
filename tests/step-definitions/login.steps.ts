import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { page } from '../hooks/hooks';

let loginPage: LoginPage;

Given('I am on the login page', { timeout: 60000 }, async () => {
  loginPage = new LoginPage(page);
  await loginPage.navigate();
});

When('I enter username {string} and password {string}', { timeout: 60000 }, async (username: string, password: string) => {
  await loginPage.login(username, password);
});

When('I click the login button', { timeout: 45000 }, async () => {
  // Đã tích hợp trong hàm login, không cần bước riêng
});

Then('I should see the success message {string}', { timeout: 60000 }, async (expectedMessage: string) => {
  const actualMessage = await loginPage.getSuccessMessage();
  expect(actualMessage).toContain(expectedMessage);
});

Then('I should see the error message {string}', { timeout: 60000 }, async (expectedMessage: string) => {
  const actualMessage = await loginPage.getErrorMessage();
  expect(actualMessage).toContain(expectedMessage);
});