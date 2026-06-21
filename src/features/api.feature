@api
Feature: API Automation Suite - Enterprise Validation

  Background:
    Given API base URL is set to "/api"

  # API-001: Get all products
  
  @api @smoke @regression
  Scenario: API-001 Get all products and validate contract
    When user sends GET request to "/productsList"
    Then HTTP status should be 200
    And response header "content-type" should contain "application/json"
    And API response code should be 200
    And response body should be a valid JSON
    And "products" should be an array
    And each product should contain:
      | id    | number |
      | name  | string |
      | price | string |
      | brand | string |

  
  # API-002: Invalid POST products

  @api @negative @regression
  Scenario: API-002 Invalid POST request to products list
    When user sends POST request to "/productsList"
    Then HTTP status should be 200
    And API response code should be 405
    And error message should be "This request method is not supported."

  
  # API-003: Get all brands

  @api @regression
  Scenario: API-003 Get all brands and validate structure
    When user sends GET request to "/brandsList"
    Then HTTP status should be 200
    And API response code should be 200
    And response body should be a valid JSON
    And "brands" should be an array
    And each brand should contain:
      | brand | string |

  
  # API-004: Invalid PUT brands
  
  @api @negative @regression
  Scenario: API-004 Invalid PUT request to brands list
    When user sends PUT request to "/brandsList"
    Then HTTP status should be 200
    And API response code should be 405
    And error message should be "This request method is not supported."

  
  # API-005: Search product valid
  
  @api @regression
  Scenario: API-005 Search product with valid input
    When user sends POST request to "/searchProduct" with form data:
      | search_product | top |
    Then HTTP status should be 200
    And API response code should be 200
    And "products" should be an array
    And response should contain products matching "top"

  
  # API-006: Search product missing param
  
  @api @negative @regression
  Scenario: API-006 Search product without required parameter
    When user sends POST request to "/searchProduct" without body
    Then HTTP status should be 200
    And API response code should be 400
    And error message should be "Bad request, search_product parameter is missing in POST request."

  
  # API-007: User lifecycle

  @api @smoke @regression
  Scenario: API-007 Complete user lifecycle validation
    Given user creates a new account with dynamic data
    Then API response code should be 201
    And response should contain account creation success message

    When user updates the account with new data
    Then API response code should be 200

    When user fetches user details by email
    Then API response code should be 200
    And response should contain correct user details

    When user deletes the account
    Then API response code should be 200

  
  # API-008: Invalid login

  @api @negative @regression
  Scenario: API-008 Invalid login validation
    When user sends POST request to "/verifyLogin" with invalid credentials
    Then HTTP status should be 200
    And API response code should be 404
    And error message should be "User not found!"