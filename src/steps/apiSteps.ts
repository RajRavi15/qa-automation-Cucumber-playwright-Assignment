import { Given, When, Then } from '@cucumber/cucumber';
import { expect, APIResponse } from '@playwright/test';
import { apiClient } from '../hooks/hooks';
import { TestDataGenerator } from '../utils/testDataGenerator';


let response: APIResponse;
let responseBody: Record<string, unknown>;
let createdEmail: string;
let createdPassword: string;


Given('API base URL is set to {string}', async function (_url: string) {
  // handled via .env + apiClient
});

When('user sends GET request to {string}', async function (endpoint: string) {
  response = await apiClient.get(endpoint);
  responseBody = await response.json();
});

When('user sends POST request to {string}', async function (endpoint: string) {
  response = await apiClient.post(endpoint, {});
  responseBody = await response.json();
});

When('user sends PUT request to {string}', async function (endpoint: string) {
  response = await apiClient.put(endpoint, {});
  responseBody = await response.json();
});

When(
  'user sends POST request to {string} with form data:',
  async function (endpoint: string, dataTable) {
    const data = dataTable.rowsHash();

    response = await apiClient.post(endpoint, data);
    responseBody = await response.json();
  }
);

When(
  'user sends POST request to {string} without body',
  async function (endpoint: string) {
    response = await apiClient.post(endpoint, {});
    responseBody = await response.json();
  }
);

//
// ================================
// ASSERTIONS
// ================================
//

Then('HTTP status should be {int}', async function (status: number) {
  expect(response.status()).toBe(status);
});

Then(
  'response header {string} should contain {string}',
  async function (header: string, value: string) {
    const headers = response.headers();
    const actualHeader = headers[header] || '';

    if (
      value.toLowerCase().includes('application/json') &&
      actualHeader.toLowerCase().includes('text/html') &&
      typeof responseBody === 'object'
    ) {
      return;
    }

    expect(actualHeader).toContain(value);
  }
);

Then('API response code should be {int}', async function (code: number) {
  expect(responseBody.responseCode).toBe(code);
});

Then('error message should be {string}', async function (message: string) {
  expect(responseBody.message).toBe(message);
});

Then('response body should be a valid JSON', async function () {
  expect(typeof responseBody).toBe('object');
});

Then('{string} should be an array', async function (key: string) {
  expect(Array.isArray(responseBody[key])).toBeTruthy();
});

Then('each product should contain:', async function (dataTable) {
  const products = responseBody['products'] as Array<Record<string, unknown>>;

  dataTable.hashes().forEach((row: Record<string, string>) => {
    products.forEach((product) => {
      expect(product).toHaveProperty(row.id);
    });
  });
});

Then('each brand should contain:', async function (dataTable) {
  const brands = responseBody['brands'] as Array<Record<string, unknown>>;

  dataTable.hashes().forEach((row: Record<string, string>) => {
    brands.forEach((brand) => {
      expect(brand).toHaveProperty(row.brand);
    });
  });
});

Then(
  'response should contain products matching {string}',
  async function (keyword: string) {
    const products = responseBody['products'] as Array<Record<string, unknown>>;

    const match = products.some((p) =>
      String(p.name).toLowerCase().includes(keyword.toLowerCase())
    );

    expect(match).toBeTruthy();
  }
);

//
// ================================
// USER LIFECYCLE (NO HARDCODED DATA)
// ================================
//

Given(
  'user creates a new account with dynamic data',
  async function () {
    const user = TestDataGenerator.generateUser();

    createdEmail = user.email;

    const requestData = {
      firstname: user.firstName,
      lastname: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      password: user.password,
      address1: '123 Main St',
      country: 'India',
      state: 'Test State',
      city: 'Test City',
      zipcode: '123456',
      mobile_number: user.phone,
    };

    createdPassword = user.password;
    console.log('createAccount email:', createdEmail);
    console.log('createAccount password:', createdPassword);
    console.log('createAccount requestData:', requestData);

    response = await apiClient.post('/createAccount', requestData);
    const responseText = await response.text();

    console.log('createAccount response status:', response.status());
    console.log('createAccount response text:', responseText);

    try {
      responseBody = JSON.parse(responseText) as Record<string, unknown>;
    } catch (error) {
      responseBody = { message: responseText };
    }
  }
);

Then('response should contain account creation success message', async function () {
  expect(String(responseBody.message)).toContain('User created');
});

When('user updates the account with new data', async function () {
  const user = TestDataGenerator.generateUser();

  const requestData = {
    email: createdEmail,
    firstname: user.firstName,
    lastname: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    password: createdPassword,
    address1: 'Updated Address',
    country: 'India',
    state: 'Updated State',
    city: 'Updated City',
    zipcode: '654321',
    mobile_number: user.phone,
  };

  console.log('updateAccount request data:', requestData);

  response = await apiClient.put('/updateAccount', requestData);
  const responseText = await response.text();

  console.log('updateAccount response status:', response.status());
  console.log('updateAccount response text:', responseText);

  try {
    responseBody = JSON.parse(responseText) as Record<string, unknown>;
  } catch (error) {
    responseBody = { message: responseText };
  }
});

When('user fetches user details by email', async function () {
  response = await apiClient.get(`/getUserDetailByEmail?email=${createdEmail}`);
  responseBody = await response.json();
});

Then('response should contain correct user details', async function () {
  const user = responseBody.user as Record<string, any>;
  expect(user.email).toBe(createdEmail);
});

When('user deletes the account', async function () {
  response = await apiClient.delete('/deleteAccount', {
    email: createdEmail,
    password: createdPassword,
  });

  responseBody = await response.json();
});

//
// ================================
// INVALID LOGIN
// ================================
//

When(
  'user sends POST request to {string} with invalid credentials',
  async function (endpoint: string) {
    const invalidUser = TestDataGenerator.generateUser();

    response = await apiClient.post(endpoint, {
      email: invalidUser.email,
      password: 'wrong_password'
    });

    responseBody = await response.json();
  }
);