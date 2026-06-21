@ui @advanced @regression
Feature: Advanced UI Scenarios

  Scenario: UI-016 Verify page works with blocked assets
    Given user blocks non critical assets
    When user navigates to products page
    Then product list should still be visible


  Scenario: UI-017 Verify session sharing across browser contexts
    Given user logs in with valid credentials
    When user creates new browser context with same session
    Then user should be logged in without login again