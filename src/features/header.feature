@ui @smoke
Feature: Header Navigation

Scenario: UI-002 Verify header navigation menu items
  Given user navigates to home page
  Then header menu should be visible
  And Home link should be visible
  And Products link should be visible
  And Cart link should be visible
  And Signup Login link should be visible