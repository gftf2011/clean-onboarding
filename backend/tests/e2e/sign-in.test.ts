/* eslint-disable func-names */
import '../../src/main/bootstrap';

import faker from 'faker';
import request, { Response } from 'supertest';
import { RandomSSN } from 'ssn';

import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

import { loader } from '../../src/main/loaders';
import server from '../../src/main/config/server';
import broker from '../../src/main/config/broker';

import { RabbitmqAdapter } from '../../src/infra/queue/rabbitmq/rabbitmq-adapter';
import { PostgresAdapter } from '../../src/infra/database/postgres/postgres-adapter';

import { AccountDTO, UserDTO } from '../../src/domain/dtos';

import {
  UserDoNotExistsError,
  PasswordDoesNotMatchError,
  MissingBodyParamsError,
} from '../../src/application/errors';

jest.mock('nodemailer');
jest.mock('jsonwebtoken');

describe('Sign-In Route', () => {
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

  const signInRequest = async (account: AccountDTO): Promise<Response> => {
    const response = await request(server).post('/api/V1/sign-in').send({
      email: account.email,
      password: account.password,
    });
    return response;
  };

  const signInRequestWithNoAccountEmail = async (
    account: AccountDTO,
  ): Promise<Response> => {
    const newAccount: any = account;
    delete newAccount.email;
    const response = await request(server)
      .post('/api/V1/sign-in')
      .send(newAccount);
    return response;
  };

  beforeAll(async () => {
    await loader();
    await broker();

    postgres = new PostgresAdapter();
    rabbitmq = new RabbitmqAdapter();
  });

  describe('POST - /api/V1/sign-in', () => {
    beforeEach(() => {
      /**
       * Most important - it clears the cache
       */
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return 200 with a valid account', async () => {
      const signSpy = jest
        .spyOn(jwt, 'sign')
        .mockImplementationOnce(
          (_payload: any, _secret: any, _options: any) => {
            return `token_fake`;
          },
        );
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

      const signUpResponse = await signUpRequest(user);
      const signInResponse = await signInRequest({
        email: user.email,
        password: user.password,
      });

      await sleep(500);

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.body).toEqual({
        auth: `Bearer token_fake`,
      });
    });

    it('should return 400 if any required body parameter is missing', async () => {
      const account = {
        email: 'test@mail.com',
        password: '12345678xX@',
      };
      const error = new MissingBodyParamsError(['email']);

      const response = await signInRequestWithNoAccountEmail(account);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 401 if user is not found', async () => {
      const account = {
        email: 'test@mail.com',
        password: '12345678xX@',
      };
      const error = new UserDoNotExistsError();

      const response = await signInRequest(account);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 403 if user password does not match', async () => {
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
      const account = {
        email: user.email,
        password: '12345670zZ$',
      };

      const signUpResponse = await signUpRequest(user);

      await sleep(500);

      const signInResponse = await signInRequest(account);

      const error = new PasswordDoesNotMatchError();

      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(403);
      expect(signInResponse.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    afterEach(async () => {
      await cleanAllUsers();
    });
  });

  afterAll(async () => {
    await closeAllConnections();
  });
});
