import { setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page, Browser } from '@playwright/test';

import { RegistrationPage } from '../pages/registrationPage';
import { HomePage } from '../pages/homePage';
import { HeaderPage } from '../pages/headerPage';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productsPage';
import { ContactPage } from '../pages/contactPage';
import * as dotenv from 'dotenv';
import { RegistrationRequest } from '../types/apiTypes';

dotenv.config();

export class CustomWorld extends World {

 
  // PLAYWRIGHT CONTEXT
  
  context!: BrowserContext;
  page!: Page;
  browser!: Browser;

  
  // PAGE OBJECTS

  registerPage!: RegistrationPage;
  homePage!: HomePage;
  headerPage!: HeaderPage;
  loginPage!: LoginPage;
  productPage!: ProductPage;
  contactPage!: ContactPage;


  // TEST DATA
  
  user?: RegistrationRequest;


  // INIT PAGES
  
  async initializePages(): Promise<void> {
    this.registerPage = new RegistrationPage(this.page);
    this.homePage = new HomePage(this.page);
    this.headerPage = new HeaderPage(this.page);
    this.loginPage = new LoginPage(this.page);
    this.productPage = new ProductPage(this.page);
    this.contactPage = new ContactPage(this.page);
  }
}

setWorldConstructor(CustomWorld);