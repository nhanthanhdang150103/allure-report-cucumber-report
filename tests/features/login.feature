Feature: Login Functionality

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter username "mikegay123" and password "123456"
    And I click the login button
    Then I should see the success message "Logged In Successfully."

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter username "wronguser" and password "wrongpass"
    And I click the login button
    Then I should see the error message "Invalid Login Credentials."