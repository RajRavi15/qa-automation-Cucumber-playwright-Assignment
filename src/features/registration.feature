@ui
Feature: User Registration and Authentication Flow

# ================= UI-003 → UI-004 → UI-005 → UI-007 =================
@ui @smoke
Scenario: UI-003-004-005-007 End-to-End user journey (Register → Login → Logout)

  # UI-003: Navigate to Signup/Login
  Given user is on home page
  When user clicks on Signup/Login
  Then user should be navigated to login page

  # UI-004: Register new user (dynamic data)
  When user enters name and email on the signup details
  And user clicks on the signup button
  And on the "Account information" page user fills account information
  And user clicks on the "Create Account" button
  Then account should be created successfully
  And user clicks Continue button           

  # UI-005: Login with same user (no hardcoding)
  When user navigates to login page
  And user enters valid credentials
  Then user name should be visible in header
  And logout button should be visible

  # UI-007: Logout and verify redirection
  When user clicks logout button
  Then user should be redirected to login page


# ================= UI-006 =================
@ui @regression
Scenario: UI-006 Invalid login validation

  Given user is on login page
  When user enters invalid credentials
  Then error message should be displayed