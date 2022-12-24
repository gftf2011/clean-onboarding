import '../../src/main/bootstrap';

import puppeteer, { Browser, Page } from 'puppeteer';
import faker from 'faker';
import request, { Response } from 'supertest';
import { RandomSSN } from 'ssn';
import { cpf } from 'cpf-cnpj-validator';

import nodemailer from 'nodemailer';

import { loader } from '../../src/main/loaders';
import server from '../../src/main/config/server';
import broker from '../../src/main/config/broker';

import { RabbitmqAdapter } from '../../src/infra/queue/rabbitmq/rabbitmq-adapter';
import { PostgresAdapter } from '../../src/infra/database/postgres/postgres-adapter';

import { UserDTO } from '../../src/domain/dtos';
import {
  InvalidDocumentNumberError,
  InvalidEmailError,
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidPhoneError,
} from '../../src/domain/errors';

import {
  UserAlreadyExistsError,
  MissingBodyParamsError,
} from '../../src/application/errors';

describe('Sign-Up Route', () => {
  let postgres: PostgresAdapter;
  let rabbitmq: RabbitmqAdapter;

  let browser: Browser;
  let page: Page;

  const setupWebCrawler = async (): Promise<void> => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 920 });
  };

  const webCrawlerGoToLoginPageAndDoLogin = async (
    email: string,
    password: string,
  ): Promise<void> => {
    await page.goto('https://ethereal.email/login', {
      waitUntil: 'networkidle0',
    });
    const form = await page.$('form[action="/login"]');
    const formGroups = await form?.$$('div.form-group');

    if (formGroups && formGroups.length === 3) {
      const emailInput = await formGroups[0].$('input[type="email"]');

      await emailInput?.focus();
      await emailInput?.type(email);

      const passwordInput = await formGroups[1].$('input[type="password"]');

      await passwordInput?.focus();
      await passwordInput?.type(password);

      const buttonSubmit = await formGroups[2].$('button[type="submit"]');

      await buttonSubmit?.click();
      await page.waitForNavigation();
    }
  };

  const webCrawlerGoToHomePageAfterLoggedGoToMessages =
    async (): Promise<void> => {
      const lists = await page.$$('ul.navbar-nav');
      const listItems = await lists[0]?.$$('li');
      const anchor = await listItems[3]?.$('a.nav-link');

      await anchor?.click();
      await page.waitForNavigation();
    };

  const webCrawlerOpenSentEmail = async (): Promise<void> => {
    const tableRows = await page.$$('tbody');
    const tableData = await tableRows[0]?.$$('td');
    const anchor = await tableData[1]?.$('a');

    await anchor?.click();
    await page.waitForNavigation();
  };

  const getSentEmail = async (): Promise<any> => {
    const iFrame = await page.$('iframe');
    const iFrameContent = await iFrame?.contentFrame();
    const body = await iFrameContent?.$('body');

    return (await body?.getProperty('innerHTML'))?.jsonValue();
  };

  const tearDownWebCrawler = async (): Promise<void> => {
    await browser.close();
  };

  const closeAllConnections = async (): Promise<void> => {
    await postgres.close();
    await rabbitmq.close();
  };

  const cleanAllUsers = async (): Promise<void> => {
    await postgres.createClient();
    await postgres.openTransaction();
    await postgres.statement({
      queryText: 'DELETE FROM users_schema.users',
      values: [],
    });
    await postgres.commit();
    await postgres.closeTransaction();
  };

  const sleep = (timeout: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  };

  const signUpRequest = async (user: UserDTO): Promise<Response> => {
    const response = await request(server).post('/api/V1/sign-up').send(user);
    return response;
  };

  const signUpRequestWithNoUserEmail = async (
    user: UserDTO,
  ): Promise<Response> => {
    const newUser: any = user;
    delete newUser.email;
    const response = await request(server)
      .post('/api/V1/sign-up')
      .send(newUser);
    return response;
  };

  beforeAll(async () => {
    await loader();
    await broker();

    postgres = new PostgresAdapter();
    rabbitmq = new RabbitmqAdapter();
  });

  describe('POST - /api/V1/sign-up', () => {
    describe('Locale - UNITED_STATES_OF_AMERICA', () => {
      beforeEach(() => {
        /**
         * Most important - it clears the cache
         */
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it('should retrive email sent to user', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          phone: faker.phone.phoneNumber('##########'),
          document: new RandomSSN().value().toString(),
        };

        await signUpRequest(user);

        await sleep(500);

        const email = String(process.env.ETHEREAL_EMAIL_USER);
        const password = String(process.env.ETHEREAL_EMAIL_PASSWORD);

        await setupWebCrawler();
        await webCrawlerGoToLoginPageAndDoLogin(email, password);
        await webCrawlerGoToHomePageAfterLoggedGoToMessages();
        await webCrawlerOpenSentEmail();
        const response = await getSentEmail();
        await tearDownWebCrawler();

        expect(response).toBe(
          `\n` +
            `  <h1>👋 Hello test test</h1>\n` +
            `  <br>\n` +
            `  <h2>Welcome to OUR community 😃</h2>\n` +
            `  <br>\n` +
            `  <br>\n` +
            `  <h4>We hope we can exchange knowledge, learning from each other in every conversation !</h4>\n` +
            `  <h4>Thank you, for doing your <strong>sign up</strong> into the platform. We hope you have a very nice experience !</h4>\n` +
            `  <br>\n` +
            `  <p>Best regards 👊</p>` +
            `\n\n`,
        );
      });

      it('should return 204 with a valid user', async () => {
        const sendMailSpy = jest.fn();

        (jest.spyOn(nodemailer, 'createTransport') as any).mockReturnValue({
          sendMail: sendMailSpy,
        });

        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          phone: faker.phone.phoneNumber('##########'),
          document: new RandomSSN().value().toString(),
        };

        const response = await signUpRequest(user);

        await sleep(500);

        expect(response.status).toBe(204);
        expect(sendMailSpy).toHaveBeenCalledTimes(1);
      });

      it('should return 400 if any required body parameter is missing', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          phone: faker.phone.phoneNumber('##########'),
          document: new RandomSSN().value().toString(),
        };

        const error = new MissingBodyParamsError(['email']);

        const response = await signUpRequestWithNoUserEmail(user);

        await sleep(500);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid email', async () => {
        const user = {
          email: '',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          phone: faker.phone.phoneNumber('##########'),
          document: new RandomSSN().value().toString(),
        };

        const error = new InvalidEmailError(user.email);

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid password', async () => {
        const user = {
          email: 'test@mail.com',
          password: '',
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          phone: faker.phone.phoneNumber('##########'),
          document: new RandomSSN().value().toString(),
        };

        const error = new InvalidPasswordError();

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 password matches cellphone', async () => {
        const phone = faker.phone.phoneNumber('##########');

        const user = {
          email: 'test@mail.com',
          password: `a$${phone}Z`,
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          document: new RandomSSN().value().toString(),
          phone,
        };

        const response = await signUpRequest(user);

        const error = new InvalidPasswordError();

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid name', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: '',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          document: new RandomSSN().value().toString(),
          phone: faker.phone.phoneNumber('##########'),
        };

        const response = await signUpRequest(user);

        const error = new InvalidNameError(user.name);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid lastname', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: '',
          locale: 'UNITED_STATES_OF_AMERICA',
          document: new RandomSSN().value().toString(),
          phone: faker.phone.phoneNumber('##########'),
        };

        const response = await signUpRequest(user);

        const error = new InvalidLastnameError(user.lastname);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid document', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          document: '',
          phone: faker.phone.phoneNumber('##########'),
        };

        const response = await signUpRequest(user);

        const error = new InvalidDocumentNumberError(
          user.document,
          user.locale,
        );

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid phone', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          document: new RandomSSN().value().toString(),
          phone: '',
        };

        const response = await signUpRequest(user);

        const error = new InvalidPhoneError(user.phone, user.locale);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 403 with a duplicated email', async () => {
        const sendMailSpy = jest.fn();

        (jest.spyOn(nodemailer, 'createTransport') as any).mockReturnValue({
          sendMail: sendMailSpy,
        });

        const user = {
          email: 'test1@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'UNITED_STATES_OF_AMERICA',
          phone: faker.phone.phoneNumber('##########'),
          document: new RandomSSN().value().toString(),
        };
        const error = new UserAlreadyExistsError();

        const successResponse = await signUpRequest(user);

        await sleep(500);

        const failResponse = await signUpRequest(user);

        expect(successResponse.status).toBe(204);

        expect(sendMailSpy).toHaveBeenCalledTimes(1);

        expect(failResponse.status).toBe(403);
        expect(failResponse.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      afterEach(async () => {
        /**
         * Most important - restores module to original implementation
         */
        jest.restoreAllMocks();
        await cleanAllUsers();
      });
    });

    describe('Locale - BRAZILIAN', () => {
      beforeEach(() => {
        /**
         * Most important - it clears the cache
         */
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it('should retrive email sent to user', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };

        await signUpRequest(user);

        await sleep(500);

        const email = String(process.env.ETHEREAL_EMAIL_USER);
        const password = String(process.env.ETHEREAL_EMAIL_PASSWORD);

        await setupWebCrawler();
        await webCrawlerGoToLoginPageAndDoLogin(email, password);
        await webCrawlerGoToHomePageAfterLoggedGoToMessages();
        await webCrawlerOpenSentEmail();
        const response = await getSentEmail();
        await tearDownWebCrawler();

        expect(response).toBe(
          `\n` +
            `  <h1>👋 Hello test test</h1>\n` +
            `  <br>\n` +
            `  <h2>Welcome to OUR community 😃</h2>\n` +
            `  <br>\n` +
            `  <br>\n` +
            `  <h4>We hope we can exchange knowledge, learning from each other in every conversation !</h4>\n` +
            `  <h4>Thank you, for doing your <strong>sign up</strong> into the platform. We hope you have a very nice experience !</h4>\n` +
            `  <br>\n` +
            `  <p>Best regards 👊</p>` +
            `\n\n`,
        );
      });

      it('should return 204 with a valid user', async () => {
        const sendMailSpy = jest.fn();

        (jest.spyOn(nodemailer, 'createTransport') as any).mockReturnValue({
          sendMail: sendMailSpy,
        });

        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };

        const response = await signUpRequest(user);

        await sleep(500);

        expect(response.status).toBe(204);
        expect(sendMailSpy).toHaveBeenCalledTimes(1);
      });

      it('should return 204 with a valid user if locale is empty', async () => {
        const sendMailSpy = jest.fn();

        (jest.spyOn(nodemailer, 'createTransport') as any).mockReturnValue({
          sendMail: sendMailSpy,
        });

        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: '',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };

        const response = await signUpRequest(user);

        await sleep(500);

        expect(response.status).toBe(204);
        expect(sendMailSpy).toHaveBeenCalledTimes(1);
      });

      it('should return 400 if any required body parameter is missing', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };

        const error = new MissingBodyParamsError(['email']);

        const response = await signUpRequestWithNoUserEmail(user);

        await sleep(500);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid email', async () => {
        const user = {
          email: '',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };
        const error = new InvalidEmailError(user.email);

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid password', async () => {
        const user = {
          email: 'test@mail.com',
          password: '',
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };
        const error = new InvalidPasswordError();

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 password matches cellphone', async () => {
        const phone = faker.phone.phoneNumber('##9########');

        const user = {
          email: 'test@mail.com',
          password: `a$${phone}Z`,
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          document: cpf.generate(),
          phone,
        };
        const error = new InvalidPasswordError();

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid name', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: '',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };
        const error = new InvalidNameError(user.name);

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid lastname', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: '',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };
        const error = new InvalidLastnameError(user.lastname);

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid document', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: '',
        };
        const error = new InvalidDocumentNumberError(
          user.document,
          user.locale,
        );

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 400 with invalid phone', async () => {
        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: '',
          document: cpf.generate(),
        };
        const error = new InvalidPhoneError(user.phone, user.locale);

        const response = await signUpRequest(user);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      it('should return 403 with a duplicated email', async () => {
        const sendMailSpy = jest.fn();

        (jest.spyOn(nodemailer, 'createTransport') as any).mockReturnValue({
          sendMail: sendMailSpy,
        });

        const user = {
          email: 'test@mail.com',
          password: '12345678xX@',
          name: 'test',
          lastname: 'test',
          locale: 'BRAZILIAN',
          phone: faker.phone.phoneNumber('##9########'),
          document: cpf.generate(),
        };
        const error = new UserAlreadyExistsError();

        const successResponse = await signUpRequest(user);

        await sleep(500);

        const failResponse = await signUpRequest(user);

        expect(successResponse.status).toBe(204);

        expect(sendMailSpy).toHaveBeenCalledTimes(1);

        expect(failResponse.status).toBe(403);
        expect(failResponse.body).toEqual({
          message: error.message,
          name: error.name,
        });
      });

      afterEach(async () => {
        /**
         * Most important - restores module to original implementation
         */
        jest.restoreAllMocks();
        await cleanAllUsers();
      });
    });
  });

  afterAll(async () => {
    await closeAllConnections();
  });
});
