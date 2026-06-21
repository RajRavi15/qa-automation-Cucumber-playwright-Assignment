@ui
Feature: Contact Form

Background: Submit the form
Given user is on contact us page
When user fills contact form
And user uploads a file
And user submits the form

@ui @regression
Scenario: UI-015 Submit contact form with file upload
And user accepts the confirmation alert
Then success message should be displayed

@ui @regression
Scenario: UI-015.1 Cancel contact form submission
And user dismisses the confirmation alert
Then form should not be submitted