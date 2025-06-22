Feature: Account Settings Functionality

  Scenario: Update account settings successfully
    Given I am logged in and on the account settings page
    When I click the save button
    Then I should see the account success message "Personal Information updated."