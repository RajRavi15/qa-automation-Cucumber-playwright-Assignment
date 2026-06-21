import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://www.automationexercise.com',

  API_BASE_URL: process.env.API_BASE_URL || 'https://www.automationexercise.com/api',
  USER_EMAIL: process.env.USER_EMAIL!,
  USER_PASSWORD: process.env.USER_PASSWORD!,

  HEADLESS: process.env.HEADLESS === 'true',

  RECORD_VIDEO: process.env.RECORD_VIDEO === 'true',

  RECORD_HAR: process.env.RECORD_HAR === 'true',

  TIMEOUT: Number(process.env.TIMEOUT) || 60000,
};