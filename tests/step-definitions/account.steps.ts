import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { AccountPage } from '../pages/account.page';
import { page } from '../hooks/hooks';

let accountPage: AccountPage;

Given('I am logged in and on the account settings page', async () => {
  accountPage = new AccountPage(page);
  await accountPage.navigateToAccountSettingsPage();
});

When('I click the save button', async () => {
  await accountPage.clickSaveButton();
});

Then('I should see the account success message {string}', async (expectedMessage: string) => {
  const actualMessage = await accountPage.getSuccessMessage();
  expect(actualMessage).toContain(expectedMessage);
});