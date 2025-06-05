Feature: Add Tasks Functionality

  Scenario: Add a new task successfully
    Given I am logged in and on the tasks page
    When I add a task with title "New Task", start date "04", end date "04", hours "10", project "Manual Test", summary "This is a test task with more than sixty characters to meet the requirement.", and description "Detailed description of the task."
    Then I should see the task success message "Task added."

  Scenario: Fail to add a task with short summary
    Given I am logged in and on the tasks page
    When I add a task with title "New Task", start date "04", end date "04", hours "10", project "Manual Test", summary "Short summary", and description "Detailed description of the task."
    Then I should see the task error message "The summary field must be at least 60 characters in length."