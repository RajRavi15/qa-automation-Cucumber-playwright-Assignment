@ui
Feature: Home Page

@ui @smoke
Scenario: UI-001 Verify home page elements and layout
Given user navigates to home page
Then home page logo should be visible
And main banner should be visible
And categories section should be visible