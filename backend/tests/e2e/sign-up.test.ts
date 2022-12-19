import '../../src/main/bootstrap';

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

import { UserAlreadyExistsError } from '../../src/application/errors';

jest.mock('nodemailer');

describe('Sign-Up Route', () => {
  let postgres: PostgresAdapter;
  let rabbitmq: RabbitmqAdapter;

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

      it('should return 204 with a valid user', async () => {
        const sendMailSpy = jest.fn();

        (nodemailer.createTransport as any).mockReturnValue({
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

        (nodemailer.createTransport as any).mockReturnValue({
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

      it('should return 204 with a valid user', async () => {
        const sendMailSpy = jest.fn();

        (nodemailer.createTransport as any).mockReturnValue({
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

        (nodemailer.createTransport as any).mockReturnValue({
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

        (nodemailer.createTransport as any).mockReturnValue({
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
        await cleanAllUsers();
      });
    });
  });

  afterAll(async () => {
    /**
     * Most important - restores module to original implementation
     */
    jest.restoreAllMocks();
    await closeAllConnections();
  });
});
