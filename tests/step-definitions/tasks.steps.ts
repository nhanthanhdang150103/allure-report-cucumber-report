import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TasksPage } from '../pages/tasks.page';
import { page } from '../hooks/hooks';

let tasksPage: TasksPage;

Given('I am logged in and on the tasks page', async () => {
  tasksPage = new TasksPage(page);
  await tasksPage.navigate();
});

When('I add a task with title {string}, start date {string}, end date {string}, hours {string}, project {string}, summary {string}, and description {string}', async (title: string, startDate: string, endDate: string, hours: string, project: string, summary: string, description: string) => {
  await tasksPage.addTask(title, startDate, endDate, hours, project, summary, description);
});

Then('I should see the task success message {string}', async (expectedMessage: string) => {
  const actualMessage = await tasksPage.getSuccessMessage();
  expect(actualMessage).toContain(expectedMessage);
});

Then('I should see the task error message {string}', async (expectedMessage: string) => {
  const actualMessage = await tasksPage.getErrorMessage();
  expect(actualMessage).toContain(expectedMessage);
});