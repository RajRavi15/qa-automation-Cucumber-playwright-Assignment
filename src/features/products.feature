@ui
Feature: Product Module

@ui @regression
Scenario: UI-008 Verify product grid
Given user is on products page
Then product list should be visible
And each product should have name and price

@ui @regression
Scenario: UI-009 Verify product details
Given user is on products page
When user clicks on a product
Then product name should be displayed
And product price should be displayed
And availability should be visible

@ui @regression
Scenario: UI-010 Search product with valid keyword
Given user is on products page
When user searches for "Tshirt"
And user clicks on the search icon button
Then search results should be displayed

@ui @regression
Scenario: UI-011 Search product with no results
Given user is on products page
When user searches for "InvalidProduct123"
And user clicks on the search icon button
Then no results message should be displayed

@ui @regression
Scenario: UI-012 Filter products by brand
Given user is on products page
When user selects brand "Polo"
Then filtered products should be displayed

@ui @regression
Scenario: UI-013 Add product to cart
Given user is on products page
When user adds a product to cart
And user clicks on view cart
Then cart should contain the product

@ui @regression
Scenario: UI-014 Add multiple products and verify total
Given user has product in cart
When user increases quantity
Then total price should be updated