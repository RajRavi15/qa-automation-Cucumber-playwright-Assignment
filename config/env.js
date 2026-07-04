"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    BASE_URL: process.env.BASE_URL || 'https://www.automationexercise.com',
    API_BASE_URL: process.env.API_BASE_URL || 'https://www.automationexercise.com/api',
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASSWORD: process.env.USER_PASSWORD,
    HEADLESS: process.env.HEADLESS === 'true',
    RECORD_VIDEO: process.env.RECORD_VIDEO === 'true',
    RECORD_HAR: process.env.RECORD_HAR === 'true',
    TIMEOUT: Number(process.env.TIMEOUT) || 60000,
};
