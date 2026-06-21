import { faker } from '@faker-js/faker';
import { RegistrationRequest } from '../types/apiTypes';

export class TestDataGenerator {

  static generateUser(): RegistrationRequest {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = this.generateStrongPassword();

    const phone = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');

    return {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password,
      phone,
      address: faker.location.streetAddress(),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      
    };
  }

  static generateStrongPassword(): string {
    return faker.internet.password({
      length: 12,
      memorable: false,
      pattern: /[A-Za-z0-9!@#$%^&*]/,
    });
  }

  static generateUUID(): string {
    return faker.string.uuid();
  }

  static generateTimestamp(): string {
    return new Date().toISOString();
  }
}